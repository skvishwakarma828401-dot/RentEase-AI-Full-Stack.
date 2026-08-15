/**
 * RentEase Theme Switcher (Dark Mode & Light Mode)
 * Persists user choice in localStorage with instant pre-render initialization
 */

(function () {
  // 1. Instant check on initial load (prevents page flash)
  const savedTheme = localStorage.getItem("renteaseTheme");
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

  applyTheme(initialTheme, false);

  // 2. Inject floating Theme Switcher FAB & sync navbar buttons on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    initThemeUI();
    updateThemeButtons(initialTheme);
  });
})();

function initThemeUI() {
  if (document.getElementById("rentease-theme-fab")) return;

  // Floating Quick Theme Switcher in Bottom Left (Ensures 100% visibility on all screens & devices)
  const fab = document.createElement("button");
  fab.id = "rentease-theme-fab";
  fab.className = "theme-floating-fab";
  fab.setAttribute("aria-label", "Toggle Dark and Light Mode");
  fab.setAttribute("title", "Toggle Dark / Light Mode");
  fab.onclick = toggleTheme;
  fab.innerHTML = `
    <span class="fab-theme-icon">🌓</span>
    <span class="fab-theme-text" id="fabThemeText">Dark Mode</span>
  `;
  document.body.appendChild(fab);
}

function applyTheme(theme, save = true) {
  document.documentElement.setAttribute("data-theme", theme);
  if (document.body) {
    document.body.classList.toggle("dark-mode", theme === "dark");
  }
  if (save) {
    localStorage.setItem("renteaseTheme", theme);
  }
  updateThemeButtons(theme);
}

function updateThemeButtons(theme) {
  const isDark = theme === "dark";

  // Navbar Buttons
  const buttons = document.querySelectorAll(".theme-toggle-btn");
  buttons.forEach(btn => {
    if (isDark) {
      btn.setAttribute("title", "Switch to Light Mode");
      btn.setAttribute("aria-label", "Switch to Light Mode");
      btn.classList.add("is-dark");
      const label = btn.querySelector(".theme-btn-label");
      if (label) label.textContent = "Light Mode";
    } else {
      btn.setAttribute("title", "Switch to Dark Mode");
      btn.setAttribute("aria-label", "Switch to Dark Mode");
      btn.classList.remove("is-dark");
      const label = btn.querySelector(".theme-btn-label");
      if (label) label.textContent = "Dark Mode";
    }
  });

  // Floating FAB
  const fabText = document.getElementById("fabThemeText");
  const fab = document.getElementById("rentease-theme-fab");
  if (fabText) {
    fabText.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
  if (fab) {
    fab.classList.toggle("is-dark", isDark);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme, true);

  if (typeof showToast === "function") {
    showToast(newTheme === "dark" ? "🌙 Dark Mode Enabled" : "☀️ Light Mode Enabled");
  }
}

// Attach to window object for global availability across all HTML files
window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
