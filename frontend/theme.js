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

  // 2. DOM Ready listener to sync toggle button UI
  document.addEventListener("DOMContentLoaded", () => {
    updateThemeButtons(initialTheme);
  });
})();

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
  const buttons = document.querySelectorAll(".theme-toggle-btn");
  buttons.forEach(btn => {
    if (theme === "dark") {
      btn.setAttribute("title", "Switch to Light Mode");
      btn.setAttribute("aria-label", "Switch to Light Mode");
      btn.classList.add("is-dark");
    } else {
      btn.setAttribute("title", "Switch to Dark Mode");
      btn.setAttribute("aria-label", "Switch to Dark Mode");
      btn.classList.remove("is-dark");
    }
  });
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
