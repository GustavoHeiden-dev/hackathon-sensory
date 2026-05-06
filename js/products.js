// Dados dos produtos - simulando banco de dados local
const products = [
  // CAMISETAS (3)
  {
    id: 1,
    name: "Camiseta Básica",
    type: "camiseta",
    color: "branca",
    material: "algodão",
    style: "casual",
    image: "assets/imagens/camiseta-branca.jpg",
    sensoryDescription: "Uma camiseta leve e confortável, feita de algodão puro. A textura é macia e respirável, perfeita para o dia a dia."
  },
  {
    id: 2,
    name: "Camiseta Polo Azul",
    type: "camiseta",
    color: "azul",
    material: "algodão",
    style: "casual",
    image: "assets/imagens/camiseta-azul.jpg",
    sensoryDescription: "Camiseta polo em algodão macio, com gola clássica. O tecido é leve e confortável para uso diário."
  },
  {
    id: 3,
    name: "Camiseta Social Preta",
    type: "camiseta",
    color: "preta",
    material: "poliéster",
    style: "formal",
    image: "assets/imagens/camiseta-preta.jpg",
    sensoryDescription: "Camiseta social elegante em poliéster, com caimento perfeito. Ideal para ambientes profissionais."
  },

  // CALÇAS (3)
  {
    id: 4,
    name: "Calça Jeans Azul",
    type: "calça",
    color: "azul",
    material: "jeans",
    style: "casual",
    image: "assets/imagens/calca-jeans-azul.jpg",
    sensoryDescription: "Calça jeans robusta com um toque firme. O tecido é denso e resistente, proporcionando um caimento estruturado."
  },
  {
    id: 5,
    name: "Calça Social Bege",
    type: "calça",
    color: "bege",
    material: "algodão",
    style: "formal",
    image: "assets/imagens/calca-bege.jpg",
    sensoryDescription: "Calça social elegante em algodão, com caimento perfeito. O tecido é confortável e profissional."
  },
  {
    id: 6,
    name: "Calça Moletom Cinza",
    type: "calça",
    color: "cinza",
    material: "algodão",
    style: "casual",
    image: "assets/imagens/calca-cinza.jpg",
    sensoryDescription: "Calça de moletom aconchegante, perfeita para dias frios. O tecido é macio e quentinho."
  },

  // CASACOS (3)
  {
    id: 7,
    name: "Jaqueta de Couro",
    type: "jaqueta",
    color: "preta",
    material: "couro",
    style: "casual",
    image: "assets/imagens/jaqueta-couro.jpg",
    sensoryDescription: "Jaqueta em couro genuíno, com textura suave e flexível. O material é resistente e oferece uma sensação de proteção."
  },
  {
    id: 8,
    name: "Blazer Azul Marinho",
    type: "blazer",
    color: "azul",
    material: "lã",
    style: "formal",
    image: "assets/imagens/blazer-azul.jpg",
    sensoryDescription: "Blazer elegante em lã, com caimento impecável. Perfeito para ambientes profissionais e formais."
  },
  {
    id: 9,
    name: "Casaco de Lã Bege",
    type: "casaco",
    color: "bege",
    material: "lã",
    style: "formal",
    image: "assets/imagens/casaco-bege.jpg",
    sensoryDescription: "Casaco de lã quentinho e elegante, ideal para climas frios. O tecido é macio e proporciona conforto térmico."
  },

  // PRODUTOS ADICIONAIS PARA VARIedade
  {
    id: 10,
    name: "Vestido de Seda",
    type: "vestido",
    color: "vermelha",
    material: "seda",
    style: "formal",
    image: "assets/imagens/vestido-seda.jpg",
    sensoryDescription: "Vestido elegante em seda natural, com caimento fluido e textura brilhante. A sensação é luxuosa e delicada."
  },
  {
    id: 11,
    name: "Blusa de Lã",
    type: "blusa",
    color: "cinza",
    material: "lã",
    style: "casual",
    image: "assets/imagens/blusa-la.jpg",
    sensoryDescription: "Blusa aconchegante em lã merino, com textura volumosa e quente. Ideal para dias frios, proporcionando conforto térmico."
  },
  {
    id: 12,
    name: "Shorts de Algodão",
    type: "shorts",
    color: "bege",
    material: "algodão",
    style: "casual",
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
