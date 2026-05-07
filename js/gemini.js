// Controlador da API Gemini
class GeminiController {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'; // Modelo anterior que funcionava
    this.isRequesting = false; // Controle para evitar múltiplas requisições simultâneas
    this.requestCount = 0; // Contador de requisições para debug
  }

  // Função assíncrona para chamar a API do Gemini
  async askGemini(prompt) {
    this.requestCount++;
    const requestId = this.requestCount;

    console.log(`🔄 [${requestId}] Iniciando chamada Gemini...`);

    try {
      const response = await fetch(`${this.endpoint}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      });

      console.log(`📡 [${requestId}] Resposta recebida: ${response.status}`);

      if (!response.ok) {
        if (response.status === 429) {
          console.error(`🚫 [${requestId}] ERRO 429 - Too Many Requests`);
        } else if (response.status === 404) {
          console.error(`🚫 [${requestId}] ERRO 404 - Modelo não encontrado`);
        } else {
          console.error(`🚫 [${requestId}] ERRO ${response.status} - ${response.statusText}`);
        }
        throw new Error(`Erro na API Gemini: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ [${requestId}] Resposta processada com sucesso:`, data);

      // Extrai o texto da resposta
      if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
        return data.candidates[0].content.parts[0].text;
      }

      throw new Error('Resposta inesperada da API');
    } catch (error) {
      console.error(`❌ [${requestId}] Erro ao chamar Gemini:`, error);
      return null;
    }
  }

  // Interpreta intenção do usuário usando Gemini com controle de requisições
  async interpretUserIntent(userMessage) {
    console.log(`🎯 Tentando interpretar intenção: "${userMessage}"`);

    // Evita múltiplas requisições simultâneas
    if (this.isRequesting) {
      console.log('🚫 Requisição Gemini em andamento, usando fallback local');
      return this.fallbackIntentExtraction(userMessage);
    }

    console.log('✅ Iniciando requisição Gemini');
    this.isRequesting = true;

    try {
      const prompt = `Extraia da frase abaixo apenas:
- tipo de roupa (ex: camiseta, calça, jaqueta, vestido, blusa, shorts, saia, bermuda)
- cor (ex: azul, preta, branca, vermelha, cinza, bege, verde, amarela, rosa, roxa)
- material (ex: algodão, jeans, couro, seda, lã, poliéster, linho)
- estilo (ex: casual, formal)

Retorne SOMENTE JSON válido com a seguinte estrutura, mesmo que algum campo esteja vazio:
{
  "type": null,
  "color": null,
  "material": null,
  "style": null
}

Se a mensagem não contiver informações de moda, retorne todos os campos como null.

Frase:
"${userMessage}"`;

      const response = await this.askGemini(prompt);

      if (!response) {
        console.log('Gemini falhou, usando fallback local');
        return this.fallbackIntentExtraction(userMessage);
      }

      try {
        // Remove possíveis marcadores de código JSON
        let cleanedResponse = response.trim();
        if (cleanedResponse.startsWith('```json')) {
          cleanedResponse = cleanedResponse.replace('```json', '');
        }
        if (cleanedResponse.startsWith('```')) {
          cleanedResponse = cleanedResponse.replace('```', '');
        }
        if (cleanedResponse.endsWith('```')) {
          cleanedResponse = cleanedResponse.slice(0, -3);
        }

        // Parse do JSON
        const intent = JSON.parse(cleanedResponse.trim());

        // Valida a estrutura
        return {
          type: intent.type || null,
          color: intent.color || null,
          material: intent.material || null,
          style: intent.style || null
        };
      } catch (parseError) {
        console.error('❌ Erro ao parsear resposta do Gemini:', parseError);
        return this.fallbackIntentExtraction(userMessage);
      }
    } catch (error) {
      console.error('❌ Erro na interpretação com Gemini:', error);
      return this.fallbackIntentExtraction(userMessage);
    } finally {
      console.log('🔄 Resetando flag isRequesting');
      this.isRequesting = false;
    }
  }

  // Fallback local para extração de intenção quando Gemini falhar
  fallbackIntentExtraction(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    const intent = {
      type: null,
      color: null,
      material: null,
      style: null
    };

    // Tipos de roupa
    const types = ['camiseta', 'calça', 'jaqueta', 'vestido', 'blusa', 'shorts', 'saia', 'bermuda'];
    for (const type of types) {
      if (lowerMessage.includes(type)) {
        intent.type = type;
        break;
      }
    }

    // Cores
    const colors = ['azul', 'preta', 'branca', 'vermelha', 'cinza', 'bege', 'verde', 'amarela', 'rosa', 'roxa'];
    for (const color of colors) {
      if (lowerMessage.includes(color)) {
        intent.color = color;
        break;
      }
    }

    // Materiais
    const materials = ['algodão', 'jeans', 'couro', 'seda', 'lã', 'poliéster', 'linho'];
    for (const material of materials) {
      if (lowerMessage.includes(material)) {
        intent.material = material;
        break;
      }
    }

    // Estilos
    const styles = ['casual', 'formal'];
    for (const style of styles) {
      if (lowerMessage.includes(style)) {
        intent.style = style;
        break;
      }
    }

    console.log('Fallback local extraído:', intent);
    return intent;
  }

  // Gera resposta mais natural usando Gemini
  async generateNaturalResponse(context) {
    const prompt = `Você é um assistente de moda amigável e empático. 
    
Contexto atual:
- Tipo de roupa: ${context.type || 'não especificado'}
- Cor: ${context.color || 'não especificado'}
- Material: ${context.material || 'não especificado'}
- Estilo: ${context.style || 'não especificado'}

Gere uma resposta breve (máximo 2 linhas) e natural em português do Brasil para ajudar o usuário na busca de roupas. 
Seja entusiasta mas não excessivo.

${context.previousMessage ? `Mensagem anterior do usuário: "${context.previousMessage}"` : ''}`;

    return await this.askGemini(prompt);
  }

  // Valida e melhora resposta do chatbot usando Gemini
  async enhanceResponse(botResponse) {
    const prompt = `Melhore levemente a seguinte resposta de um assistente de moda para torná-la mais natural e amigável, mantendo o mesmo significado:

"${botResponse}"

Retorne apenas a resposta melhorada, sem explicações adicionais.`;

    return await this.askGemini(prompt);
  }
}

// Instância global (será inicializada no main.js com a API Key)
let geminiController = null;

// Função para inicializar o Gemini com a API Key
function initGemini(apiKey) {
  geminiController = new GeminiController(apiKey);
  console.log('Gemini inicializado com sucesso');
}
