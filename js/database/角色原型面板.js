// 文件路径: js/database/角色原型面板.js
// 描述: 渲染“角色原型”资料库面板。

function renderArchetypePanel() {
    const panel = document.getElementById('archetype-panel');
    if (!panel) return;

    panel.innerHTML = `
        <h3>角色原型深度解析</h3>
        <p>角色原型是故事中反复出现的、具有普遍意义的角色模式。它们是构成人物性格的基石，您的主角通常是1-3个原型的组合。</p>
        <div class="archetype-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            ${ARCHETYPE_DETAILS.map(a => `
                <div class="archetype-card" style="background: var(--bg-color); border: 1px solid var(--border-color); border-radius: 8px; padding: 20px;">
                    <h4>${a.name}</h4>
                    <p>${a.desc}</p>
                    ${a.keywords ? `<p style="margin-top: 10px;"><strong>关键词:</strong> ${a.keywords}</p>` : ''}
                </div>
            `).join('')}
        </div>
    `;
}