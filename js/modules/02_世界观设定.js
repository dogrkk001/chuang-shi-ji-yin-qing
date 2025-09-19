// 文件路径: js/modules/02_世界观设定.js
// 描述: (V1.7 终极性能版) 将“深化”和“审核”合并为一步AI请求，并采用并行处理，彻底解决生成速度慢和卡顿的问题。

function renderWorldviewPanel() {
    const panel = document.getElementById('worldview-panel');
    if (!panel) return;
    panel.innerHTML = `
        <div id="worldview-summary"><h3><i class="fas fa-globe-americas"></i> 世界观设定</h3><p>请先在“灵感系统”中确认一个创意。</p></div>
        
        <div id="worldview-actions-top" style="margin-bottom: 25px;">
            <button id="expand-worldview-btn" class="action-btn" style="background: var(--primary-color); color: var(--bg-color);" disabled><i class="fas fa-magic"></i> AI一键深化并审核</button>
        </div>

        <div id="short-form-worldview" class="worldview-grid">
            <div class="worldview-section-container">
                <div class="worldview-section">
                    <label for="wv-character_arc_expanded">人物弧光 (拓展深化)</label>
                    <textarea id="wv-character_arc_expanded" class="editable-ai-content" rows="12" placeholder="AI将在此处深化您的“人物弧光”..."></textarea>
                    <div class="individual-review-controls">
                        <button class="settings-btn" id="regen-wv-character_arc_expanded" onclick="handleIndividualExpandedArcRegen('character_arc_expanded')"><i class="fas fa-sync-alt"></i> 手动重构</button>
                    </div>
                    <div id="feedback-character_arc_expanded" class="individual-review-feedback"></div>
                </div>
            </div>
            <div class="worldview-section-container">
                <div class="worldview-section">
                    <label for="wv-plot_arc_expanded">情节弧光 (拓展深化)</label>
                    <textarea id="wv-plot_arc_expanded" class="editable-ai-content" rows="12" placeholder="AI将在此处深化您的“情节弧光”..."></textarea>
                    <div class="individual-review-controls">
                        <button class="settings-btn" id="regen-wv-plot_arc_expanded" onclick="handleIndividualExpandedArcRegen('plot_arc_expanded')"><i class="fas fa-sync-alt"></i> 手动重构</button>
                    </div>
                    <div id="feedback-plot_arc_expanded" class="individual-review-feedback"></div>
                </div>
            </div>
            <div class="worldview-section-container">
                 <div class="worldview-section">
                    <label for="wv-emotional_arc_expanded">情绪弧光 (拓展深化)</label>
                    <textarea id="wv-emotional_arc_expanded" class="editable-ai-content" rows="12" placeholder="AI将在此处深化您的“情绪弧光”..."></textarea>
                    <div class="individual-review-controls">
                        <button class="settings-btn" id="regen-wv-emotional_arc_expanded" onclick="handleIndividualExpandedArcRegen('emotional_arc_expanded')"><i class="fas fa-sync-alt"></i> 重构</button>
                    </div>
                    <div id="feedback-emotional_arc_expanded" class="individual-review-feedback"></div>
                </div>
            </div>
        </div>

        <div class="worldview-actions" style="margin-top: 25px; display: flex; flex-direction:column; align-items:center; gap: 15px;">
            <button id="confirm-worldview-btn" class="action-btn" disabled style="background-color: var(--success-color);"><i class="fas fa-check"></i> 确认世界观</button>
             <div class="automation-controls">
                <button id="worldview-auto-continue-btn" class="settings-btn"><i class="fas fa-arrow-right"></i> 手动转自动</button>
            </div>
        </div>
    `;
    document.getElementById('expand-worldview-btn').addEventListener('click', () => handleExpandWorldview(false));
    document.getElementById('confirm-worldview-btn').addEventListener('click', confirmWorldview);
    document.getElementById('worldview-auto-continue-btn').addEventListener('click', () => {
        creationState.autoFlowState.isRunning = true;
        confirmWorldview();
    });
}


function updateWorldviewPanelOnLoad() {
    const concept = creationState.inspirationConcept;
    if (!concept) {
        document.getElementById('worldview-summary').innerHTML = `<h3><i class="fas fa-globe-americas"></i> 世界观设定</h3><p>请先在“灵感系统”中确认一个创意。</p>`;
        document.getElementById('expand-worldview-btn').disabled = true;
        return;
    };
    document.getElementById('worldview-summary').innerHTML = `<h3><i class="fas fa-lightbulb"></i> 核心创意: ${concept.title}</h3><p>${concept.brief}</p>`;
    document.getElementById('expand-worldview-btn').disabled = false;
    document.getElementById('confirm-worldview-btn').disabled = true;
}


async function confirmWorldview() {
    creationState.worldview = {};
    const fields = getShortformWorldviewFields();

    for (const key in fields) {
        const el = document.getElementById(`wv-${key}`);
        if (el) creationState.worldview[key] = el.value;
    }
    
    if (Object.values(creationState.worldview).some(val => !val || val.trim() === '' || val.includes("生成中") || val.includes("审核中"))) {
        showNotification("请确保所有世界观字段都已生成并审核完毕再确认。", "error");
        return;
    }

    showNotification("世界观已确认！", "success");
    const confirmBtn = document.getElementById('confirm-worldview-btn');
    confirmBtn.textContent = '✅ 已确认';
    confirmBtn.disabled = true;

    updateCharacterPanelSource();
    updateStoryGenSource();
    updateEmotionGenSource();
    
    if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('worldview');
    } else {
        switchTab('char-generator-panel');
    }
}

// 【!!! 核心修正点 !!!】
// 重写了主控函数，现在点击一次按钮，就会并行地、一步到位地完成所有深化和审核工作。
async function handleExpandWorldview(isAuto = false) {
    if (!creationState.inspirationConcept) {
        showNotification("核心创意丢失，请返回灵感系统。", "error");
        return;
    }
    
    showNotification("AI正在并行深化并审核三弧光...", "info");
    const arcTypes = Object.keys(getShortformWorldviewFields());

    // 1. 先将所有UI设置为“生成中”状态
    arcTypes.forEach(arcType => {
        const textarea = document.getElementById(`wv-${arcType}`);
        const feedbackEl = document.getElementById(`feedback-${arcType}`);
        if (textarea) textarea.value = 'AI正在生成中...';
        if (feedbackEl) {
            feedbackEl.className = 'individual-review-feedback status-validating';
            feedbackEl.style.display = 'block';
            feedbackEl.textContent = 'AI编辑正在同步审核...';
        }
    });

    // 2. 创建所有“一步到位”的AI请求的Promise数组
    const expansionPromises = arcTypes.map(arcType => generateAndReviewExpandedArc(arcType));
    
    // 3. 等待所有请求完成
    await Promise.all(expansionPromises);
    
    showNotification("所有弧光深化与审核完成！", "success");
    document.getElementById('confirm-worldview-btn').disabled = false;

    if (isAuto || automationMode === 'full-auto') {
       await confirmWorldview();
    }
}

async function startWorldviewGeneration(isAuto = false) {
    creationState.mode = 'short';
    showNotification(`已进入三弧光深化模式...`, "success");
    updateWorldviewPanelOnLoad();
    switchTab('worldview-panel');
    
    if (isAuto || automationMode === 'full-auto') {
        await handleExpandWorldview(true);
    }
}

// 【!!! 核心修正点 !!!】
// 这是一个全新的、“一步到位”的AI请求函数，取代了旧的多个函数。
async function generateAndReviewExpandedArc(arcType) {
    const baseConcept = creationState.inspirationConcept;
    const originalArcType = arcType.replace('_expanded', '');
    const originalArc = baseConcept[originalArcType];

    const prompt = `你是一位顶级的、对中文纯净性有洁癖的资深网文编辑。
# 核心任务:
请一步到位地完成以下两项工作：
1.  **深化内容**: 首先，为用户提供的“原版弧光”进行详细的拓展和深化，产出一段高质量的【深化后内容】。
2.  **完成审核**: 然后，基于你刚才深化好的内容，完成一次专业的审核，产出【审核结果】。

# 创作依据:
- **核心创意**: ${JSON.stringify(baseConcept)}
- **待深化的原版弧光**: ${originalArc}

# 【终极铁律】(最高优先级):
- **语言铁律**: 你的所有输出，包括深化内容和审核意见，都必须完全使用纯粹的简体中文，**绝对禁止出现任何英文**。
- **内容铁律**: 你**必须**为JSON中的**每一个字段**都生成详细、具体、有深度的中文内容。
- **格式铁律**: 你的回答必须且只能是一个JSON对象，不能包含任何解释性文字。

# JSON输出格式要求:
严格遵循以下格式返回:
{
  "expanded_content": "【纯中文】这里是你深化后的完整段落文本",
  "review": {
    "is_approved": boolean,
    "feedback": "【纯中文】对深化后内容的简洁结论",
    "suggestions": "【纯中文】具体的修改建议或鼓励的话"
  }
}`;

    const textarea = document.getElementById(`wv-${arcType}`);
    const feedbackEl = document.getElementById(`feedback-${arcType}`);
    const regenBtn = document.getElementById(`regen-wv-${arcType}`);

    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response);

        // 更新UI
        textarea.value = result.expanded_content || "AI未能生成深化内容。";
        lastValidationResult[arcType] = result.review;

        if (result.review.is_approved) {
            feedbackEl.className = 'individual-review-feedback status-approved';
            feedbackEl.innerHTML = `<strong>审核通过:</strong> ${result.review.feedback}`;
            if (regenBtn) regenBtn.disabled = true;
        } else {
            feedbackEl.className = 'individual-review-feedback status-rejected';
            feedbackEl.innerHTML = `<strong>需要修改:</strong> ${result.review.feedback}<br><strong>建议:</strong> ${result.review.suggestions}`;
            if (regenBtn) regenBtn.disabled = false;
        }
    } catch (error) {
        textarea.value = `生成失败: ${error.message}`;
        feedbackEl.className = 'individual-review-feedback status-rejected';
        feedbackEl.innerHTML = `<strong>审核出错:</strong> ${error.message}`;
    }
}

// “手动重构”功能保留，但现在它会使用新的“一步到位”函数来重新生成和审核
async function handleIndividualExpandedArcRegen(arcType) {
    showNotification(`正在根据您的要求，重新深化并审核【${arcType}】...`, "info");
    await generateAndReviewExpandedArc(arcType);
    showNotification(`【${arcType}】已重构并审核完毕！`, "success");
}


function getShortformWorldviewFields() {
    return { character_arc_expanded: "人物弧光 (拓展深化)", plot_arc_expanded: "情节弧光 (拓展深化)", emotional_arc_expanded: "情绪弧光 (拓展深化)" };
}