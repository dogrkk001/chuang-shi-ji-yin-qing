// 文件路径: js/database/情节系统面板.js
// 描述: 渲染“情节系统”资料库面板。

function renderPlotPanel() {
    const panel = document.getElementById('plot-panel');
    if (!panel) return;

    const flattenPlotData = (data) => {
        const rows = [];
        for (const channel in data) {
            for (const category in data[channel]) {
                for (const subCategory in data[channel][category]) {
                    for (const topic in data[channel][category][subCategory]) {
                        const plots = data[channel][category][subCategory][topic];
                        plots.forEach((plot, index) => {
                            if (index === 0) {
                                rows.push([channel, category, subCategory, topic, plot]);
                            } else {
                                rows.push(["", "", "", "", plot]);
                            }
                        });
                    }
                }
            }
        }
        return rows;
    };
    const tableRows = flattenPlotData(PLOT_SYSTEM_DATA);
    let tableHtml = `
        <h3>《终极版·万能剧情引擎与海量灵感库》</h3>
        <div class="plot-table-container">
            <table class="plot-table">
                <thead>
                    <tr>
                        <th>频道</th><th>大类</th><th>子类</th><th>主题</th><th>情节/灵感点</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('')}
                </tbody>
            </table>
        </div>
    `;
    panel.innerHTML = tableHtml;
}