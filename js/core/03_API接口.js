// 文件路径: js/core/03_API接口.js
// 描述: (V1.1 稳定版) 增加了对500等服务器错误的自动重试机制，提升稳定性。

/**
 * 初始化API设置模态框的事件监听。
 */
function initializeApiSettingsModal(){
    const modal = document.getElementById('api-settings-modal');
    const openBtn = document.getElementById('api-settings-btn');
    const closeBtn = modal.querySelector('.close-btn');
    if(openBtn) {
        openBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    }
    if(closeBtn) {
        closeBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }
    modal.addEventListener('click', (e) => { if (e.target === modal) { modal.classList.add('hidden'); } });
    document.getElementById('save-settings-btn').addEventListener('click', saveAndCloseSettings);
    document.getElementById('api-provider').addEventListener('change', updateApiSettingsVisibility);
    loadSettings();
}

/**
 * 根据选择的API服务商，动态更新设置界面的显示。
 */
function updateApiSettingsVisibility(){
    const provider = document.getElementById("api-provider").value;
    const needsApiKey = ['gemini', 'openai', 'deepseek', 'siliconflow', 'custom'].includes(provider);
    document.getElementById("api-key-group").classList.toggle("hidden", !needsApiKey);
    document.getElementById("api-base-url-group").classList.toggle("hidden", !['ollama', 'custom'].includes(provider));
    const needsModelName = ['ollama', 'custom', 'siliconflow'].includes(provider);
    document.getElementById("api-model-name-group").classList.toggle("hidden", !needsModelName);
    document.getElementById("api-gemini-model-group").classList.toggle("hidden", provider !== 'gemini');
    document.getElementById("api-deepseek-model-group").classList.toggle("hidden", provider !== 'deepseek');
}

/**
 * 从localStorage加载已保存的API设置。
 */
function loadSettings(){
    document.getElementById("api-provider").value = localStorage.getItem("api_provider") || "gemini";
    document.getElementById("api-key").value = localStorage.getItem("api_key") || "";
    document.getElementById("api-base-url").value = localStorage.getItem("api_base_url") || "";
    document.getElementById("api-model-name").value = localStorage.getItem("api_model_name") || "";
    document.getElementById("api-gemini-model").value = localStorage.getItem("gemini_model") || "gemini-1.5-flash";
    document.getElementById("api-deepseek-model").value = localStorage.getItem("deepseek_model") || "deepseek-chat";
    updateApiSettingsVisibility();
}

/**
 * 保存API设置到localStorage并关闭模态框。
 */
function saveAndCloseSettings(){
    localStorage.setItem("api_provider", document.getElementById("api-provider").value);
    localStorage.setItem("api_key", document.getElementById("api-key").value);
    localStorage.setItem("api_base_url", document.getElementById("api-base-url").value);
    localStorage.setItem("api_model_name", document.getElementById("api-model-name").value);
    localStorage.setItem("gemini_model", document.getElementById("api-gemini-model").value);
    localStorage.setItem("deepseek_model", document.getElementById("api-deepseek-model").value);
    const statusEl = document.getElementById("settings-status");
    statusEl.textContent = "设置已保存!";
    statusEl.style.color = 'var(--success-color)';
    setTimeout(() => { statusEl.textContent = ""; document.getElementById("api-settings-modal").classList.add("hidden"); }, 1000);
}

// ==========================================================
//                    【核心修复区域】
// 我重写了 callApi 函数，为其加入了自动重试逻辑。
// ==========================================================
/**
 * 核心AI调用函数，增加了自动重试机制。
 * @param {string} prompt - 发送给AI的指令。
 * @param {boolean} isJsonMode - 是否要求AI返回JSON格式。
 * @returns {Promise<string>} AI返回的文本内容。
 */
async function callApi(prompt, isJsonMode = false) {
    const MAX_RETRIES = 3; // 设置最大重试次数
    const RETRY_DELAY = 2000; // 设置每次重试的延迟时间（毫秒）

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            const provider = localStorage.getItem('api_provider') || 'gemini';
            const apiKey = localStorage.getItem('api_key') || '';
            const baseUrl = localStorage.getItem('api_base_url') || '';
            const modelName = localStorage.getItem('api_model_name') || '';
            let endpoint = '';
            let headers = { 'Content-Type': 'application/json' };
            let body = {};
            
            console.log(`正在使用 [${provider}] 进行AI交互... (第 ${attempt} 次尝试, JSON模式: ${isJsonMode})`);
            if (attempt === 1) { // 只在第一次尝试时显示通用通知
                showNotification("正在请求AI...", "info");
            }

            switch (provider) {
                case 'gemini':
                    const geminiModel = localStorage.getItem('gemini_model') || 'gemini-1.5-flash';
                    if (!apiKey) throw new Error("请在设置中配置您的 Google Gemini API Key。");
                    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${geminiModel}:generateContent?key=${apiKey}`;
                    body = { contents: [{ parts: [{ text: prompt }] }] };
                    if (isJsonMode) {
                        body.generationConfig = { responseMimeType: "application/json" };
                    }
                    break;
                
                case 'openai': case 'deepseek': case 'siliconflow': case 'ollama': case 'custom':
                    let finalEndpoint = '';
                    let finalModel = '';
                    switch (provider) {
                        case 'openai':
                            if (!apiKey) throw new Error("请配置 OpenAI API Key。");
                            finalEndpoint = 'https://api.openai.com/v1/chat/completions';
                            finalModel = 'gpt-3.5-turbo';
                            headers['Authorization'] = `Bearer ${apiKey}`;
                            break;
                        case 'deepseek':
                            if (!apiKey) throw new Error("请配置 DeepSeek API Key。");
                            finalEndpoint = 'https://api.deepseek.com/chat/completions';
                            finalModel = localStorage.getItem('deepseek_model') || 'deepseek-chat';
                            headers['Authorization'] = `Bearer ${apiKey}`;
                            break;
                        case 'siliconflow':
                            if (!apiKey) throw new Error("请配置 Silicon Flow API Key。");
                            if (!modelName) throw new Error("请为 Silicon Flow 配置模型名称。");
                            finalEndpoint = 'https://api.siliconflow.cn/v1/chat/completions';
                            finalModel = modelName;
                            headers['Authorization'] = `Bearer ${apiKey}`;
                            break;
                        case 'ollama': case 'custom':
                            if (!baseUrl || !modelName) throw new Error("请配置自定义API Base URL和模型名称。");
                            const finalBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
                            finalEndpoint = `${finalBaseUrl}/chat/completions`;
                            finalModel = modelName;
                            if (provider === 'custom' && apiKey) {
                                headers['Authorization'] = `Bearer ${apiKey}`;
                            }
                            break;
                    }
                    endpoint = finalEndpoint;
                    body = { model: finalModel, messages: [{ role: "user", content: prompt }] };
                    if (isJsonMode) {
                        body.response_format = { type: "json_object" };
                    }
                    break;

                default:
                    throw new Error(`未知的API服务商: ${provider}`);
            }

            const response = await fetch(endpoint, { method: 'POST', headers: headers, body: JSON.stringify(body) });

            if (response.ok) {
                const data = await response.json();
                let content;
                if (provider === 'gemini') {
                    content = data.candidates?.[0]?.content?.parts?.[0]?.text;
                } else {
                    content = data.choices?.[0]?.message?.content;
                }
                if (content === undefined || content === null) {
                    throw new Error('未能从API响应中提取有效内容。');
                }
                showNotification("AI响应成功", "success");
                return content.trim(); // 成功则直接返回，跳出循环
            }

            // 如果是服务器错误 (5xx)，并且还有重试机会，则等待后继续循环
            if (response.status >= 500 && attempt < MAX_RETRIES) {
                console.warn(`API请求失败 (状态码: ${response.status})。将在 ${RETRY_DELAY / 1000} 秒后进行第 ${attempt + 1} 次尝试。`);
                showNotification(`AI服务器暂时繁忙，正在自动重试...`, 'info');
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                continue; // 继续下一次循环
            }

            // 如果是客户端错误 (4xx) 或重试次数用尽，则直接抛出最终错误
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API请求失败 (${response.status}): ${errorData.error?.message || response.statusText}`);

        } catch (error) {
            console.error(`第 ${attempt} 次尝试失败:`, error);
            if (attempt < MAX_RETRIES) {
                // 如果是网络错误等，也进行重试
                showNotification(`网络连接错误，正在自动重试...`, 'info');
                await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                continue;
            } else {
                // 所有重试都失败了，向上抛出最终的错误
                showNotification(`AI交互最终失败: ${error.message}`, 'error');
                throw error;
            }
        }
    }
}