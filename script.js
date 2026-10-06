// Update the page language and Bootstrap stylesheet when a translation changes it.
(() => {
  const rtlLanguages = ["ar", "dv", "fa", "he", "ku", "ps", "sd", "ug", "ur", "yi"];
  const page = document.documentElement;
  const bootstrapStylesheet = document.getElementById("bootstrap-css");
  const ltrBootstrap = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css";
  const rtlBootstrap = "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.rtl.min.css";

  function updateLanguage() {
    const translatorLanguage = document.querySelector(".goog-te-combo")?.value;
    const language = translatorLanguage || page.getAttribute("lang") || "en";
    const primaryLanguage = language.toLowerCase().split(/[-_]/)[0];
    const hasTranslatedRtlClass = document.documentElement.classList.contains("translated-rtl")
      || document.body.classList.contains("translated-rtl");
    const hasTranslatedLtrClass = document.documentElement.classList.contains("translated-ltr")
      || document.body.classList.contains("translated-ltr");
    const isRtl = hasTranslatedRtlClass
      || (!hasTranslatedLtrClass && rtlLanguages.includes(primaryLanguage));

    // Keep the document language useful to assistive technology and search engines.
    if (page.lang !== language) {
      page.lang = language;
    }
    const direction = isRtl ? "rtl" : "ltr";
    if (page.dir !== direction) {
      page.dir = direction;
    }

    // Bootstrap has a separate stylesheet for RTL layouts.
    bootstrapStylesheet.href = isRtl ? rtlBootstrap : ltrBootstrap;
  }

  updateLanguage();

  // Translation menus can change the selected language without reloading the page.
  document.addEventListener("change", (event) => {
    if (event.target.matches(".goog-te-combo")) {
      updateLanguage();
    }
  });

  // Watch for translation tools that update the document language or direction classes.
  const languageObserver = new MutationObserver((mutations) => {
    const languageChanged = mutations.some(({ target, attributeName }) =>
      attributeName === "lang"
      || (attributeName === "class" && (target === page || target === document.body)));
    if (languageChanged) {
      updateLanguage();
    }
  });
  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class", "lang"],
    subtree: true,
  });

  // This demo validates the email in the browser and confirms submission without sending it.
  document.getElementById("newsletter-form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.getElementById("newsletter-status").textContent =
      "Thanks for subscribing. This demo form does not send email.";
    event.currentTarget.reset();
  });
})();