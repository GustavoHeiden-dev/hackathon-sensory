Adicione funcionalidade de resposta por voz ao chatbot existente.

Tarefas:

1. Criar uma função speak(text) separada (em voice.js ou arquivo equivalente):
   - Usar SpeechSynthesisUtterance
   - Definir idioma como "pt-BR"
   - Configurar rate e pitch básicos
   - Antes de falar, chamar speechSynthesis.cancel() para evitar sobreposição

2. Integrar no fluxo do chatbot:
   - Sempre que o bot enviar uma mensagem (resposta), chamar speak(message)
   - Não alterar a lógica atual, apenas complementar

3. Melhorar qualidade da voz:
   - Tentar selecionar uma voz disponível em português (pt-BR) usando speechSynthesis.getVoices()

4. Garantir funcionamento:
   - A fala deve acontecer apenas após interação do usuário
   - Evitar múltiplas falas ao mesmo tempo

5. Manter código organizado:
   - Não misturar lógica de voz com lógica do chatbot
   - Importar a função corretamente

Faça a implementação de forma simples e funcional (MVP).