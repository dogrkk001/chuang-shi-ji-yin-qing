// 文件路径: js/database/叙事圣典面板.js
// 描述: 渲染“叙事圣典”资料库面板。

function renderCanonPanel() {
    const panel = document.getElementById('canon-panel');
    if (!panel) return;
    let html = `<h3>《奇点·创世纪：终极叙事律法圣典》【四大准则】</h3>`;
    NARRATIVE_CANON_DATA.四大准则.forEach(rule => {
        html += `
            <details open>
                <summary><h4>${rule.title}</h4></summary>
                <div class="reference-content">${rule.content}</div>
            </details>
        `;
    });
    panel.innerHTML = html;
}