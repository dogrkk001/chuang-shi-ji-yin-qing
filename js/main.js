// 文件路径: js/main.js
// 描述: (V40.3 梦想终极版) 适配全新的逐章写作流程。

function switchTab(targetId) {
    document.querySelectorAll('.main-tab').forEach(t => t.classList.remove('active'));
    const targetTab = document.querySelector(`.main-tab[data-target="${targetId}"]`);
    if (targetTab) targetTab.classList.add('active');
    
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    const targetContent = document.getElementById(targetId);
    if (targetContent) targetContent.classList.add('active');

    if (targetId === 'char-generator-panel') updateCharacterPanelSource();
    if (targetId === 'story-generator-panel') updateStoryGenSource();
    if (targetId === 'emotion-generator-panel') updateEmotionGenSource();
    if (targetId === 'scribe-panel') updateScribeReferences();
    if (targetId === 'dictionary-panel') updateDictionaryPanelState();
}

async function proceedToNextStep(currentStep) {
    if (automationMode === 'manual' && !creationState.autoFlowState.isRunning) return;

    creationState.autoFlowState.isRunning = true;
    creationState.autoFlowState.currentStep = currentStep;

    console.log(`自动化流程: 完成 [${currentStep}], 进入下一步...`);
    showNotification(`自动化: ${currentStep} 已完成，正在进入下一步...`, 'info');

    try {
        switch (currentStep) {
            case 'inspiration':
                await startWorldviewGeneration(true); 
                break;
            case 'worldview':
                 switchTab('char-generator-panel');
                 await handleGenerateCharacterCast();
                break;
            case 'characters':
                switchTab('story-generator-panel');
                await handleGenerateStoryCard();
                break;
            case 'story':
                switchTab('emotion-generator-panel');
                await handleGenerateEmotionCard();
                break;
            case 'emotion':
                switchTab('blueprint-panel');
                await handleGenerateWeaving();
                break;
            case 'weaving':
                await handleGenerateOutline();
                break;
            case 'outline':
                switchTab('scribe-panel');
                // 【!!! 核心修正点: 调用新的逐章生成函数 !!!】
                await handleChapterGenerationCycle(0);
                break;
            case 'scribe':
                 switchTab('dictionary-panel');
                 await handlePreliminaryPolish();
                 await getPolishSuggestions();
                 await handleFullRefinement();
                 await handleFormatForTomato();
                 handleFinalConsolidatedExport('txt');
                 
                 if (creationState.inspirationQueue.length > 0) {
                    showNotification("当前作品已完成！3秒后开始下一个灵感...", "success");
                    setTimeout(() => startNextInspirationInQueue(), 3000);
                } else {
                    showNotification("【全程自动化】所有任务已成功完成！", "success");
                    creationState.autoFlowState.isRunning = false;
                    automationMode = 'manual';
                    document.getElementById('automation-mode-select').value = 'manual';
                }
                break;
        }
    } catch (error) {
        showNotification(`自动化流程在 [${currentStep}] 后中断: ${error.message}`, 'error');
        creationState.autoFlowState.isRunning = false;
        automationMode = 'manual';
        document.getElementById('automation-mode-select').value = 'manual';
    }
}

async function startNextInspirationInQueue() {
    if (creationState.inspirationQueue.length > 0) {
        resetCreationState(true);
        switchTab('inspiration-panel');
        const nextInspiration = creationState.inspirationQueue.shift();
        document.getElementById('inspiration-text').value = nextInspiration;
        showNotification(`开始处理新的灵感: ${nextInspiration.substring(0,20)}...`, "info");
        await document.getElementById('analyze-inspiration-btn').click();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    function initialize() {
        console.log("创世纪引擎 V40.3 正在初始化...");
        renderAllPanels();
        setupCoreEventListeners();
        initializeAuth();
        initializeApiSettingsModal();
        initializeProjectManager();
        initializeAssistantWidget();
        checkLoginStatus();
        toggleDatabasePanels(true); 
        console.log("初始化完成。");
    }

    function renderAllPanels() {
        renderInspirationPanel();
        renderWorldviewPanel();
        renderCharGeneratorPanel();
        renderStoryGeneratorPanel();
        renderEmotionGeneratorPanel();
        renderBlueprintPanel();
        renderScribePanel();
        renderDictionaryPanel();
        renderCanonPanel();
        renderCharacterSystemPanel();
        renderArchetypePanel();
        renderPlotPanel();
        renderEmotionPanel();
    }

    function setupCoreEventListeners() {
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                if (document.getElementById('app-content').classList.contains('disabled')) return;
                switchTab(e.currentTarget.dataset.target);
            });
        });
        document.getElementById('toggle-database-btn').addEventListener('click', () => toggleDatabasePanels(false));
        document.querySelector('.theme-switcher').addEventListener('click', (e) => {
            const button = e.target.closest('.theme-btn');
            if(button) {
                const theme = button.dataset.theme;
                document.body.className = `theme-${theme}`;
                document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }
        });
        document.getElementById('automation-mode-select').addEventListener('change', (e) => {
            automationMode = e.target.value;
            showNotification(`模式已切换为: ${e.target.options[e.target.selectedIndex].text}`, 'info');
        });
    }
    
    function toggleDatabasePanels(isInitial = false) {
        const nav = document.querySelector('.main-nav-tabs');
        const btn = document.getElementById('toggle-database-btn');
        if (!nav || !btn) return;
        if (!isInitial) {
            nav.classList.toggle('database-panels-hidden');
            btn.classList.toggle('active');
        } else {
            nav.classList.add('database-panels-hidden');
            btn.classList.remove('active');
        }
    }

    function initializeAssistantWidget() {
        const toggleBtn = document.getElementById('assistant-toggle-btn');
        const closeBtn = document.getElementById('assistant-close-btn');
        const windowEl = document.getElementById('assistant-window');
        if (toggleBtn) toggleBtn.addEventListener('click', () => windowEl.classList.toggle('hidden'));
        if (closeBtn) closeBtn.addEventListener('click', () => windowEl.classList.add('hidden'));
    }

    initialize();
});