const DATA_URL = "assets/data/site-data.json?v=20260517-fisicaro5";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

async function loadSiteData() {
  const response = await fetch(DATA_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Impossibile caricare ${DATA_URL}`);
  }
  return response.json();
}

function setupNavigation() {
  const button = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    nav.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("is-nav-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      button.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("is-nav-open");
    }
  });
}

function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  items.forEach((item) => observer.observe(item));
}

function renderCoalition(lists = []) {
  const target = document.querySelector("[data-coalition-grid]");
  if (!target) return;

  target.innerHTML = lists
    .map(
      (list) => `
        <a class="list-card" href="candidati.html?lista=${encodeURIComponent(list.id)}" style="--list-color: ${escapeHtml(list.color)}">
          <span class="list-logo">
            <img src="${escapeHtml(list.logo || "assets/img/list-placeholder.svg")}" alt="Logo ${escapeHtml(list.name)}" loading="lazy">
          </span>
          <span>
            <h3>${escapeHtml(list.name)}</h3>
            <p>${escapeHtml(list.description || "Elenco candidati della lista.")}</p>
          </span>
        </a>
      `
    )
    .join("");
}

function renderProgram(program = []) {
  const target = document.querySelector("[data-program-grid]");
  if (!target) return;

  target.innerHTML = program
    .map(
      (item, index) => `
        <article class="program-item">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <p>${escapeHtml(item)}</p>
        </article>
      `
    )
    .join("");
}

function renderSocialLinks(social = []) {
  const socialTarget = document.querySelector("[data-social-links]");
  const footerTarget = document.querySelectorAll("[data-footer-social]");
  const icons = {
    Facebook: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M14.2 8.1V6.7c0-.7.5-.9.9-.9h2.2V2h-3.1c-3.5 0-4.4 2.6-4.4 4.3v1.8H7v3.8h2.8V22h4.4V11.9h3l.5-3.8h-3.5Z"></path>
      </svg>
    `,
    Instagram: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2.2a3.6 3.6 0 0 0-3.6 3.6v8.4a3.6 3.6 0 0 0 3.6 3.6h8.4a3.6 3.6 0 0 0 3.6-3.6V7.8a3.6 3.6 0 0 0-3.6-3.6H7.8Zm4.2 3.2a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 2.2a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8Zm5-2.6a1.1 1.1 0 1 1 0 2.2A1.1 1.1 0 0 1 17 7Z"></path>
      </svg>
    `,
    TikTok: `
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M16.4 2c.4 2.9 2 4.6 4.6 4.8v4.1a8.4 8.4 0 0 1-4.5-1.4v6.2c0 4-2.6 6.3-6.3 6.3-3.4 0-6.2-2.4-6.2-5.9 0-3.7 2.9-6 6.8-5.8v4.2c-1.7-.3-2.8.5-2.8 1.7 0 1.1.9 1.8 2.1 1.8 1.4 0 2.1-.8 2.1-2.6V2h4.2Z"></path>
      </svg>
    `
  };

  const iconFor = (item) => icons[item.name] || `<span>${escapeHtml(item.label)}</span>`;

  if (socialTarget) {
    socialTarget.innerHTML = social
      .map(
        (item) => `
          <a class="social-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="Apri ${escapeHtml(item.name)}">
            <span class="social-icon">${iconFor(item)}</span>
            <span class="sr-only">${escapeHtml(item.name)}</span>
          </a>
        `
      )
      .join("");
  }

  footerTarget.forEach((target) => {
    target.innerHTML = social
      .map(
        (item) => `
          <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer" aria-label="Apri ${escapeHtml(item.name)}">${iconFor(item)}<span class="sr-only">${escapeHtml(item.name)}</span></a>
        `
      )
      .join("");
  });
}

async function initShared() {
  setupNavigation();
  setupReveal();

  try {
    const data = await loadSiteData();
    renderCoalition(data.lists);
    renderProgram(data.program);
    renderSocialLinks(data.social);
    window.siteData = data;
    window.dispatchEvent(new CustomEvent("site-data-ready", { detail: data }));
  } catch (error) {
    console.error(error);
  }
}

function setupCookieBanner() {
  if (localStorage.getItem("cookie-consent")) return;

  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-label", "Informativa cookie");
  banner.innerHTML = `
    <div class="cookie-banner-inner">
      <p>Questo sito utilizza esclusivamente <strong>cookie tecnici</strong> necessari al funzionamento. Nessun cookie di profilazione viene utilizzato. Per saperne di più consulta la nostra <a href="privacy.html">Privacy&nbsp;Policy</a>.</p>
      <div class="cookie-banner-actions">
        <button type="button" class="btn btn-primary" id="cookie-accept">Accetta</button>
        <button type="button" class="btn btn-secondary" id="cookie-reject">Solo essenziali</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  function dismiss(value) {
    localStorage.setItem("cookie-consent", value);
    banner.remove();
  }

  banner.querySelector("#cookie-accept").addEventListener("click", () => dismiss("all"));
  banner.querySelector("#cookie-reject").addEventListener("click", () => dismiss("essential"));
}

document.addEventListener("DOMContentLoaded", () => {
  initShared();
  setupCookieBanner();
});
