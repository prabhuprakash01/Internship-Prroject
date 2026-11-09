// Shared progressive enhancements: footer year and persistent light/dark theme.
document.querySelectorAll("#year").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const root = document.documentElement;
const themeButton = document.querySelector(".theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

function applyTheme(theme) {
  root.dataset.theme = theme;
  if (themeButton) {
    const dark = theme === "dark";
    themeButton.setAttribute("aria-pressed", String(dark));
    themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
    themeButton.textContent = dark ? "☀️ Theme" : "🌙 Theme";
  }
}
applyTheme(initialTheme);

if (themeButton) {
  themeButton.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("portfolio-theme", nextTheme);
    applyTheme(nextTheme);
  });
}

const contactForm = document.querySelector("#contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.querySelector("#form-status");
    status.textContent = "Thanks! This demo form is validated, but it is not connected to an email service yet.";
  });
}
