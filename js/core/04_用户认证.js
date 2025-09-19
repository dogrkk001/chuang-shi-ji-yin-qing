// 文件路径: js/core/04_用户认证.js
// 描述: (V1.2 - 登录流程强化) 负责用户的注册、登录、登出以及UI状态更新。

/**
 * 初始化认证相关的按钮事件。
 */
function initializeAuth(){
    document.getElementById('register-btn').addEventListener('click', handleRegister);
    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

/**
 * 检查本地存储中是否存在当前用户，并据此更新UI。
 * 这个函数现在能正确处理页面刷新，保持登录状态。
 */
function checkLoginStatus(){
    currentUser = localStorage.getItem("genesis_engine_currentUser");
    if (currentUser) {
        // 场景：用户刷新页面或关闭后重开浏览器
        // 行为：静默恢复登录状态，不重置工作区
        document.getElementById('welcome-message').textContent = `欢迎, ${currentUser}`;
        document.getElementById('login-btn').classList.add('hidden');
        document.getElementById('register-btn').classList.add('hidden');
        document.getElementById('logout-btn').classList.remove('hidden');
        document.getElementById('app-content').classList.remove('disabled');

        // 只加载用户的永久资产，不清空当前工作
        loadProjectsFromStorage();
        loadCharacterDeckFromStorage();
        renderCharacterDeck(); 
        renderProjectList();   

    } else {
        // 场景：用户从未登录或已手动登出
        updateUIAfterLogout();
    }
}

/**
 * 处理用户注册。
 */
function handleRegister(){
    const username = prompt("注册用户名:");
    if (!username || username.trim() === '') return;
    const password = prompt("设置密码:");
    if (!password) return;
    let users = JSON.parse(localStorage.getItem("genesis_engine_users")) || {};
    if (users[username]) {
        showNotification("用户名已存在！", "error");
    } else {
        users[username] = { password: password };
        localStorage.setItem("genesis_engine_users", JSON.stringify(users));
        showNotification("注册成功！现在请登录。", "success");
    }
}

/**
 * 处理用户登录。
 */
function handleLogin(){
    const username = prompt("用户名:");
    if (!username) return;
    const password = prompt("密码:");
    if (!password) return;
    let users = JSON.parse(localStorage.getItem("genesis_engine_users")) || {};
    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem("genesis_engine_currentUser", currentUser);
        updateUIAfterLogin(); // 调用为“手动登录”准备的函数
    } else {
        showNotification("用户名或密码错误！", "error");
    }
}

/**
 * 处理用户登出。
 */
function handleLogout(){
    currentUser = null;
    localStorage.removeItem("genesis_engine_currentUser");
    updateUIAfterLogout();
}

/**
 * [V1.2 核心修正] 登录成功后更新UI界面。
 * 这个函数现在只在用户“手动点击登录”时被调用。
 * 新增了加载用户项目和角色卡组的逻辑，确保登录后数据立即可用。
 */
function updateUIAfterLogin(){
    document.getElementById('welcome-message').textContent = `欢迎, ${currentUser}`;
    document.getElementById('login-btn').classList.add('hidden');
    document.getElementById('register-btn').classList.add('hidden');
    document.getElementById('logout-btn').classList.remove('hidden');
    document.getElementById('app-content').classList.remove('disabled');
    showNotification(`欢迎回来, ${currentUser}!`, "success");
    
    // 【!!! 核心修正点 !!!】
    // 在重置工作区之前，先加载用户的永久资产（项目库、角色卡组）
    // 这样可以确保用户登录后，能立刻看到自己之前保存的项目和角色
    loadProjectsFromStorage();
    loadCharacterDeckFromStorage();
    renderCharacterDeck(); 
    renderProjectList();
    
    // 清空上一个用户可能留下的临时工作内容，提供一个干净的工作区
    resetCreationState(true);
}

/**
 * 登出后或未登录时更新UI界面。
 */
function updateUIAfterLogout(){
    document.getElementById('welcome-message').textContent = "请先登录";
    document.getElementById('login-btn').classList.remove('hidden');
    document.getElementById('register-btn').classList.remove('hidden');
    document.getElementById('logout-btn').classList.add('hidden');
    document.getElementById('app-content').classList.add('disabled');
    
    // 只有在手动登出时才显示通知
    if(currentUser !== null) { // 检查是否是从登录状态登出
      showNotification("您已登出。", "info");
    }

    currentUser = null;
    projectLibrary = [];
    characterDeck = [];
    resetCreationState(false);
    renderProjectList();
    renderCharacterDeck();
}