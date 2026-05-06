Adicione mais produtos ao sistema e implemente exibição de resultados com imagem no chatbot.

Tarefas:

1. Atualizar o arquivo de produtos (products.js):
   - Criar um array com pelo menos 9 produtos divididos em:
     • 3 calças
     • 3 camisas
     • 3 casacos
   - Cada produto deve ter:
     id, name, type, color, material, style, image
   - Usar cores variadas (azul, preto, branco, bege, etc)
   - O campo image deve ser um caminho local (ex: "assets/calca-azul.jpg")

2. Garantir que o sistema de filtro continue funcionando:
   - O filtro deve considerar:
     type, color, material e style
   - Não quebrar a lógica existente

3. Criar função para exibir produtos no chat:
   - Criar uma função chamada showProducts(products)
   - Para cada produto:
     • mostrar nome
     • mostrar imagem usando <img>
   - Inserir no chat como mensagem do bot

4. Integrar no fluxo do chatbot:
   - Após coletar informações suficientes do usuário:
     • filtrar os produtos
     • chamar showProducts(results)
     • responder com mensagem tipo:
       "Encontrei algumas opções para você"

5. Melhorar a experiência:
   - Se não encontrar produtos → mostrar mensagem amigável
   - Garantir que a resposta também seja falada (se já existir função speak, usar ela)

6. Organização:
   - Não misturar lógica de UI com lógica de filtro
   - Manter código simples e legível

7. Considerar estrutura de arquivos:
   - As imagens devem estar em uma pasta "assets/"
   - Garantir que os caminhos das imagens funcionem corretamente no HTML

Importante:
- Não usar backend
- Não usar frameworks
- Não remover funcionalidades existentes
- Apenas expandir o sistema atual

Objetivo:
Permitir que o chatbot mostre produtos com imagem após entender o que o usuário quer.