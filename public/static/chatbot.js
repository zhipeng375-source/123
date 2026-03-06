/**
 * Global Hydraulic AI Chatbot Widget
 * 7x24 AI Customer Service
 */
(function() {
  'use strict';

  // ========== STYLES ==========
  const styles = document.createElement('style');
  styles.textContent = `
    /* Chat Toggle Button — sits inside .fab-wrapper, no fixed positioning */
    .gh-chat-toggle {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, #002B49 0%, #004a7c 100%);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 43, 73, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      font-size: 22px;
      position: relative;
      text-decoration: none;
    }
    .gh-chat-toggle:hover {
      transform: scale(1.1);
      color: white;
    }
    .gh-chat-toggle .gh-badge {
      position: absolute;
      top: -4px;
      right: -4px;
      background: #FF6B00;
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 5px;
      border-radius: 10px;
      line-height: 1.2;
    }

    /* Chat Window */
    .gh-chat-window {
      position: fixed;
      bottom: 100px;
      right: 30px;
      width: 380px;
      height: 520px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 10001;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'Montserrat', 'Segoe UI', sans-serif;
      animation: ghChatSlideUp 0.3s ease;
    }
    .gh-chat-window.gh-open {
      display: flex;
    }
    @keyframes ghChatSlideUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Header */
    .gh-chat-header {
      background: linear-gradient(135deg, #002B49 0%, #004a7c 100%);
      color: white;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .gh-chat-header-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      flex-shrink: 0;
    }
    .gh-chat-header-info h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 700;
    }
    .gh-chat-header-info p {
      margin: 0;
      font-size: 11px;
      opacity: 0.8;
    }
    .gh-chat-header-status {
      display: inline-block;
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      margin-right: 4px;
      animation: ghPulse 2s infinite;
    }
    @keyframes ghPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .gh-chat-close {
      margin-left: auto;
      background: rgba(255,255,255,0.15);
      border: none;
      color: white;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: background 0.2s;
    }
    .gh-chat-close:hover {
      background: rgba(255,255,255,0.3);
    }

    /* Messages Area */
    .gh-chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      background: #f4f6f9;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .gh-chat-messages::-webkit-scrollbar {
      width: 4px;
    }
    .gh-chat-messages::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }

    /* Message Bubbles */
    .gh-msg {
      max-width: 85%;
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.5;
      word-wrap: break-word;
    }
    .gh-msg-bot {
      background: white;
      color: #333;
      align-self: flex-start;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .gh-msg-user {
      background: linear-gradient(135deg, #002B49, #004a7c);
      color: white;
      align-self: flex-end;
      border-bottom-right-radius: 4px;
    }
    .gh-msg-bot a {
      color: #FF6B00;
      text-decoration: underline;
    }

    /* Typing indicator */
    .gh-typing {
      display: flex;
      gap: 4px;
      padding: 10px 14px;
      background: white;
      border-radius: 14px;
      border-bottom-left-radius: 4px;
      align-self: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .gh-typing span {
      width: 7px;
      height: 7px;
      background: #aaa;
      border-radius: 50%;
      animation: ghTyping 1.4s infinite;
    }
    .gh-typing span:nth-child(2) { animation-delay: 0.2s; }
    .gh-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ghTyping {
      0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
      30% { transform: translateY(-6px); opacity: 1; }
    }

    /* Quick Actions */
    .gh-quick-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding: 0 16px 8px;
      background: #f4f6f9;
    }
    .gh-quick-btn {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 20px;
      padding: 5px 12px;
      font-size: 11px;
      color: #002B49;
      cursor: pointer;
      transition: all 0.2s;
      font-family: inherit;
      font-weight: 500;
    }
    .gh-quick-btn:hover {
      background: #002B49;
      color: white;
      border-color: #002B49;
    }

    /* Input Area */
    .gh-chat-input-area {
      padding: 12px 16px;
      background: white;
      border-top: 1px solid #eee;
      display: flex;
      gap: 8px;
      align-items: center;
      flex-shrink: 0;
    }
    .gh-chat-input {
      flex: 1;
      border: 1px solid #e0e0e0;
      border-radius: 24px;
      padding: 10px 16px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s;
      resize: none;
      max-height: 80px;
      line-height: 1.4;
    }
    .gh-chat-input:focus {
      border-color: #002B49;
    }
    .gh-chat-input::placeholder {
      color: #aaa;
    }
    .gh-chat-send {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FF6B00, #e65c00);
      color: white;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      transition: all 0.2s;
      flex-shrink: 0;
    }
    .gh-chat-send:hover {
      transform: scale(1.05);
      box-shadow: 0 3px 10px rgba(255, 107, 0, 0.4);
    }
    .gh-chat-send:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    /* Mobile Responsive */
    @media (max-width: 480px) {
      .gh-chat-window {
        width: calc(100vw - 20px);
        height: calc(100vh - 120px);
        bottom: 80px;
        left: 10px;
        right: 10px;
        border-radius: 12px;
      }
    }
  `;
  document.head.appendChild(styles);

  // ========== HTML ==========
  const widget = document.createElement('div');
  widget.id = 'gh-chat-widget';
  widget.innerHTML = `
    <button class="gh-chat-toggle" id="ghChatToggle" title="AI-консультант 24/7">
      <i class="fas fa-robot"></i>
      <span class="gh-badge">24/7</span>
    </button>
    <div class="gh-chat-window" id="ghChatWindow">
      <div class="gh-chat-header">
        <div class="gh-chat-header-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="gh-chat-header-info">
          <h4>AI-Консультант</h4>
          <p><span class="gh-chat-header-status"></span> Online 24/7</p>
        </div>
        <button class="gh-chat-close" id="ghChatClose">&times;</button>
      </div>
      <div class="gh-chat-messages" id="ghChatMessages"></div>
      <div class="gh-quick-actions" id="ghQuickActions">
        <button class="gh-quick-btn" data-msg="Какие насосы есть в наличии?">Насосы в наличии</button>
        <button class="gh-quick-btn" data-msg="Как заказать и оплатить?">Как заказать?</button>
        <button class="gh-quick-btn" data-msg="Какие бренды вы поставляете?">Бренды</button>
        <button class="gh-quick-btn" data-msg="Условия доставки и гарантия?">Доставка</button>
      </div>
      <div class="gh-chat-input-area">
        <input type="text" class="gh-chat-input" id="ghChatInput" placeholder="Введите сообщение..." autocomplete="off">
        <button class="gh-chat-send" id="ghChatSend" title="Отправить">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  `;
  // Insert toggle button into .fab-wrapper (above Telegram button) instead of body
  const fabWrapper = document.querySelector('.fab-wrapper');
  if (fabWrapper) {
    const toggleEl = widget.querySelector('.gh-chat-toggle');
    fabWrapper.insertBefore(toggleEl, fabWrapper.firstChild);
  }
  document.body.appendChild(widget);

  // ========== LOGIC ==========
  const toggleBtn = document.getElementById('ghChatToggle');
  const chatWindow = document.getElementById('ghChatWindow');
  const closeBtn = document.getElementById('ghChatClose');
  const messagesEl = document.getElementById('ghChatMessages');
  const inputEl = document.getElementById('ghChatInput');
  const sendBtn = document.getElementById('ghChatSend');
  const quickActions = document.getElementById('ghQuickActions');

  let isOpen = false;
  let isLoading = false;
  let chatHistory = [];
  let greeted = false;

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('gh-open', isOpen);
    if (isOpen && !greeted) {
      greeted = true;
      addBotMessage('Здравствуйте! Я AI-консультант Global Hydraulic. Работаю 24/7. Чем могу помочь?\n\nМогу рассказать о наличии, ценах, условиях поставки и оплаты.');
    }
    if (isOpen) {
      setTimeout(() => inputEl.focus(), 300);
    }
  }

  toggleBtn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Quick action buttons
  quickActions.addEventListener('click', (e) => {
    const btn = e.target.closest('.gh-quick-btn');
    if (btn && !isLoading) {
      const msg = btn.getAttribute('data-msg');
      sendMessage(msg);
      quickActions.style.display = 'none';
    }
  });

  // Send on Enter
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      const msg = inputEl.value.trim();
      if (msg) sendMessage(msg);
    }
  });

  sendBtn.addEventListener('click', () => {
    if (isLoading) return;
    const msg = inputEl.value.trim();
    if (msg) sendMessage(msg);
  });

  function addBotMessage(text) {
    const div = document.createElement('div');
    div.className = 'gh-msg gh-msg-bot';
    div.innerHTML = formatText(text);
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'gh-msg gh-msg-user';
    div.textContent = text;
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'gh-typing';
    div.id = 'ghTyping';
    div.innerHTML = '<span></span><span></span><span></span>';
    messagesEl.appendChild(div);
    scrollToBottom();
  }

  function removeTyping() {
    const el = document.getElementById('ghTyping');
    if (el) el.remove();
  }

  function formatText(text) {
    // Simple markdown-like formatting
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank">$1</a>')
      .replace(/(eddie@global-hydraulic\.ru)/g, '<a href="mailto:$1">$1</a>');
  }

  function scrollToBottom() {
    requestAnimationFrame(() => {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    });
  }

  async function sendMessage(text) {
    if (isLoading) return;
    
    addUserMessage(text);
    inputEl.value = '';
    chatHistory.push({ role: 'user', content: text });
    
    isLoading = true;
    sendBtn.disabled = true;
    showTyping();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory })
      });

      removeTyping();

      if (!response.ok) {
        throw new Error('API error');
      }

      // Read streamed text response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let botText = '';
      
      const botDiv = document.createElement('div');
      botDiv.className = 'gh-msg gh-msg-bot';
      messagesEl.appendChild(botDiv);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        botText += chunk;
        botDiv.innerHTML = formatText(botText);
        scrollToBottom();
      }

      if (botText) {
        chatHistory.push({ role: 'assistant', content: botText });
      } else {
        botDiv.innerHTML = formatText('Извините, не удалось получить ответ. Пожалуйста, попробуйте ещё раз или свяжитесь с нами напрямую: eddie@global-hydraulic.ru');
      }

    } catch (err) {
      removeTyping();
      addBotMessage('Извините, произошла ошибка. Пожалуйста, попробуйте позже или свяжитесь с нами:\n\nWhatsApp: +86-15861883072\nEmail: eddie@global-hydraulic.ru');
    } finally {
      isLoading = false;
      sendBtn.disabled = false;
    }
  }

})();
