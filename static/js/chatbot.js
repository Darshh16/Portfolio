// Chatbot Q&A Data based on Darsh Jilka's Resume
const chatbotQA = {
    "who_are_you": {
        question: "Who are you?",
        answer: "I'm Darsh's AI Assistant! I can help you navigate his portfolio and answer questions about his background. Darsh is a Full Stack Developer, Computer Engineering student, and AI enthusiast who loves building cool web applications."
    },
    "what_do_you_do": {
        question: "What do you do?",
        answer: "Darsh designs and builds scalable, high-performance web applications, machine learning models, and automation tools. Recently, he trained over 1,000 students in AI prompt engineering, Power BI, and data analytics as an Educator at Get AnalyticX. He's also built full-stack booking platforms and smart monitoring apps."
    },
    "skills": {
        question: "What are your skills?",
        answer: "Darsh is highly skilled in:\n\n• Languages: Python, C++, C#, JavaScript, HTML, CSS\n• Frameworks: Django, TensorFlow, Scikit-learn, OpenCV, NumPy, Pandas\n• Databases: MySQL, SQL, PostgreSQL, SQLite\n• Tools & Platforms: Git, GitHub, AWS, Docker, Power BI, Excel, Vercel"
    },
    "achievements": {
        question: "Show me your achievements!",
        answer: "🏆 Secured 1st Prize in Web Development at the Technova Hackathon.\n\n⚙️ Served as Technical Head at the HackcathonicX Hackathon, leading technical evaluations and mentoring participants.\n\n💡 Qualified for the prestigious Smart India Hackathon (SIH) in both 2024 and 2025!"
    },
    "contact": {
        question: "How do I contact you?",
        answer: "You can reach out to Darsh via:\n\n• Email: darshjilka09@gmail.com\n• Phone: +91 96193 86255\n• LinkedIn: linkedin.com/in/darshjilka\n• GitHub: github.com/Darshh16\n\nOr scroll down to the Contact section below and send a message right here on the website!"
    }
};

let isTyping = false;

// Initialize Chatbot
function initChatbot() {
    const overlay = document.getElementById('chatbot-overlay');
    const closeBtn = document.getElementById('chatbot-close-btn');
    const suggestionsContainer = document.getElementById('chatbot-suggestions');
    const messagesContainer = document.getElementById('chatbot-messages');

    if (!overlay || !closeBtn || !suggestionsContainer || !messagesContainer) {
        console.warn('Chatbot DOM elements missing');
        return;
    }

    // Close chatbot events
    closeBtn.addEventListener('click', closeChatbot);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeChatbot();
        }
    });

    // Populate suggestions
    suggestionsContainer.innerHTML = '';
    Object.keys(chatbotQA).forEach(key => {
        const item = chatbotQA[key];
        const button = document.createElement('button');
        button.className = 'chatbot-chip';
        button.innerText = item.question;
        button.addEventListener('click', () => handleQuestionSelect(key));
        suggestionsContainer.appendChild(button);
    });

    // Input events
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');
    if (inputField && sendBtn) {
        sendBtn.addEventListener('click', handleCustomInput);
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleCustomInput();
        });
    }

    // Show initial message
    showInitialMessage();
}

function openChatbot() {
    const overlay = document.getElementById('chatbot-overlay');
    if (overlay) {
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling behind modal
        // Trigger resize on window to keep three.js renderer sized correctly
        window.dispatchEvent(new Event('resize'));
    }
}

function closeChatbot() {
    const overlay = document.getElementById('chatbot-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
    }
}

function showInitialMessage() {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    messagesContainer.innerHTML = '';
    
    const initialText = "Hey there! I am Darsh's AI Assistant. Click on any of the questions below, and I'll tell you all about Darsh's skills, experience, and projects!";
    
    appendMessage(initialText, 'bot', false);
}

function appendMessage(text, sender, animate = true) {
    const messagesContainer = document.getElementById('chatbot-messages');
    if (!messagesContainer) return;

    const bubble = document.createElement('div');
    bubble.className = `chatbot-bubble ${sender}`;
    
    messagesContainer.appendChild(bubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    if (animate && sender === 'bot') {
        isTyping = true;
        disableChips(true);
        typeText(bubble, text, () => {
            isTyping = false;
            disableChips(false);
        });
    } else {
        bubble.innerText = text;
        bubble.innerHTML = bubble.innerHTML.replace(/\n/g, '<br>');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

function disableChips(disable) {
    const chips = document.querySelectorAll('.chatbot-chip');
    chips.forEach(chip => {
        chip.disabled = disable;
        if (disable) {
            chip.style.opacity = '0.5';
            chip.style.pointerEvents = 'none';
        } else {
            chip.style.opacity = '1';
            chip.style.pointerEvents = 'auto';
        }
    });
}

function typeText(element, text, callback) {
    element.classList.add('typing-cursor');
    const messagesContainer = document.getElementById('chatbot-messages');
    let i = 0;
    element.innerHTML = '';
    
    function typeChar() {
        if (i < text.length) {
            const char = text.charAt(i);
            if (char === '\n') {
                element.innerHTML += '<br>';
            } else {
                element.innerHTML += char;
            }
            i++;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            setTimeout(typeChar, 12); // Speed of typing
        } else {
            element.classList.remove('typing-cursor');
            if (callback) callback();
        }
    }
    typeChar();
}

function handleQuestionSelect(key) {
    if (isTyping) return;

    const data = chatbotQA[key];
    if (!data) return;

    // Append user question
    appendMessage(data.question, 'user', false);

    // Typing response after a small delay
    setTimeout(() => {
        appendMessage(data.answer, 'bot', true);
    }, 400);
}

function handleCustomInput() {
    if (isTyping) return;
    const inputField = document.getElementById('chatbot-input');
    if (!inputField) return;
    
    const text = inputField.value.trim();
    if (!text) return;
    
    inputField.value = '';
    
    // Append user message
    appendMessage(text, 'user', false);
    
    // Simple keyword matching
    const lowerText = text.toLowerCase();
    let matchedKey = null;
    
    if (lowerText.includes('who') || lowerText.includes('about')) {
        matchedKey = 'who_are_you';
    } else if (lowerText.includes('do') || lowerText.includes('work') || lowerText.includes('experience')) {
        matchedKey = 'what_do_you_do';
    } else if (lowerText.includes('skill') || lowerText.includes('tech') || lowerText.includes('know')) {
        matchedKey = 'skills';
    } else if (lowerText.includes('achieve') || lowerText.includes('award') || lowerText.includes('prize') || lowerText.includes('hackathon')) {
        matchedKey = 'achievements';
    } else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('reach') || lowerText.includes('hire')) {
        matchedKey = 'contact';
    }
    
    setTimeout(() => {
        if (matchedKey) {
            appendMessage(chatbotQA[matchedKey].answer, 'bot', true);
        } else {
            appendMessage("I'm Darsh's AI Assistant! Try asking me about his skills, experience, or how to contact him. (Or click the suggestion buttons above!)", 'bot', true);
        }
    }, 400);
}

// Export functions to global scope so they can be triggered from mascot.js
window.openChatbot = openChatbot;
window.closeChatbot = closeChatbot;

document.addEventListener('DOMContentLoaded', () => {
    initChatbot();
});
