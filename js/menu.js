(function () {
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuOverlay = document.getElementById("menu-overlay");
  const cartToggleMobile = document.getElementById("cart-toggle-mobile");
  const cartCount = document.getElementById("cart-count");
  const cartCountMobile = document.getElementById("cart-count-mobile");

  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove("active");
    if (menuToggle) {
      menuToggle.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    }
    if (menuOverlay) menuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add("active");
    if (menuToggle) {
      menuToggle.classList.add("active");
      menuToggle.setAttribute("aria-expanded", "true");
    }
    if (menuOverlay) menuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function syncCartCounts() {
    if (!cartCount || !cartCountMobile) return;
    const count = cartCount.textContent;
    cartCountMobile.textContent = count;
    if (cartCount.classList.contains("visible")) {
      cartCountMobile.classList.add("visible");
    } else {
      cartCountMobile.classList.remove("visible");
    }
  }

  if (cartCount && cartCountMobile) {
    const observer = new MutationObserver(syncCartCounts);
    observer.observe(cartCount, {
      childList: true,
      attributes: true,
      attributeFilter: ["class"],
    });
    syncCartCounts();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    if (menuOverlay) {
      menuOverlay.addEventListener("click", closeMenu);
    }

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });
  }

  if (cartToggleMobile) {
    cartToggleMobile.addEventListener("click", () => {
      const cartModal = document.getElementById("cart-modal");
      if (cartModal) {
        cartModal.classList.add("active");
        if (typeof window.renderCart === "function") {
          window.renderCart();
        }
        closeMenu();
      }
    });
  }

})();

