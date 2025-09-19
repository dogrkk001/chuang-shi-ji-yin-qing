// 文件路径: js/modules/07_圣典执笔者.js
// 描述: (V40.9.4 终极视角修正版) 增加了最严格的“视角铁律”，强制AI在任何风格下都必须严格遵守用户选择的叙事视角。

let currentChapterIndex = 0;
let totalChapters = 0;
let isGenerating = false;

function renderScribePanel() {
    const panel = document.getElementById('scribe-panel');
    if (!panel) return;
    
    panel.innerHTML = `
        <div class="scribe-section" id="scribe-top-console">
            <h3><i class="fas fa-satellite-dish"></i> 创作控制台</h3>
            <div id="scribe-controls-wrapper">
                <div class="scribe-controls">
                    <div class="form-group"><label for="scribe-persona">AI作者风格</label><select id="scribe-persona"><option value="qixingjue">【推荐】七星剑阵 (仿受戒风格)</option><option value="tomato">番茄长篇风格</option><option value="zhihu">知乎热帖风格</option><option value="default">默认通用风格</option></select></div>
                    
                    <div class="form-group"><label for="scribe-perspective">叙事视角</label><select id="scribe-perspective"><option value="第一人称" selected>第一人称</option><option value="第三人称">第三人称</option></select></div>
                    
                    <div class="form-group"><label for="scribe-words">每章字数(约)</label><input type="number" id="scribe-words" value="2000" step="500"></div>
                </div>
            </div>
        </div>

        <div class="scribe-section scribe-references-accordion">
            <h3><i class="fas fa-book-reader"></i> 创作参考资料 (点击展开)</h3>
            <details>
                <summary><h4>参考：叙事融合策略</h4></summary>
                <div id="scribe-weaving-plan-display" class="document-panel reference-panel"><p>请先在“蓝图骨架”中生成融合策略，或直接在下方导入大纲开始创作。</p></div>
            </details>
            <details open>
                <summary><h4>参考：故事大纲</h4></summary>
                <div id="scribe-full-outline-display" class="document-panel reference-panel" style="margin-bottom: 15px;"><p>请先在“蓝图骨架”中锁定大纲，或在下方文本框中粘贴并导入您的外部大纲。</p></div>
                <div class="form-group">
                    <label for="scribe-external-outline-input"><strong>导入外部大纲:</strong></label>
                    <textarea id="scribe-external-outline-input" class="editable-ai-content" rows="8" placeholder="在此处粘贴您的外部大纲..."></textarea>
                </div>
                <button id="import-external-outline-btn" class="settings-btn" style="width:100%;"><i class="fas fa-file-import"></i> 导入并使用此外部大纲</button>
            </details>
            <details>
                <summary><h4>参考：开篇风格范例</h4></summary>
                 <div id="scribe-style-examples" class="reference-panel"></div>
            </details>
        </div>

        <div class="scribe-section" id="scribe-main-workspace">
            <h3><i class="fas fa-feather-alt"></i> 圣典执笔区</h3>
            <button id="start-scribe-process-btn" class="action-btn" style="width:100%;" disabled><i class="fas fa-play-circle"></i> 开始撰写第一章</button>
            <div id="interactive-scribe-area" class="hidden">
                <h4 id="current-chapter-header"><i class="fas fa-map-signs"></i> 当前章节梗概 (来自大纲)</h4>
                <p id="scribe-chapter-prompt"></p>
                <div class="form-group">
                    <label for="scribe-draft-output">章节正文 (AI生成的内容将显示于此)</label>
                    <textarea id="scribe-draft-output" class="editable-ai-content" rows="20"></textarea>
                </div>
                <div id="scribe-navigation">
                     <button id="regenerate-chapter-btn" class="settings-btn"><i class="fas fa-sync-alt"></i> 重写本章</button>
                    <span id="chapter-indicator">章节: 0 / 0</span>
                     <button id="prev-chapter-btn" class="settings-btn"><i class="fas fa-arrow-left"></i> 上一章</button>
                    <button id="next-chapter-btn" class="action-btn">下一章 <i class="fas fa-arrow-right"></i></button>
                </div>
                <button id="finish-writing-btn" class="action-btn hidden" style="background-color: var(--success-color); width:100%; margin-top: 15px;"><i class="fas fa-flag-checkered"></i> 全部章节已完成，送去润色</button>
            </div>
             <p id="scribe-placeholder" style="text-align:center; color: var(--text-muted); padding: 50px 0;">请先锁定或导入大纲，然后点击上方“开始撰写”按钮。</p>
        </div>
    `;
    
    document.getElementById('start-scribe-process-btn').addEventListener('click', () => handleChapterGenerationCycle(0));
    document.getElementById('prev-chapter-btn').addEventListener('click', handlePrevChapter);
    document.getElementById('next-chapter-btn').addEventListener('click', handleNextChapter);
    document.getElementById('regenerate-chapter-btn').addEventListener('click', () => handleChapterGenerationCycle(currentChapterIndex, true));
    document.getElementById('finish-writing-btn').addEventListener('click', handleProceedToPostProduction);
    document.getElementById('import-external-outline-btn').addEventListener('click', handleImportExternalOutline);
}

function handleImportExternalOutline() {
    const externalOutlineText = document.getElementById('scribe-external-outline-input').value;
    if (!externalOutlineText || externalOutlineText.trim() === '') {
        showNotification("请先在文本框中粘贴您的外部大纲。", "warning");
        return;
    }
    creationState.finalOutline = externalOutlineText;
    showNotification("外部大纲导入成功！", "success");
    updateScribeReferences();
}


function updateScribeReferences() {
    const weavingDisplay = document.getElementById('scribe-weaving-plan-display');
    const outlineDisplay = document.getElementById('scribe-full-outline-display');
    const styleDisplay = document.getElementById('scribe-style-examples');
    const startBtn = document.getElementById('start-scribe-process-btn');

    if (!weavingDisplay || !outlineDisplay || !styleDisplay || !startBtn) return;
    
    const hasOutline = creationState.finalOutline && creationState.finalOutline.trim() !== '';

    if (creationState.weavingPlan) {
        weavingDisplay.innerHTML = creationState.weavingPlan;
    }

    if (hasOutline) {
        outlineDisplay.innerHTML = `<pre>${creationState.finalOutline}</pre>`;
        startBtn.disabled = false;
        totalChapters = getChaptersFromOutline().length;
        if (totalChapters === 0) {
             showNotification("大纲格式无法识别出章节，请确保每章以“第X章”开头。", "warning");
             startBtn.disabled = true;
        } else {
             showNotification(`大纲已就绪，共识别出 ${totalChapters} 个章节。`, "info");
        }
    } else {
        const placeholderText = `<p>请先在“蓝图骨架”中生成并【锁定大纲】，或在上方导入外部大纲。</p>`;
        outlineDisplay.innerHTML = placeholderText;
        startBtn.disabled = true;
    }

    styleDisplay.innerHTML = '';
    if (OPENING_BLUEPRINTS) {
        for (const category in OPENING_BLUEPRINTS) {
            OPENING_BLUEPRINTS[category].forEach(bp => {
                const card = document.createElement('div');
                card.className = 'style-example-card';
                card.innerHTML = `<h4>${bp.title}</h4><p>${bp.summary.substring(0, 5000)}</p>`;
                styleDisplay.appendChild(card);
            });
        }
    }
    
    if (creationState.storyChapters && creationState.storyChapters.length > 0 && creationState.storyChapters.some(c => c && c.trim() !== '')) {
         loadChapter(currentChapterIndex);
    }
}

async function handleChapterGenerationCycle(chapterIndex, isRegen = false) {
    if (isGenerating) {
        showNotification("AI正在写作中，请稍候...", "info");
        return;
    }
    const chapters = getChaptersFromOutline();
    if (chapters.length === 0) {
        showNotification("无法开始写作，请先锁定或导入有效的大纲。", "error");
        return;
    }
    isGenerating = true;

    document.getElementById('start-scribe-process-btn').classList.add('hidden');
    document.getElementById('scribe-placeholder').classList.add('hidden');
    document.getElementById('interactive-scribe-area').classList.remove('hidden');
    
    const draftTextarea = document.getElementById('scribe-draft-output');
    const header = document.getElementById('current-chapter-header');
    const promptDisplay = document.getElementById('scribe-chapter-prompt');

    if (isRegen) {
        creationState.storyChapters[chapterIndex] = "";
    }
    currentChapterIndex = chapterIndex;
    updateChapterUI();

    try {
        promptDisplay.textContent = chapters[chapterIndex];
        header.innerHTML = `<i class="fas fa-spinner fa-spin"></i> AI作者正在构思并撰写第 ${chapterIndex + 1} 章...`;
        showNotification(`开始生成第 ${chapterIndex + 1} 章...`, "info");
        
        const chapterText = await generateChapterTextV2(chapterIndex);
        
        header.textContent = `第 ${chapterIndex + 1} 章 正文`;
        await streamTextToTextarea(draftTextarea, chapterText, 5, true);
        creationState.storyChapters[chapterIndex] = chapterText;
        saveCurrentChapterContent(); 
        showNotification(`第 ${chapterIndex + 1} 章已完成！`, "success");

        if ((automationMode === 'full-auto' || creationState.autoFlowState.isRunning) && currentChapterIndex < totalChapters - 1) {
            showNotification(`2秒后将自动开始撰写下一章...`, "info");
            setTimeout(() => {
                if (!isGenerating) {
                    handleChapterGenerationCycle(currentChapterIndex + 1);
                }
            }, 2000);
        } else if ((automationMode === 'full-auto' || creationState.autoFlowState.isRunning) && currentChapterIndex >= totalChapters - 1) {
            handleProceedToPostProduction();
        }

    } catch (error) {
        header.textContent = `第 ${chapterIndex + 1} 章生成失败`;
        draftTextarea.value = `错误: ${error.message}`;
        showNotification(`生成失败: ${error.message}`, "error");
    } finally {
        isGenerating = false;
        updateChapterUI();
    }
}

// 【!!! 核心修正点 !!!】
// 这里的 prompt 被再次强化，加入了最严格的“终极视角铁律”，强制AI在任何风格下都必须严格遵守用户选择的叙事视角。
async function generateChapterTextV2(chapterIndex) {
    const chapters = getChaptersFromOutline();
    if (chapterIndex >= chapters.length) return "错误：章节索引超出范围。";

    const chapterOutline = chapters[chapterIndex];
    const prevChapterOutline = chapterIndex > 0 ? chapters[chapterIndex - 1] : "无，这是第一章。";
    const nextChapterOutline = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : "无，这是最后一章。";
    const persona = document.getElementById('scribe-persona').value;
    const perspective = document.getElementById('scribe-perspective').value;
    const wordCount = document.getElementById('scribe-words').value;
    const prevChapterContent = chapterIndex > 0 ? (creationState.storyChapters[chapterIndex - 1] || "").slice(-500) : "这是故事的开篇。";
    
    const title = creationState.inspirationConcept?.title || "未命名小说";
    const characters = creationState.blueprintCharacters?.map(c => c.name).join(', ') || "未指定";
    const weavingPlanSnippet = creationState.weavingPlan ? `${sanitizeForTemplate(creationState.weavingPlan).substring(0, 300)}...` : "无";

    const prompt = `# 写作指令：创作单章小说正文
# 身份: 你是一位模仿能力极强的顶级网络小说作家。
# 核心任务: 为小说《${title}》创作第 ${chapterIndex + 1} 章的完整正文。

# 【终极视角铁律】(最高优先级，必须无条件遵守):
本次写作任务，你**必须，也只能，自始至终**使用【${perspective}】进行叙事。这是一个绝对的、不可违背的硬性要求。无论你模仿何种风格，都不能改变这个叙事视角。
- 如果要求是“第一人称”，全文必须围绕“我”的所见所闻所感展开。
- 如果要求是“第三人称”，全文必须围绕“他/她/它”或角色姓名展开。

# 【终极文风铁律】:
你的写作必须果断、直接、清晰、通俗易懂。**绝对禁止**在正文中出现任何体现你创作过程中犹豫、选择、注释或内心思考的文字（例如：...尾巴（或者叫声？）...）。

# 【绝对纯文本铁律】:
你的输出必须是纯粹的、未格式化的段落文本。**绝对禁止**包含任何章节标题、前言、评论、Markdown标记 (如 \`###\`, \`*\`, \`**\`) 或代码符号 (如 \`{\`, \`}\`)。

# 其他硬性要求:
1.  **字数要求**: 本章正文必须在 ${wordCount} 汉字左右。
2.  **风格要求**: 全文必须严格遵循“${persona}”风格。
3.  **内容要求**: 严格基于【本章详细梗概】进行深度扩写。

# 创作依据:
## 1. 整体设定:
- 核心人物: ${characters}
- 整体策略: ${weavingPlanSnippet}
## 2. 章节上下文:
- 上一章梗概: ${prevChapterOutline}
- 当前章节梗概 (创作主线): ${chapterOutline}
- 下一章梗概: ${nextChapterOutline}
- 上一章结尾概要: ...${prevChapterContent}

# 开始创作 (请严格遵守以上所有铁律，直接输出纯净正文):`;

    return await callApi(prompt, false);
}


function loadChapter(index) {
    if (index < 0 || index >= totalChapters) return;
    currentChapterIndex = index;
    
    document.getElementById('start-scribe-process-btn').classList.add('hidden');
    document.getElementById('scribe-placeholder').classList.add('hidden');
    document.getElementById('interactive-scribe-area').classList.remove('hidden');
    
    const draftTextarea = document.getElementById('scribe-draft-output');
    draftTextarea.value = creationState.storyChapters[index] || `(本章尚未生成，点击“下一章”或“重写本章”开始创作)`;
    
    const chapters = getChaptersFromOutline();
    document.getElementById('scribe-chapter-prompt').textContent = chapters[index] || `(已加载第 ${index + 1} 章历史内容)`;
    updateChapterUI();
}

function handlePrevChapter() {
    if(currentChapterIndex > 0) {
        saveCurrentChapterContent();
        loadChapter(currentChapterIndex - 1);
    }
}

function handleNextChapter() {
    if (isGenerating) return;
    if(currentChapterIndex < totalChapters - 1) {
        saveCurrentChapterContent();
        const nextChapterIndex = currentChapterIndex + 1;
        if (!creationState.storyChapters[nextChapterIndex] || creationState.storyChapters[nextChapterIndex].trim() === '') {
            handleChapterGenerationCycle(nextChapterIndex);
        } else {
            loadChapter(nextChapterIndex);
        }
    }
}

function saveCurrentChapterContent() {
    const draftTextarea = document.getElementById('scribe-draft-output');
    if (draftTextarea && creationState.storyChapters && currentChapterIndex >= 0) {
        creationState.storyChapters[currentChapterIndex] = draftTextarea.value;
    }
}

function updateChapterUI() {
    totalChapters = getChaptersFromOutline().length;
    document.getElementById('chapter-indicator').textContent = `章节: ${currentChapterIndex + 1} / ${totalChapters}`;
    
    document.getElementById('prev-chapter-btn').disabled = isGenerating || currentChapterIndex === 0;
    document.getElementById('next-chapter-btn').disabled = isGenerating;
    document.getElementById('regenerate-chapter-btn').disabled = isGenerating;

    const nextBtn = document.getElementById('next-chapter-btn');
    const finishBtn = document.getElementById('finish-writing-btn');
    
    if (currentChapterIndex >= totalChapters - 1) {
        nextBtn.classList.add('hidden');
        finishBtn.classList.remove('hidden');
    } else {
        nextBtn.classList.remove('hidden');
        finishBtn.classList.add('hidden');
    }
}

function getChaptersFromOutline() {
    if (!creationState.finalOutline) return [];
    let text = creationState.finalOutline;
    const chapterRegex = /(?=^\s*\*?第\s*[一二三四五六七八九十百千万\d]+\s*章)/im;
    const parts = text.split(chapterRegex);
    return parts.filter(part => part && part.trim() !== '' && /^\s*\*?第/.test(part.trim()));
}


function handleProceedToPostProduction() {
    saveCurrentChapterContent();
    creationState.finalProse = creationState.storyChapters.join("\n\n\n");
    if (!creationState.finalProse || !creationState.finalProse.trim()) {
        showNotification("没有有效的正文内容可以进入下一步。", "error");
        return;
    }
    updateDictionaryPanelState();
    if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('scribe');
    } else {
        switchTab('dictionary-panel');
        showNotification("所有章节已汇总，送至“后期与导出”模块！", "success");
    }
}