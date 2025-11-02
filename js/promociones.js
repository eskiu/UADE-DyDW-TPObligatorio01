(function () {
  const promoBooks = [
    {
      id: "ultimo_secreto",
      name: "El último secreto",
      author: "Dan Brown · Planeta",
      cover: "assets/covers/el_ultimo_secreto.jpg",
      description:
        "Langdon busca en Praga a la científica desaparecida, descifrando símbolos y conspiraciones sobre la conciencia humana.",
      originalPrice: 39800,
      discount: 25,
    },
    {
      id: "camino_artista",
      name: "El camino del artista",
      author: "Julia Cameron · Planeta",
      cover: "assets/covers/el_camino_del_artista.jpg",
      description:
        "Programa de doce semanas para desbloquear la creatividad con páginas matutinas, citas artísticas y ejercicios introspectivos.",
      originalPrice: 24000,
      discount: 30,
    },
    {
      id: "harry_potter",
      name: "Harry Potter y la Piedra Filosofal",
      author: "J. K. Rowling · Salamandra",
      cover: "assets/covers/harry_potter.jpg",
      description:
        "Harry Potter descubre que es un mago y comienza su aventura en Hogwarts.",
      originalPrice: 29900,
      discount: 20,
    },
    {
      id: "la_felicidad",
      name: "La felicidad",
      author: "Gabriel Rolón · Planeta",
      cover: "assets/covers/la_felicidad.jpg",
      description:
        "Ensayo psicoanalítico que cuestiona mitos y enseña a reconocer la felicidad en instantes cotidianos.",
      originalPrice: 23900,
      discount: 15,
    },
    {
      id: "lionel_scaloni",
      name: "Lionel Scaloni",
      author: "Diego Borinsky · Sudamericana",
      cover: "assets/covers/lionel_scaloni.jpg",
      description:
        "Biografía del DT Lionel Scaloni: de Pujato al campeón mundial, método, vestuario y camino hacia 2026.",
      originalPrice: 9900,
      discount: 40,
    },
    {
      id: "mientras_respires",
      name: "Mientras respires estás a tiempo",
      author: "Leti Arévalo · Random",
      cover: "assets/covers/mientras_respires.jpg",
      description:
        "Eva, al borde de un trasplante de corazón, escribe cartas y aprende perdón y amor propio.",
      originalPrice: 22500,
      discount: 25,
    },
  ];

  const container = document.getElementById("promos-container");

  function formatCurrency(n) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function calculatePrice(originalPrice, discount) {
    return Math.round(originalPrice * (1 - discount / 100));
  }

  function renderBooks() {
    container.innerHTML = promoBooks
      .map((book) => {
        const promoPrice = calculatePrice(book.originalPrice, book.discount);
        return `
          <article class="card promo-card">
            <div class="cover">
              <span class="discount-badge">${book.discount}% OFF</span>
              <img src="${book.cover}" alt="Tapa: ${book.name}" />
            </div>
            <h3>${book.name}</h3>
            <p class="muted">${book.author}</p>
            <p>${book.description}</p>
            <div class="price-container">
              <span class="price-original">${formatCurrency(book.originalPrice)}</span>
              <span class="price-promo">${formatCurrency(promoPrice)}</span>
            </div>
            <button 
              class="btn-add-cart"
              data-product-id="${book.id}"
              data-product-name="${book.name}"
              data-product-author="${book.author}"
              data-product-price="${promoPrice}"
              data-product-original-price="${book.originalPrice}"
              data-product-discount="${book.discount}">
              Agregar al carrito
            </button>
          </article>
        `;
      })
      .join("");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBooks);
  } else {
    renderBooks();
  }
})();
