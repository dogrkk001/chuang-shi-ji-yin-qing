// 文件路径: js/modules/03_人物卡生成器.js
// 描述: (V3.6 终极姓名修正版) 增加了最严格的“命名铁律”，强制AI生成符合中文习惯的两到三字姓名。

/**
 * 生成一个包含54个扑克牌定义的对象数组，用于UI映射。
 * @returns {Array<Object>} 扑克牌定义数组。
 */
function getPokerDeckMap() {
    const suits = { spades: '♠', hearts: '♥', diams: '♦', clubs: '♣' };
    const ranks = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    let deck = [];
    ranks.forEach(rank => deck.push({ rank, suit: suits.spades, suitName: 'spades' }));
    ranks.forEach(rank => deck.push({ rank, suit: suits.hearts, suitName: 'hearts' }));
    ranks.forEach(rank => deck.push({ rank, suit: suits.diams, suitName: 'diams' }));
    ranks.forEach(rank => deck.push({ rank, suit: suits.clubs, suitName: 'clubs' }));
    deck.push({ rank: '大', suit: '🃏', suitName: 'joker', jokerType: 'big' });
    deck.push({ rank: '小', suit: '🃏', suitName: 'joker', jokerType: 'small' });
    return deck;
}

function renderCharGeneratorPanel() {
    const panel = document.getElementById('char-generator-panel');
    if (!panel) return;
    panel.innerHTML = `
        <div class="character-deck-container">
            <div id="char-cast-generator" class="inspiration-section">
                <h3><i class="fas fa-magic"></i> 智能角色阵容生成</h3>
                <div id="char-gen-source-display">
                    <p style="color: var(--text-muted);">请先在“世界观设定”模块中，生成并【确认】您的“人物弧光”。</p>
                </div>
                <button id="generate-cast-btn" class="action-btn" disabled><i class="fas fa-users-cog"></i> AI根据弧光生成专业角色阵容</button>
            </div>
            <div class="character-deck-header" style="margin-top:25px;">
                <h3><i class="fas fa-users"></i> 永久角色卡组</h3>
                <div class="button-group" style="display:flex; gap: 10px;">
                    <button id="add-selected-to-blueprint-btn" class="action-btn"><i class="fas fa-paper-plane"></i> 将选中项加入蓝图</button>
                    <button id="create-new-char-btn" class="settings-btn"><i class="fas fa-plus"></i> 手动创建新人物</button>
                    <button id="clear-deck-btn" class="settings-btn" style="background-color: var(--error-color); color: white;"><i class="fas fa-trash-alt"></i> 一键清空卡组</button>
                </div>
            </div>
            <p style="color: var(--text-muted); margin-bottom: 20px;">
                勾选需要的人物，点击上方按钮送入蓝图。点击卡片可编辑，按住并拖动可排序。
            </p>
            <div id="character-deck-grid" class="character-deck-grid"></div>
             <div class="automation-controls" style="justify-content: center;">
                <button id="char-auto-continue-btn" class="settings-btn"><i class="fas fa-arrow-right"></i> 手动转自动 (采纳选中项)</button>
            </div>
        </div>
    `;

    const modalContainer = document.getElementById('character-editor-modal');
    if (modalContainer) {
        modalContainer.innerHTML = `
        <div class="modal-content large">
            <div class="modal-header">
                <h2 id="modal-editor-title">创建新人物</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <input type="hidden" id="modal-char-id">
                <div class="modal-char-grid">
                    <div class="modal-char-column">
                        <h4>核心基础</h4>
                        <div class="form-group"><label for="modal-char-name">姓名</label><input type="text" id="modal-char-name"></div>
                        <div class="form-group"><label for="modal-char-gender">性别</label><input type="text" id="modal-char-gender"></div>
                        <div class="form-group"><label for="modal-char-age">年龄</label><input type="text" id="modal-char-age"></div>
                        <div class="form-group"><label for="modal-char-bloodtype">血型</label><input type="text" id="modal-char-bloodtype" placeholder="例如：A型、O型、未知"></div>
                        <div class="form-group"><label for="modal-char-race">种族/物种</label><input type="text" id="modal-char-race"></div>
                        <div class="form-group"><label for="modal-char-occupation">职业/身份</label><input type="text" id="modal-char-occupation"></div>
                        <div class="form-group">
                            <label for="modal-char-role">角色定位 (核心)</label>
                            <select id="modal-char-role">
                                <option value="主角">主角 (Protagonist)</option>
                                <option value="反派">反派 (Antagonist)</option>
                                <option value="盟友">盟友 (Ally)</option>
                                <option value="导师">导师 (Mentor)</option>
                                <option value="恋人">恋人 (Love Interest)</option>
                                <option value="陪衬角色">陪衬角色 (Foil)</option>
                                <option value="门槛守卫">门槛守卫 (Threshold Guardian)</option>
                                <option value="信使">信使 (Herald)</option>
                                <option value="变形者">变形者 (Shapeshifter)</option>
                                <option value="普通人代表">普通人代表 (Everyman)</option>
                                <option value="其他">其他</option>
                            </select>
                        </div>
                        <div class="form-group"><label for="modal-char-background">出身/阶级</label><input type="text" id="modal-char-background"></div>
                    </div>
                    <div class="modal-char-column">
                        <h4>外貌与体征</h4>
                        <div class="form-group"><label for="modal-char-height">身高/体格</label><input type="text" id="modal-char-height"></div>
                        <div class="form-group"><label for="modal-char-eyecolor">发色/瞳色</label><input type="text" id="modal-char-eyecolor"></div>
                        <div class="form-group"><label for="modal-char-skincolor">肤色/毛色</label><input type="text" id="modal-char-skincolor"></div>
                        <div class="form-group"><label for="modal-char-appearance">五官与外貌详述</label><textarea id="modal-char-appearance" rows="3"></textarea></div>
                        <div class="form-group"><label for="modal-char-attire">标志性服饰</label><textarea id="modal-char-attire" rows="3"></textarea></div>
                    </div>
                    <div class="modal-char-column">
                        <h4>内在与心理</h4>
                        <div class="form-group"><label for="modal-char-personality">性格</label><textarea id="modal-char-personality" rows="4"></textarea></div>
                        <div class="form-group"><label for="modal-char-motivation">人生目标/驱动力</label><textarea id="modal-char-motivation" rows="3"></textarea></div>
                        <div class="form-group"><label for="modal-char-fear">最大的恐惧/弱点</label><textarea id="modal-char-fear" rows="3"></textarea></div>
                         <div class="form-group"><label for="modal-char-flaw">原始缺陷</label><textarea id="modal-char-flaw" rows="3"></textarea></div>
                        <div class="form-group"><label for="modal-char-conflict">核心冲突</label><textarea id="modal-char-conflict" rows="3"></textarea></div>
                    </div>
                </div>
                <div style="margin-top: 15px;">
                     <h4>身体状态与特殊特征</h4>
                     <div class="modal-char-grid">
                        <div class="modal-char-column">
                             <div class="form-group"><label for="modal-char-initialState">初始状态</label><input type="text" id="modal-char-initialState" placeholder="如：健全，天生失明"></div>
                        </div>
                        <div class="modal-char-column">
                            <div class="form-group"><label for="modal-char-midChange">中期变化</label><input type="text" id="modal-char-midChange" placeholder="如：为救同伴失去右臂"></div>
                        </div>
                        <div class="modal-char-column">
                            <div class="form-group"><label for="modal-char-finalState">后期/最终状态</label><input type="text" id="modal-char-finalState" placeholder="如：安装了符文义肢"></div>
                        </div>
                     </div>
                </div>
            </div>
            <div class="modal-footer">
                <button id="save-char-from-modal-btn" class="action-btn">保存人物</button>
            </div>
        </div>`;
    }
    
    initializeCharacterDeckSystem();
    updateCharacterPanelSource();
}

function initializeCharacterDeckSystem() {
    document.getElementById('generate-cast-btn')?.addEventListener('click', handleGenerateCharacterCast);
    document.getElementById('create-new-char-btn')?.addEventListener('click', () => openCharacterModal());
    document.getElementById('add-selected-to-blueprint-btn')?.addEventListener('click', handleAddSelectedToBlueprint);
    document.getElementById('clear-deck-btn')?.addEventListener('click', handleClearDeck);
    document.getElementById('char-auto-continue-btn')?.addEventListener('click', () => {
        creationState.autoFlowState.isRunning = true;
        handleAddSelectedToBlueprint();
    });
    const modal = document.getElementById('character-editor-modal');
    if (modal) {
        modal.querySelector('.close-btn').addEventListener('click', () => modal.classList.add('hidden'));
        document.getElementById('save-char-from-modal-btn').addEventListener('click', handleSaveCharacterFromModal);
    }
    loadCharacterDeckFromStorage();
    renderCharacterDeck();
    initializeDragAndDrop();
}

function updateCharacterPanelSource() {
    const sourceDisplay = document.getElementById('char-gen-source-display');
    const genBtn = document.getElementById('generate-cast-btn');
    if (!sourceDisplay || !genBtn) return;
    const arc = creationState.worldview?.character_arc_expanded;
    if (arc) {
        sourceDisplay.innerHTML = `<p><strong>当前依据的人物弧光:</strong></p><p style="background: var(--bg-color); padding: 10px; border-radius: 5px; max-height: 100px; overflow-y: auto;">${arc}</p>`;
        genBtn.disabled = false;
    } else {
        sourceDisplay.innerHTML = `<p style="color: var(--text-muted);">请先在“世界观设定”模块中，生成并【确认】您的“人物弧光”。</p>`;
        genBtn.disabled = true;
    }
}

// 【核心升级：终极命名铁律】: 在AI指令中加入最严格的姓名生成规则
async function handleGenerateCharacterCast() {
    const arc = creationState.worldview?.character_arc_expanded;
    if (!arc) {
        showNotification("错误：缺少核心“人物弧光”作为生成依据。", "error");
        return;
    }
    showNotification("AI正在通读人物弧光，为您设计专业角色阵容...", "info");
    const genBtn = document.getElementById('generate-cast-btn');
    genBtn.disabled = true;
    genBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';

    const ROLE_OPTIONS = ["主角", "反派", "盟友", "导师", "恋人", "陪衬角色", "门槛守卫", "信使", "变形者", "普通人代表"];
    
    const prompt = `你是一位顶级的、注重逻辑严谨性的世界观架构师和角色设计师。你的任务是根据用户的“人物弧光”设计一个包含4-5名核心角色的阵容，并严格按照JSON格式输出。

### 人物弧光 (核心依据):
${arc}

### 【最高优先级铁律】(必须严格遵守):
1.  **主角必须有**: 你的角色阵容中，**必须**有一名角色的"role"字段值为“主角”。
2.  **定位必须选**: 所有角色的"role"字段值，**必须**从以下列表中选择: [${ROLE_OPTIONS.join(", ")}]。请确保角色定位多样且符合逻辑。
3.  **命名铁律**: 所有角色的姓名("name"字段)，**必须**是符合中文语境的、通俗易懂的**两字或三字姓名**。**绝对禁止**使用任何英文、拼音、字母、数字或特殊符号作为姓名。

### 【其他终极逻辑铁律】:
1.  **动态身体构思**: 必须思考并设定角色在前、中、后期的身体状态变化。
2.  **内容完整性**: **必须**为JSON中的**每一个字段**都生成详细、具体的中文内容，**不允许**空值。
3.  **语言纯净性**: 你的所有输出，包括你创造的所有名词、概念和描述，都必须完全使用纯粹的简体中文。**绝对禁止出现任何英文字母或单词。**

### JSON输出格式要求:
严格以JSON格式返回一个只包含 "characters" 键的根对象，其值为一个角色对象的数组。
每个角色对象都**必须包含**以下【所有21个】字段：
- **核心基础**: "name", "gender", "age", "bloodtype", "race", "occupation", "background", "role"
- **外貌体征**: "height", "eyecolor", "skincolor", "specialtraits", "appearance", "attire"
- **内在心理**: "personality", "motivation", "fear", "flaw", "conflict"
- **动态身体状态**: "initialState", "midChange", "finalState"

**请直接输出JSON代码块，不要有任何其他文字。**`;

    try {
        const response = await callApi(prompt, true);
        const result = parseAiJson(response); 
        if (!result.characters || !Array.isArray(result.characters) || result.characters.length === 0) {
            throw new Error("AI未能生成有效的角色阵容数组。");
        }
        result.characters.forEach(char => {
            const newChar = { ...char, id: `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`};
            if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
                selectedCharacterIds.push(newChar.id);
            }
            characterDeck.push(newChar);
        });
        saveCharacterDeckToStorage();
        renderCharacterDeck();
        showNotification(`成功生成了 ${result.characters.length} 名新角色！`, "success");
        
        if(automationMode === 'full-auto' || creationState.autoFlowState.isRunning){
            handleAddSelectedToBlueprint();
        }

    } catch (error) {
        showNotification(`角色阵容生成失败: ${error.message}`, "error");
    } finally {
        genBtn.disabled = false;
        genBtn.innerHTML = '<i class="fas fa-users-cog"></i> AI根据弧光生成专业角色阵容';
    }
}

function renderCharacterDeck() {
    const grid = document.getElementById('character-deck-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!Array.isArray(characterDeck) || characterDeck.length === 0) {
        grid.innerHTML = `<p style="color: var(--text-muted); text-align: center; grid-column: 1 / -1;">卡组中还没有人物，请先使用上方功能生成或手动创建。</p>`;
        return;
    }
    const POKER_DECK_MAP = getPokerDeckMap();
    characterDeck.forEach((char, index) => {
        if (!char || typeof char !== 'object' || !char.id) return; 
        const cardInfo = POKER_DECK_MAP[index % POKER_DECK_MAP.length];
        const isSelected = selectedCharacterIds.includes(char.id);
        const cardEl = document.createElement('div');
        cardEl.className = 'char-profile-card';
        cardEl.dataset.id = char.id;
        if (isSelected) cardEl.classList.add('selected');
        
        const displayTrait = char.role || char.occupation || '身份待补充';

        cardEl.innerHTML = `
            <div class="char-card-header">
                <h5>${cardInfo.rank}</h5>
                <span>${cardInfo.suit}</span>
            </div>
             <div class="char-card-body">
                <p><strong>${char.name || '未命名'}</strong></p>
                <p>${displayTrait}</p>
            </div>
            <div class="char-card-footer">
                <h5>${cardInfo.rank}</h5>
                <span>${cardInfo.suit}</span>
            </div>
            <input type="checkbox" class="char-select-checkbox" ${isSelected ? 'checked' : ''} title="勾选以加入蓝图">
            <button class="delete-char-btn" title="删除人物">&times;</button>
        `;

        cardEl.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox' && !e.target.classList.contains('delete-char-btn')) {
                openCharacterModal(char.id);
            }
        });

        const deleteBtn = cardEl.querySelector('.delete-char-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                handleDeleteCharacter(char.id);
            });
        }

        const checkbox = cardEl.querySelector('.char-select-checkbox');
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCharacterSelection(char.id, e.currentTarget.checked);
        });
        
        grid.appendChild(cardEl);
    });
}

function openCharacterModal(charId = null) {
    const modal = document.getElementById('character-editor-modal');
    const title = document.getElementById('modal-editor-title');
    document.getElementById('modal-char-id').value = '';
    
    const fields = ['name', 'gender', 'age', 'bloodtype', 'race', 'occupation', 'role', 'background', 'height', 'eyecolor', 'skincolor', 'specialtraits', 'appearance', 'attire', 'personality', 'motivation', 'fear', 'flaw', 'conflict', 'initialState', 'midChange', 'finalState'];
    
    fields.forEach(f => {
        const el = document.getElementById(`modal-char-${f}`);
        if (el) el.value = '';
    });

    if (charId) {
        title.textContent = "编辑人物信息";
        const char = characterDeck.find(c => c && c.id === charId);
        if (char) {
            document.getElementById('modal-char-id').value = char.id;
            fields.forEach(f => {
                const el = document.getElementById(`modal-char-${f}`);
                if(el) el.value = char[f] || '';
            });
        } else {
            showNotification("编辑失败：找不到该人物卡。", "error");
            return;
        }
    } else {
        title.textContent = "创建新人物";
        document.getElementById('modal-char-role').value = "主角";
    }
    modal.classList.remove('hidden');
}

function handleSaveCharacterFromModal() {
    const charId = document.getElementById('modal-char-id').value;
    const nameInput = document.getElementById('modal-char-name');
    const newName = nameInput.value.trim();
    if (!newName) {
        showNotification("错误：人物姓名不能为空。", "error");
        nameInput.focus();
        return;
    }
    
    const charData = {
        id: charId || `char_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: newName,
        gender: document.getElementById('modal-char-gender').value,
        age: document.getElementById('modal-char-age').value,
        bloodtype: document.getElementById('modal-char-bloodtype').value,
        race: document.getElementById('modal-char-race').value,
        occupation: document.getElementById('modal-char-occupation').value,
        role: document.getElementById('modal-char-role').value,
        background: document.getElementById('modal-char-background').value,
        height: document.getElementById('modal-char-height').value,
        eyecolor: document.getElementById('modal-char-eyecolor').value,
        skincolor: document.getElementById('modal-char-skincolor').value,
        specialtraits: document.getElementById('modal-char-specialtraits').value,
        appearance: document.getElementById('modal-char-appearance').value,
        attire: document.getElementById('modal-char-attire').value,
        personality: document.getElementById('modal-char-personality').value,
        motivation: document.getElementById('modal-char-motivation').value,
        fear: document.getElementById('modal-char-fear').value,
        flaw: document.getElementById('modal-char-flaw').value,
        conflict: document.getElementById('modal-char-conflict').value,
        initialState: document.getElementById('modal-char-initialState').value,
        midChange: document.getElementById('modal-char-midChange').value,
        finalState: document.getElementById('modal-char-finalState').value
    };

    if (charId) {
        const index = characterDeck.findIndex(c => c && c.id === charId);
        if (index > -1) {
            characterDeck[index] = charData;
        }
    } else {
        characterDeck.unshift(charData);
    }
    saveCharacterDeckToStorage();
    renderCharacterDeck();
    document.getElementById('character-editor-modal').classList.add('hidden');
    showNotification(`人物 "${charData.name}" 已保存！`, 'success');
}

function handleDeleteCharacter(charId) {
    const charIndex = characterDeck.findIndex(c => c && c.id === charId);
    if (charIndex === -1) return;
    const charName = characterDeck[charIndex].name || '未命名';
    if (confirm(`您确定要永久删除人物 "${charName}" 吗？`)) {
        characterDeck.splice(charIndex, 1);
        const selectedIndex = selectedCharacterIds.indexOf(charId);
        if (selectedIndex > -1) selectedCharacterIds.splice(selectedIndex, 1);
        saveCharacterDeckToStorage();
        renderCharacterDeck();
        showNotification("人物已删除。", "info");
    }
}

function handleClearDeck() {
    if (characterDeck.length === 0) {
        showNotification("卡组已经是空的了。", "info");
        return;
    }
    if (confirm("您确定要永久删除所有人物吗？此操作无法撤销。")) {
        characterDeck = [];
        selectedCharacterIds = [];
        saveCharacterDeckToStorage();
        renderCharacterDeck();
        showNotification("所有人物卡已清空。", "success");
    }
}

function initializeDragAndDrop() {
    const grid = document.getElementById('character-deck-grid');
    if (grid && typeof Sortable !== 'undefined') {
        new Sortable(grid, {
            animation: 150,
            ghostClass: 'sortable-ghost',
            onEnd: (evt) => {
                const movedItem = characterDeck.splice(evt.oldIndex, 1)[0];
                characterDeck.splice(evt.newIndex, 0, movedItem);
                saveCharacterDeckToStorage();
            }
        });
    }
}

function saveCharacterDeckToStorage() {
    if (currentUser) {
        try {
            const validDeck = characterDeck.filter(c => c);
            localStorage.setItem(`${currentUser}_characterDeck_v1`, JSON.stringify(validDeck));
        } catch (error) {
            showNotification("保存角色卡组失败。", "error");
        }
    }
}

function loadCharacterDeckFromStorage() {
    if (currentUser) {
        const savedDeck = localStorage.getItem(`${currentUser}_characterDeck_v1`);
        characterDeck = savedDeck ? JSON.parse(savedDeck).filter(c => c) : [];
    } else {
        characterDeck = [];
    }
    selectedCharacterIds = [];
}

function handleCharacterSelection(charId, isChecked) {
    const card = document.querySelector(`.char-profile-card[data-id="${charId}"]`);
    if (!card) return;
    const index = selectedCharacterIds.indexOf(charId);
    if (isChecked && index === -1) {
        selectedCharacterIds.push(charId);
    } else if (!isChecked && index > -1) {
        selectedCharacterIds.splice(index, 1);
    }
    card.classList.toggle('selected', isChecked);
}

function handleAddSelectedToBlueprint() {
    if (selectedCharacterIds.length === 0) {
        if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
            showNotification("自动模式下未选中任何角色，将自动采纳全部角色。", "info");
            selectedCharacterIds = characterDeck.map(c => c.id);
            renderCharacterDeck();
        } else {
            showNotification("请先勾选至少一个人物，才能加入蓝图。", "info");
            return;
        }
    }
    const selectedChars = characterDeck.filter(char => char && selectedCharacterIds.includes(char.id));
    creationState.blueprintCharacters = selectedChars;
    
    if(automationMode === 'manual' && !creationState.autoFlowState.isRunning) {
        showNotification(`成功将 ${selectedChars.length} 个人物加入蓝图！即将跳转...`, "success");
         setTimeout(() => {
            switchTab('story-generator-panel');
        }, 800);
    }
   
    updateBlueprintButtonState();

    if (automationMode === 'full-auto' || creationState.autoFlowState.isRunning) {
        proceedToNextStep('characters');
    }
}