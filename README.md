Refatore o CSS do projeto para melhorar a organização e separar responsabilidades.

Problema:
Atualmente todo o CSS está em um único arquivo, o que dificulta manutenção e organização.

Objetivo:
Dividir o CSS em múltiplos arquivos por responsabilidade.

Tarefas:

1. Criar estrutura de arquivos CSS:
   - css/base.css
   - css/layout.css
   - css/components.css
   - css/chat.css
   - css/animations.css

2. Separar estilos:

- base.css:
  • reset básico
  • body
  • fontes

- layout.css:
  • containers
  • grid de produtos
  • estrutura geral da página

- components.css:
  • botões
  • inputs
  • cards de produtos

- chat.css:
  • modal do chatbot
  • botão flutuante
  • mensagens (user/bot)
  • input do chat

- animations.css:
  • animações (fade, scale, typing)

3. Atualizar os arquivos HTML:
   - Importar todos os CSS corretamente usando <link>
   - Manter ordem lógica (base → layout → components → chat → animations)

4. Garantir:
   - Nenhum estilo seja perdido
   - Nenhuma funcionalidade seja quebrada
   - Código continue simples (MVP)

5. NÃO criar complexidade desnecessária:
   - Evitar frameworks
   - Apenas organizar melhor

Objetivo final:
Ter um projeto com CSS modular, organizado e fácil de manter.