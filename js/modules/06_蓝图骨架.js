// 文件路径: js/modules/06_蓝-图骨架.js
// 描述: (V40.8 终极稳定版) 通过最严格的AI指令，强制AI必须生成用户指定的完整、独立的章节数量，根治大纲内容不完整或章节合并的问题。

function renderBlueprintPanel() {
    const panel = document.getElementById('blueprint-panel');
    if (!panel) return;
    panel.innerHTML = `
        <div class="blueprint-layout">
            <div class="blueprint-section">
                <h3><i class="fas fa-project-diagram"></i> 上部：叙事融合策略</h3>
                <p>AI将分析已有的故事卡、人物卡和情绪卡，制定一份详细的“三弧合一”融合计划...</p>
                <button id="generate-weaving-btn" class="action-btn" disabled><i class="fas fa-cogs"></i> 1. 生成融合策略</button>
                <div id="blueprint-weaving-output" class="document-panel" style="margin-top: 15px; min-height: 400px;"><p>请先在其他模块生成角色卡、故事链和情绪链，并通过审核后“加入蓝图”。</p></div>
            </div>
            <div class="blueprint-section">
                <h3><i class="fas fa-file-alt"></i> 下部：生成故事大纲</h3>
                <p>AI将严格依据“融合策略”和您设定的章节数，生成一份完整的章节大纲...</p>
                <div id="outline-controls" class="outline-controls" style="background-color: var(--bg-color); padding: 15px; border-radius: 8px;">
                    <div class="form-group" style="flex: 1; margin-bottom: 0;"><label for="outline-chapters">章节数 (建议)</label><input type="number" id="outline-chapters" value="15" min="1"></div>
                </div>
                <button id="generate-outline-btn" class="action-btn" disabled style="margin-top: 15px;"><i class="fas fa-pen-alt"></i> 2. 生成故事大纲</button>
                <div id="blueprint-outline-output" class="document-panel" style="margin-top: 15px; min-height: 400px; white-space: pre-wrap; line-height: 1.8;"><p>请先生成“融合策略”。</p></div>
                <button id="confirm-outline-btn" class="action-btn" disabled style="width: 100%; margin-top: 20px; background: var(--success-color);"><i class="fas fa-lock"></i> 3. 锁定大纲，进入最终写作</button>
                <div class="automation-controls" style="justify-content: center;">
                    <button id="blueprint-auto-continue-btn" class="settings-btn"><i class="fas fa-arrow-right"></i> 手动转自动 (锁定大纲)</button>
                </div>
            </div>
        </div>
    `;
    document.getElementById('generate-weaving-btn').addEventListener('click', handleGenerateWeaving);
    document.getElementById('generate-outline-btn').addEventListener('click', handleGenerateOutline);
    document.getElementById('confirm-outline-btn').addEventListener('click', handleConfirmOutline);
    document.getElementById('blueprint-auto-continue-btn').addEventListener('click', () => {
        creationState.autoFlowState.isRunning = true;
        handleConfirmOutline();
    });
    
    updateBlueprintButtonState();
}

function updateBlueprintButtonState() {
    const weavingBtn = document.getElementById('generate-weaving-btn');
    if (!weavingBtn) return;
    const hasCharacter = creationState.blueprintCharacters && creationState.blueprintCharacters.length > 0;
    const hasStoryChain = creationState.storyChain && creationState.storyChain.trim() !== '';
    const hasEmotionChain = creationState.emotionChain && creationState.emotionChain.trim() !== '';
    if (hasCharacter && hasStoryChain && hasEmotionChain) {
        weavingBtn.disabled = false;
        if(automationMode === 'full-auto' && !creationState.autoFlowState.isRunning) {
            handleGenerateWeaving();
        } else {
             showNotification("所有素材已就绪，您可以生成融合策略了！", "success");
        }
    } else {
        weavingBtn.disabled = true;
    }
}

async function handleGenerateWeaving() {
    if (!creationState.blueprintCharacters || creationState.blueprintCharacters.length === 0 || !creationState.storyChain || !creationState.emotionChain) {
        showNotification("错误：必须先在人物、故事和情绪模块中【采纳并加入蓝图】。", "error");
        return;
    }
    const outputDiv = document.getElementById('blueprint-weaving-output');
    outputDiv.innerHTML = "<p>AI总编正在深度分析您的创作，制定融合策略...</p>";
    showNotification("正在生成融合策略...", "info");

    const prompt = `你是一位顶级的、注重细节的网文总编和叙事架构师。请分析我提供的所有创作素材，并制定一份专业、可执行的“叙事融合策略”。

### 创作素材：
1.  **核心创意:** ${JSON.stringify(creationState.inspirationConcept)}
2.  **世界观:** ${JSON.stringify(creationState.worldview)}
3.  **核心人物卡阵容:** ${JSON.stringify(creationState.blueprintCharacters)}
4.  **故事链 (Markdown格式):** \n${creationState.storyChain}
5.  **情绪链 (Markdown格式):** \n${creationState.emotionChain}

### 【终极格式铁律】(最高优先级，必须无条件遵守):
你的回答必须且只能是一个JSON对象，绝对不能包含任何解释性文字或Markdown标记。
这个JSON对象**必须包含**以下【所有三个】顶级字段: \`"core_conflict_and_theme"\`, \`"weaving_points"\`, 和 \`"key_foreshadowings"\`。
- \`"weaving_points"\` 和 \`"key_foreshadowings"\` 的值**必须是数组**。如果你认为没有内容可填，**也必须返回一个空数组 \`[]\`**，绝对不能省略这两个字段或将其设为null。

### 【终极内容铁律】(最高优先级):
你**必须**为JSON中的**每一个字段**都生成详细、具体、有深度的中文内容。**绝对不允许**出现空字符串 \`""\` 或 \`null\` 值。每一个字段都必须言之有物，这对后续生成高质量大纲至关重要。

### 你的任务与输出格式要求：
严格按照下面的JSON结构返回，并确保所有字段都被完整填充：
{
  "core_conflict_and_theme": {
    "internal": "(必须详细填写内部矛盾)",
    "external": "(外部矛盾)",
    "theme_elevation": "(主题升华)"
  },
  "weaving_points": [
    {
      "plot_node": "(情节节点1)",
      "buildup_foreshadowing": "(铺垫/伏笔1)",
      "rendering_contrast": "(渲染/反差1)",
      "character_arc_link": "(人物弧光关联1)",
      "emotion_arc_link": "(情绪弧光关联1)"
    }
  ],
  "key_foreshadowings": [
    {
      "name": "(伏笔名称1)",
      "setup": "(前期如何埋下)",
      "hint": "(中期如何暗示)",
      "reveal": "(后期如何揭晓)"
    }
  ]
}`;

    try {
        const response = await callApi(prompt, true);
        const weavingPlan = parseAiJson(response);
        let html = '';

        if (weavingPlan.core_conflict_and_theme) {
            html += '<h4>核心矛盾与主题升华</h4>';
            html += `<div class="weaving-card"><p><strong>内部矛盾:</strong> ${weavingPlan.core_conflict_and_theme.internal || 'AI未能生成'}</p><p><strong>外部矛盾:</strong> ${weavingPlan.core_conflict_and_theme.external || 'AI未能生成'}</p><p><strong>主题升华:</strong> ${weavingPlan.core_conflict_and_theme.theme_elevation || 'AI未能生成'}</p></div>`;
        }

        if (weavingPlan.weaving_points && Array.isArray(weavingPlan.weaving_points) && weavingPlan.weaving_points.length > 0) {
            html += '<h4>三弧合一融合点</h4>';
            weavingPlan.weaving_points.forEach(point => {
                html += `<div class="weaving-card"><h5>节点：${point.plot_node || '未知节点'}</h5><p><strong>铺垫/伏笔:</strong> ${point.buildup_foreshadowing || 'AI未能生成'}</p><p><strong>渲染/反差:</strong> ${point.rendering_contrast || 'AI未能生成'}</p><p><strong>人物弧光关联:</strong> ${point.character_arc_link || 'AI未能生成'}</p><p><strong>情绪弧光关联:</strong> ${point.emotion_arc_link || 'AI未能生成'}</p></div>`;
            });
        }
        
        if (weavingPlan.key_foreshadowings && Array.isArray(weavingPlan.key_foreshadowings) && weavingPlan.key_foreshadowings.length > 0) {
            html += '<h4>关键伏笔设计</h4>';
            weavingPlan.key_foreshadowings.forEach(item => {
                html += `<div class="weaving-card"><h5>伏笔：${item.name || '未知伏笔'}</h5><p><strong>[埋] 前期:</strong> ${item.setup || 'AI未能生成'}</p><p><strong>[显] 中期:</strong> ${item.hint || 'AI未能生成'}</p><p><strong>[爆] 后期:</strong> ${item.reveal || 'AI未能生成'}</p></div>`;
            });
        }

        if (html === '') {
             throw new Error("AI未能生成有效的融合策略内容。");
        }

        outputDiv.innerHTML = html;
        creationState.weavingPlan = outputDiv.innerHTML; 
        showNotification("融合策略生成成功！可以进行下一步了。", "success");
        document.getElementById('generate-outline-btn').disabled = false;
        
        if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
            proceedToNextStep('weaving');
        }

    } catch (error) {
        outputDiv.innerHTML = `<p style="color:var(--error-color);">生成失败: ${error.message}</p>`;
        showNotification("融合策略生成失败。", "error");
    }
}

async function handleGenerateOutline() {
    const weavingPlanHTML = creationState.weavingPlan;
    if (!weavingPlanHTML) {
        showNotification("错误：必须先生成“融合策略”。", "error");
        return;
    }
    const chapters = document.getElementById('outline-chapters').value;
    const outputDiv = document.getElementById('blueprint-outline-output');
    outputDiv.innerHTML = "<p>AI大神作者正在依据融合策略和章节规划，为您奋笔疾书...</p>";
    showNotification("正在生成故事大纲...", "info");
    document.getElementById('confirm-outline-btn').disabled = true;
    
    // 【!!! 核心修正点 !!!】
    // 这里的 prompt 被彻底重写，加入了“终极章节数量与格式铁律”，强制AI必须生成指定的、独立的章节数。
    const prompt = `你是一位严格遵循指令的顶级网文大神作者。
# 核心任务: 为小说《${creationState.inspirationConcept.title || "未命名"}》生成一份详细的故事大纲。

# 【终极章节数量与格式铁律】(最高优先级，必须无条件遵守):
1.  **数量绝对**：你的输出**必须，也只能是，不多不少，正好 ${chapters} 章**。这是一个绝对的、不可协商的硬性要求。
2.  **格式独立**：**每一个章节都必须独立成段，以“第X章”开头**。绝对禁止将多个章节（例如“第十三章至第十五章”）合并成一段。
3.  **直接开始**: 你的回答必须直接以 "第一章" 或 "第1章" 开始，绝对禁止在前面添加任何开场白、标题、核心主题或任何解释性文字。
4.  **内容详实**: 每个章节都必须包含一个“标题”和一个“情节描述”。“情节描述”需要清晰、具体，能够直接指导写作。
5.  **纯净文本**: 在“标题”和“情节描述”中，绝对禁止使用任何Markdown符号，如"###", "---", "**", "*", "[]"等。

# 创作依据:
### 叙事融合策略 (你的创作圣经):
${sanitizeForTemplate(weavingPlanHTML)}

# 输出范例 (如果要求3章):
第一章：凡尘卧龙
标题：废物赘婿？
情节描述：故事开篇，主角纪辰...

第二章：龙王之怒
标题：一怒为红颜
情节描述：在寿宴上，丈母娘...

第三章：权掌天下
标题：参见龙王
情节描述：随着真实身份暴露...
`;

    try {
        const fullOutline = await callApi(prompt, false);
        outputDiv.textContent = fullOutline;
        showNotification("故事大纲生成成功！请审阅并点击下方按钮锁定。", "success");
        document.getElementById('confirm-outline-btn').disabled = false;
        
        if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
            handleConfirmOutline();
        }

    } catch (error) {
        outputDiv.innerHTML = `<p style="color:var(--error-color);">生成失败: ${error.message}</p>`;
        showNotification("故事大纲生成失败。", "error");
    }
}

function handleConfirmOutline() {
    const outlineContent = document.getElementById('blueprint-outline-output').textContent;
    if (!outlineContent || outlineContent.includes("请先生成")) {
        showNotification("没有可供锁定的有效大纲。", "error");
        return;
    }
    creationState.finalOutline = outlineContent;
    
    currentChapterIndex = 0;
    creationState.storyChapters = [];
    creationState.finalProse = "";
    
    if (automationMode === 'manual' && !creationState.autoFlowState.isRunning) {
        showNotification("大纲已锁定！正在为您跳转至最终写作模块...", "success");
        setTimeout(() => {
            switchTab('scribe-panel');
        }, 800);
    }

    if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('outline');
    }
}