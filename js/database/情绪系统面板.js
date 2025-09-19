// 文件路径: js/database/情绪系统面板.js
// 描述: 渲染“情绪系统”资料库面板。

function renderEmotionPanel() {
    const panel = document.getElementById('emotion-panel');
    if (!panel) return;
    
    const fibo = EMOTION_SYSTEM_DATA.fibonacciSystem;
    let fiboHtml = `
        <h3>${fibo.title}</h3>
        <details open><summary><h4>${fibo.coreConcept.split('。')[0]}</h4></summary>
            <div class="reference-content">
                <p>${fibo.coreConcept.split('。').slice(1).join('。')}</p>
                <p><strong>收缩 (高压期 / Systole):</strong> ${fibo.systole}</p>
                <p><strong>舒张 (缓和期 / Diastole):</strong> ${fibo.diastole}</p>
            </div>
        </details>
        ${fibo.waveforms.map(wave => `
            <details><summary><h5>${wave.name}</h5></summary>
                <div class="reference-content">
                    <p><strong>节奏序列:</strong> ${wave.sequence}</p>
                    <p><strong>情绪解读:</strong> ${wave.interpretation}</p>
                    <p><strong>适用:</strong> ${wave.applicable}</p>
                    <ul>${wave.details.map(d => `<li>${d}</li>`).join('')}</ul>
                </div>
            </details>
        `).join('')}
    `;

    const chains = EMOTION_SYSTEM_DATA.emotionChains;
    let chainsHtml = `
        <h3 style="margin-top: 40px;">${chains.title}</h3>
        <p>${chains.overview}</p>
        ${chains.categories.map(cat => `
            <details><summary><h4>${cat.name}</h4></summary>
                <div class="reference-content">
                <p>${cat.description}</p>
                ${cat.chains.map(chain => `
                    <div>
                        <h5>${chain.name}</h5>
                        <p><strong>核心阶段:</strong> ${chain.stages}</p>
                        <p><strong>案例分析:</strong> ${chain.example}</p>
                    </div>
                `).join('')}
                </div>
            </details>
        `).join('')}
    `;
    panel.innerHTML = fiboHtml + chainsHtml;
}