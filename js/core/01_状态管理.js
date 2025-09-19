// 文件路径: js/core/01_状态管理.js
// 描述: (V1.5 梦想最终版) 增加了对批次写作的状态支持。

// 用户与项目状态
let currentUser = null;
let projectLibrary = [];
let currentProjectId = null;

// 自动化模式状态
let automationMode = 'manual'; 

// 永久角色卡组
let characterDeck = [];
let selectedCharacterIds = [];

// 初始的、干净的工作区状态模板，用于重置
const initialCreationState = {
    mode: null,
    inspirationConcept: null,
    worldview: null,
    blueprintCharacters: [],
    storyChain: null,
    emotionChain: null,
    weavingPlan: null,
    finalOutline: null,
    
    // =================================================================
    // 【!!核心升级!!】为“圣典执笔者”增加批次化状态管理
    // =================================================================
    storyChapters: [],                 // 存放每一章的正文内容
    currentScribeBatchIndex: 0,        // 【新增】用于追踪当前正在创作的批次
    // =================================================================

    finalProse: null,
    inspirationQueue: [],
    autoFlowState: {
        isRunning: false,
        currentStep: '',
        isScribePaused: false 
    }
};

// 当前工作区状态
let creationState = { ...initialCreationState };

// 流程中的临时数据
let tempInspirationConcept = {};
let tempWorldview = {};
let lastValidationResult = {}; 
let lastScribeSuggestions = "";

// 各模块的验证状态机
let validationState = {
    inspiration: 'pending',
    worldview: 'pending',
    character: 'pending',
    story: 'pending',
    emotion: 'pending',
    scribe: 'pending'
};

/**
 * [V1.5 新增] 重置当前工作区状态。
 */
function resetCreationState(keepQueue = false) {
    const queue = keepQueue ? [...creationState.inspirationQueue] : [];
    
    creationState = JSON.parse(JSON.stringify(initialCreationState));
    creationState.inspirationQueue = queue;

    tempInspirationConcept = {};
    tempWorldview = {};
    lastValidationResult = {};
    lastScribeSuggestions = "";
    selectedCharacterIds = [];

    for (const key in validationState) {
        validationState[key] = 'pending';
    }

    console.log("Creation state has been reset.", "保留队列:", keepQueue);
}