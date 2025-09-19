// 文件路径: js/core/02_通用工具.js
// 描述: (V40.3 梦想终极版) 存放通用辅助函数。补上了缺失的流式打印函数。

/**
 * 在界面右上角显示一个短暂的通知。
 * @param {string} message - 要显示的消息内容。
 * @param {string} type - 通知类型 ('info', 'success', 'error')，决定了颜色。
 */
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    const notification = document.createElement('div');
    notification.className = `notification`;
    notification.style.borderLeftColor = `var(--${type}-color, var(--border-color))`;
    notification.textContent = message;
    container.appendChild(notification);
    setTimeout(() => notification.remove(), 4000);
}

/**
 * 向AI助手窗口添加一条消息。
 * @param {string} message - 要显示的消息内容 (支持简单的Markdown)。
 * @param {string} sender - 发送者 ('user' 或 'ai')。
 */
function addAssistantMessage(message, sender) {
    const messagesContainer = document.getElementById('assistant-messages');
    if (!messagesContainer) return;
    const messageElement = document.createElement('div');
    messageElement.className = sender === 'user' ? 'user-message' : 'ai-message';
    message = message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messageElement.innerHTML = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

/**
 * [V1.3 修正版] 智能解析AI返回的JSON字符串。
 * @param {string} text - AI返回的原始文本。
 * @returns {Object} 解析后的JavaScript对象。
 */
function parseAiJson(text) {
    let jsonString = text.trim();
    const markdownMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (markdownMatch && markdownMatch[1]) {
        jsonString = markdownMatch[1].trim();
    } else {
        const firstBrace = jsonString.indexOf('{');
        const lastBrace = jsonString.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace > firstBrace) {
            jsonString = jsonString.substring(firstBrace, lastBrace + 1);
        }
    }
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON:", e);
        console.error("Content that failed to parse:", jsonString);
        throw new Error("AI返回的内容不是有效的JSON格式。");
    }
}

/**
 * 净化文本，移除可能导致JSON.parse失败的非法控制字符。
 * @param {string} text - 需要净化的字符串。
 * @returns {string} 净化后的字符串。
 */
function sanitizeTextForJSON(text) {
    if (typeof text !== 'string') return text;
    return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

/**
 * 从HTML字符串中剥离标签，为AI指令创建干净的纯文本。
 * @param {string} htmlString - 需要清洗的HTML内容。
 * @returns {string} 清洗后的纯文本。
 */
function sanitizeForTemplate(htmlString) {
    if (!htmlString || typeof htmlString !== 'string') return "";
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    tempDiv.querySelectorAll('p, div, h4, h5, li, br').forEach(el => {
        el.insertAdjacentHTML('afterend', '\n');
    });
    return tempDiv.textContent || tempDiv.innerText || "";
}

/**
 * [V1.3 修正版] 设置通用验证状态的UI反馈。
 */
function setValidationStatus(panel, status, statusText, content = '') {
    if (validationState.hasOwnProperty(panel)) {
        validationState[panel] = status;
    }
    const feedbackBox = document.getElementById(`${panel}-validation-feedback`);
    const statusTextEl = document.getElementById(`${panel}-validation-status-text`);
    const contentEl = document.getElementById(`${panel}-validation-feedback-content`);
    const regenerateBtn = document.getElementById(`regenerate-${panel}-btn`);
    const addToBlueprintBtn = document.getElementById(`add-to-blueprint-${panel}-btn`);
    if (feedbackBox && statusTextEl && contentEl) {
        feedbackBox.className = '';
        feedbackBox.classList.add(`status-${status}`);
        feedbackBox.classList.remove('hidden');
        statusTextEl.textContent = statusText;
        contentEl.innerHTML = content.replace(/\n/g, '<br>');
    }
    if (regenerateBtn) {
        const panelResult = lastValidationResult[panel];
        const hasSuggestions = panelResult && typeof panelResult.suggestions === 'string' && panelResult.suggestions.trim() !== "" && !panelResult.suggestions.includes("期待");
        regenerateBtn.disabled = status === 'approved' || !hasSuggestions;
    }
    if (addToBlueprintBtn) {
        addToBlueprintBtn.classList.toggle('hidden', status !== 'approved');
    }
}

/**
 * 下载文件到本地
 */
function downloadFile(content, fileName, format) {
     let blobType;
    switch(format) {
        case 'md': blobType = 'text/markdown;charset=utf-8'; break;
        case 'doc': blobType = 'application/msword;charset=utf-8'; break;
        default: blobType = 'text/plain;charset=utf-8'; break;
    }
    const blob = new Blob([`\uFEFF${content}`], { type: blobType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${fileName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// 【!!! 核心修正点：补上缺失的流式打印函数 !!!】
/**
 * 将文本以打字机效果流式输出到指定的textarea中。
 * @param {HTMLTextAreaElement} textarea - 目标文本区域元素。
 * @param {string} text - 需要输出的完整文本。
 * @param {number} [delay=5] - 每个字符之间的延迟（毫秒）。
 * @param {boolean} [clear=false] - 在开始打印前是否清空文本区域。
 */
async function streamTextToTextarea(textarea, text, delay = 5, clear = false) {
    if (clear) {
        textarea.value = '';
    }
    for (let i = 0; i < text.length; i++) {
        textarea.value += text[i];
        // 保持滚动条在最下方，以便用户能看到最新的内容
        textarea.scrollTop = textarea.scrollHeight;
        // 使用一个小的延迟来创建动画效果，避免UI卡顿
        if (i % 2 === 0) {
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}