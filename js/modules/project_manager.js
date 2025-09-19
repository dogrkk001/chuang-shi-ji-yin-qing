// 文件路径: js/modules/project_manager.js
// 描述: (V1.1 最终修正版) 负责项目管理的所有功能，包括UI渲染和增删改查逻辑。已彻底修复加载项目后UI不更新的BUG。

function initializeProjectManager() {
    const modal = document.getElementById('project-manager-modal');
    const openBtn = document.getElementById('project-manager-btn');
    const closeBtn = modal.querySelector('.close-btn');

    openBtn.addEventListener('click', () => { 
        renderProjectList(); 
        modal.classList.remove('hidden'); 
    });
    closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    document.getElementById('save-current-project-btn').addEventListener('click', handleSaveCurrentProject);
    document.getElementById('save-as-new-project-btn').addEventListener('click', () => handleSaveNewProject());
}

function renderProjectList() {
    const container = document.getElementById('project-list-container');
    if (!container) return;
    container.innerHTML = '';

    if (projectLibrary.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted);">还没有任何项目，快开始创作吧！</p>';
        return;
    }

    projectLibrary.sort((a, b) => b.lastModified - a.lastModified);

    projectLibrary.forEach(project => {
        const el = document.createElement('div');
        el.className = 'project-item';
        if (project.id === currentProjectId) {
            el.classList.add('active');
        }
        el.innerHTML = `
            <div class="project-info">
                <h4>${project.title || '无标题项目'}</h4>
                <small>最后修改: ${new Date(project.lastModified).toLocaleString()}</small>
            </div>
            <div class="project-actions">
                <button class="action-btn load-btn" data-id="${project.id}" title="加载项目"><i class="fas fa-folder-open"></i></button>
                <button class="settings-btn export-btn" data-id="${project.id}" title="导出"><i class="fas fa-download"></i></button>
                <button class="settings-btn rename-btn" data-id="${project.id}" title="重命名"><i class="fas fa-edit"></i></button>
                <button class="settings-btn delete-btn" data-id="${project.id}" title="删除"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        container.appendChild(el);
    });

    container.addEventListener('click', (e) => {
        const button = e.target.closest('button');
        if (!button) return;
        
        const id = button.dataset.id;
        if (button.classList.contains('load-btn')) handleLoadProject(id);
        if (button.classList.contains('export-btn')) handleExportProject(id);
        if (button.classList.contains('rename-btn')) handleRenameProject(id);
        if (button.classList.contains('delete-btn')) handleDeleteProject(id);
    });
}

// 【!!! 核心修正点 1 !!!】
// 修正了保存逻辑，确保在保存时，所有当前界面上的可编辑内容都被同步到 creationState 中。
function syncUIStateToCreationState() {
    // 同步世界观设定的文本框内容
    if (creationState.worldview) {
        const worldviewFields = getShortformWorldviewFields(); 
        for (const key in worldviewFields) {
            const el = document.getElementById(`wv-${key}`);
            if (el) creationState.worldview[key] = el.value;
        }
    }
    // 同步故事卡、情绪卡、蓝图、执笔人和最终稿件
    const storyCardTextarea = document.getElementById('story-card-output-textarea');
    if(storyCardTextarea) creationState.storyChain = storyCardTextarea.value;
    
    const emotionCardTextarea = document.getElementById('emotion-card-output-textarea');
    if(emotionCardTextarea) creationState.emotionChain = emotionCardTextarea.value;

    const finalProseTextarea = document.getElementById('polished-prose-output');
    if(finalProseTextarea) creationState.finalProse = finalProseTextarea.value;

    console.log("UI state synced to creationState for saving.");
}


function handleSaveCurrentProject() {
    syncUIStateToCreationState(); // 保存前，先同步UI上的最新修改

    if (!creationState.inspirationConcept) {
        showNotification("当前没有可保存的内容。", "error");
        return;
    }
    if (currentProjectId) {
        const projectIndex = projectLibrary.findIndex(p => p.id === currentProjectId);
        if (projectIndex !== -1) {
            // 创建一个新的项目对象来替换旧的，而不是修改它，以确保数据完整性
            const updatedProject = {
                ...JSON.parse(JSON.stringify(creationState)), // 深拷贝当前工作区状态
                id: currentProjectId, // 保持ID不变
                title: creationState.inspirationConcept.title || projectLibrary[projectIndex].title,
                lastModified: Date.now()
            };
            projectLibrary[projectIndex] = updatedProject;
            saveProjectsToStorage();
            renderProjectList();
            showNotification(`项目 "${updatedProject.title}" 已更新。`, "success");
        }
    } else {
        handleSaveNewProject(creationState.inspirationConcept.title);
    }
}

function handleSaveNewProject(titleToSave) {
    syncUIStateToCreationState(); // 保存前，先同步UI上的最新修改

    if (!creationState.inspirationConcept) {
        showNotification("没有可保存的灵感内容。", "error");
        return;
    }
    const title = titleToSave || prompt("请输入新项目的名称:", creationState.inspirationConcept.title || "未命名项目");
    if (!title || !title.trim()) return;

    const newProject = {
        ...JSON.parse(JSON.stringify(creationState)),
        id: `proj_${Date.now()}`,
        title: title.trim(),
        lastModified: Date.now()
    };
    projectLibrary.push(newProject);
    currentProjectId = newProject.id;
    showNotification(`新项目 "${title}" 已创建。`, "success");
    
    saveProjectsToStorage();
    renderProjectList();
}

function handleLoadProject(projectId) {
    const project = projectLibrary.find(p => p.id === projectId);
    if (!project) {
        showNotification("加载失败，找不到该项目。", "error");
        return;
    }
    currentProjectId = projectId;
    
    creationState = JSON.parse(JSON.stringify(project));
    
    updateUIFromLoadedProject(); // 使用全新的、完整的UI更新函数
    document.getElementById('project-manager-modal').classList.add('hidden');
    showNotification(`项目 "${project.title}" 已加载。`, "success");
}


// 【!!! 核心修正点 2 !!!】
// 这是一个全新的、完整的UI更新函数，它会负责恢复所有模块的界面状态。
function updateUIFromLoadedProject() {
    // 恢复灵感系统
    if (creationState.inspirationConcept) {
        const insp = creationState.inspirationConcept;
        document.getElementById('inspiration-text').value = insp.brief || '';
        document.getElementById('combo-preview').classList.remove('hidden');
        document.getElementById('arcs-container').classList.remove('hidden');
        document.getElementById('combo-fixed-core').textContent = insp.fixedCore || '';
        document.getElementById('combo-ai-title').value = insp.title || '';
        document.getElementById('combo-ai-brief').value = insp.brief || '';
        document.getElementById('combo-ai-character_arc').value = insp.character_arc || '';
        document.getElementById('combo-ai-plot_arc').value = insp.plot_arc || '';
        document.getElementById('combo-ai-emotional_arc').value = insp.emotional_arc || '';
        document.getElementById('use-combo-btn').disabled = false;
    }

    // 恢复世界观设定
    updateWorldviewPanelOnLoad(); // 更新顶部的灵感摘要
    if (creationState.worldview) {
        const fields = getShortformWorldviewFields();
        for (const key in fields) {
             const textarea = document.getElementById(`wv-${key}`);
             if(textarea) textarea.value = creationState.worldview[key] || '';
        }
        document.getElementById('confirm-worldview-btn').disabled = false;
    }

    // 恢复人物卡生成器
    selectedCharacterIds = creationState.blueprintCharacters.map(c => c.id);
    renderCharacterDeck(); // 重新渲染卡组以显示正确的勾选状态
    updateCharacterPanelSource();

    // 恢复故事卡生成器
    const storyCardTextarea = document.getElementById('story-card-output-textarea');
    if (storyCardTextarea) storyCardTextarea.value = creationState.storyChain || '';
    updateStoryGenSource();

    // 恢复情绪卡生成器
    const emotionCardTextarea = document.getElementById('emotion-card-output-textarea');
    if (emotionCardTextarea) emotionCardTextarea.value = creationState.emotionChain || '';
    updateEmotionGenSource();
    
    // 恢复蓝图骨架
    const weavingOutput = document.getElementById('blueprint-weaving-output');
    if (weavingOutput) weavingOutput.innerHTML = creationState.weavingPlan || '<p>请先生成“融合策略”。</p>';
    
    const outlineOutput = document.getElementById('blueprint-outline-output');
    if (outlineOutput) outlineOutput.textContent = creationState.finalOutline || '';
    
    updateBlueprintButtonState(); // 更新蓝图模块的按钮状态
    if(creationState.weavingPlan) document.getElementById('generate-outline-btn').disabled = false;
    if(creationState.finalOutline) document.getElementById('confirm-outline-btn').disabled = false;

    // 恢复圣典执笔者和后期与导出
    updateScribeReferences();
    updateDictionaryPanelState(); // 这会同时填充最终稿件
    
    // 切换到第一个标签页，给用户一个干净的起点
    switchTab('inspiration-panel');
}


function handleDeleteProject(projectId) {
    const projectIndex = projectLibrary.findIndex(p => p.id === projectId);
    if (projectIndex === -1) return;
    const projectTitle = projectLibrary[projectIndex].title;
    if (confirm(`确定要永久删除项目 "${projectTitle}" 吗？此操作无法撤销。`)) {
        projectLibrary.splice(projectIndex, 1);
        if (currentProjectId === projectId) {
            currentProjectId = null;
            resetCreationState(false);
            updateUIFromLoadedProject(); // 清空界面
        }
        saveProjectsToStorage();
        renderProjectList();
        showNotification(`项目 "${projectTitle}" 已删除。`, "success");
    }
}

function handleRenameProject(projectId) {
    const project = projectLibrary.find(p => p.id === projectId);
    if (!project) return;
    const newTitle = prompt("请输入新的项目名称：", project.title);
    if (!newTitle || newTitle.trim() === '' || newTitle.trim() === project.title) return;
    
    project.title = newTitle.trim();
    if(project.inspirationConcept) {
        project.inspirationConcept.title = newTitle.trim();
    }
    project.lastModified = Date.now();
    saveProjectsToStorage();
    renderProjectList();
    showNotification("项目已重命名。", "success");
}

function handleExportProject(projectId) {
    const project = projectLibrary.find(p => p.id === projectId);
    if (!project) return;
    
    let content = `项目标题: ${project.title}\n`;
    content += `最后修改: ${new Date(project.lastModified).toLocaleString()}\n`;
    content += "========================================\n";

    if (project.inspirationConcept) {
        const insp = project.inspirationConcept;
        content += " 灵感核心\n========================================\n\n";
        content += `AI生成标题: ${insp.title}\n\n`;
        content += `简介核心:\n${insp.brief}\n\n`;
        content += `人物弧光:\n${insp.character_arc}\n\n`;
        content += `情节弧光:\n${insp.plot_arc}\n\n`;
        content += `情绪弧光:\n${insp.emotional_arc}\n\n`;
    }
    if (project.worldview) {
        content += "\n========================================\n 世界观设定\n========================================\n\n";
        const fields = getShortformWorldviewFields();
        for (const key in fields) {
            content += `${fields[key]}:\n${project.worldview[key] || '未设定'}\n\n`;
        }
    }
    
    const filename = `${project.title}.txt`;
    downloadFile(content, filename, 'txt');
}

function saveProjectsToStorage() {
    if (currentUser) {
        try {
            localStorage.setItem(`${currentUser}_projectLibrary_v1`, JSON.stringify(projectLibrary));
        } catch (e) {
            console.error("保存项目库失败:", e);
            showNotification("保存失败，本地存储可能已满。", "error");
        }
    }
}

function loadProjectsFromStorage() {
    if (currentUser) {
        const savedData = localStorage.getItem(`${currentUser}_projectLibrary_v1`);
        projectLibrary = savedData ? JSON.parse(savedData) : [];
    } else {
        projectLibrary = [];
    }
}