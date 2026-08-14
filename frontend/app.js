const API = "/api";

let cart = JSON.parse(localStorage.getItem("renteaseCart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("renteaseWishlist") || "[]");
let token = localStorage.getItem("renteaseToken");
let authMode = "login";

let currentProducts = [];
let aiProducts = [];

function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(value);
}

async function loadProducts() {
  const searchEl = document.getElementById("search");
  const categoryEl = document.getElementById("category");
  const search = searchEl ? searchEl.value.trim() : "";
  const category = categoryEl ? categoryEl.value : "";

  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (category) params.set("category", category);

  try {
    const res = await fetch(`${API}/products?${params.toString()}`);
    currentProducts = await res.json();
    const grid = document.getElementById("productsGrid");
    if (grid) {
      if (!currentProducts.length) {
        grid.innerHTML = `<p style="grid-column: span 3; text-align: center; color: var(--muted); padding: 40px;">No furniture found in this category.</p>`;
      } else {
        grid.innerHTML = currentProducts.map(productCard).join("");
      }
    }
  } catch (err) {
    console.error("Failed to load products:", err);
  }
}

function selectCategoryFilter(cat, element) {
  // Update active category circle
  document.querySelectorAll(".category-item").forEach(item => item.classList.remove("active"));
  if (element) element.classList.add("active");

  const catSelect = document.getElementById("category");
  if (catSelect) {
    catSelect.value = cat;
  }

  loadProducts();

  // Smooth scroll to collection
  const target = document.getElementById("products");
  if (target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function scrollCategories(direction) {
  const track = document.getElementById("categoryTrack");
  if (track) {
    track.scrollBy({ left: direction * 280, behavior: "smooth" });
  }
}

function productCard(p) {
  wishlist = JSON.parse(localStorage.getItem("renteaseWishlist") || "[]");
  const isInWishlist = wishlist.some(item => String(item._id) === String(p._id));
  return `
    <article class="product" data-id="${p._id}">
      <img src="${p.image}" alt="${p.name}">
      <button class="wishlist-icon ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(event, '${p._id}')" title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">❤</button>
      <div class="product-body">
        <span class="tag">${p.category}</span>
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="meta">
          <span class="price">${money(p.price)}</span>
          <span>★ ${p.rating}</span>
        </div>
        <button class="primary" onclick="addToCartById('${p._id}')">Add to Cart</button>
      </div>
    </article>
  `;
}

function addToCartById(productId) {
  const product = currentProducts.find(p => String(p._id) === String(productId)) ||
                  aiProducts.find(p => String(p._id) === String(productId)) ||
                  wishlist.find(p => String(p._id) === String(productId));
  if (!product) return;

  cart = JSON.parse(localStorage.getItem("renteaseCart") || "[]");
  const existing = cart.find(item => String(item.product) === String(product._id));
  if (existing) existing.quantity += 1;
  else cart.push({ product: product._id, name: product.name, price: product.price, quantity: 1 });
  saveCart();
  window.location.href = "/cart.html";
}

function addToCart(product) {
  if (!product || !product._id) return;
  addToCartById(product._id);
}

function saveCart() {
  localStorage.setItem("renteaseCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  cart = JSON.parse(localStorage.getItem("renteaseCart") || "[]");
  const el = document.getElementById("cartCount");
  if (el) el.textContent = cart.reduce((n, x) => n + x.quantity, 0);
}
window.updateCartCount = updateCartCount;

function toggleWishlist(event, productId) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  wishlist = JSON.parse(localStorage.getItem("renteaseWishlist") || "[]");
  const index = wishlist.findIndex(item => String(item._id) === String(productId));
  
  if (index > -1) {
    const removed = wishlist.splice(index, 1)[0];
    saveWishlist();
    showToast(`Removed "${removed ? removed.name : 'item'}" from wishlist`);
  } else {
    const product = currentProducts.find(p => String(p._id) === String(productId)) ||
                    aiProducts.find(p => String(p._id) === String(productId));
    if (product) {
      wishlist.push(product);
      saveWishlist();
      showToast(`Saved "${product.name}" to wishlist ❤`);
    }
  }
  
  // Update heart icons across the page immediately
  document.querySelectorAll(`.product[data-id="${productId}"] .wishlist-icon`).forEach(btn => {
    const isNowInWishlist = wishlist.some(item => String(item._id) === String(productId));
    btn.classList.toggle("active", isNowInWishlist);
    btn.title = isNowInWishlist ? "Remove from wishlist" : "Add to wishlist";
  });
  
  updateWishlistCount();
}

function saveWishlist() {
  localStorage.setItem("renteaseWishlist", JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  wishlist = JSON.parse(localStorage.getItem("renteaseWishlist") || "[]");
  const el = document.getElementById("wishlistCount");
  if (el) el.textContent = wishlist.length;
}
window.updateWishlistCount = updateWishlistCount;

function showToast(message) {
  let toast = document.getElementById("site-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "site-toast";
    toast.style.cssText = "position:fixed;bottom:100px;left:50%;transform:translateX(-50%);background:#1f4b3f;color:white;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:600;box-shadow:0 6px 20px rgba(0,0,0,0.2);z-index:9999;transition:all 0.3s ease;opacity:0;pointer-events:none;";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(10px)";
  }, 2400);
}

async function askAI() {
  const message = document.getElementById("aiMessage").value.trim();
  if (!message) return alert("Tell the AI what furniture you need.");

  const result = document.getElementById("aiResult");
  result.innerHTML = "<div class='ai-message'>AI is finding the best matches...</div>";

  const res = await fetch(`${API}/ai/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message })
  });

  const data = await res.json();

  if (!res.ok) {
    result.innerHTML = `<div class="ai-message">${data.message}</div>`;
    return;
  }

  aiProducts = data.products || [];

  result.innerHTML = `
    <div class="ai-message">
      <strong>✦ AI Assistant:</strong> ${data.message}
      <br><small>Filters understood: ${JSON.stringify(data.filters)}</small>
    </div>
    <div class="ai-products">
      ${aiProducts.map(p => `
        <div class="ai-mini product" data-id="${p._id}">
          <img src="${p.image}" alt="${p.name}">
          <strong>${p.name}</strong>
          <p>${money(p.price)} · ★ ${p.rating}</p>
          <button class="primary" onclick="addToCartById('${p._id}')">Add</button>
        </div>
      `).join("")}
    </div>
  `;
}

function openAuth() {
  document.getElementById("authModal").classList.remove("hidden");
}

function closeAuth() {
  document.getElementById("authModal").classList.add("hidden");
}

function toggleAuthMode() {
  authMode = authMode === "login" ? "register" : "login";
  document.getElementById("authTitle").textContent = authMode === "login" ? "Login" : "Create Account";
  document.getElementById("nameField").classList.toggle("hidden", authMode === "login");
  document.getElementById("toggleAuth").textContent =
    authMode === "login" ? "Create an account" : "Already have an account? Login";
  document.getElementById("authMessage").textContent = "";
}

async function submitAuth() {
  const name = document.getElementById("authName").value.trim();
  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;

  const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
  const body = authMode === "login" ? { email, password } : { name, email, password };

  const res = await fetch(API + endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    document.getElementById("authMessage").textContent = data.message;
    return;
  }

  if (authMode === "login") {
    token = data.token;
    localStorage.setItem("renteaseToken", token);
    localStorage.setItem("renteaseUser", JSON.stringify(data.user));
    updateUserStatus();
    closeAuth();
  } else {
    alert("Account created. Please login.");
    toggleAuthMode();
  }
}



function updateUserStatus() {
  const user = JSON.parse(localStorage.getItem("renteaseUser") || "null");
  document.getElementById("userStatus").textContent = user ? `Hi, ${user.name}` : "Guest";
}

/* ==========================================================================
   Top 10-Image Automatic Promotional Slider Controller
   ========================================================================== */
let currentHeroSlide = 0;
const totalHeroSlides = 10;
let heroSlideTimer = null;

function initHeroSlider() {
  const dotsContainer = document.getElementById("sliderDots");
  const track = document.getElementById("slidesTrack");
  const wrapper = document.getElementById("sliderWrapper");

  if (!dotsContainer || !track) return;

  // Render 10 numbered bullet dots
  dotsContainer.innerHTML = Array.from({ length: totalHeroSlides }, (_, i) => `
    <button class="slider-dot ${i === 0 ? 'active' : ''}" onclick="goToHeroSlide(${i})" aria-label="Go to slide ${i + 1}">
      ${i + 1}
    </button>
  `).join("");

  // Start auto timer (4.5 seconds per slide)
  startHeroSlideTimer();

  // Pause on mouse enter, resume on mouse leave
  if (wrapper) {
    wrapper.addEventListener("mouseenter", stopHeroSlideTimer);
    wrapper.addEventListener("mouseleave", startHeroSlideTimer);

    // Touch swipe support for mobile
    let touchStartX = 0;
    wrapper.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopHeroSlideTimer();
    }, { passive: true });

    wrapper.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) changeHeroSlide(1);
      else if (touchEndX - touchStartX > 50) changeHeroSlide(-1);
      startHeroSlideTimer();
    }, { passive: true });
  }
}

function startHeroSlideTimer() {
  stopHeroSlideTimer();
  heroSlideTimer = setInterval(() => {
    changeHeroSlide(1);
  }, 4500);
}

function stopHeroSlideTimer() {
  if (heroSlideTimer) {
    clearInterval(heroSlideTimer);
    heroSlideTimer = null;
  }
}

function goToHeroSlide(index) {
  currentHeroSlide = (index + totalHeroSlides) % totalHeroSlides;
  const track = document.getElementById("slidesTrack");
  if (track) {
    track.style.transform = `translateX(-${currentHeroSlide * 100}%)`;
  }

  // Update active dot
  document.querySelectorAll(".slider-dot").forEach((dot, idx) => {
    dot.classList.toggle("active", idx === currentHeroSlide);
  });
}

function changeHeroSlide(direction) {
  goToHeroSlide(currentHeroSlide + direction);
}

loadProducts();
updateCartCount();
updateWishlistCount();
updateUserStatus();
initHeroSlider();

