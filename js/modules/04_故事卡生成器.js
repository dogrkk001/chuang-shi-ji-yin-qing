// 文件路径: js/modules/04_故事卡生成器.js
// 描述: (V1.4 终极通俗纯净版) 增加了最严格的语言、纯文本和文风指令，彻底杜绝AI输出任何非中文内容或晦涩文字。

function renderStoryGeneratorPanel() {
    const panel = document.getElementById('story-generator-panel');
    if (!panel) return;
    panel.innerHTML = `
        <div class="story-generator-layout">
            <div class="char-gen-controls">
                <h3><i class="fas fa-scroll"></i> 故事链构造控制器</h3>
                <div id="story-gen-source">
                    <h4>深化来源：当前项目情节弧光</h4>
                    <p id="plot-arc-summary">请先在“世界观设定”中，生成并【确认】拓展后的内容。</p>
                </div>
                <button id="deepen-story-btn" class="action-btn" disabled><i class="fas fa-magic"></i> AI构造故事链</button>
            </div>
            <div class="char-gen-display">
                <h3><i class="fas fa-book-open"></i> AI构造的故事链 (生成后可编辑)</h3>
                <textarea id="story-card-output-textarea" class="editable-ai-content" rows="25" placeholder="AI生成的故事链将在此处完整显示..."></textarea>
                <div id="story-validation-feedback" class="hidden" style="margin-top:15px;">
                    <h4>编辑审核</h4>
                    <p id="story-validation-status-text"></p>
                    <div id="story-validation-feedback-content"></div>
                </div>
                <div class="button-group" style="display:flex; gap: 10px; margin-top: 10px;">
                    <button id="reaudit-story-btn" class="settings-btn" style="flex:1;"><i class="fas fa-file-signature"></i> 手动提交审核</button>
                    <button id="regenerate-story-btn" class="settings-btn" style="flex:1;" disabled><i class="fas fa-sync-alt"></i> 采纳建议并重构</button>
                </div>
                <button id="add-to-blueprint-story-btn" class="action-btn hidden" style="width: 100%; margin-top: 10px; background-color: var(--success-color);"><i class="fas fa-check-double"></i> 采纳并加入蓝图</button>
                 <div class="automation-controls" style="justify-content: center;">
                    <button id="story-auto-continue-btn" class="settings-btn"><i class="fas fa-arrow-right"></i> 手动转自动 (采纳当前故事链)</button>
                </div>
            </div>
        </div>`;
    document.getElementById('deepen-story-btn').addEventListener('click', () => handleGenerateStoryCard());
    document.getElementById('regenerate-story-btn').addEventListener('click', handleRegenerateStoryWithFeedback);
    document.getElementById('reaudit-story-btn').addEventListener('click', () => validateStoryChain(false));
    document.getElementById('add-to-blueprint-story-btn').addEventListener('click', handleAddToBlueprintStory);
    document.getElementById('story-auto-continue-btn').addEventListener('click', () => {
        creationState.autoFlowState.isRunning = true;
        handleAddToBlueprintStory();
    });
}

function updateStoryGenSource() {
    const summaryEl = document.getElementById('plot-arc-summary');
    const btn = document.getElementById('deepen-story-btn');
    if (!summaryEl || !btn) return;
    if (creationState.worldview && creationState.worldview.plot_arc_expanded) {
        summaryEl.innerHTML = `<strong>来源：拓展后的情节弧光</strong><br>${creationState.worldview.plot_arc_expanded.substring(0, 150)}...`;
        btn.disabled = false;
    } else {
        summaryEl.textContent = "请先在“世界观设定”中，生成并【确认】拓展后的内容。";
        btn.disabled = true;
    }
}

function handleAddToBlueprintStory() {
    const storyContent = document.getElementById('story-card-output-textarea').value;
    if (!storyContent || storyContent.trim() === '') {
        showNotification("没有可采纳的故事链内容。", "error");
        return;
    }
    creationState.storyChain = storyContent;
    
    if(automationMode === 'manual' && !creationState.autoFlowState.isRunning) {
        showNotification("故事链已成功采纳并锁定到蓝图！", "success");
    }
    
    const addButton = document.getElementById('add-to-blueprint-story-btn');
    if (addButton) {
        addButton.textContent = '✅ 已采纳';
        addButton.disabled = true;
    }
    updateBlueprintButtonState();

     if(automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('story');
    }
}

function handleRegenerateStoryWithFeedback() {
    const suggestions = lastValidationResult.story?.suggestions;
    if (!suggestions) {
        showNotification("没有可供采纳的修改建议。", "info");
        return;
    }
    showNotification("正在采纳AI编辑的建议，重新构造故事链...", "success");
    handleGenerateStoryCard(suggestions);
}

// 【!!! 核心修正点 !!!】
// 这里的两个 prompt 都被彻底重写，加入了最严格的“终极语言与纯文本铁律”和“终极文风铁律”。
async function handleGenerateStoryCard(suggestions = "") {
    if (!creationState.worldview?.plot_arc_expanded) {
        showNotification("缺少情节弧光，无法生成故事卡。", "error");
        return;
    }
    showNotification("AI正在构造故事链...", "info");
    const cardOutput = document.getElementById('story-card-output-textarea');
    cardOutput.value = 'AI故事架构师正在深度分析您的情节弧光，请稍候...';
    document.getElementById('story-validation-feedback').classList.add('hidden');

    const prompt = `你是一位顶级的、对中文纯净性有洁癖的网文故事架构师。请根据用户提供的“核心情节弧光”，并结合情节理论，构造一个完整且可执行的“故事链”。

### 核心情节弧光:
${creationState.worldview.plot_arc_expanded}
${suggestions ? `**重要优化指令**: AI编辑给出了以下修改建议，请你在本次生成中重点采纳和体现：\n"${suggestions}"\n\n` : ''}

### 【终极文风铁律】(最高优先级):
- **风格**: 你的写作风格必须是**通俗易懂、接地气的大白话**。面向追求流畅、爽快阅读体验的中国网络小说读者。
- **禁止**: **绝对禁止**使用任何过于华丽、生僻、复杂的词汇和长句。优先使用简洁、直接、有画面感的语言。

### 【终极语言与纯文本铁律】(最高优先级):
- **语言铁律**: 你的所有回答，都必须完全使用纯粹的简体中文。**绝对禁止出现任何英文字母、单词或拼音缩写。** (例如，不能出现 'SHRINK', 'AI' 等，必须写成 '收缩', '人工智能'。)
- **纯文本铁律**: 每个节点请使用'###'作为标题。除此之外，正文内容中**绝对禁止**使用任何其他Markdown格式化符号，如 \`**\`, \`*\` 等。

### 你的任务:
请以清晰的Markdown格式，输出一份包含5-7个关键节点的故事链报告。
- 每个节点请使用'###'作为标题（例如：### 故事卡1：风起于微末）。
- 在标题下方，用一个详细的段落描述该节点的核心情节、冲突和转折。

**请直接输出格式化的报告全文。**`;

    try {
        const response = await callApi(prompt, false);
        if (!response || response.trim() === '') {
            throw new Error("AI未能生成任何内容。");
        }
        cardOutput.value = response;
        await validateStoryChain(true); // 自动审核
    } catch(error) {
        showNotification(`故事链构造失败: ${error.message}`, "error");
        cardOutput.value = `生成失败:\n${error.message}`;
        setValidationStatus('story', 'rejected', '生成失败', `错误: ${error.message}`);
    }
}

async function validateStoryChain(isAuto = false) {
    const regenerateBtn = document.getElementById('regenerate-story-btn');
    if(regenerateBtn) regenerateBtn.disabled = true;
    setValidationStatus('story', 'validating', 'AI编辑正在审核故事链...');
    
    const storyContent = document.getElementById('story-card-output-textarea').value;
    if (!storyContent || storyContent.trim() === '' || storyContent.includes("正在")) {
        setValidationStatus('story', 'rejected', '审核失败', '未能提取到有效的故事链内容。');
        lastValidationResult.story = null;
        updateBlueprintButtonState();
        return;
    }

    const prompt = `你是一位经验丰富的、对中文纯净性有洁癖的网文主编。请严格审核以下“故事链”，判断其商业潜力。

【故事链内容】:
${storyContent}

### 【终极语言与格式铁律】(最高优先级):
1.  **语言铁律**: 你的所有反馈和建议，都必须完全使用纯粹的简体中文。**绝对禁止出现任何英文字母、单词或拼音缩写。**
2.  **格式铁律**: 你的回答必须且只能是一个JSON对象，不能包含任何解释性文字。

### 【审核标准】:
1.  **吸引力**: 开篇是否抓人？情节是否有足够的期待感？
2.  **节奏感**: 爽点、虐点、反转和伏笔的布局是否合理？
3.  **完整性**: 故事的核心矛盾是否清晰？逻辑线是否连贯？

请严格以JSON格式返回: {"is_approved": boolean, "feedback": "【纯中文】简洁的审核结论", "suggestions": "【纯中文】具体的、可执行的修改建议或鼓励的话"}`;

    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response);
        lastValidationResult.story = result; 
        const feedbackHTML = `<b>编辑点评:</b> ${result.feedback}<br><br><b>修改建议:</b> ${result.suggestions}`;
        if (result.is_approved) {
            setValidationStatus('story', 'approved', '审核通过！', feedbackHTML);
            if (isAuto) handleAddToBlueprintStory();
        } else {
            setValidationStatus('story', 'rejected', '需要修改', feedbackHTML);
        }
    } catch (error) {
        setValidationStatus('story', 'rejected', '审核过程出错', error.message);
        lastValidationResult.story = null;
    } finally {
        updateBlueprintButtonState();
    }
}