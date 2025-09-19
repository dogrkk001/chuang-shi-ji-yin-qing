// 文件路径: js/modules/05_情绪卡生成器.js
// 描述: (V1.2 修正) 负责将抽象的情绪弧光，具体化为可执行的情绪链条，并集成自动化流程。

function renderEmotionGeneratorPanel() {
    const panel = document.getElementById('emotion-generator-panel');
    if (!panel) return;
    panel.innerHTML = `
        <div class="emotion-generator-layout">
            <div class="char-gen-controls">
                <h3><i class="fas fa-heart-pulse"></i> 情绪链构造控制器</h3>
                <div id="emotion-gen-source">
                    <h4>深化来源：当前项目情绪弧光</h4>
                    <p id="emotion-arc-summary">请先在“世界观设定”中，生成并【确认】拓展后的内容。</p>
                </div>
                <button id="deepen-emotion-btn" class="action-btn" disabled><i class="fas fa-magic"></i> AI构造情绪链</button>
            </div>
            <div class="char-gen-display">
                <h3><i class="fas fa-chart-line"></i> AI构造的情绪链 (生成后可编辑)</h3>
                <textarea id="emotion-card-output-textarea" class="editable-ai-content" rows="25" placeholder="AI生成的情绪链将在此处完整显示..."></textarea>
                <div id="emotion-validation-feedback" class="hidden" style="margin-top:15px;">
                    <h4>编辑审核</h4>
                    <p id="emotion-validation-status-text"></p>
                    <div id="emotion-validation-feedback-content"></div>
                </div>
                <div class="button-group" style="display:flex; gap: 10px; margin-top: 10px;">
                     <button id="reaudit-emotion-btn" class="settings-btn" style="flex:1;"><i class="fas fa-heart-circle-check"></i> 手动提交审核</button>
                     <button id="regenerate-emotion-btn" class="settings-btn" style="flex:1;" disabled><i class="fas fa-sync-alt"></i> 采纳建议并重构</button>
                </div>
                <button id="add-to-blueprint-emotion-btn" class="action-btn hidden" style="width: 100%; margin-top: 10px; background-color: var(--success-color);"><i class="fas fa-check-double"></i> 采纳并加入蓝图</button>
                <div class="automation-controls" style="justify-content: center;">
                    <button id="emotion-auto-continue-btn" class="settings-btn"><i class="fas fa-arrow-right"></i> 手动转自动 (采纳当前情绪链)</button>
                </div>
            </div>
        </div>`;
    document.getElementById('deepen-emotion-btn').addEventListener('click', () => handleGenerateEmotionCard());
    document.getElementById('regenerate-emotion-btn').addEventListener('click', handleRegenerateEmotionWithFeedback);
    document.getElementById('reaudit-emotion-btn').addEventListener('click', () => validateEmotionChain());
    document.getElementById('add-to-blueprint-emotion-btn').addEventListener('click', handleAddToBlueprintEmotion);
     document.getElementById('emotion-auto-continue-btn').addEventListener('click', () => {
        creationState.autoFlowState.isRunning = true;
        handleAddToBlueprintEmotion();
    });
}

function updateEmotionGenSource() {
    const summaryEl = document.getElementById('emotion-arc-summary');
    const btn = document.getElementById('deepen-emotion-btn');
    if (!summaryEl || !btn) return;
    if (creationState.worldview && creationState.worldview.emotional_arc_expanded) {
        summaryEl.innerHTML = `<strong>来源：拓展后的情绪弧光</strong><br>${creationState.worldview.emotional_arc_expanded.substring(0, 150)}...`;
        btn.disabled = false;
    } else {
        summaryEl.textContent = "请先在“世界观设定”中，生成并【确认】拓展后的内容。";
        btn.disabled = true;
    }
}

function handleAddToBlueprintEmotion() {
    const emotionContent = document.getElementById('emotion-card-output-textarea').value;
    if (!emotionContent || emotionContent.trim() === '' || emotionContent.includes("正在")) {
        showNotification("没有可采纳的有效情绪链内容。", "error");
        return;
    }
    creationState.emotionChain = emotionContent;
    
    if (automationMode === 'manual' && !creationState.autoFlowState.isRunning) {
        showNotification("情绪链已成功采纳并锁定到蓝图！", "success");
    }
    
    const addButton = document.getElementById('add-to-blueprint-emotion-btn');
    if (addButton) {
        addButton.textContent = '✅ 已采纳';
        addButton.disabled = true;
    }
    updateBlueprintButtonState();

    if(automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('emotion');
    }
}

function handleRegenerateEmotionWithFeedback() {
    const suggestions = lastValidationResult.emotion?.suggestions;
    if (!suggestions) {
        showNotification("没有可供采纳的修改建议。", "info");
        return;
    }
    showNotification("正在采纳AI编辑的建议，重新构造情绪链...", "success");
    handleGenerateEmotionCard(suggestions);
}

async function handleGenerateEmotionCard(suggestions = "") {
    if (!creationState.worldview?.emotional_arc_expanded && !suggestions) {
        showNotification("缺少情绪弧光，无法生成情绪链。", "error");
        return;
    }
    showNotification("AI正在构造情绪链...", "info");
    const cardOutput = document.getElementById('emotion-card-output-textarea');
    cardOutput.value = 'AI叙事心理学家正在深度分析您的情绪弧光，请稍候...';
    document.getElementById('emotion-validation-feedback').classList.add('hidden');
    const prompt = `你是一位叙事心理学家和顶级网文编辑。请根据用户的“核心情绪弧光”，并结合情绪理论，构造一个完整且可执行的“情绪链条”。
### 核心情绪弧光:
${creationState.worldview.emotional_arc_expanded}
${suggestions ? `**重要优化指令**: AI编辑给出了以下修改建议，请你在本次生成中重点采纳和体现：\n"${suggestions}"\n\n` : ''}
### 你的任务:
请以清晰的Markdown格式，输出一份完整的情绪链分析报告，必须包含以下部分：
1.  **宏观情绪节奏**: (包括“选用波形”和“选用理由”)
2.  **分阶段情绪链**: (分解为4-5个阶段，每个阶段都必须包含“核心情绪链”和详细的“执行简报”)
**请直接输出格式化的报告全文。**`;
    try {
        const response = await callApi(prompt, false);
        if (!response || response.trim() === '') {
            throw new Error("AI未能生成任何内容。");
        }
        cardOutput.value = response;
        await validateEmotionChain(true); // 自动审核
    } catch(error) {
        showNotification(`情绪链构造失败: ${error.message}`, "error");
        cardOutput.value = `生成失败:\n${error.message}`;
        setValidationStatus('emotion', 'rejected', '生成失败', `错误: ${error.message}`);
    }
}

async function validateEmotionChain(isAuto = false) {
    const regenerateBtn = document.getElementById('regenerate-emotion-btn');
    if(regenerateBtn) regenerateBtn.disabled = true;
    setValidationStatus('emotion', 'validating', 'AI编辑正在审核情绪链...');
    
    const emotionContent = document.getElementById('emotion-card-output-textarea').value;
    if (!emotionContent || emotionContent.trim() === '' || emotionContent.includes("正在")) {
        setValidationStatus('emotion', 'rejected', '审核失败', '未能提取到有效的情绪链内容。');
        lastValidationResult.emotion = null;
        updateBlueprintButtonState();
        return;
    }
    
    const prompt = `你是一位精通读者心理的叙事理论家。请严格审核以下“情绪链”设计方案。
【情绪链方案】:
${emotionContent}
【审核标准】:
1.  **理论契合度**: 方案是否有效运用了情绪理论？
2.  **执行可行性**: 设计的情绪节点是否清晰，能否有效指导具体情节的创作？
3.  **读者体验**: 预设的情绪曲线是否能带来强烈的阅读体验？
请严格以JSON格式返回: {"is_approved": boolean, "feedback": "简洁的审核结论", "suggestions": "具体的、可执行的修改建议或鼓励的话"}`;
    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response);
        lastValidationResult.emotion = result;
        const feedbackHTML = `<b>编辑点评:</b> ${result.feedback}<br><br><b>修改建议:</b> ${result.suggestions}`;
        if (result.is_approved) {
            setValidationStatus('emotion', 'approved', '审核通过！', feedbackHTML);
            if (isAuto) handleAddToBlueprintEmotion();
        } else {
            setValidationStatus('emotion', 'rejected', '需要修改', feedbackHTML);
        }
    } catch (error) {
        setValidationStatus('emotion', 'rejected', '审核过程出错', error.message);
        lastValidationResult.emotion = null;
    } finally {
        updateBlueprintButtonState();
    }
}