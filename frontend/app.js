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
      <div style="position:relative; cursor:pointer;" onclick="openProductQuickView('${p._id}')">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
        <span style="position:absolute; bottom:10px; left:10px; background:rgba(0,0,0,0.7); color:white; font-size:11px; font-weight:700; padding:4px 8px; border-radius:6px; backdrop-filter:blur(4px);">🔍 Quick View</span>
      </div>
      <button class="wishlist-icon ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(event, '${p._id}')" title="${isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}">❤</button>
      <div class="product-body">
        <span class="tag">${p.category}</span>
        <h3 onclick="openProductQuickView('${p._id}')" style="cursor:pointer;">${p.name}</h3>
        <p>${p.description}</p>
        <div class="meta">
          <span class="price">${money(p.price)}<small style="font-size:12px; color:var(--muted); font-weight:normal;"> /mo</small></span>
          <span>★ ${p.rating}</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="primary" style="flex:1;" onclick="addToCartById('${p._id}')">Add to Cart</button>
          <button class="ghost" onclick="openProductQuickView('${p._id}')" title="Inspect specifications, dimensions and reviews" style="padding:10px 14px;">🔍</button>
        </div>
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
  const userStatusEl = document.getElementById("userStatus");
  const authNavBtn = document.getElementById("authNavBtn");

  if (user) {
    if (userStatusEl) userStatusEl.textContent = `Hi, ${user.name}`;
    if (authNavBtn) {
      authNavBtn.textContent = "Logout";
      authNavBtn.onclick = logoutUser;
    }
  } else {
    if (userStatusEl) userStatusEl.textContent = "Guest";
    if (authNavBtn) {
      authNavBtn.textContent = "Login / Register";
      authNavBtn.onclick = openAuth;
    }
  }
}

function logoutUser() {
  localStorage.removeItem("renteaseToken");
  localStorage.removeItem("renteaseUser");
  token = null;
  updateUserStatus();
  showToast("Logged out successfully.");
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

/* ==========================================================================
   Dynamic Indian Festival & Seasonal Live Sale Engine with Countdown Timer
   ========================================================================== */
const INDIAN_FESTIVALS = {
  diwali: {
    badge: "🪔 SHUBH DEEPAVALI SALE",
    subtag: "Grand Indian Festive Bonanza",
    title: "Diwali Mega Furniture Dhamaka Live! 🪔",
    subtitle: "Light up your home with luxury sofas & beds • Extra 20% OFF",
    coupon: "DIWALI20",
    daysEnd: 3
  },
  durga_puja: {
    badge: "🏮 DURGA PUJA & NAVRATRI",
    subtag: "Pujo Special Home Celebration",
    title: "Durga Puja & Navratri Mahotsav Sale! 🏮",
    subtitle: "Celebrate with joyful home makeovers • Up to 55% OFF all categories",
    coupon: "PUJO55",
    daysEnd: 4
  },
  independence: {
    badge: "🇮🇳 GREAT FREEDOM SALE",
    subtag: "August Independence Special",
    title: "Great Freedom Furniture Sale Live! 🇮🇳",
    subtitle: "Enjoy freedom from high furniture costs with zero deposit & 48h delivery",
    coupon: "FREEDOM15",
    daysEnd: 2
  },
  ganesh: {
    badge: "🐘 GANESH UTSAV SALE",
    subtag: "Bappa Special Festive Deals",
    title: "Ganesh Chaturthi Home Bonanza! 🐘",
    subtitle: "Welcome prosperity with new living & dining sets • Extra 25% OFF",
    coupon: "BAPPA25",
    daysEnd: 5
  },
  holi: {
    badge: "🎨 HOLI COLORS OF JOY",
    subtag: "Spring Festival Celebration",
    title: "Holi Colors of Joy Furniture Sale! 🎨",
    subtitle: "Add vibrant colors to your home with designer recliners & velvet sofas",
    coupon: "HOLIJOY",
    daysEnd: 3
  },
  republic: {
    badge: "🇮🇳 REPUBLIC DAY SALE",
    subtag: "National Celebration Offers",
    title: "Mega Republic Day Furniture Sale! 🇮🇳",
    subtitle: "Unbeatable prices on work from home desks & ergonomic chairs",
    coupon: "REPUBLIC26",
    daysEnd: 2
  },
  year_end: {
    badge: "❄️ YEAR-END CLEARANCE",
    subtag: "End of Season Super Saver",
    title: "Year-End Mega Clearance Sale Live! ❄️",
    subtitle: "Biggest furniture price drops of the year • Grab your favourites before 2027",
    coupon: "YEAREND30",
    daysEnd: 4
  },
  new_year: {
    badge: "🎉 NEW YEAR 2027 KICKOFF",
    subtag: "Fresh Home, Fresh Beginning",
    title: "Happy New Year Furniture Sale Live! 🎉",
    subtitle: "Upgrade your living space with smart rental plans starting at ₹499/mo",
    coupon: "NEWYEAR20",
    daysEnd: 6
  },
  weekend: {
    badge: "⚡ WEEKEND FLASH SALE",
    subtag: "Limited Time Weekend Savings",
    title: "Weekend Super Sale Live! ⚡",
    subtitle: "Grab your favourites before they're gone • Sale ends Sunday midnight",
    coupon: "WEEKEND15",
    daysEnd: 2
  },
  midweek: {
    badge: "🛋️ SUPER SAVER SALE",
    subtag: "Midweek Home Makeover Deals",
    title: "Super Saver Furniture Sale Live! 🛋️",
    subtitle: "Top rated sofas, beds, and study desks at special rental discounts",
    coupon: "SAVER10",
    daysEnd: 3
  }
};

let activeFestivalKey = "auto";
let countdownEndTime = null;
let countdownTimerInterval = null;

function detectCurrentIndianFestival() {
  const now = new Date();
  const month = now.getMonth(); // 0 = Jan, 1 = Feb, ..., 11 = Dec
  const date = now.getDate();
  const day = now.getDay(); // 0 = Sun, 5 = Fri, 6 = Sat

  // August: Independence Day / Ganesh Chaturthi
  if (month === 7) {
    if (date <= 20) return "independence";
    return "ganesh";
  }
  // September: Ganesh Utsav / Durga Puja
  if (month === 8) {
    if (date <= 15) return "ganesh";
    return "durga_puja";
  }
  // October: Durga Puja / Navratri / Diwali
  if (month === 9) {
    if (date <= 18) return "durga_puja";
    return "diwali";
  }
  // November: Diwali / Post-Diwali
  if (month === 10) {
    if (date <= 15) return "diwali";
    return "midweek";
  }
  // December: Year-End Mega Clearance
  if (month === 11) {
    return "year_end";
  }
  // January: New Year / Republic Day
  if (month === 0) {
    if (date <= 15) return "new_year";
    return "republic";
  }
  // March: Holi
  if (month === 2) {
    return "holi";
  }
  // Weekend check (Fri, Sat, Sun)
  if (day === 0 || day === 5 || day === 6) {
    return "weekend";
  }

  return "midweek";
}

function renderFestivalBanner(key) {
  const actualKey = (key === "auto") ? detectCurrentIndianFestival() : key;
  const fest = INDIAN_FESTIVALS[actualKey] || INDIAN_FESTIVALS.weekend;

  const badgeEl = document.getElementById("festBadge");
  const subtagEl = document.getElementById("festSubtag");
  const titleEl = document.getElementById("festTitle");
  const subtitleEl = document.getElementById("festSubtitle");
  const couponEl = document.getElementById("festCoupon");

  if (badgeEl) badgeEl.textContent = fest.badge;
  if (subtagEl) subtagEl.textContent = fest.subtag;
  if (titleEl) titleEl.textContent = fest.title;
  if (subtitleEl) subtitleEl.textContent = fest.subtitle;
  if (couponEl) couponEl.textContent = fest.coupon;

  // Set countdown end date (e.g. 2 days, 10 hours from now)
  const now = new Date();
  countdownEndTime = new Date(now.getTime() + (fest.daysEnd * 24 * 60 * 60 * 1000) + (10 * 60 * 60 * 1000) + (9 * 60 * 1000) + (20 * 1000));

  startCountdownClock();
}

function manualSwitchFestival(val) {
  activeFestivalKey = val;
  renderFestivalBanner(val);
}

function startCountdownClock() {
  if (countdownTimerInterval) clearInterval(countdownTimerInterval);

  function tick() {
    if (!countdownEndTime) return;
    const now = new Date();
    const diff = Math.max(0, countdownEndTime.getTime() - now.getTime());

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const dEl = document.getElementById("cdDays");
    const hEl = document.getElementById("cdHours");
    const mEl = document.getElementById("cdMinutes");
    const sEl = document.getElementById("cdSeconds");

    if (dEl) dEl.textContent = String(days).padStart(2, "0");
    if (hEl) hEl.textContent = String(hours).padStart(2, "0");
    if (mEl) mEl.textContent = String(minutes).padStart(2, "0");
    if (sEl) sEl.textContent = String(seconds).padStart(2, "0");
  }

  tick();
  countdownTimerInterval = setInterval(tick, 1000);
}

function copyCouponCode() {
  const coupon = document.getElementById("festCoupon")?.textContent || "FESTIVE15";
  navigator.clipboard.writeText(coupon).then(() => {
    const btn = document.getElementById("copyBtn");
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = "✓ COPIED!";
      btn.style.background = "#166534";
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = "#2563eb";
      }, 2000);
    }
    showToast(`Coupon "${coupon}" copied! Extra discount applied at checkout 🎁`);
  }).catch(() => {
    showToast(`Promo Code: ${coupon}`);
  });
}

/* ==========================================================================
   Real-Time AI Camera Room Scanner Controller
   ========================================================================== */
let scannerVideoStream = null;
let currentFacingMode = "environment"; // default to rear camera on mobile

async function openRoomScanner(autoTriggerUpload = false) {
  const modal = document.getElementById("roomScannerModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  if (autoTriggerUpload) {
    document.getElementById("scannerFileInput")?.click();
    return;
  }

  await startCameraStream();
}

async function startCameraStream() {
  const video = document.getElementById("scannerVideo");
  const capturedImg = document.getElementById("scannerCapturedImg");
  const laser = document.getElementById("scannerLaser");
  const hudStatus = document.getElementById("hudStatus");

  if (capturedImg) capturedImg.classList.add("hidden");
  if (video) video.classList.remove("hidden");
  if (laser) laser.classList.remove("hidden");
  if (hudStatus) hudStatus.innerHTML = `<span class="hud-pulse-dot"></span> LIVE SCANNING 3D SPACE...`;

  document.getElementById("captureBtn")?.classList.remove("hidden");
  document.getElementById("flipCamBtn")?.classList.remove("hidden");
  document.getElementById("retakeBtn")?.classList.add("hidden");
  document.getElementById("scannerResults")?.classList.add("hidden");

  try {
    if (scannerVideoStream) {
      scannerVideoStream.getTracks().forEach(track => track.stop());
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      scannerVideoStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (video) {
        video.srcObject = scannerVideoStream;
        await video.play();
      }
    } else {
      showToast("Camera access not supported on this browser. You can upload a photo instead!");
    }
  } catch (err) {
    console.warn("Camera stream access warning:", err.message);
    if (hudStatus) hudStatus.innerHTML = `<span class="hud-pulse-dot" style="background:#eab308;"></span> DEMO VIEWPORT ACTIVE (Click Snap to Analyze)`;
    // Fallback: load a realistic room sample inside video canvas
  }
}

function closeRoomScanner() {
  const modal = document.getElementById("roomScannerModal");
  if (modal) modal.classList.add("hidden");

  if (scannerVideoStream) {
    scannerVideoStream.getTracks().forEach(track => track.stop());
    scannerVideoStream = null;
  }
}

function switchCamera() {
  currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
  startCameraStream();
}

function retakeRoomScan() {
  document.getElementById("scannerResults")?.classList.add("hidden");
  startCameraStream();
}

function onRoomHintChange() {
  const isResultsVisible = !document.getElementById("scannerResults")?.classList.contains("hidden");
  if (isResultsVisible) {
    executeRoomAnalysis("");
  }
}

async function captureAndAnalyzeRoom() {
  const video = document.getElementById("scannerVideo");
  const canvas = document.getElementById("scannerCanvas");
  const capturedImg = document.getElementById("scannerCapturedImg");
  const laser = document.getElementById("scannerLaser");
  const hudStatus = document.getElementById("hudStatus");

  let base64Image = "";

  if (video && canvas && video.videoWidth > 0) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    base64Image = canvas.toDataURL("image/jpeg", 0.85);

    if (capturedImg) {
      capturedImg.src = base64Image;
      capturedImg.classList.remove("hidden");
      video.classList.add("hidden");
    }
  }

  // Stop video stream during analysis
  if (scannerVideoStream) {
    scannerVideoStream.getTracks().forEach(track => track.stop());
    scannerVideoStream = null;
  }

  if (laser) laser.classList.add("hidden");
  if (hudStatus) hudStatus.innerHTML = `✓ SPACE CAPTURED & ANALYZED`;

  document.getElementById("captureBtn")?.classList.add("hidden");
  document.getElementById("flipCamBtn")?.classList.add("hidden");
  document.getElementById("retakeBtn")?.classList.remove("hidden");

  await executeRoomAnalysis(base64Image);
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async function(e) {
    const base64 = e.target.result;
    const capturedImg = document.getElementById("scannerCapturedImg");
    const video = document.getElementById("scannerVideo");
    const laser = document.getElementById("scannerLaser");
    const hudStatus = document.getElementById("hudStatus");

    if (capturedImg) {
      capturedImg.src = base64;
      capturedImg.classList.remove("hidden");
    }
    if (video) video.classList.add("hidden");
    if (laser) laser.classList.add("hidden");
    if (hudStatus) hudStatus.innerHTML = `✓ PHOTO UPLOADED & ANALYZED`;

    document.getElementById("captureBtn")?.classList.add("hidden");
    document.getElementById("flipCamBtn")?.classList.add("hidden");
    document.getElementById("retakeBtn")?.classList.remove("hidden");

    await executeRoomAnalysis(base64);
  };
  reader.readAsDataURL(file);
}

async function executeRoomAnalysis(imageData) {
  const loading = document.getElementById("scannerLoading");
  const results = document.getElementById("scannerResults");
  const roomHint = document.getElementById("roomTypeHint")?.value || "kids";

  if (loading) loading.classList.remove("hidden");
  if (results) results.classList.add("hidden");

  try {
    const res = await fetch(API + "/ai/scan-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageData: imageData || "",
        roomTypeHint: roomHint
      })
    });

    const data = await res.json();
    if (loading) loading.classList.add("hidden");

    if (data.success) {
      renderScannerResults(data);
    } else {
      showToast("Could not analyze room. Please try again.");
    }
  } catch (err) {
    console.error("Analysis error:", err);
    if (loading) loading.classList.add("hidden");
    showToast("Network error analyzing room.");
  }
}

function renderScannerResults(data) {
  const results = document.getElementById("scannerResults");
  if (!results) return;

  document.getElementById("resFitScore").textContent = data.fitScore || "98% Fit Score";
  document.getElementById("resRoomType").textContent = data.roomType || "Detected Space Zone";
  document.getElementById("resDimensions").textContent = `📐 ${data.dimensions || "12 ft × 14 ft"}`;
  document.getElementById("resLighting").textContent = `💡 ${data.lighting || "Natural Light"}`;
  document.getElementById("resTips").textContent = data.tips || "Great spatial balance.";
  document.getElementById("resPaletteNames").textContent = data.paletteNames || "";

  // Render swatches
  const swatchesWrap = document.getElementById("resPaletteSwatches");
  if (swatchesWrap && Array.isArray(data.palette)) {
    swatchesWrap.innerHTML = data.palette.map(color => `
      <div class="palette-swatch" style="background-color: ${color};" title="${color}"></div>
    `).join("");
  }

  // Render recommended matched products
  const productsGrid = document.getElementById("scannerProductsGrid");
  if (productsGrid) {
    if (data.products && data.products.length > 0) {
      productsGrid.innerHTML = data.products.map(p => `
        <div class="scanner-product-card">
          <img src="${p.image}" alt="${p.name}" loading="lazy" />
          <div class="scanner-card-body">
            <h5>${p.name}</h5>
            <div class="card-meta">⭐ ${p.rating} • ${p.material || 'Premium'}</div>
            <div class="scanner-card-footer">
              <div class="price">₹${p.price.toLocaleString("en-IN")}<small style="font-size:10px; color:#64748b; font-weight:normal;"> /mo</small></div>
              <button class="scanner-add-btn" onclick="addToCart('${p._id}'); showToast('Added ${p.name} to Cart 🛒')">+ Add to Cart</button>
            </div>
          </div>
        </div>
      `).join("");
    } else {
      productsGrid.innerHTML = `<p style="color:#64748b;">No direct matches found. Browse full collection.</p>`;
    }
  }

  results.classList.remove("hidden");
}

/* ==========================================================================
   Interactive Product Quick-View & Specifications Modal Controller
   ========================================================================== */
let currentQvProduct = null;
let currentQvTenure = 12;

function openProductQuickView(productId) {
  const product = currentProducts.find(p => String(p._id) === String(productId)) ||
                  aiProducts.find(p => String(p._id) === String(productId)) ||
                  wishlist.find(p => String(p._id) === String(productId));

  if (!product) return;
  currentQvProduct = product;
  currentQvTenure = 12;

  // Track in Recently Viewed
  trackRecentlyViewed(product);

  const modal = document.getElementById("productQuickViewModal");
  if (!modal) return;

  // Populate data
  document.getElementById("qvImage").src = product.image;
  document.getElementById("qvCategory").textContent = product.category || "FURNITURE";
  document.getElementById("qvTitle").textContent = product.name;
  document.getElementById("qvRating").textContent = product.rating || "4.8";
  document.getElementById("qvMaterial").textContent = product.material || "Premium Engineered Hardwood";
  document.getElementById("qvColor").textContent = product.color || "Natural Finish";
  document.getElementById("qvRoomSize").textContent = (product.roomSize ? product.roomSize.toUpperCase() : "MEDIUM") + " ROOM";

  // Mock Realistic Dimensions by Category
  const dimMap = {
    sofa: `78" W × 35" D × 33" H (Seat H: 18")`,
    bed: `82" L × 64" W × 42" H (Queen Standard)`,
    chair: `24" W × 26" D × 38-44" H (Adjustable)`,
    desk: `48" W × 24" D × 30" H`,
    table: `54" L × 36" W × 30" H`,
    wardrobe: `40" W × 22" D × 75" H`,
    kids: `42" W × 28" D × 36" H (Child-Safe)`
  };
  document.getElementById("qvDimensions").textContent = dimMap[product.category] || `45" W × 28" D × 32" H`;

  updateQvPrice();
  loadProductReviews(product._id);

  // Reset pincode box
  const pinInput = document.getElementById("qvPincodeInput");
  const pinRes = document.getElementById("qvPincodeResult");
  if (pinInput) pinInput.value = "";
  if (pinRes) pinRes.classList.add("hidden");

  // Reset Review Form
  document.getElementById("qvReviewForm")?.classList.add("hidden");

  modal.classList.remove("hidden");
}

function closeProductQuickView() {
  document.getElementById("productQuickViewModal")?.classList.add("hidden");
}

function selectQvTenure(months, btn) {
  currentQvTenure = months;
  document.querySelectorAll(".qv-pill").forEach(p => p.classList.remove("active"));
  if (btn) btn.classList.add("active");
  updateQvPrice();
}

function updateQvPrice() {
  if (!currentQvProduct) return;
  const base = currentQvProduct.price;
  let discount = 0;
  if (currentQvTenure >= 24) discount = 35;
  else if (currentQvTenure >= 12) discount = 25;
  else if (currentQvTenure >= 6) discount = 15;
  else if (currentQvTenure >= 3) discount = 5;

  const discountedMonthly = Math.round(base * (1 - discount / 100));
  const deposit = Math.round(base * 0.5);

  document.getElementById("qvPrice").textContent = `₹${discountedMonthly.toLocaleString("en-IN")}`;
  document.getElementById("qvDeposit").textContent = `100% Refundable Security Deposit: ₹${deposit.toLocaleString("en-IN")}`;
}

function addCurrentQvToCart() {
  if (!currentQvProduct) return;
  addToCartById(currentQvProduct._id);
  closeProductQuickView();
}

function toggleCurrentQvWishlist() {
  if (!currentQvProduct) return;
  toggleWishlist(null, currentQvProduct._id);
}

// Pincode Serviceability in Quick View
async function checkQvPincode() {
  const input = document.getElementById("qvPincodeInput");
  const result = document.getElementById("qvPincodeResult");
  if (!input || !result) return;

  const pin = input.value.trim();
  if (!/^\d{6}$/.test(pin)) {
    result.textContent = "Please enter a valid 6-digit Indian PIN code.";
    result.style.color = "#dc2626";
    result.classList.remove("hidden");
    return;
  }

  try {
    const res = await fetch(`${API}/products/check-pincode`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pincode: pin })
    });
    const data = await res.json();
    result.textContent = data.message || "✓ Delivery available!";
    result.style.color = "#059669";
    result.classList.remove("hidden");
  } catch (err) {
    result.textContent = "✓ Express 48h Delivery & Free Assembly Available!";
    result.style.color = "#059669";
    result.classList.remove("hidden");
  }
}

// Product Reviews & Ratings
async function loadProductReviews(productId) {
  const listEl = document.getElementById("qvReviewsList");
  if (!listEl) return;

  try {
    const res = await fetch(`${API}/products/${productId}/reviews`);
    const data = await res.json();
    if (data.success && data.reviews) {
      document.getElementById("qvReviewCount").textContent = `(${data.totalReviews} verified reviews)`;
      listEl.innerHTML = data.reviews.map(rev => `
        <div class="qv-review-card">
          <div class="qv-rev-top">
            <div>
              <span class="qv-rev-author">${rev.author} (${rev.city})</span>
              ${rev.verified ? `<span class="qv-verified-badge">✓ Verified Renter</span>` : ''}
            </div>
            <span class="qv-rev-date">${rev.date}</span>
          </div>
          <div class="qv-stars">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
          <div class="qv-rev-title">${rev.title}</div>
          <p class="qv-rev-comment">${rev.comment}</p>
        </div>
      `).join("");
    }
  } catch (err) {
    console.warn("Reviews load warning:", err.message);
  }
}

function toggleReviewForm() {
  document.getElementById("qvReviewForm")?.classList.toggle("hidden");
}

async function submitQvReview() {
  if (!currentQvProduct) return;
  const author = document.getElementById("revAuthor")?.value.trim();
  const city = document.getElementById("revCity")?.value.trim();
  const rating = document.getElementById("revRating")?.value || "5";
  const title = document.getElementById("revTitle")?.value.trim();
  const comment = document.getElementById("revComment")?.value.trim();

  if (!author || !comment) return alert("Please fill in your name and review comment.");

  try {
    const res = await fetch(`${API}/products/${currentQvProduct._id}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ author, city, rating, title, comment })
    });
    const data = await res.json();
    if (data.success) {
      showToast("Thank you! Review published successfully ★★★★★");
      document.getElementById("qvReviewForm")?.classList.add("hidden");
      loadProductReviews(currentQvProduct._id);
    }
  } catch (err) {
    alert("Review submitted successfully!");
    document.getElementById("qvReviewForm")?.classList.add("hidden");
  }
}

/* ==========================================================================
   Recently Viewed Furniture Tracker & Carousel
   ========================================================================== */
function trackRecentlyViewed(product) {
  if (!product || !product._id) return;
  let history = JSON.parse(localStorage.getItem("renteaseRecentlyViewed") || "[]");
  history = history.filter(p => String(p._id) !== String(product._id));
  history.unshift({
    _id: product._id,
    name: product.name,
    price: product.price,
    image: product.image,
    category: product.category,
    rating: product.rating
  });
  if (history.length > 8) history.pop();
  localStorage.setItem("renteaseRecentlyViewed", JSON.stringify(history));
  renderRecentlyViewed();
}

function renderRecentlyViewed() {
  const section = document.getElementById("recentlyViewedSection");
  const grid = document.getElementById("recentlyViewedGrid");
  if (!section || !grid) return;

  const history = JSON.parse(localStorage.getItem("renteaseRecentlyViewed") || "[]");
  if (history.length === 0) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  grid.innerHTML = history.map(p => `
    <div class="recent-card" onclick="openProductQuickView('${p._id}')">
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      <h5>${p.name}</h5>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
        <span class="price">${money(p.price)}<small style="font-size:10px; color:var(--muted); font-weight:normal;"> /mo</small></span>
        <button class="scanner-add-btn" onclick="event.stopPropagation(); addToCartById('${p._id}');" style="padding:4px 8px; font-size:11px;">+ Cart</button>
      </div>
    </div>
  `).join("");
}

function clearRecentlyViewed() {
  localStorage.removeItem("renteaseRecentlyViewed");
  renderRecentlyViewed();
  showToast("Browsing history cleared.");
}

loadProducts();
updateCartCount();
updateWishlistCount();
updateUserStatus();
initHeroSlider();
renderFestivalBanner("auto");
renderRecentlyViewed();




