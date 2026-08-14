/**
 * RentEase AI Assistant — Intelligent Floating Chatbot Widget
 * Supports full conversational assistance, FAQs, problem solving, and direct 1-click cart integration.
 */

(function () {
  const CHAT_STORAGE_KEY = "rentease_chat_history";
  const IS_OPEN_STORAGE_KEY = "rentease_chat_open";
  const API_ENDPOINT = "/api/ai/chat";

  // Initial welcome message and suggested quick prompts
  const INITIAL_WELCOME = {
    sender: "bot",
    text: "Hello! 👋 I'm **RentEase AI**, your personal furniture advisor and support assistant.\n\nHow can I help you today? You can ask me to find furniture matching your budget, explain our rental plans, or solve any questions you have!",
    suggestions: [
      "🛋️ Find a Sofa for small room",
      "🛏️ Beds under ₹20,000",
      "📦 How does renting work?",
      "💰 Security Deposit & Refund",
      "🚚 Delivery & Assembly",
      "🛒 Help with my cart"
    ],
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  };

  // Helper: Format INR currency
  function formatMoney(num) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(num);
  }

  // Create & Inject Chatbot DOM structure
  function initChatbotUI() {
    if (document.getElementById("rentease-chatbot-root")) return;

    const root = document.createElement("div");
    root.id = "rentease-chatbot-root";
    root.innerHTML = `
      <!-- Floating Trigger Button -->
      <button id="chatbot-fab" class="chatbot-fab" aria-label="Open RentEase AI Chat">
        <div class="fab-badge pulse">✦</div>
        <div class="fab-icon-chat">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="fab-icon-close">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </div>
        <span class="fab-tooltip">Chat with RentEase AI</span>
      </button>

      <!-- Chatbot Main Window -->
      <div id="chatbot-window" class="chatbot-window hidden">
        <!-- Header -->
        <div class="chatbot-header">
          <div class="chatbot-brand">
            <div class="bot-avatar">
              <span>✦</span>
              <span class="online-indicator"></span>
            </div>
            <div class="bot-info">
              <h4>RentEase Assistant <span class="ai-badge">AI</span></h4>
              <p><span class="status-dot"></span> Online · Instant Support</p>
            </div>
          </div>
          <div class="chatbot-actions">
            <button id="chatbot-clear-btn" class="header-btn" title="Clear conversation" aria-label="Clear chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
            <button id="chatbot-close-btn" class="header-btn" title="Close" aria-label="Close chat">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body / Messages -->
        <div id="chatbot-messages" class="chatbot-messages"></div>

        <!-- Quick Suggestions Container -->
        <div id="chatbot-quick-chips" class="chatbot-quick-chips"></div>

        <!-- Input Bar -->
        <div class="chatbot-input-bar">
          <textarea
            id="chatbot-input"
            placeholder="Ask anything (e.g., sofas under ₹20,000, deposit policy)..."
            rows="1"
          ></textarea>
          <button id="chatbot-send-btn" class="chatbot-send-btn" aria-label="Send message">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    setupEventListeners();
    loadChatHistory();
  }

  // Load / Store conversation
  function getStoredHistory() {
    try {
      const stored = sessionStorage.getItem(CHAT_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [INITIAL_WELCOME];
    } catch {
      return [INITIAL_WELCOME];
    }
  }

  function saveHistory(messages) {
    try {
      sessionStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Could not save chat history to sessionStorage", e);
    }
  }

  let chatHistory = [];

  function loadChatHistory() {
    chatHistory = getStoredHistory();
    renderAllMessages();
  }

  function renderAllMessages() {
    const container = document.getElementById("chatbot-messages");
    if (!container) return;
    container.innerHTML = "";

    chatHistory.forEach((msg) => {
      appendMessageToDOM(msg, false);
    });

    // Render chips from last bot message
    const lastBotMsg = [...chatHistory].reverse().find((m) => m.sender === "bot" && m.suggestions);
    if (lastBotMsg && lastBotMsg.suggestions) {
      renderSuggestions(lastBotMsg.suggestions);
    }

    scrollToBottom();
  }

  // Parse simple markdown to HTML
  function formatMarkdown(text) {
    if (!text) return "";
    let html = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h5 class="chat-h5">$1</h5>');
    html = html.replace(/^## (.*$)/gim, '<h4 class="chat-h4">$1</h4>');

    // Bold & italic
    html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_self" class="chat-link">$1</a>');

    // Bullet points
    html = html.replace(/^[•\-\*] (.*$)/gim, '<div class="chat-bullet">• $1</div>');

    // Numbered lists
    html = html.replace(/^\d+\.\s+(.*$)/gim, '<div class="chat-num-item"><b>$&</b></div>');

    // Line breaks
    html = html.replace(/\n/g, "<br>");
    return html;
  }

  // Append a single message to DOM
  function appendMessageToDOM(msg, shouldScroll = true) {
    const container = document.getElementById("chatbot-messages");
    if (!container) return;

    const isUser = msg.sender === "user";
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${isUser ? "msg-user" : "msg-bot"}`;

    let productsHtml = "";
    if (msg.products && msg.products.length > 0) {
      productsHtml = `
        <div class="chat-products-grid">
          ${msg.products.map(p => `
            <div class="chat-product-card" data-product-id="${p._id}">
              <div class="card-img-wrap">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
                <span class="card-tag">${p.category || 'furniture'}</span>
              </div>
              <div class="card-details">
                <h6>${p.name}</h6>
                <div class="card-price-row">
                  <span class="card-price">${formatMoney(p.price)}<small>/mo</small></span>
                  <span class="card-rating">★ ${p.rating || 4.5}</span>
                </div>
                <button class="chat-add-btn" onclick="window.RentEaseChatbot.handleAddToCart(event, '${encodeURIComponent(JSON.stringify(p))}')">
                  + Add to Cart
                </button>
              </div>
            </div>
          `).join("")}
        </div>
      `;
    }

    msgDiv.innerHTML = `
      ${!isUser ? `<div class="msg-avatar">✦</div>` : ""}
      <div class="msg-bubble-wrap">
        <div class="msg-bubble">
          <div class="msg-content">${formatMarkdown(msg.text)}</div>
          ${productsHtml}
        </div>
        <span class="msg-time">${msg.timestamp || ""}</span>
      </div>
    `;

    container.appendChild(msgDiv);
    if (shouldScroll) scrollToBottom();
  }

  // Render clickable quick chips
  function renderSuggestions(suggestions) {
    const chipsContainer = document.getElementById("chatbot-quick-chips");
    if (!chipsContainer) return;

    if (!suggestions || suggestions.length === 0) {
      chipsContainer.innerHTML = "";
      return;
    }

    chipsContainer.innerHTML = suggestions
      .map(
        (chip) => `
      <button class="quick-chip" onclick="window.RentEaseChatbot.sendQuickMessage('${chip.replace(/'/g, "\\'")}')">
        ${chip}
      </button>
    `
      )
      .join("");
  }

  // Show typing loader
  function showTypingIndicator() {
    const container = document.getElementById("chatbot-messages");
    if (!container || document.getElementById("typing-indicator")) return;

    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.className = "chat-msg msg-bot typing";
    typingDiv.innerHTML = `
      <div class="msg-avatar">✦</div>
      <div class="msg-bubble typing-bubble">
        <span></span><span></span><span></span>
      </div>
    `;
    container.appendChild(typingDiv);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    const container = document.getElementById("chatbot-messages");
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  // Send message handler
  async function sendMessage(textToSend) {
    const input = document.getElementById("chatbot-input");
    const message = (textToSend || (input ? input.value : "")).trim();
    if (!message) return;

    if (input && !textToSend) {
      input.value = "";
      input.style.height = "auto";
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // User message
    const userMsg = { sender: "user", text: message, timestamp: timeStr };
    chatHistory.push(userMsg);
    appendMessageToDOM(userMsg);
    saveHistory(chatHistory);

    // Render typing
    showTypingIndicator();

    // Prepare conversation history payload for LLM context
    const historyPayload = chatHistory.slice(-6).map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text
    }));

    try {
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: historyPayload })
      });

      const data = await response.json();
      hideTypingIndicator();

      const botMsg = {
        sender: "bot",
        text: data.reply || "I couldn't process that. Please try again.",
        suggestions: data.suggestions || ["🛋️ Browse Sofas", "📦 Rental Plans", "📞 Contact Support"],
        products: data.products || [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      chatHistory.push(botMsg);
      appendMessageToDOM(botMsg);
      renderSuggestions(botMsg.suggestions);
      saveHistory(chatHistory);
    } catch (err) {
      console.error("Chat API error:", err);
      hideTypingIndicator();

      const errorMsg = {
        sender: "bot",
        text: "I am having trouble reaching the server right now. Please check if the backend server is running and try again!",
        suggestions: ["🛋️ Browse Products", "📦 How Renting Works", "🔄 Try Again"],
        products: [],
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      chatHistory.push(errorMsg);
      appendMessageToDOM(errorMsg);
      renderSuggestions(errorMsg.suggestions);
      saveHistory(chatHistory);
    }
  }

  // Add to cart from within the chat window
  function handleAddToCart(event, encodedProduct) {
    if (event) event.stopPropagation();
    try {
      const product = JSON.parse(decodeURIComponent(encodedProduct));
      let cart = JSON.parse(localStorage.getItem("renteaseCart") || "[]");

      const existing = cart.find((item) => item.product === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          product: product._id,
          name: product.name,
          price: product.price,
          quantity: 1
        });
      }

      localStorage.setItem("renteaseCart", JSON.stringify(cart));

      // Visual feedback on button
      if (event && event.target) {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = "✓ Added!";
        btn.style.backgroundColor = "#2d7a4d";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.backgroundColor = "";
        }, 1800);
      }

      // Update navbar cart counter if page has the function
      if (typeof window.updateCartCount === "function") {
        window.updateCartCount();
      } else {
        const badge = document.getElementById("cartCount");
        if (badge) {
          badge.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }
      }

      // Show small toast inside chat
      const toast = document.createElement("div");
      toast.className = "chat-toast";
      toast.innerHTML = `<span>✓</span> Added <strong>${product.name}</strong> to your Cart! <a href="/cart.html">View Cart →</a>`;
      const container = document.getElementById("chatbot-messages");
      if (container) {
        container.appendChild(toast);
        scrollToBottom();
      }
    } catch (e) {
      console.error("Failed to add product to cart from chat", e);
    }
  }

  // Toggle chat window open/close
  function toggleChat(forceState) {
    const win = document.getElementById("chatbot-window");
    const fab = document.getElementById("chatbot-fab");
    if (!win || !fab) return;

    const isOpening = forceState !== undefined ? forceState : win.classList.contains("hidden");

    if (isOpening) {
      win.classList.remove("hidden");
      fab.classList.add("active");
      document.getElementById("chatbot-input")?.focus();
      scrollToBottom();
      sessionStorage.setItem(IS_OPEN_STORAGE_KEY, "true");
    } else {
      win.classList.add("hidden");
      fab.classList.remove("active");
      sessionStorage.setItem(IS_OPEN_STORAGE_KEY, "false");
    }
  }

  // Clear conversation history
  function clearChat() {
    if (confirm("Clear your conversation history with RentEase AI?")) {
      chatHistory = [INITIAL_WELCOME];
      saveHistory(chatHistory);
      renderAllMessages();
    }
  }

  // Event Listeners
  function setupEventListeners() {
    const fab = document.getElementById("chatbot-fab");
    const closeBtn = document.getElementById("chatbot-close-btn");
    const clearBtn = document.getElementById("chatbot-clear-btn");
    const sendBtn = document.getElementById("chatbot-send-btn");
    const input = document.getElementById("chatbot-input");

    fab?.addEventListener("click", () => toggleChat());
    closeBtn?.addEventListener("click", () => toggleChat(false));
    clearBtn?.addEventListener("click", clearChat);
    sendBtn?.addEventListener("click", () => sendMessage());

    input?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });

    // Auto-grow textarea height
    input?.addEventListener("input", () => {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 100) + "px";
    });

    // Restore open state if user previously had it open in session
    if (sessionStorage.getItem(IS_OPEN_STORAGE_KEY) === "true") {
      toggleChat(true);
    }
  }

  // Expose methods globally for inline onclick triggers
  window.RentEaseChatbot = {
    toggle: toggleChat,
    sendQuickMessage: (text) => {
      sendMessage(text);
    },
    handleAddToCart: handleAddToCart,
    clearChat: clearChat
  };

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initChatbotUI);
  } else {
    initChatbotUI();
  }
})();
