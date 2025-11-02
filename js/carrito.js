(function () {
  let cart = JSON.parse(localStorage.getItem("ink-cart")) || [];

  const cartToggle = document.getElementById("cart-toggle");
  const cartModal = document.getElementById("cart-modal");
  const cartClose = document.getElementById("cart-close");
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (cartToggle) {
    cartToggle.addEventListener("click", () => {
      if (cartModal) {
        cartModal.classList.add("active");
        renderCart();
      }
    });
  }

  if (cartClose) {
    cartClose.addEventListener("click", () => {
      cartModal.classList.remove("active");
    });
  }

  if (cartModal) {
    cartModal.addEventListener("click", (e) => {
      if (e.target === cartModal) {
        cartModal.classList.remove("active");
      }
    });
  }

  function formatCurrency(n) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      maximumFractionDigits: 0,
    }).format(n);
  }

  function saveCart() {
    localStorage.setItem("ink-cart", JSON.stringify(cart));
    updateCartCount();
  }

  function updateCartCount() {
    if (!cartCount) return;
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = count;
    if (count > 0) {
      cartCount.classList.add("visible");
    } else {
      cartCount.classList.remove("visible");
    }
  }

  function addToCart(product) {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1,
        originalPrice: product.originalPrice || product.price,
        discount: product.discount || 0,
      });
    }
    saveCart();
    renderCart();
  }


  document.addEventListener("click", function (e) {
    const button = e.target.closest(".btn-add-cart");
    if (!button) return;

    const product = {
      id: button.dataset.productId,
      name: button.dataset.productName,
      author: button.dataset.productAuthor || "",
      price: parseFloat(button.dataset.productPrice),
      originalPrice: parseFloat(button.dataset.productOriginalPrice || button.dataset.productPrice),
      discount: parseFloat(button.dataset.productDiscount || 0),
    };

    if (!product.id || !product.name || isNaN(product.price)) {
      console.error("Datos del producto incompletos", product);
      return;
    }

    addToCart(product);
  });

  function removeFromCart(productId) {
    cart = cart.filter((item) => item.id !== productId);
    saveCart();
    renderCart();
  }

  function updateQuantity(productId, newQuantity) {
    const item = cart.find((item) => item.id === productId);
    if (item) {
      if (newQuantity <= 0) {
        removeFromCart(productId);
      } else {
        item.quantity = newQuantity;
        saveCart();
        renderCart();
      }
    }
  }

  function calculatePromotions() {

    const subtotal = cart.reduce(
      (sum, item) => {
        const originalPrice = item.originalPrice || item.price;
        return sum + originalPrice * item.quantity;
      },
      0
    );

    const discounts = cart.reduce(
      (sum, item) => {
        if (item.originalPrice && item.discount && item.discount > 0) {
          const discountAmount = (item.originalPrice * item.discount) / 100;
          return sum + discountAmount * item.quantity;
        }
        return sum;
      },
      0
    );

    const promosAccumulator = {
      "2x1 Especial": 0,
      "3x2": 0,
      "10% de descuento": 0,
    };

    cart.forEach((item) => {
      const price = item.originalPrice || item.price;
      
      const pairs = Math.floor(item.quantity / 2);
      const promo2x50 = pairs * price * 0.5;
      
      const groups = Math.floor(item.quantity / 3);
      const promo3x2 = groups * price;
      
      const itemSubtotal = price * item.quantity;
      const promo10 = subtotal > 30000 ? itemSubtotal * 0.1 : 0;

      const itemPromos = [
        { name: "2x1 Especial", discount: promo2x50 },
        { name: "3x2", discount: promo3x2 },
        { name: "10% de descuento", discount: promo10 },
      ];

      const bestPromo = itemPromos.reduce((best, current) => 
        current.discount > best.discount ? current : best
      );

      if (bestPromo.discount > 0) {
        promosAccumulator[bestPromo.name] += bestPromo.discount;
      }
    });

    const activePromos = Object.entries(promosAccumulator)
      .filter(([name, discount]) => discount > 0)
      .map(([name, discount]) => ({ name, discount }));

    return {
      discounts,
      promos: activePromos,
    };
  }

  function renderCart() {
    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {
      cartItems.innerHTML = '<p class="cart-empty">Tu carrito está vacío</p>';
      cartTotal.textContent = formatCurrency(0);
      return;
    }

    const subtotal = cart.reduce(
      (sum, item) => sum + (item.originalPrice || item.price) * item.quantity,
      0
    );

    const { discounts, promos } = calculatePromotions();
    const promosDiscount = promos.reduce((sum, p) => sum + p.discount, 0);
    const totalDiscount = discounts + promosDiscount;
    const total = subtotal - totalDiscount;

    let itemsHTML = cart
      .map((item) => {
        const originalPrice = item.originalPrice || item.price;
        const currentPrice = item.price;
        const itemDiscount = item.discount || 0;
        const itemSubtotal = originalPrice * item.quantity;
        const itemDiscountAmount =
          itemDiscount > 0 ? (originalPrice * itemDiscount) / 100 * item.quantity : 0;
        const itemTotal = itemSubtotal - itemDiscountAmount;

        return `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <p class="muted">${item.author || ""}</p>
              <div class="cart-item-price-details">
                ${
                  itemDiscount > 0
                    ? `<span class="price-original-small">${formatCurrency(originalPrice)}</span>`
                    : ""
                }
                <span class="price-current">${formatCurrency(currentPrice)} c/u</span>
                ${
                  itemDiscount > 0
                    ? `<span class="discount-badge-small">-${itemDiscount}%</span>`
                    : ""
                }
              </div>
              ${itemDiscountAmount > 0 ? `<div class="item-discount">Descuento: ${formatCurrency(itemDiscountAmount)}</div>` : ""}
            </div>
            <div class="cart-item-controls">
              <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})">+</button>
              <button class="remove-btn" onclick="removeFromCartById('${item.id}')" aria-label="Eliminar">×</button>
            </div>
            <div class="cart-item-total">
              ${itemDiscountAmount > 0 ? `<span class="price-original-small">${formatCurrency(itemSubtotal)}</span>` : ""}
              <span>${formatCurrency(itemTotal)}</span>
            </div>
          </div>
        `;
      })
      .join("");

    let promoHTML = "";
    if (discounts > 0 || promos.length > 0) {
      let promosItems = "";
      
      if (discounts > 0) {
        promosItems += `<div class="promo-item"><span>Descuentos en productos:</span> <strong>-${formatCurrency(discounts)}</strong></div>`;
      }
      
      promos.forEach(promo => {
        promosItems += `<div class="promo-item"><span>${promo.name}:</span> <strong>-${formatCurrency(promo.discount)}</strong></div>`;
      });
      
      promoHTML = `
        <div class="cart-promotions">
          <h4>Promociones aplicadas</h4>
          ${promosItems}
        </div>
      `;
    }

    const summaryHTML = `
      <div class="cart-summary">
        <div class="summary-row">
          <span>Subtotal:</span>
          <strong>${formatCurrency(subtotal)}</strong>
        </div>
        ${totalDiscount > 0 ? `
        <div class="summary-row discount-row">
          <span>Descuentos:</span>
          <strong>-${formatCurrency(totalDiscount)}</strong>
        </div>
        ` : ""}
        <div class="summary-row total-row">
          <span>Total:</span>
          <strong>${formatCurrency(total)}</strong>
        </div>
      </div>
    `;

    cartItems.innerHTML = itemsHTML + promoHTML + summaryHTML;
    
    if (cartTotal) {
      cartTotal.textContent = formatCurrency(total);
    }
  }

  window.renderCart = renderCart;

  window.updateCartQuantity = function (productId, newQuantity) {
    updateQuantity(productId, newQuantity);
  };

  window.removeFromCartById = function (productId) {
    removeFromCart(productId);
  };

  updateCartCount();
})();
