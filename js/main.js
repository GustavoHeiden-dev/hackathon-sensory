let userInteracted = false;
let hasWelcomed = false;
let isChatOpen = false; // Controle para voz funcionar apenas quando modal estiver aberto

// Controlador principal da aplicação
class App {
  constructor() {
    console.log('🚀 Inicializando App...');
    this.chatbotUI = null;
    this.init();
  }

  init() {
    // Inicializa Gemini com API Key
    const geminiApiKey = 'AIzaSyDiBSWvpehMbP0ZBMd1SJEK-JcRk_zsq84';
    if (geminiApiKey && geminiApiKey !== 'SUA_API_KEY_AQUI') {
      initGemini(geminiApiKey);
    } else {
      console.warn('Gemini API Key não configurada. Usando modo local apenas.');
    }

    // Verifica suporte a voz
    this.checkVoiceSupport();

    // Inicializa chatbot
    this.initChatbot();

    // Configura eventos
    this.setupEventListeners();

  }

  // Verifica suporte a voz
  checkVoiceSupport() {
    if (!voiceController.isSynthesisSupported()) {
      console.warn('Síntese de voz não suportada');
      this.showWarning('Síntese de voz não suportada neste navegador.');
    }

    if (!voiceController.isRecognitionSupported()) {
      console.warn('Reconhecimento de voz não suportado');
      this.showWarning('Reconhecimento de voz não suportado neste navegador.');
    }
  }

  // Inicializa interface do chatbot
  initChatbot() {
    this.chatbotUI = new ChatbotUI();

    // Conecta callbacks do chatbot
    chatbotController.setOnMessageCallback((message) => {
      this.chatbotUI.addMessage(message);
    });

    chatbotController.setOnTypingCallback((isTyping) => {
      this.chatbotUI.setTyping(isTyping);
    });

    // Conecta entrada de voz
    voiceController.setVoiceInputCallback((text) => {
      chatbotController.processVoiceInput(text);
    });
  }

  // Configura eventos
  setupEventListeners() {
    // Botão de enviar mensagem
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');

    if (sendButton && messageInput) {
      sendButton.addEventListener('click', () => {
        this.sendMessage();
      });

      messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.sendMessage();
        }
      });
    }

    // Botão de voz
    const voiceButton = document.getElementById('voiceButton');
    if (voiceButton) {
      voiceButton.addEventListener('click', () => {
        this.toggleVoiceInput();
      });
    }

    // Botão de limpar chat
    const clearButton = document.getElementById('clearButton');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        this.clearChat();
      });
    }

    // Botão flutuante abrir/fechar chat
    const chatToggleButton = document.getElementById('chatToggleButton');
    if (chatToggleButton) {
      chatToggleButton.addEventListener('click', () => {
        this.toggleChatWidget();
      });
    }

    // Botão 'Abrir assistente' na página
    const openChatButton = document.getElementById('openChatButton');
    if (openChatButton) {
      openChatButton.addEventListener('click', () => {
        this.openChatWidget();
      });
    }

    // Botão 'Falar com assistente' no hero
    const openChatButtonHero = document.getElementById('openChatButtonHero');
    if (openChatButtonHero) {
      openChatButtonHero.addEventListener('click', () => {
        this.openChatWidget();
      });
    }

    // Botão de fechar chat
    const closeChatButton = document.getElementById('closeChatButton');
    if (closeChatButton) {
      closeChatButton.addEventListener('click', () => {
        this.closeChatWidget();
      });
    }

    const chatOverlay = document.getElementById('chatOverlay');
    if (chatOverlay) {
      chatOverlay.addEventListener('click', () => {
        this.closeChatWidget();
      });
    }
  }

  // Alterna o widget de chat flutuante
  toggleChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    if (!chatWidget) return;

    const isActive = chatWidget.classList.contains('active');
    if (isActive) {
      this.closeChatWidget();
    } else {
      this.openChatWidget();
    }
  }

  openChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    const chatOverlay = document.getElementById('chatOverlay');
    const messageInput = document.getElementById('messageInput');
    if (!chatWidget || !chatOverlay) return;

    userInteracted = true;
    isChatOpen = true; // Ativar voz quando modal abrir
    chatWidget.classList.add('active');
    chatOverlay.classList.add('active');
    chatWidget.setAttribute('aria-hidden', 'false');
    chatOverlay.setAttribute('aria-hidden', 'false');
    if (messageInput) {
      messageInput.focus();
    }

    if (!hasWelcomed) {
      const welcomeMessage = 'Olá! Sou seu assistente de moda. Como posso ajudar você hoje?';
      chatbotController.addMessage('bot', welcomeMessage);
      setTimeout(() => {
        voiceController.speak(welcomeMessage, () => {
          hasWelcomed = true;
        });
      }, 400);
    }
  }

  closeChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    const chatOverlay = document.getElementById('chatOverlay');
    if (!chatWidget || !chatOverlay) return;

    isChatOpen = false; // Desativar voz quando modal fechar
    voiceController.stopSpeaking();

    chatWidget.classList.remove('active');
    chatOverlay.classList.remove('active');
    chatWidget.setAttribute('aria-hidden', 'true');
    chatOverlay.setAttribute('aria-hidden', 'true');
  }

  // Envia mensagem do usuário
  sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;

    const text = messageInput.value.trim();
    if (text) {
      userInteracted = true;
      chatbotController.processTextInput(text);
      messageInput.value = '';
    }
  }

  // Alterna entrada de voz
  toggleVoiceInput() {
    if (voiceController.isListening) {
      voiceController.stopListening();
    } else {
      voiceController.startListening();
    }
  }

  // Limpa chat
  clearChat() {
    chatbotController.clearMessages();
    this.chatbotUI.clearMessages();
    setTimeout(() => {
      chatbotController.addMessage('bot', 'Chat limpo! Como posso ajudar?');
    }, 500);
  }

  // Mostra aviso
  showWarning(message) {
    const warning = document.createElement('div');
    warning.className = 'warning';
    warning.textContent = message;
    document.body.insertBefore(warning, document.body.firstChild);
  }
}

// Interface do chatbot
class ChatbotUI {
  constructor() {
    this.messagesContainer = document.getElementById('messagesContainer');
    this.typingIndicator = document.getElementById('typingIndicator');
    this.voiceButton = document.getElementById('voiceButton');
  }

  // Adiciona mensagem à interface
  addMessage(message) {
    if (!this.messagesContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.sender}`;
    messageElement.setAttribute('data-message-id', message.id);

    const textElement = document.createElement('div');
    textElement.className = 'message-text';

    // Verifica se é HTML ou texto simples
    if (message.data && message.data.isHtml) {
      textElement.innerHTML = message.text;
    } else {
      textElement.textContent = message.text;
    }

    messageElement.appendChild(textElement);

    // Se for produto, adiciona botão para ouvir descrição
    if (message.data && message.data.productId) {
      const listenButton = document.createElement('button');
      listenButton.className = 'listen-button';
      listenButton.textContent = '🔊 Ouvir';
      listenButton.onclick = () => this.playProductDescription(message.data.productId);
      messageElement.appendChild(listenButton);
    }

    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  // Reproduz descrição do produto
  playProductDescription(productId) {
    const product = getProductById(productId);
    if (product) {
      voiceController.speak(product.sensoryDescription);
    }
  }

  // Define indicador de digitação
  setTyping(isTyping) {
    if (!this.typingIndicator) return;

    if (isTyping) {
      this.typingIndicator.style.display = 'block';
    } else {
      this.typingIndicator.style.display = 'none';
    }
  }

  // Limpa mensagens da interface
  clearMessages() {
    if (!this.messagesContainer) return;
    this.messagesContainer.innerHTML = '';
  }

  // Rola para o final
  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }
}

// Atualiza UI de voz
voiceController.updateUI = function() {
  const voiceButton = document.getElementById('voiceButton');
  if (!voiceButton) return;

  if (this.isListening) {
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i> Ouvindo...';
    voiceButton.classList.add('listening');
    voiceButton.classList.remove('speaking');
  } else if (this.isSpeaking) {
    voiceButton.innerHTML = '<i class="fas fa-volume-high"></i> Falando...';
    voiceButton.classList.add('speaking');
    voiceButton.classList.remove('listening');
  } else {
    voiceButton.innerHTML = '<i class="fas fa-microphone"></i>';
    voiceButton.classList.remove('listening');
    voiceButton.classList.remove('speaking');
  }

  voiceButton.disabled = this.isSpeaking;
};

// Inicializa aplicação quando DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
  new App();
});
