# Configuração da API Gemini

## Como adicionar sua API Key do Gemini

### Passo 1: Obter a API Key
1. Acesse [Google AI Studio](https://aistudio.google.com/apikey)
2. Clique em "Create API key"
3. Copie sua chave de API

### Passo 2: Adicionar ao projeto
1. Abra o arquivo `js/main.js`
2. Procure pela linha:
```javascript
const geminiApiKey = 'SUA_API_KEY_AQUI';
```

3. Substitua `'SUA_API_KEY_AQUI'` com sua API Key real:
```javascript
const geminiApiKey = 'sua_chave_api_aqui';
```

### Exemplo:
```javascript
const geminiApiKey = 'AIzaSyD_example_key_1234567890abcdef';
```

## Funcionalidades com Gemini

Com a API Key configurada, o chatbot ganha:

✅ **Interpretação Inteligente de Intenção**
- Extrai tipo de roupa, cor, material e estilo automaticamente
- Entende frases mais complexas e naturais
- Exemplo: "Quero uma jaqueta de couro preta e formal" → reconhece todos os critérios

✅ **Melhor Compreensão do Usuário**
- Aceita descrições variadas e naturais
- Menos dependência de palavras-chave exatas
- Fluxo conversacional mais fluido

## Modo Offline (sem API Key)

Se você não adicionar uma API Key, o chatbot continuará funcionando com:
- Extração local de critérios
- Fluxo guiado de perguntas
- Todas as outras funcionalidades

A diferença é que será menos inteligente na interpretação de intenção, mas ainda funcional.

## Segurança

⚠️ **Importante:**
- NUNCA compartilhe sua API Key publicamente
- Se vazar, revogue a chave no Google AI Studio
- Considere usar variáveis de ambiente em produção

## Teste

Após adicionar a API Key, teste com frases como:
- "Quero uma calça jeans azul casual"
- "Me mostre uma blusa vermelha de algodão"
- "Procuro uma jaqueta de couro preta formal"

O Gemini agora interpretará corretamente e acelerará o fluxo de busca!
