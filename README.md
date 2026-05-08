Melhore o fluxo de acessibilidade do chatbot e refine a página de produto para manter consistência visual premium e acessível.

========================
PROBLEMA 1 — OPÇÕES NÃO ESTÃO SENDO FALADAS
========================

Problema atual:
Quando o usuário escolhe NÃO ouvir a descrição da roupa:
- o chatbot mostra opções semelhantes na tela
- MAS não fala essas opções por voz

Isso prejudica completamente a experiência para usuários cegos.

Objetivo:
Sempre que o chatbot mostrar novas opções de roupas:
- ele deve também ler essas opções em voz alta

========================
COMPORTAMENTO ESPERADO
========================

Exemplo:

"Encontrei outras opções semelhantes para você:

1. Camiseta branca oversized
2. Camiseta branca básica premium
3. Camiseta casual de algodão slim

Você pode falar ou digitar qual opção deseja."

Essa mensagem inteira deve:
- aparecer no chat
- ser falada pelo speech synthesis

========================
IMPLEMENTAÇÃO
========================

1. Verificar fluxo:
showSimilarProducts()

2. Garantir:
- mensagens das opções sejam adicionadas no chat
- speak() seja chamado também

3. Criar texto concatenado com:
- nomes dos produtos
- numeração
- instrução final

4. NÃO mostrar opções apenas visualmente.

========================
PROBLEMA 2 — ACESSIBILIDADE TALKBACK
========================

Objetivo:
Garantir que TODOS botões e elementos importantes sejam identificáveis por leitores de tela.

========================
IMPLEMENTAÇÃO
========================

Adicionar aria-label em:

- botão flutuante do chatbot
- botão fechar chat
- botão enviar mensagem
- botão microfone
- botão limpar conversa
- botões de compra
- botões de carrinho
- inputs
- botões de seleção de produtos

========================
EXEMPLOS
========================

<button aria-label="Abrir assistente de moda acessível">

<button aria-label="Enviar mensagem">

<button aria-label="Ativar reconhecimento de voz">

========================
TAMBÉM GARANTIR
========================

1. Navegação correta por teclado
2. Focus visível
3. Ordem semântica correta
4. TalkBack lendo botões corretamente

========================
PROBLEMA 3 — MELHORAR VISUAL DO PRODUCT.HTML
========================

Objetivo:
A página do produto deve combinar com o restante do site:
- minimalista
- clean
- fashion
- elegante

========================
REMOVER
========================

- aparência simples demais
- blocos pesados
- excesso de cores
- aparência de sistema

========================
ADICIONAR
========================

1. Layout mais sofisticado:
- imagem grande do produto
- descrição elegante
- muito espaço em branco
- tipografia premium

2. Paleta minimalista:
- branco/off-white
- preto suave
- cinza claro
- sem azul forte

3. Melhorar botões:
- adicionar ao carrinho
- finalizar compra

Com:
- hover suave
- bordas elegantes
- animações discretas

4. Melhorar responsividade mobile.

5. Melhorar tipografia:
- usar Inter/Poppins/Manrope

========================
IMPORTANTE
========================

NÃO quebrar:
- chatbot
- voz
- fluxo atual
- renderização dos produtos

Objetivo final:
O projeto deve parecer um e-commerce premium acessível de verdade, funcionando corretamente para usuários cegos com TalkBack e experiência por voz completa.