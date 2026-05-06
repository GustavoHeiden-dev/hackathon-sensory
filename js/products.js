// Dados dos produtos - simulando banco de dados local
const products = [
  {
    id: 1,
    name: "Camiseta Básica",
    type: "camiseta",
    color: "branca",
    material: "algodão",
    image: "assets/imagens/camiseta.jpg",
    sensoryDescription: "Uma camiseta leve e confortável, feita de algodão puro. A textura é macia e respirável, perfeita para o dia a dia."
  },
  {
    id: 2,
    name: "Calça Jeans Azul",
    type: "calça",
    color: "azul",
    material: "jeans",
    image: "assets/imagens/calca-jeans.jpg",
    sensoryDescription: "Calça jeans robusta com um toque firme. O tecido é denso e resistente, proporcionando um caimento estruturado."
  },
  {
    id: 3,
    name: "Jaqueta de Couro",
    type: "jaqueta",
    color: "preta",
    material: "couro",
    image: "assets/imagens/jaqueta-couro.jpg",
    sensoryDescription: "Jaqueta em couro genuíno, com textura suave e flexível. O material é resistente e oferece uma sensação de proteção."
  },
  {
    id: 4,
    name: "Vestido de Seda",
    type: "vestido",
    color: "vermelha",
    material: "seda",
    image: "assets/imagens/vestido-seda.jpg",
    sensoryDescription: "Vestido elegante em seda natural, com caimento fluido e textura brilhante. A sensação é luxuosa e delicada."
  },
  {
    id: 5,
    name: "Blusa de Lã",
    type: "blusa",
    color: "cinza",
    material: "lã",
    image: "assets/imagens/blusa-la.jpg",
    sensoryDescription: "Blusa aconchegante em lã merino, com textura volumosa e quente. Ideal para dias frios, proporcionando conforto térmico."
  },
  {
    id: 6,
    name: "Shorts de Algodão",
    type: "shorts",
    color: "bege",
    material: "algodão",
    image: "assets/imagens/shorts.jpg",
    sensoryDescription: "Shorts leves em algodão orgânico, com textura macia e respirável. Perfeito para climas quentes."
  }
];

// Função para filtrar produtos por critérios
function filterProducts(criteria) {
  return products.filter(product => {
    // Verifica se todos os critérios correspondem
    for (const [key, value] of Object.entries(criteria)) {
      if (product[key] && product[key].toLowerCase().includes(value.toLowerCase())) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  });
}

// Função para obter produto por ID
function getProductById(id) {
  return products.find(product => product.id === id);
}

// Função para obter todos os produtos
function getAllProducts() {
  return products;
}

// Função para buscar produtos por texto (simples)
function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.name.toLowerCase().includes(lowerQuery) ||
    product.type.toLowerCase().includes(lowerQuery) ||
    product.color.toLowerCase().includes(lowerQuery) ||
    product.material.toLowerCase().includes(lowerQuery)
  );
}
