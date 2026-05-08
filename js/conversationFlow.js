// Gerenciador do fluxo conversacional - Lógica de diálogo guiado
class ConversationFlow {
  constructor(chatbotController) {
    this.chatbot = chatbotController;
    
    // Estado atual da conversa
    this.currentState = null;
    this.states = {
      AWAITING_DESCRIPTION_CHOICE: 'awaiting_description_choice',
      AWAITING_INTEREST: 'awaiting_interest',
      AWAITING_MORE_OPTIONS: 'awaiting_more_options',
      AWAITING_PURCHASE_DECISION: 'awaiting_purchase_decision',
      EXPLORING_SIMILAR: 'exploring_similar'
    };

    // Produto atualmente sendo sugerido
    this.currentProduct = null;
    this.suggestedProducts = [];
  }

  /**
   * Inicia o fluxo após encontrar um produto
   */
  startProductSuggestion(product) {
    this.currentProduct = product;
    this.currentState = this.states.AWAITING_DESCRIPTION_CHOICE;
    
    const message = `Encontrei uma opção perfeita para você: ${product.name}. Você gostaria de ouvir uma descrição sensorial desta roupa?`;
    this.chatbot.addMessage('bot', message, { product: product, productId: product.id });
    this.chatbot.speakMessage(message);
  }

  /**
   * Processa a resposta do usuário sobre querer ouvir descrição
   */
  handleDescriptionChoice(userResponse) {
    const response = userResponse.toLowerCase().trim();
    
    // Palavras-chave para SIM
    const yesKeywords = ['sim', 'sim por favor', 'quero', 'pode falar', 'ouvir', 'ouvir descrição', 'verdade', 's', 'ok', 'claro', 'com certeza'];
    
    // Palavras-chave para NÃO
    const noKeywords = ['não', 'nao', 'pular', 'próxima', 'proxima', 'não precisa', 'nao precisa', 'passe', 'skip'];
    
    const wantDescription = yesKeywords.some(keyword => response.includes(keyword));
    const refuseDescription = noKeywords.some(keyword => response.includes(keyword));

    if (wantDescription) {
      this.giveSensoryDescription();
    } else if (refuseDescription) {
      this.handleRefusedDescription();
    } else {
      const clarification = "Desculpe, não entendi. Você gostaria de ouvir a descrição sensorial? (responda: sim ou não)";
      this.chatbot.addMessage(clarification, 'bot');
      this.chatbot.speakMessage(clarification);
    }
  }

  /**
   * Fornece a descrição sensorial do produto
   */
  giveSensoryDescription() {
    if (!this.currentProduct) return;

    const product = this.currentProduct;
    let description = product.sensoryDescription || this.generateSensoryDescription(product);

    // Enriquecer a descrição com mais detalhes sensoriais
    description = this.enhancedSensoryDescription(product, description);

    this.chatbot.addMessage(description, 'bot');
    this.chatbot.speakMessage(description);

    // Após descrever, mudar para estado de interesse
    setTimeout(() => {
      this.currentState = this.states.AWAITING_INTEREST;
      this.askAboutInterest();
    }, 2000);
  }

  /**
   * Gera descrição sensorial aprimorada
   */
  enhancedSensoryDescription(product, baseDescription) {
    let enhanced = baseDescription;

    // Adicionar informações contextuais específicas
    const contextDetails = {
      camiseta: " Perfeita para dias quentes, oferece liberdade de movimento.",
      calça: " O caimento é confortável para uso prolongado ao longo do dia.",
      jaqueta: " Proporciona uma sensação de proteção e elegância.",
      blazer: " Oferece um toque profissional e sofisticado.",
      casaco: " Mantém o calor e o conforto em climas frios."
    };

    const productType = product.type?.toLowerCase();
    if (contextDetails[productType]) {
      enhanced += contextDetails[productType];
    }

    return enhanced;
  }

  /**
   * Gera descrição sensorial padrão se não existir
   */
  generateSensoryDescription(product) {
    return `${product.name} é uma peça ${product.style} feita em ${product.material}, na cor ${product.color}. 
    O material oferece uma sensação agradável ao toque e um caimento natural no corpo.`;
  }

  /**
   * Pergunta ao usuário se se interessou pela peça
   */
  askAboutInterest() {
    const interestQuestion = "Você se interessou por esta peça? (responda: sim ou não)";
    this.chatbot.addMessage(interestQuestion, 'bot');
    this.chatbot.speakMessage(interestQuestion);
  }

  /**
   * Processa resposta sobre interesse na peça
   */
  handleInterestResponse(userResponse) {
    const response = userResponse.toLowerCase().trim();
    
    const yesKeywords = ['sim', 'gostei', 'adorei', 'perfeito', 'quero', 'adicionar', 's', 'ok', 'ótimo', 'excelente'];
    const noKeywords = ['não', 'nao', 'não gostei', 'nao gostei', 'outra', 'outra opção', 'mais', 'próxima', 'proxima'];

    const isInterested = yesKeywords.some(keyword => response.includes(keyword));
    const isNotInterested = noKeywords.some(keyword => response.includes(keyword));

    if (isInterested) {
      this.handlePurchaseDecision();
    } else if (isNotInterested) {
      this.handleRefusedProduct();
    } else {
      const clarification = "Desculpe, não entendi. Você gostou da peça? (responda: sim ou não)";
      this.chatbot.addMessage(clarification, 'bot');
      this.chatbot.speakMessage(clarification);
    }
  }

  /**
   * Processa decisão de compra/adição
   */
  handlePurchaseDecision() {
    if (!this.currentProduct) return;

    const product = this.currentProduct;
    const purchaseMessage = `Ótimo! Vou levar você para a página da peça "${product.name}". Lá você pode visualizar mais detalhes e realizar a compra.`;
    
    this.chatbot.addMessage(purchaseMessage, 'bot');
    this.chatbot.speakMessage(purchaseMessage);

    // Redirecionar para página do produto após 3 segundos
    setTimeout(() => {
      window.location.href = `product.html?id=${product.id}`;
    }, 3000);
  }

  /**
   * Trata quando usuário não se interessa pela peça
   */
  handleRefusedProduct() {
    this.currentState = this.states.EXPLORING_SIMILAR;
    
    const similarMessage = "Sem problemas! Deixe-me buscar opções parecidas que você pode gostar mais.";
    this.chatbot.addMessage(similarMessage, 'bot');
    this.chatbot.speakMessage(similarMessage);

    setTimeout(() => {
      this.showSimilarProducts();
    }, 2000);
  }

  /**
   * Trata quando usuário não quer ouvir descrição
   */
  handleRefusedDescription() {
    this.currentState = this.states.AWAITING_MORE_OPTIONS;
    
    const moreOptionsQuestion = "Você gostaria de ver mais opções semelhantes?";
    this.chatbot.addMessage(moreOptionsQuestion, 'bot');
    this.chatbot.speakMessage(moreOptionsQuestion);
  }

  /**
   * Processa resposta sobre mais opções
   */
  handleMoreOptionsResponse(userResponse) {
    const response = userResponse.toLowerCase().trim();
    
    const yesKeywords = ['sim', 'quero', 'pode', 'mostra', 's', 'ok', 'claro', 'com certeza'];
    const noKeywords = ['não', 'nao', 'passe', 'não precisa', 'nao precisa', 'ok chega', 'tá bom'];

    const wantMore = yesKeywords.some(keyword => response.includes(keyword));
    const refuseMore = noKeywords.some(keyword => response.includes(keyword));

    if (wantMore) {
      this.showSimilarProducts();
    } else if (refuseMore) {
      this.endConversation();
    } else {
      const clarification = "Gostaria de ver mais opções? (responda: sim ou não)";
      this.chatbot.addMessage(clarification, 'bot');
      this.chatbot.speakMessage(clarification);
    }
  }

  /**
   * Encontra e mostra produtos similares
   */
  showSimilarProducts() {
    if (!this.currentProduct) {
      this.endConversation();
      return;
    }

    const product = this.currentProduct;
    
    // Buscar produtos semelhantes
    this.suggestedProducts = this.findSimilarProducts(product, 3);

    if (this.suggestedProducts.length === 0) {
      const noMoreMessage = "Desculpe, não encontrei mais opções parecidas. Posso ajudar com algo mais?";
      this.chatbot.addMessage(noMoreMessage, 'bot');
      this.chatbot.speakMessage(noMoreMessage);
      return;
    }

    const optionsText = this.suggestedProducts
      .map((product, index) => `${index + 1}. ${product.name}`)
      .join('\n');

    const similarMessage = `Encontrei ${this.suggestedProducts.length} opções semelhantes para você:\n${optionsText}\nVocê pode falar ou digitar qual opção deseja.`;
    this.chatbot.addMessage('bot', similarMessage);
    this.chatbot.speakMessage(similarMessage);
    this.currentState = this.states.EXPLORING_SIMILAR;
  }

  /**
   * Encontra produtos similares baseado em características
   */
  findSimilarProducts(referenceProduct, limit = 3) {
    if (!products || products.length === 0) {
      return [];
    }

    // Filtrar produtos similares (mesmo tipo, cor parecida ou estilo parecido)
    const similar = products.filter(p => {
      // Não retornar o mesmo produto
      if (p.id === referenceProduct.id) return false;
      
      // Priorizar: mesmo tipo OU mesma cor OU mesmo estilo
      return (
        p.type === referenceProduct.type ||
        p.color === referenceProduct.color ||
        p.style === referenceProduct.style
      );
    });

    // Retornar apenas o número limite
    return similar.slice(0, limit);
  }

  /**
   * Pergunta qual produto explorar
   */
  askToExploreProduct() {
    this.currentState = this.states.AWAITING_DESCRIPTION_CHOICE;
    
    const exploreMessage = "Qual delas te interessou? Digite o número (1, 2, 3...) ou o nome da peça.";
    this.chatbot.addMessage(exploreMessage, 'bot');
    this.chatbot.speakMessage(exploreMessage);
  }

  /**
   * Processa seleção de produto da lista
   */
  handleProductSelection(userResponse) {
    const response = userResponse.toLowerCase().trim();
    
    // Tentar encontrar por número
    const numberMatch = response.match(/\d+/);
    if (numberMatch) {
      const index = parseInt(numberMatch[0]) - 1;
      if (index >= 0 && index < this.suggestedProducts.length) {
        this.startProductSuggestion(this.suggestedProducts[index]);
        return;
      }
    }

    // Tentar encontrar por nome
    const selectedProduct = this.suggestedProducts.find(p => 
      p.name.toLowerCase().includes(response) ||
      response.includes(p.name.toLowerCase())
    );

    if (selectedProduct) {
      this.startProductSuggestion(selectedProduct);
    } else {
      const clarification = "Desculpe, não encontrei esse produto. Digite o número ou o nome da peça.";
      this.chatbot.addMessage(clarification, 'bot');
      this.chatbot.speakMessage(clarification);
    }
  }

  /**
   * Encerra a conversa elegantemente
   */
  endConversation() {
    const endMessage = "Sem problemas! Estou aqui caso queira explorar outras peças mais tarde. Tenha um ótimo dia!";
    this.chatbot.addMessage(endMessage, 'bot');
    this.chatbot.speakMessage(endMessage);
    
    this.currentState = null;
    this.currentProduct = null;
    this.suggestedProducts = [];
  }

  /**
   * Detecta em qual estado estamos e roteia para o handler apropriado
   */
  processUserInput(userMessage) {
    switch (this.currentState) {
      case this.states.AWAITING_DESCRIPTION_CHOICE:
        this.handleDescriptionChoice(userMessage);
        break;
      
      case this.states.AWAITING_INTEREST:
        this.handleInterestResponse(userMessage);
        break;
      
      case this.states.AWAITING_MORE_OPTIONS:
        this.handleMoreOptionsResponse(userMessage);
        break;
      
      case this.states.AWAITING_PURCHASE_DECISION:
        this.handlePurchaseDecision();
        break;
      
      case this.states.EXPLORING_SIMILAR:
        this.handleProductSelection(userMessage);
        break;
      
      default:
        // Não estamos em um fluxo de produto, deixar chatbot.js lidar
        return false;
    }
    
    return true; // Fluxo foi processado
  }

  /**
   * Reseta o estado da conversa
   */
  reset() {
    this.currentState = null;
    this.currentProduct = null;
    this.suggestedProducts = [];
  }
}
