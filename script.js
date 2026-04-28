document.addEventListener("DOMContentLoaded", () => {
    // تعريف العناصر
    const loginScreen = document.getElementById("login-screen");
    const appScreen = document.getElementById("app-screen");
    const googleLoginBtn = document.getElementById("google-login-btn");

    const menuBtn = document.getElementById("menu-btn");
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    const newChatBtn = document.getElementById("new-chat-btn");

    const plusBtn = document.getElementById("plus-btn");
    const bottomSheet = document.getElementById("bottom-sheet");

    const chatInput = document.getElementById("chat-input");
    const micBtn = document.querySelector(".mic-btn");
    const voiceBtn = document.getElementById("voice-btn");
    const sendBtn = document.getElementById("send-btn");

    const suggestions = document.getElementById("suggestions");
    const messagesContainer = document.getElementById("messages-container");
    const chatArea = document.getElementById("chat-area");

    // 1. نظام تسجيل الدخول الوهمي وحفظه بالمتصفح
    if (localStorage.getItem("chatgpt_simulator_loggedin") === "true") {
        loginScreen.classList.add("hidden");
        appScreen.classList.remove("hidden");
        loadChat();
    }

    googleLoginBtn.addEventListener("click", () => {
        googleLoginBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جاري التحقق...';
        
        setTimeout(() => {
            localStorage.setItem("chatgpt_simulator_loggedin", "true");
            loginScreen.classList.add("hidden");
            appScreen.classList.remove("hidden");
            loadChat();
        }, 1500); // تأخير ثانية ونصف للمحاكاة
    });

    // 2. التحكم بفتح وإغلاق القوائم المنبثقة
    menuBtn.addEventListener("click", () => {
        sidebar.classList.add("active");
        overlay.classList.add("active");
    });

    plusBtn.addEventListener("click", () => {
        bottomSheet.classList.add("active");
        overlay.classList.add("active");
    });

    overlay.addEventListener("click", () => {
        sidebar.classList.remove("active");
        bottomSheet.classList.remove("active");
        overlay.classList.remove("active");
    });

    // 3. التبديل بين أزرار المايكروفون والسهم عند الكتابة
    chatInput.addEventListener("input", () => {
        if (chatInput.value.trim().length > 0) {
            voiceBtn.classList.add("hidden");
            micBtn.classList.add("hidden");
            sendBtn.classList.remove("hidden");
        } else {
            voiceBtn.classList.remove("hidden");
            micBtn.classList.remove("hidden");
            sendBtn.classList.add("hidden");
        }
    });

    // 4. نظام المحادثة التفاعلي وحفظه في (LocalStorage)
    function saveMessage(text, sender) {
        const savedMessages = JSON.parse(localStorage.getItem("chatgpt_history") || "[]");
        savedMessages.push({ text, sender });
        localStorage.setItem("chatgpt_history", JSON.stringify(savedMessages));
    }

    function loadChat() {
        const savedMessages = JSON.parse(localStorage.getItem("chatgpt_history") || "[]");
        if (savedMessages.length > 0) {
            suggestions.style.display = "none";
            savedMessages.forEach(msg => appendMessage(msg.text, msg.sender));
        }
    }

    function appendMessage(text, sender) {
        const div = document.createElement("div");
        div.className = `message ${sender}`;
        
        if (sender === "bot") {
            const svgIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="black" xmlns="http://www.w3.org/2000/svg"><path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2057 5.9847 5.9847 0 0 0 3.998-2.9001 6.0557 6.0557 0 0 0-.7478-7.0731z"/></svg>`;
            div.innerHTML = `<div class="bot-icon">${svgIcon}</div> <div>${text}</div>`;
        } else {
            div.innerText = text;
        }
        
        messagesContainer.appendChild(div);
        chatArea.scrollTo({ top: chatArea.scrollHeight, behavior: 'smooth' });
    }

    function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        // إخفاء الاقتراحات وإظهار المحادثة
        suggestions.style.display = "none";
        
        appendMessage(text, "user");
        saveMessage(text, "user");

        // إعادة حالة حقل النص للوضع الافتراضي
        chatInput.value = "";
        chatInput.dispatchEvent(new Event("input")); 

        // محاكاة رد من الروبوت بعد ثانية واحدة
        setTimeout(() => {
            const botReply = "أنا نموذج محاكاة لـ ChatGPT. تم تصميمي خصيصاً لأطابق الصور التي قمت بطلبها بدقة! كيف يمكنني الترفيه عنك اليوم؟";
            appendMessage(botReply, "bot");
            saveMessage(botReply, "bot");
        }, 1000);
    }

    sendBtn.addEventListener("click", handleSend);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSend();
    });

    // 5. زر "محادثة جديدة" (في القائمة الجانبية) لمسح السجل
    newChatBtn.addEventListener("click", () => {
        localStorage.removeItem("chatgpt_history");
        messagesContainer.innerHTML = "";
        suggestions.style.display = "flex"; // إعادة إظهار الاقتراحات
        sidebar.classList.remove("active");
        overlay.classList.remove("active");
    });
});
