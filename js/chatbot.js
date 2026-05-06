// Controlador do chatbot
class ChatbotController {
  constructor() {
    this.messages = [];
    this.isTyping = false;
    this.onMessageCallback = null;
    this.onTypingCallback = null;

    // Respostas simuladas simples
    this.responses = {
      saudacao: [
        "Olá! Sou seu assistente de moda. Posso ajudar você a encontrar roupas com descrições sensoriais. O que você procura?",
        "Oi! Bem-vindo ao Sensory UX. Conte-me o que você gostaria de vestir hoje.",
        "Olá! Estou aqui para descrever roupas de forma sensorial. Como posso ajudar?"
      ],
      ajuda: [
        "Posso ajudar você a encontrar roupas por tipo, cor ou material. Por exemplo: 'mostre camisetas azuis' ou 'quero algo de algodão'.",
        "Digite o que você procura, como 'calça jeans preta' ou 'blusa de lã'. Também posso descrever sensações!",
        "Pergunte sobre roupas! Diga o tipo, cor ou material que você quer."
      ],
      naoEntendi: [
        "Desculpe, não entendi. Tente dizer algo como 'camiseta azul' ou 'calça jeans'.",
        "Hmm, não consegui entender. Que tal tentar: 'mostre vestidos vermelhos'?",
        "Não compreendi. Fale sobre roupas: tipo, cor ou material."
      ],
      encontrou: [
        "Encontrei algumas opções! Aqui estão:",
        "Ótimo! Encontrei o que você procura:",
        "Perfeito! Aqui vão as sugestões:"
      ]
    };
  }

  // Define callback para quando receber mensagem
  setOnMessageCallback(callback) {
    this.onMessageCallback = callback;
  }

  // Define callback para status de digitação
  setOnTypingCallback(callback) {
    this.onTypingCallback = callback;
  }

  // Processa entrada de texto
  processTextInput(text) {
    this.addMessage('user', text);
    this.simulateTyping();
    setTimeout(() => {
      this.processQuery(text);
    }, 1000 + Math.random() * 1000); // Simula delay
  }

  // Processa entrada de voz
  processVoiceInput(text) {
    this.addMessage('user', text + ' (voz)');
    this.simulateTyping();
    setTimeout(() => {
      this.processQuery(text);
    }, 1000 + Math.random() * 1000);
  }

  // Processa a consulta do usuário
  processQuery(query) {
    const lowerQuery = query.toLowerCase();

    // Verifica se é saudação
    if (this.isGreeting(lowerQuery)) {
      this.respondWithGreeting();
      return;
    }

    // Verifica se é pedido de ajuda
    if (this.isHelpRequest(lowerQuery)) {
      this.respondWithHelp();
      return;
    }

    // Tenta extrair critérios da busca
    const criteria = this.extractCriteria(lowerQuery);
    if (Object.keys(criteria).length > 0) {
      this.searchAndRespond(criteria);
      return;
    }

    // Não entendeu
    this.respondWithConfusion();
  }

  // Verifica se é saudação
  isGreeting(text) {
    const greetings = ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'ei', 'hey'];
    return greetings.some(greeting => text.includes(greeting));
  }

  // Verifica se é pedido de ajuda
  isHelpRequest(text) {
    const helpWords = ['ajuda', 'help', 'como', 'o que', 'socorro'];
    return helpWords.some(word => text.includes(word));
  }

  // Extrai critérios da busca
  extractCriteria(text) {
    const criteria = {};

    // Tipos de roupa
    const types = ['camiseta', 'calça', 'jaqueta', 'vestido', 'blusa', 'shorts', 'saia', 'bermuda'];
    for (const type of types) {
      if (text.includes(type)) {
        criteria.type = type;
        break;
      }
    }

    // Cores
    const colors = ['branca', 'azul', 'preta', 'vermelha', 'cinza', 'bege', 'verde', 'amarela', 'rosa', 'roxa'];
    for (const color of colors) {
      if (text.includes(color)) {
        criteria.color = color;
        break;
      }
    }

    // Materiais
    const materials = ['algodão', 'jeans', 'couro', 'seda', 'lã', 'poliéster', 'linho'];
    for (const material of materials) {
      if (text.includes(material)) {
        criteria.material = material;
        break;
      }
    }

    return criteria;
  }

  // Busca produtos e responde
  searchAndRespond(criteria) {
    const results = filterProducts(criteria);

    if (results.length > 0) {
      const response = this.getRandomResponse('encontrou');
      this.addMessage('bot', response);
      voiceController.speak(response);

      // Lista os produtos encontrados
      results.forEach(product => {
        const productMessage = `${product.name} (${product.color}, ${product.material})`;
        this.addMessage('bot', productMessage, { productId: product.id });
      });
    } else {
      const errorMessage = 'Desculpe, não encontrei produtos com esses critérios. Tente outros termos!';
      this.addMessage('bot', errorMessage);
      voiceController.speak(errorMessage);
    }
  }

  // Responde com saudação
  respondWithGreeting() {
    const response = this.getRandomResponse('saudacao');
    this.addMessage('bot', response);
    voiceController.speak(response);
  }

  // Responde com ajuda
  respondWithHelp() {
    const response = this.getRandomResponse('ajuda');
    this.addMessage('bot', response);
    voiceController.speak(response);
  }

  // Responde quando não entendeu
  respondWithConfusion() {
    const response = this.getRandomResponse('naoEntendi');
    this.addMessage('bot', response);
    voiceController.speak(response);
  }

  // Adiciona mensagem
  addMessage(sender, text, data = null) {
    const message = {
      id: Date.now(),
      sender: sender, // 'user' ou 'bot'
      text: text,
      timestamp: new Date(),
      data: data
    };

    this.messages.push(message);

    if (this.onMessageCallback) {
      this.onMessageCallback(message);
    }
  }

  // Simula digitação
  simulateTyping() {
    this.isTyping = true;
    if (this.onTypingCallback) {
      this.onTypingCallback(true);
    }

    setTimeout(() => {
      this.isTyping = false;
      if (this.onTypingCallback) {
        this.onTypingCallback(false);
      }
    }, 1500);
  }

  // Obtém resposta aleatória
  getRandomResponse(type) {
    const responses = this.responses[type];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Obtém histórico de mensagens
  getMessages() {
    return this.messages;
  }

  // Limpa histórico
  clearMessages() {
    this.messages = [];
  }
}

// Instância global
const chatbotController = new ChatbotController();