/**
 * RentEase Theme Switcher (Dark Mode & Light Mode)
 * Ensures 100% reliable theme toggling across Mobile, iPad, and Laptop devices.
 */

(function () {
  // Pre-render theme check
  const savedTheme = localStorage.getItem("renteaseTheme");
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  applyTheme(initialTheme, false);

  document.addEventListener("DOMContentLoaded", () => {
    updateThemeUIElements(initialTheme);
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
  updateThemeUIElements(theme);
}

function updateThemeUIElements(theme) {
  const isDark = theme === "dark";

  // 1. Update Floating FAB (Bottom-Left)
  const fab = document.getElementById("themeFloatingFab") || document.getElementById("rentease-theme-fab");
  const fabText = document.getElementById("fabThemeText");
  if (fabText) {
    fabText.textContent = isDark ? "Light Mode" : "Dark Mode";
  }
  if (fab) {
    fab.classList.toggle("is-dark", isDark);
    fab.setAttribute("title", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
  }

  // 2. Update Navbar Theme Pill Button
  const navBtns = document.querySelectorAll(".theme-nav-btn, .theme-toggle-btn");
  navBtns.forEach(btn => {
    btn.classList.toggle("is-dark", isDark);
    btn.setAttribute("title", isDark ? "Switch to Light Mode" : "Switch to Dark Mode");
    const textSpan = btn.querySelector(".theme-nav-text, .theme-btn-label");
    if (textSpan) {
      textSpan.textContent = isDark ? "Light Mode" : "Dark Mode";
    }
  });
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme, true);

  if (typeof showToast === "function") {
    showToast(newTheme === "dark" ? "🌙 Dark Mode Active" : "☀️ Light Mode Active");
  }
}

window.toggleTheme = toggleTheme;
window.applyTheme = applyTheme;
