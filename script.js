const sendBtn = document.getElementById('sendBtn');
const userInput = document.getElementById('userInput');
const chatBody = document.getElementById('chatBody');

// Typing effect for messages
function typeText(element, text, speed = 20) {
    return new Promise((resolve) => {
        let index = 0;
        element.innerHTML = '';
        const interval = setInterval(() => {
            element.innerHTML += text.charAt(index);
            chatBody.scrollTop = chatBody.scrollHeight;
            index++;
            if (index >= text.length) {
                clearInterval(interval);
                MathJax.typesetPromise(); // render LaTeX
                resolve();
            }
        }, speed);
    });
}

// Send user message
async function sendMessage() {
    const text = userInput.value.trim();
    if(text === "") return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.classList.add('message', 'user');
    userMsg.innerText = text;
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    userInput.value = '';

    // Loading message
    const loadingMsg = document.createElement('div');
    loadingMsg.classList.add('message', 'bot');
    loadingMsg.innerText = "DrewMatica is thinking... 🤖";
    chatBody.appendChild(loadingMsg);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch("https://drewmatica-backend.onrender.com/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await response.json();
        chatBody.removeChild(loadingMsg);

        // Single AI response only
        const botMsg = document.createElement('div');
        botMsg.classList.add('message', 'bot');
        chatBody.appendChild(botMsg);
        await typeText(botMsg, data.response || "No response.", 15);

    } catch (err) {
        console.error(err);
        loadingMsg.innerText = `Error: Could not reach DrewMatica backend!`;
    }
}

// Event listeners
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function(e){
    if(e.key === 'Enter') sendMessage();
});
