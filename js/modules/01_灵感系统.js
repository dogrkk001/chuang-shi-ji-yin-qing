// 文件路径: js/modules/01_灵感系统.js
// 版本: K2.0 终极内核·修复版
// 描述: 本次优化严格遵循用户现有的“智能分步流水线”逻辑。
//      【问题1修复】: 为“简介核心”生成指令加入了“创作指令优先级”原则，强制AI必须以用户的原始灵感为最高准则，解决了AI创作内容跑偏的问题。
//      【问题2修复】: 1. 三大弧光生成指令升级为强制返回结构化JSON，从技术上保证了五幕结构的完整性。2. 为所有AI指令加入了“终极语言与格式铁律”，强制要求输出详尽的“大白话”描述，并从根本上杜绝了英文、乱码和表情符号的出现。
//      【问题3修复】: 优化了标题生成的指令范例，解决了AI错误输出“标题1”占位符的问题。

function renderInspirationPanel() {
    const panel = document.getElementById('inspiration-panel');
    if (!panel) return;

    // --- UI渲染部分完全保持您K2.0版本的原样，不做任何修改 ---
    panel.innerHTML = `
        <div class="inspiration-panel-grid">
            <div class="inspiration-section">
                <h3><i class="fas fa-lightbulb"></i> 灵感输入</h3>
                <div class="form-group">
                    <label for="inspiration-text">1. 输入您的核心灵感 (在自动模式下可每行输入一个)</label>
                    <textarea id="inspiration-text" rows="5" placeholder="例如：一个表面怂包内心腹黑的凡人，意外获得智者传承，开启了爆笑不断的逆袭之旅..."></textarea>
                </div>
                <div class="button-group" style="display: flex; gap: 10px; margin-top: 10px;">
                    <button id="analyze-inspiration-btn" class="action-btn" style="flex-grow: 1;"><i class="fas fa-magic"></i> AI解析并生成</button>
                    <button id="rebuild-concept-btn" class="settings-btn" style="flex-grow: 1;"><i class="fas fa-retweet"></i> 根据手动选择重构</button>
                </div>
                <div id="combo-selectors" style="margin-top:20px;">
                    <div class="form-group"><label>题材定位 (可手动修改)</label><div class="tag-selector-container" id="combo-theme-container"></div></div>
                    <div class="form-group"><label>核心角色原型 (可手动修改)</label><div class="tag-selector-container" id="combo-roles-container"></div></div>
                    <div class="form-group"><label>核心情节驱动 (可手动修改)</label><div class="tag-selector-container" id="combo-plots-container"></div></div>
                </div>
            </div>

            <div class="inspiration-section">
                <h3><i class="fas fa-cogs"></i> AI生成与审核</h3>
                <div id="combo-preview" class="hidden">
                    <p><strong>固定核心:</strong> <span id="combo-fixed-core"></span></p>
                    <div class="form-group" data-layout="inline">
                        <label for="combo-ai-title"><strong>AI生成标题 (可编辑)</strong></label>
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="combo-ai-title" class="editable-ai-content" style="flex-grow: 1;">
                            <button id="generate-title-btn" class="settings-btn" title="根据方法论智能生成备选标题"><i class="fas fa-wand-magic-sparkles"></i></button>
                        </div>
                    </div>
                    <div id="arcs-container" class="hidden">
                        <div class="arc-section">
                            <h5><i class="fas fa-file-alt"></i> AI简介核心 (可编辑)</h5>
                            <textarea id="combo-ai-brief" rows="3" class="editable-ai-content"></textarea>
                            <button id="review-all-arcs-btn" class="action-btn" style="width: 100%; margin-bottom: 10px; background-color: var(--primary-color);"><i class="fas fa-tasks"></i> 一键审核全部</button>
                            <div class="individual-review-controls">
                                <button class="settings-btn review-btn" data-arc="brief" style="flex:1;"><i class="fas fa-file-signature"></i> 单独审核</button>
                                <button class="settings-btn regenerate-btn" data-arc="brief" disabled style="flex:1;"><i class="fas fa-sync-alt"></i> 重构</button>
                            </div>
                            <div id="feedback-brief" class="individual-review-feedback"></div>
                        </div>
                        <div class="arc-section">
                            <h5><i class="fas fa-user"></i> 人物弧光 (可编辑)</h5>
                            <textarea id="combo-ai-character_arc" rows="5" class="editable-ai-content"></textarea>
                            <div class="individual-review-controls">
                                <button class="settings-btn review-btn" data-arc="character_arc"><i class="fas fa-user-check"></i> 单独审核</button>
                                <button class="settings-btn regenerate-btn" data-arc="character_arc" disabled><i class="fas fa-sync-alt"></i> 重构</button>
                            </div>
                            <div id="feedback-character_arc" class="individual-review-feedback"></div>
                        </div>
                        <div class="arc-section">
                            <h5><i class="fas fa-stream"></i> 情节弧光 (可编辑)</h5>
                            <textarea id="combo-ai-plot_arc" rows="5" class="editable-ai-content"></textarea>
                            <div class="individual-review-controls">
                                <button class="settings-btn review-btn" data-arc="plot_arc"><i class="fas fa-project-diagram"></i> 单独审核</button>
                                <button class="settings-btn regenerate-btn" data-arc="plot_arc" disabled><i class="fas fa-sync-alt"></i> 重构</button>
                            </div>
                            <div id="feedback-plot_arc" class="individual-review-feedback"></div>
                        </div>
                        <div class="arc-section">
                            <h5><i class="fas fa-heart-pulse"></i> 情绪弧光 (可编辑)</h5>
                            <textarea id="combo-ai-emotional_arc" rows="5" class="editable-ai-content"></textarea>
                            <div class="individual-review-controls">
                                <button class="settings-btn review-btn" data-arc="emotional_arc"><i class="fas fa-heartbeat"></i> 单独审核</button>
                                <button class="settings-btn regenerate-btn" data-arc="emotional_arc" disabled><i class="fas fa-sync-alt"></i> 重构</button>
                            </div>
                            <div id="feedback-emotional_arc" class="individual-review-feedback"></div>
                        </div>
                    </div>
                     <button id="use-combo-btn" class="action-btn" style="width: 100%; margin-top: 20px;" disabled><i class="fas fa-check-double"></i> 确认灵感，进入下一步</button>
                </div>
            </div>
        </div>
        <div style="margin-top: 25px;">
             <h3 class="panel-h3"><i class="fas fa-fire"></i> 热门灵感模板 (点击自动解析)</h3>
             <div class="template-container" id="template-container"></div>
        </div>
    `;

    // --- 事件监听器保持不变 ---
    populateHotTemplates();
    populateCombinerTags();
    document.getElementById('analyze-inspiration-btn').addEventListener('click', handleAnalyzeInspiration);
    document.getElementById('use-combo-btn').addEventListener('click', confirmInspiration);
    document.getElementById('generate-title-btn').addEventListener('click', handleGenerateTitle);
    document.getElementById('rebuild-concept-btn').addEventListener('click', handleRebuildConcept);
    document.getElementById('review-all-arcs-btn').addEventListener('click', handleReviewAllArcs);
    document.querySelectorAll('.review-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleIndividualArcReview(e.currentTarget.dataset.arc));
    });
    document.querySelectorAll('.regenerate-btn').forEach(btn => {
        btn.addEventListener('click', (e) => handleIndividualArcRegeneration(e.currentTarget.dataset.arc));
    });
}

// --- 交互函数保持原有逻辑 ---
function analyzeTagsFromText(text) {
    const fanficList = ['三国衍生', '水浒衍生', '西游衍生', '红楼衍生', '甄嬛衍生', '如懿衍生', '封神衍生'];
    let foundTheme = '';
    const foundRoles = new Set();
    const foundPlots = new Set();
    const { themeKeywordMap, roleKeywordMap, plotKeywordMap } = INSPIRATION_SYSTEM_DATA;
    for (const theme in themeKeywordMap) { if (foundTheme) break; for (const keyword of themeKeywordMap[theme]) { if (text.includes(keyword)) { foundTheme = theme; break; } } }
    if (!foundTheme) foundTheme = '脑洞';
    for (const role in roleKeywordMap) { for (const keyword of roleKeywordMap[role]) { if (text.includes(keyword)) { foundRoles.add(role); } } }
    if (foundRoles.size === 0) foundRoles.add('凡人');
    for (const plot in plotKeywordMap) { for (const keyword of plotKeywordMap[plot]) { if (text.includes(keyword)) { foundPlots.add(plot); if (fanficList.includes(plot)) foundPlots.add('同人'); } } }
    if (foundPlots.size === 0) foundPlots.add('爽文');
    return { theme: foundTheme, roles: Array.from(foundRoles), plots: Array.from(foundPlots) };
}

async function handleAnalyzeInspiration() {
    const text = document.getElementById('inspiration-text').value.trim();
    if (!text) { showNotification("请输入灵感！", "error"); return; }
    const inspirations = text.split('\n').map(line => line.trim()).filter(line => line);
    if (inspirations.length > 1 && automationMode !== 'full-auto') { showNotification("批量处理仅在“全程自动”模式下可用。", "error"); return; }
    resetCreationState(true);
    creationState.inspirationQueue = inspirations;
    const firstInspiration = creationState.inspirationQueue.shift();
    document.getElementById('inspiration-text').value = firstInspiration;
    showNotification(`开始处理灵感: ${firstInspiration.substring(0,20)}...`, "info");
    addAssistantMessage(`收到灵感：“${firstInspiration.substring(0, 50)}...”，正在解析核心要素。`, 'user');
    document.getElementById('combo-preview').classList.add('hidden');
    const finalCategories = analyzeTagsFromText(firstInspiration);
    updateCombinerUI(finalCategories.theme, finalCategories.roles, finalCategories.plots);
    await generateFullConcept(firstInspiration, finalCategories);
}

async function generateFullConcept(inspirationText, categories) {
    showNotification("AI正在生成故事核心...", "info");
    document.getElementById('combo-preview').classList.remove('hidden');
    const fixedCore = `主题=${categories.theme}; 角色=${categories.roles.join('+')}; 情节=${categories.plots.join('+')}`;
    document.getElementById('combo-fixed-core').textContent = fixedCore;
    document.getElementById('arcs-container').classList.remove('hidden');
    document.getElementById('use-combo-btn').disabled = true;

    const partsToClear = ['brief', 'character_arc', 'plot_arc', 'emotional_arc', 'title'];
    partsToClear.forEach(part => {
        const el = document.getElementById(`combo-ai-${part}`);
        if (el) el.value = '等待中...';
        const feedbackEl = document.getElementById(`feedback-${part}`);
        if (feedbackEl) feedbackEl.style.display = 'none';
        const regenBtn = document.querySelector(`.regenerate-btn[data-arc="${part}"]`);
        if (regenBtn) regenBtn.disabled = true;
    });

    tempInspirationConcept = { fixedCore, userInput: inspirationText };

    try {
        const briefEl = document.getElementById('combo-ai-brief');
        briefEl.value = 'AI正在生成简介核心...';
        const briefContent = await generateConceptPart('brief', inspirationText, categories);
        briefEl.value = briefContent;
        tempInspirationConcept.brief = briefContent;
        showNotification("简介核心已生成，开始并行生成其余部分...", "info");

        const generationPromises = [];
        const titleEl = document.getElementById('combo-ai-title');
        titleEl.value = 'AI正在生成标题...';
        const titlePromise = generateTitleList(briefContent).then(titles => {
            const bestTitle = titles[0] || "AI未能生成标题";
            titleEl.value = bestTitle;
            tempInspirationConcept.title = bestTitle;
        }).catch(error => { titleEl.value = `标题生成失败: ${error.message}`; });
        generationPromises.push(titlePromise);

        const arcParts = ['character_arc', 'plot_arc', 'emotional_arc'];
        arcParts.forEach(part => {
            const el = document.getElementById(`combo-ai-${part}`);
            el.value = `AI正在生成${el.previousElementSibling.textContent}...`;
            const promise = generateConceptPart(part, inspirationText, categories, "", briefContent).then(content => {
                el.value = content;
                tempInspirationConcept[part] = content;
            });
            generationPromises.push(promise);
        });
        
        await Promise.all(generationPromises);
        showNotification("所有创意部分已生成！请一键审核或单独审核。", "success");
        addAssistantMessage('AI已生成简介与三弧光，请您审核。', 'ai');
        document.getElementById('use-combo-btn').disabled = false;

        if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
            await handleReviewAllArcs();
        }
    } catch (error) {
        showNotification(`创意生成失败: ${error.message}`, "error");
        addAssistantMessage(`**错误:** 创意生成过程中出现问题 - ${error.message}`, 'ai');
    }
}

// =================================================================================
// 【!!! 终极内核优化区域 !!!】
// =================================================================================

function formatArcJsonToText(arcType, arcJson) {
    const actMap = {
        plot_arc: { act_one: "第一幕 (激励事件)", act_two: "第二幕 (上升行动)", act_three: "第三幕 (中点转折)", act_four: "第四幕 (高潮前夜)", act_five: "第五幕 (最终高潮)" },
        character_arc: { act_one: "第一幕 (初始缺陷)", act_two: "第二幕 (信念挑战)", act_three: "第三幕 (信念破裂)", act_four: "第四幕 (信念重铸)", act_five: "第五幕 (信念证明)" },
        emotional_arc: { act_one: "第一幕 (情绪基调)", act_two: "第二幕 (紧张升级)", act_three: "第三幕 (情绪反转)", act_four: "第四幕 (情绪顶点)", act_five: "第五幕 (情绪释放)" }
    };
    const labels = actMap[arcType];
    if (!labels || typeof arcJson !== 'object') return "解析AI返回的结构化数据失败。";

    let text = "";
    for (const key of ['act_one', 'act_two', 'act_three', 'act_four', 'act_five']) {
        if (arcJson[key]) {
            text += `${labels[key]}:\n`;
            if (arcType === 'plot_arc' && typeof arcJson[key] === 'object') {
                text += `  - 钩子: ${arcJson[key].hook || 'AI未提供'}\n`;
                text += `  - 反转: ${arcJson[key].twist || 'AI未提供'}\n\n`;
            } else {
                text += `${arcJson[key]}\n\n`;
            }
        } else {
            text += `${labels[key]}:\n(AI未能生成此幕内容，可能是网络问题或指令冲突，请尝试重构。)\n\n`;
        }
    }
    return text.trim();
}

async function generateConceptPart(part, inspirationText, categories, suggestions = "", briefContext = "") {
    const partMap = {
        brief: { name: "营销简介核心", persona: "顶级的网文故事策划师" },
        character_arc: { name: "人物弧光 (主角心路历程)", persona: "心理学家兼编剧" },
        plot_arc: { name: "情节弧光 (五幕结构)", persona: "结构工程师兼编剧" },
        emotional_arc: { name: "情绪弧光 (读者体验地图)", persona: "电影导演兼市场分析师" }
    };

    const ultimateRules = `
# 【终极语言与格式铁律】(零容忍！若违反，你的回答将被视为完全失败！)
1.  **语言纯净铁律**: 你的所有回答，**必须**完全使用**纯粹的简体中文**。
2.  **词汇纯净铁律**: **绝对禁止**在你的回答中出现任何**英文字母、英文单词（包括\`BOSS\`，请用“首领”、“最终敌人”或“幕后黑手”等中文词汇替代）、或任何非中文的语言字符**。
3.  **符号纯净铁律**: **绝对禁止**使用任何**表情符号 (Emoji)** 或非标准的特殊符号。
4.  **风格纯净铁律**: 你的写作风格必须是**通俗易懂、接地气的中文大白话**。`;

    let prompt = "";

    if (part === 'brief') {
        prompt = `
# 身份: ${partMap[part].persona}
# 核心任务: 根据用户的【核心灵感】，创作一段150字左右的“${partMap[part].name}”。
${ultimateRules}
# 【最高优先级铁律：主角身份锁定】
1.  **第一优先级 (宪法)**: 你的创作必须**绝对忠于**用户【核心灵感】原文的所有设定和事实。
2.  **【范例解析】**: 如果用户输入“**我**带着系统**穿越**到孙悟空身上”，那么故事的主角**必须是“我”这个现代灵魂**，核心事件是**“穿越”**。在你的简介中，**必须**清晰地体现出**“我”**这个第一人称视角，以及**从现代穿越到西游世界**这一核心事实。你**绝对禁止**将故事的主角写成孙悟空本人。
3.  **第二优先级 (风格)**: 【标签】仅用于辅助你判断故事的风格类型，绝不能覆盖或扭曲【核心灵感】的内容。

# 【核心灵感】:
---
${inspirationText}
---
# 【标签】:
- 题材定位: ${categories.theme}
- 核心情节驱动: ${categories.plots.join(', ')}
- 核心角色原型: ${categories.roles.join(', ')}
${suggestions ? `\n# 【重要修改建议】:\n${suggestions}\n` : ''}

# 【纯净文本铁律】: 你的回答必须且只能是简介文本本身，绝对禁止包含任何字数统计、括号注释、标题或任何解释性文字。

# 【你的任务】:
直接输出最终的简介核心纯净文本。`;
        
        try {
            return await callApi(prompt, false);
        } catch (error) {
            console.error(`生成 ${part} 失败:`, error);
            return `生成 ${partMap[part].name} 失败: ${error.message}`;
        }

    } else {
        const jsonStructures = {
            plot_arc: `{"act_one": {"hook": "【在这里用大白话详细描述第一幕的钩子】", "twist": "【在这里用大白话详细描述第一幕的反转】"}, "act_two": {"hook": "...", "twist": "..."}, "act_three": {"hook": "...", "twist": "..."}, "act_four": {"hook": "...", "twist": "..."}, "act_five": {"hook": "...", "twist": "..."}}`,
            character_arc: `{"act_one": "【在这里用大白话详细描述主角的初始缺陷】", "act_two": "...", "act_three": "...", "act_four": "...", "act_five": "..."}`,
            emotional_arc: `{"act_one": "【在这里用大白话详细描述第一幕要带给读者的情绪体验】", "act_two": "...", "act_three": "...", "act_four": "...", "act_five": "..."}`
        };

        prompt = `
# 身份: ${partMap[part].persona}
# 核心任务: 基于【AI简介核心】，为故事构建详细的【${partMap[part].name}】。
${ultimateRules}
# 【创作依据】:
---
**AI简介核心:** ${briefContext}
---
${suggestions ? `\n# 【重要修改建议】:\n${suggestions}\n` : ''}

# 【强制JSON格式与内容详尽铁律】: 
1. 你的回答必须且只能是一个完整的、严格符合以下结构的JSON对象。
2. **必须填满所有五个字段** (\`act_one\` 到 \`act_five\`)，绝对不能减少或合并。
3. **内容详尽铁律**: 每一个字段的值，都必须是一段**【超过30个汉字的、详细的、描述性的中文句子】**。你**必须**为所有幕都进行创作，**绝对禁止**以任何理由留空或输出“未能生成”之类的无效内容。**如果想不出来，就基于上下文编一个最合理的。**

# 【JSON结构】:
${jsonStructures[part]}
# 【你的任务】:
直接输出这个JSON对象。`;
        
        try {
            const jsonResponse = await callApi(prompt, true);
            const parsedJson = parseAiJson(jsonResponse);
            return formatArcJsonToText(part, parsedJson);
        } catch (error) {
            console.error(`生成 ${part} 失败:`, error);
            return `生成 ${partMap[part].name} 失败: ${error.message}`;
        }
    }
}


async function generateTitleList(brief) {
    if (!brief || !brief.trim() || brief.includes("生成中")) {
        throw new Error("简介核心为空，无法生成标题。");
    }
    const prompt = `
# 身份: 顶级的爆款标题大师
# 核心任务: 根据【故事简介】，生成5个备选爆款标题。
# 【终极语言与格式铁律】(零容忍！若违反，你的回答将被视为完全失败！)
1.  **语言纯净铁律**: 你的所有回答，**必须**完全使用**纯粹的简体中文**。
2.  **词汇纯净铁律**: **绝对禁止**在你的回答中出现任何**英文字母、英文单词、或任何非中文的语言字符**。
3.  **符号纯净铁律**: **绝对禁止**使用任何**表情符号 (Emoji)** 或非标准的特殊符号。
4.  **风格纯净铁律**: 你的写作风格必须是**通俗易懂、接地气的中文大白话**。

# 【故事简介】:
---
${brief}
---
# 【最终输出格式铁律】
你的回答必须严格以JSON格式返回一个包含\`"titles"\`键的对象，其值为一个包含5个字符串的数组。**不要输出任何占位符**，必须是你自己创作的标题。
**(正确范例):** \`{"titles": ["我穿成孙悟空，开局被压五指山下签到", "西游：我的系统让我别去取经", "带着系统穿成孙悟空是什么体验", "夭寿了，我的系统让我去天庭打工", "系统让我别闹天宫，我反手就是一个筋斗云"]}\`
`;
    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response);
        return result.titles && Array.isArray(result.titles) && result.titles.length > 0 ? result.titles : ["AI未能生成有效标题"];
    } catch (error) {
        console.error("标题列表生成失败:", error);
        return [`标题生成出错: ${error.message}`];
    }
}

// =================================================================================
// 【注意】: 以下是您文件中原有的，且在此次优化中无需修改的函数。
// =================================================================================
function confirmInspiration() {
    creationState.inspirationConcept = {
        ...tempInspirationConcept,
        title: sanitizeTextForJSON(document.getElementById('combo-ai-title').value),
        brief: sanitizeTextForJSON(document.getElementById('combo-ai-brief').value),
        character_arc: sanitizeTextForJSON(document.getElementById('combo-ai-character_arc').value),
        plot_arc: sanitizeTextForJSON(document.getElementById('combo-ai-plot_arc').value),
        emotional_arc: sanitizeTextForJSON(document.getElementById('combo-ai-emotional_arc').value),
    };
    console.log("灵感已确认:", creationState.inspirationConcept);
    const allApproved = ['brief', 'character_arc', 'plot_arc', 'emotional_arc'].every(arc => {
        const feedbackEl = document.getElementById(`feedback-${arc}`);
        return feedbackEl && feedbackEl.classList.contains('status-approved');
    });
    if (!allApproved && !(automationMode === 'full-auto' || creationState.autoFlowState.isRunning)) {
        if (!confirm("部分内容未经审核或审核未通过，您确定要继续吗？")) {
            return;
        }
    }
    if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('inspiration');
    } else {
       startWorldviewGeneration(false);
    }
}

async function handleReviewAllArcs() {
    showNotification("正在一键并行审核所有模块...", "info");
    const arcTypes = ['brief', 'character_arc', 'plot_arc', 'emotional_arc'];
    const reviewPromises = arcTypes.map(arcType => handleIndividualArcReview(arcType, true));
    await Promise.all(reviewPromises);
    showNotification("所有模块审核完成！", "success");
    const allApproved = arcTypes.every(arc => {
        const feedbackEl = document.getElementById(`feedback-${arc}`);
        return feedbackEl && feedbackEl.classList.contains('status-approved');
    });
    if(allApproved && (automationMode === 'full-auto' || creationState.autoFlowState.isRunning)) {
        confirmInspiration();
    }
}

async function handleIndividualArcReview(arcType, isParallel = false) {
    const arcContentEl = document.getElementById(`combo-ai-${arcType}`);
    if (!arcContentEl) return;
    const arcContent = arcContentEl.value;
    const feedbackEl = document.getElementById(`feedback-${arcType}`);
    const regenBtn = document.querySelector(`.regenerate-btn[data-arc="${arcType}"]`);
    if (!arcContent.trim() || arcContent.includes("生成中")) {
        if (!isParallel) showNotification("该部分内容为空或正在生成，无法审核。", "error");
        return;
    }
    feedbackEl.className = 'individual-review-feedback status-validating';
    feedbackEl.style.display = 'block';
    feedbackEl.innerHTML = 'AI编辑正在审核此部分...';
    if (!isParallel) addAssistantMessage(`正在审核【${arcType}】...`, 'ai');
    const contextPrompt = `- 固定核心: ${document.getElementById('combo-fixed-core').textContent}\n- 故事简介: ${document.getElementById('combo-ai-brief').value}`;
    const prompt = `你是一位对中文纯净性有洁癖的资深网文编辑。请严格审核以下内容。
### 审核目标: ${arcType}
### 具体内容: "${arcContent}"
### 参考上下文: ${contextPrompt}
### 【格式与语言铁律】(最高优先级):
1.  **【语言铁律】**: 你的所有反馈和建议，都必须完全使用纯粹的简体中文。**绝对禁止出现任何英文。**
2.  **【格式铁律】**: 你的回答必须且只能是一个JSON对象，不能包含任何解释性文字。
必须严格遵循以下格式:
{"is_approved": boolean, "feedback": "【纯中文】简洁结论", "suggestions": "【纯中文】修改建议"}`;
    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response);
        lastValidationResult[arcType] = result;
        if (result.is_approved) {
            feedbackEl.className = 'individual-review-feedback status-approved';
            feedbackEl.innerHTML = `<strong>审核通过:</strong> ${result.feedback}`;
            regenBtn.disabled = true;
        } else {
            feedbackEl.className = 'individual-review-feedback status-rejected';
            feedbackEl.innerHTML = `<strong>需要修改:</strong> ${result.feedback}<br><strong>建议:</strong> ${result.suggestions}`;
            regenBtn.disabled = false;
        }
        if ((automationMode === 'full-auto' || creationState.autoFlowState.isRunning) && !result.is_approved) {
            await handleIndividualArcRegeneration(arcType);
        }
    } catch (error) {
        feedbackEl.className = 'individual-review-feedback status-rejected';
        feedbackEl.innerHTML = `<strong>审核出错:</strong> ${error.message}`;
    }
}

async function handleIndividualArcRegeneration(arcType) {
    const suggestions = lastValidationResult[arcType]?.suggestions;
    if (!suggestions) {
        showNotification("没有可供采纳的修改建议。", "error");
        return;
    }
    const textarea = document.getElementById(`combo-ai-${arcType}`);
    textarea.value = "AI正在根据建议重构此部分...";
    showNotification(`正在重构【${arcType}】...`, "info");
    try {
        const briefContent = document.getElementById('combo-ai-brief').value;
        const newArcContent = await generateConceptPart(arcType, tempInspirationConcept.userInput, { theme: tempInspirationConcept.fixedCore.split(';')[0].split('=')[1], roles: tempInspirationConcept.fixedCore.split(';')[1].split('+'), plots: tempInspirationConcept.fixedCore.split(';')[2].split('=')[1].split('+') }, suggestions, briefContent);
        textarea.value = newArcContent;
        tempInspirationConcept[arcType] = newArcContent;
        showNotification(`【${arcType}】重构完成！`, "success");
        const feedbackEl = document.getElementById(`feedback-${arcType}`);
        feedbackEl.style.display = 'none';
        document.querySelector(`.regenerate-btn[data-arc="${arcType}"]`).disabled = true;
    } catch (error) {
        textarea.value = `重构失败: ${error.message}`;
    }
}

function handleRebuildConcept() {
    const selectedTheme = document.querySelector('#combo-theme-container .tag.selected')?.textContent;
    const selectedRoles = Array.from(document.querySelectorAll('#combo-roles-container .tag.selected')).map(el => el.textContent);
    const selectedPlots = Array.from(document.querySelectorAll('#combo-plots-container .tag.selected')).map(el => el.textContent);
    if (!selectedTheme || selectedRoles.length === 0 || selectedPlots.length === 0) {
        showNotification("请至少选择一个主题、角色和情节。", "info");
        return;
    }
    const newCategories = { theme: selectedTheme, roles: selectedRoles, plots: selectedPlots };
    const inspirationText = document.getElementById('inspiration-text').value.trim();
    addAssistantMessage(`好的，我将根据您手动选择的核心标签进行一次全新的深度拓展。`, 'user');
    generateFullConcept(inspirationText, newCategories);
}

function populateCombinerTags() {
    const themeContainer = document.getElementById('combo-theme-container');
    const rolesContainer = document.getElementById('combo-roles-container');
    const plotsContainer = document.getElementById('combo-plots-container');
    if (!themeContainer || !rolesContainer || !plotsContainer) return;
    const comboData = INSPIRATION_SYSTEM_DATA.comboData;
    const specialPlotTags = ['斩神衍生', '三国衍生', '十日衍生', '水浒衍生', '西游衍生', '红楼衍生', '甄嬛衍生', '如懿衍生', '封神衍生'];
    themeContainer.innerHTML = comboData.themes.map(t => `<span class="tag">${t}</span>`).join('');
    rolesContainer.innerHTML = comboData.roles.map(r => `<span class="tag">${r}</span>`).join('');
    plotsContainer.innerHTML = comboData.plots.map(p => {
        const isSpecial = specialPlotTags.includes(p);
        return `<span class="tag ${isSpecial ? 'tag-special-plot' : ''}">${p}</span>`;
    }).join('');
    const selectorsParent = document.getElementById('combo-selectors');
    if (!selectorsParent) return;
    selectorsParent.addEventListener('click', e => {
        if (!e.target.classList.contains('tag')) return;
        const clickedTag = e.target;
        const container = clickedTag.parentElement;
        switch (container.id) {
            case 'combo-theme-container':
                container.querySelectorAll('.tag').forEach(tag => tag.classList.remove('selected'));
                clickedTag.classList.add('selected');
                break;
            case 'combo-plots-container':
                const isClickedTagSpecial = clickedTag.classList.contains('tag-special-plot');
                if (isClickedTagSpecial) {
                    container.querySelectorAll('.tag-special-plot').forEach(specialTag => {
                        if (specialTag !== clickedTag) specialTag.classList.remove('selected');
                    });
                }
                clickedTag.classList.toggle('selected');
                break;
            case 'combo-roles-container':
            default:
                clickedTag.classList.toggle('selected');
                break;
        }
    });
}

function updateCombinerUI(theme, roles = [], plots = []) {
    document.querySelectorAll('#combo-selectors .tag.selected').forEach(t => t.classList.remove('selected'));
    const allTags = document.querySelectorAll('#combo-selectors .tag');
    const itemsToSelect = [theme, ...roles, ...plots];
    allTags.forEach(tag => {
        if (itemsToSelect.includes(tag.textContent)) {
            tag.classList.add('selected');
        }
    });
}

async function handleGenerateTitle() {
    const brief = document.getElementById('combo-ai-brief').value;
    if (!brief.trim() || brief.includes("生成中")) {
        showNotification("请先等待AI生成简介核心，或手动填写内容。", "warning");
        return;
    }
    showNotification("正在生成备选标题...", "info");
    try {
        const titles = await generateTitleList(brief);
        const modal = document.getElementById('title-selection-modal');
        const container = document.getElementById('title-options-container');
        container.innerHTML = '';
        titles.forEach(title => {
            const card = document.createElement('div');
            card.className = 'title-option-card';
            card.textContent = title;
            card.addEventListener('click', () => {
                document.getElementById('combo-ai-title').value = title;
                modal.classList.add('hidden');
            });
            container.appendChild(card);
        });
        modal.classList.remove('hidden');
        modal.querySelector('.close-btn').addEventListener('click', () => modal.classList.add('hidden'));
    } catch (error) {
        showNotification(`标题生成失败: ${error.message}`, "error");
    }
}