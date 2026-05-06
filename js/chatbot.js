// Controlador do chatbot com fluxo guiado
class ChatbotController {
  constructor() {
    this.messages = [];
    this.isTyping = false;
    this.onMessageCallback = null;
    this.onTypingCallback = null;

    // Estado do usuário - armazena preferências
    this.userContext = {
      type: null,       // calça, camiseta, etc
      color: null,      // azul, preta, etc
      style: null,      // casual, formal
      material: null    // algodão, jeans, etc
    };

    // Controla o fluxo de perguntas
    this.isInGuidedFlow = false;
    this.askedQuestions = new Set(); // Rastreia quais perguntas já foram feitas

    // Respostas simuladas simples
    this.responses = {
      saudacao: [
        "Olá! Sou seu assistente de moda. Vou te ajudar a encontrar as roupas perfeitas passo a passo.",
        "Oi! Bem-vindo ao Sensory UX. Vamos descobrir juntos o que você procura.",
        "Olá! Estou aqui para te guiar na escolha perfeita. Vamos começar?"
      ],
      ajuda: [
        "Posso ajudar você a encontrar roupas! Conte-me o tipo (camiseta, calça...), cor ou material que procura.",
        "Claro! Vou fazer algumas perguntas para entender melhor o que você quer.",
        "Vou guiá-lo passo a passo. Me diga o que você está procurando!"
      ],
      naoEntendi: [
        "Desculpe, não entendi. Tente dizer o tipo de roupa que procura.",
        "Hmm, não consegui entender. Que tal me dizer: camiseta, calça, vestido...?",
        "Não compreendi. Fale sobre o tipo de roupa que você quer!"
      ],
      encontrou: [
        "Ótimo! Encontrei algumas opções para você:",
        "Perfeito! Aqui estão as sugestões:",
        "Excelente! Veja o que encontrei:"
      ],
      perguntaTipo: [
        "Que tipo de roupa você gostaria de encontrar? (camiseta, calça, vestido, blusa, jaqueta, etc)",
        "Qual tipo de roupa você procura? Me diga: camiseta, calça, jaqueta...",
        "Começamos! Que tipo de roupa você quer?"
      ],
      perguntaCor: [
        "Que cor você prefere? (azul, preta, branca, vermelha, etc)",
        "Qual cor combina com você? (azul, preta, branca, etc)",
        "Qual é sua cor preferida?"
      ],
      perguntaMaterial: [
        "Qual material você prefere? (algodão, jeans, seda, lã, etc)",
        "Que tipo de tecido você gostaria? (algodão, jeans, couro, etc)",
        "Qual material te interessa?"
      ],
      perguntaEstilo: [
        "Qual é o seu estilo? Algo casual ou formal?",
        "Você quer algo casual ou formal?",
        "Esse look é para algo casual ou formal?"
      ],
      resumo: [
        "Perfeito! Procuramos por: {criteria}. Deixe-me buscar as melhores opções para você.",
        "Ótimo! Vou procurar {criteria}. Um momento...",
        "Entendi! Você quer {criteria}. Deixa eu procurar isso para você."
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

  // Processa a consulta do usuário com fluxo guiado
  processQuery(query) {
    const lowerQuery = query.toLowerCase();

    // Verifica se é saudação
    if (this.isGreeting(lowerQuery)) {
      this.respondWithGreeting();
      this.startGuidedFlow();
      return;
    }

    // Verifica se é pedido de ajuda
    if (this.isHelpRequest(lowerQuery)) {
      this.respondWithHelp();
      return;
    }

    // Se está no fluxo guiado, processa no contexto
    if (this.isInGuidedFlow) {
      this.processGuidedFlowInput(query);
      return;
    }

    // Tenta extrair critérios da busca
    const criteria = this.extractCriteria(lowerQuery);
    if (Object.keys(criteria).length > 0) {
      this.updateContextWithCriteria(criteria);
      this.startGuidedFlow();
      return;
    }

    // Não entendeu - inicia fluxo guiado
    this.respondWithConfusion();
  }

  // Inicia o fluxo guiado de perguntas
  startGuidedFlow() {
    this.isInGuidedFlow = true;
    this.askNextQuestion();
  }

  // Processa entrada do usuário dentro do fluxo guiado
  processGuidedFlowInput(userInput) {
    const lowerInput = userInput.toLowerCase();

    // Se não tem tipo, tenta extrair
    if (!this.userContext.type) {
      const type = this.extractType(lowerInput);
      if (type) {
        this.userContext.type = type;
        this.addMessage('bot', `Ótimo! ${type.charAt(0).toUpperCase() + type.slice(1)} é uma boa escolha.`);
        voiceController.speak(`Ótimo! ${type.charAt(0).toUpperCase() + type.slice(1)} é uma boa escolha.`);
        this.askNextQuestion();
        return;
      }
    }

    // Se não tem cor, tenta extrair
    if (!this.userContext.color) {
      const color = this.extractColor(lowerInput);
      if (color) {
        this.userContext.color = color;
        this.addMessage('bot', `${color.charAt(0).toUpperCase() + color.slice(1)} é uma cor lindíssima!`);
        voiceController.speak(`${color.charAt(0).toUpperCase() + color.slice(1)} é uma cor lindíssima!`);
        this.askNextQuestion();
        return;
      }
    }

    // Se não tem material, tenta extrair
    if (!this.userContext.material) {
      const material = this.extractMaterial(lowerInput);
      if (material) {
        this.userContext.material = material;
        this.addMessage('bot', `${material.charAt(0).toUpperCase() + material.slice(1)} é uma excelente escolha para conforto!`);
        voiceController.speak(`${material.charAt(0).toUpperCase() + material.slice(1)} é uma excelente escolha para conforto!`);
        this.askNextQuestion();
        return;
      }
    }

    // Se não tem estilo, tenta extrair
    if (!this.userContext.style) {
      const style = this.extractStyle(lowerInput);
      if (style) {
        this.userContext.style = style;
        this.addMessage('bot', `${style.charAt(0).toUpperCase() + style.slice(1)} é perfeito!`);
        voiceController.speak(`${style.charAt(0).toUpperCase() + style.slice(1)} é perfeito!`);
        this.completeGuidedFlow();
        return;
      }
    }

    // Não conseguiu extrair informação, pede novamente
    this.askNextQuestion();
  }

  // Pergunta a próxima questão necessária
  askNextQuestion() {
    if (!this.userContext.type && !this.askedQuestions.has('type')) {
      this.askedQuestions.add('type');
      const question = this.getRandomResponse('perguntaTipo');
      this.addMessage('bot', question);
      voiceController.speak(question);
      return;
    }

    if (!this.userContext.color && !this.askedQuestions.has('color')) {
      this.askedQuestions.add('color');
      const question = this.getRandomResponse('perguntaCor');
      this.addMessage('bot', question);
      voiceController.speak(question);
      return;
    }

    if (!this.userContext.material && !this.askedQuestions.has('material')) {
      this.askedQuestions.add('material');
      const question = this.getRandomResponse('perguntaMaterial');
      this.addMessage('bot', question);
      voiceController.speak(question);
      return;
    }

    if (!this.userContext.style && !this.askedQuestions.has('style')) {
      this.askedQuestions.add('style');
      const question = this.getRandomResponse('perguntaEstilo');
      this.addMessage('bot', question);
      voiceController.speak(question);
      return;
    }

    // Se chegou aqui, tem informação suficiente
    this.completeGuidedFlow();
  }

  // Finaliza o fluxo guiado e busca produtos
  completeGuidedFlow() {
    this.isInGuidedFlow = false;

    // Cria descrição dos critérios
    const parts = [];
    if (this.userContext.type) parts.push(this.userContext.type);
    if (this.userContext.style) parts.push(this.userContext.style);
    if (this.userContext.color) parts.push(this.userContext.color);
    if (this.userContext.material) parts.push(this.userContext.material);
    
    const criteria = parts.join(' ');
    const resumoMsg = this.getRandomResponse('resumo').replace('{criteria}', criteria);
    
    this.addMessage('bot', resumoMsg);
    voiceController.speak(resumoMsg);

    // Busca e retorna produtos
    setTimeout(() => {
      this.searchAndRespond(this.userContext);
      this.resetContext();
    }, 500);
  }

  // Reseta o contexto para uma nova busca
  resetContext() {
    this.userContext = {
      type: null,
      color: null,
      style: null,
      material: null
    };
    this.askedQuestions.clear();
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

  // Extrai tipo de roupa
  extractType(text) {
    const types = ['camiseta', 'calça', 'jaqueta', 'vestido', 'blusa', 'shorts', 'saia', 'bermuda'];
    for (const type of types) {
      if (text.includes(type)) {
        return type;
      }
    }
    return null;
  }

  // Extrai cor
  extractColor(text) {
    const colors = ['branca', 'azul', 'preta', 'vermelha', 'cinza', 'bege', 'verde', 'amarela', 'rosa', 'roxa'];
    for (const color of colors) {
      if (text.includes(color)) {
        return color;
      }
    }
    return null;
  }

  // Extrai material
  extractMaterial(text) {
    const materials = ['algodão', 'jeans', 'couro', 'seda', 'lã', 'poliéster', 'linho'];
    for (const material of materials) {
      if (text.includes(material)) {
        return material;
      }
    }
    return null;
  }

  // Extrai estilo
  extractStyle(text) {
    const styles = ['casual', 'formal'];
    for (const style of styles) {
      if (text.includes(style)) {
        return style;
      }
    }
    return null;
  }

  // Extrai critérios da busca (compatível com modo anterior)
  extractCriteria(text) {
    const criteria = {};
    
    const type = this.extractType(text);
    if (type) criteria.type = type;
    
    const color = this.extractColor(text);
    if (color) criteria.color = color;
    
    const material = this.extractMaterial(text);
    if (material) criteria.material = material;

    return criteria;
  }

  // Atualiza contexto com critérios extraídos
  updateContextWithCriteria(criteria) {
    if (criteria.type) this.userContext.type = criteria.type;
    if (criteria.color) this.userContext.color = criteria.color;
    if (criteria.material) this.userContext.material = criteria.material;
  }

  // Função para exibir produtos no chat com imagens
  showProducts(products) {
    if (products.length === 0) {
      const noResultsMsg = 'Desculpe, não encontrei produtos com esses critérios. Vamos tentar novamente!';
      this.addMessage('bot', noResultsMsg);
      voiceController.speak(noResultsMsg);
      return;
    }

    // Mensagem inicial de resultados
    const foundMsg = this.getRandomResponse('encontrou');
    this.addMessage('bot', foundMsg);
    voiceController.speak(foundMsg);

    // Exibe cada produto com imagem
    products.forEach(product => {
      // Cria HTML para o produto com imagem
      const productHtml = `
        <div class="product-card" style="margin: 10px 0; padding: 10px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9;">
          <img src="${product.image}" alt="${product.name}" style="max-width: 150px; height: auto; border-radius: 4px; margin-bottom: 8px;" onerror="this.style.display='none'">
          <div style="font-weight: bold; margin-bottom: 4px;">${product.name}</div>
          <div style="color: #666; font-size: 14px;">${product.color} • ${product.material} • ${product.style}</div>
          <div style="color: #888; font-size: 12px; margin-top: 4px; font-style: italic;">${product.sensoryDescription}</div>
        </div>
      `;

      // Adiciona como mensagem especial do bot
      this.addMessage('bot', productHtml, { productId: product.id, isHtml: true });
    });
  }

  // Busca produtos e responde
  searchAndRespond(criteria) {
    const results = filterProducts(criteria);
    this.showProducts(results);
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