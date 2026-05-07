Corrija o sistema de voz do chatbot para evitar falas sobrepostas e melhorar a naturalidade da voz.

Problema atual:
Às vezes o chatbot envia duas respostas rapidamente.
Quando isso acontece:
- a segunda fala interrompe a primeira
- o áudio fica cortado
- experiência parece bugada

Além disso, a voz atual parece muito robótica.

Objetivo:
Melhorar controle de speech synthesis e deixar a experiência mais natural e fluida.

Tarefas:

========================
1. EVITAR FALAS SOBREPOSTAS
========================

Criar sistema de fila de voz.

Objetivo:
- uma fala terminar antes da próxima começar

Implementação:
- criar array/queue de mensagens
- adicionar novas falas na fila
- só executar próxima após onend da atual

Exemplo:
speechQueue.push(text)

Quando terminar:
- executar próxima da fila

========================
2. NÃO INTERROMPER FALAS
========================

REMOVER comportamento atual:
speechSynthesis.cancel()

Ele só deve ser usado:
- quando fechar o modal/chat
- quando usuário parar manualmente

NÃO cancelar automaticamente ao chegar nova mensagem.

========================
3. MELHORAR QUALIDADE DA VOZ
========================

Selecionar voz mais natural disponível no navegador.

Preferir:
- Google português Brasil
- Microsoft natural voices
- pt-BR feminino natural

Exemplo:
speechSynthesis.getVoices()

Selecionar automaticamente:
- pt-BR
- voz mais humana disponível

========================
4. AJUSTAR CONFIGURAÇÕES DA VOZ
========================

Melhorar:
- rate
- pitch
- volume

Sugestão:
- rate: 1
- pitch: 1
- volume: 1

Objetivo:
fala mais natural e confortável.

========================
5. EVITAR DUPLICAÇÃO
========================

Garantir:
- mesma mensagem não seja falada duas vezes
- evitar múltiplas chamadas simultâneas

========================
6. MELHORAR EXPERIÊNCIA
========================

Quando bot estiver falando:
- mostrar indicador visual discreto
- ex: animação leve ou "falando..."

========================
7. IMPORTANTE
========================

NÃO quebrar:
- chatbot atual
- modal
- speech synthesis
- mensagens

Objetivo final:
O chatbot deve falar de forma contínua, organizada e mais humana, sem cortar frases ao receber novas respostas.