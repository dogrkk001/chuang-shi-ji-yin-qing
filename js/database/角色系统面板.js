// 文件路径: js/database/角色系统面板.js
// 描述: 渲染“角色系统”资料库面板。

function renderCharacterSystemPanel() {
    const panel = document.getElementById('character-panel');
    if (!panel) return;

    const createTable = (headers, dataRows) => {
        let tableHTML = '<table class="data-table">'; // Use a different class to avoid conflict
        tableHTML += '<thead><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr></thead>';
        tableHTML += '<tbody>';
        tableHTML += dataRows.map(row => '<tr>' + row.map(cell => `<td>${cell.toString().replace(/\n/g, '<br>')}</td>`).join('') + '</tr>').join('');
        tableHTML += '</tbody></table>';
        return tableHTML;
    };

    panel.innerHTML = `
        <h3>Part 1: 基础属性、身份与性格标签库</h3>
        <div class="sub-section">
            <h4>身份 (Identity)</h4>
            <div class="tags-container">${CHARACTER_SYSTEM_DATA.tags.identity.map(t => `<span class="tag-item">${t}</span>`).join('')}</div>
            <h4 style="margin-top: 20px;">属性 (Attribute)</h4>
            <div class="tags-container">${CHARACTER_SYSTEM_DATA.tags.attribute.map(t => `<span class="tag-item">${t}</span>`).join('')}</div>
            <h4 style="margin-top: 20px;">性格 (Personality)</h4>
            <div class="tags-container">${CHARACTER_SYSTEM_DATA.tags.personality.map(t => `<span class="tag-item">${t}</span>`).join('')}</div>
        </div>

        <h3>Part 2: 详细人设模板</h3>
        <div class="sub-section">
            <h4>女主人设 (36类)</h4>
            ${createTable( ['序号', '人设标签', '说明'], CHARACTER_SYSTEM_DATA.femalePersonas.map(p => [p.no, p.tag, p.desc]) )}
            <h4 style="margin-top: 30px;">男主人设 (36类)</h4>
            ${createTable( ['序号', '人设标签', '说明'], CHARACTER_SYSTEM_DATA.malePersonas.map(p => [p.no, p.tag, p.desc]) )}
            <h4 style="margin-top: 30px;">反派人设 (12类)</h4>
            ${createTable( ['序号', '人设标签', '说明'], CHARACTER_SYSTEM_DATA.villainPersonas.map(p => [p.no, p.tag, p.desc]) )}
        </div>

        <h3>Part 3: 角色的语言——性格与语言特征对照总表</h3>
        <div class="sub-section">
            ${createTable(
                ['类别', '细分', '句式偏好', '语言特征', '举例'],
                CHARACTER_SYSTEM_DATA.languageFeatures.map(f => [f.category, f.type, f.preference, f.feature, f.example])
            )}
        </div>
    `;
}