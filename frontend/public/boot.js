// Runs before first paint: applies the saved (or system) theme and the language from the URL or
// the saved choice, so the page never flashes the wrong colours or direction. Mirrors
// src/context/ThemeContext.tsx and src/i18n/index.ts.
(function () {
  var root = document.documentElement;
  var theme, lang;
  try {
    theme = localStorage.getItem("theme");
    lang = localStorage.getItem("lang");
  } catch (e) {
    /* storage blocked */
  }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var fromUrl = new URLSearchParams(location.search).get("lang");
  if (fromUrl === "en" || fromUrl === "ar") lang = fromUrl;
  lang = lang === "en" ? "en" : "ar";
  root.setAttribute("data-theme", theme);
  root.lang = lang;
  root.dir = lang === "ar" ? "rtl" : "ltr";
})();
