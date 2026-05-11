let activeList = new URLSearchParams(window.location.search).get("lista") || "all";
let searchTerm = "";

function candidateListName(candidate, lists) {
  return lists.find((list) => list.id === candidate.listId)?.name || "Lista da inserire";
}

function candidateList(candidate, lists) {
  return lists.find((list) => list.id === candidate.listId) || {
    name: "Lista da inserire",
    color: "#d1a437"
  };
}

function renderFilters(lists) {
  const target = document.querySelector("[data-list-filters]");
  if (!target) return;

  const buttons = [
    { id: "all", name: "Tutte le liste" },
    ...lists.map((list) => ({ id: list.id, name: list.name }))
  ];

  target.innerHTML = buttons
    .map(
      (item) => `
        <button type="button" class="${item.id === activeList ? "is-active" : ""}" data-filter="${escapeHtml(item.id)}">
          ${escapeHtml(item.name)}
        </button>
      `
    )
    .join("");

  target.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;

    activeList = button.dataset.filter;
    const params = new URLSearchParams(window.location.search);
    if (activeList === "all") {
      params.delete("lista");
    } else {
      params.set("lista", activeList);
    }
    const query = params.toString();
    window.history.replaceState({}, "", query ? `?${query}` : window.location.pathname);
    renderCandidates(window.siteData);
  });
}

function candidateMatches(candidate, lists) {
  const listName = candidateListName(candidate, lists);
  const matchesList = activeList === "all" || candidate.listId === activeList;
  const haystack = `${candidate.name} ${listName}`.toLowerCase();
  const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase());
  return matchesList && matchesSearch;
}

function renderCandidates(data) {
  const grid = document.querySelector("[data-candidates-grid]");
  const count = document.querySelector("[data-result-count]");
  const filterTarget = document.querySelector("[data-list-filters]");
  if (!grid || !data) return;

  const filtered = data.candidates.filter((candidate) => candidateMatches(candidate, data.lists));

  if (filterTarget) {
    filterTarget.querySelectorAll("[data-filter]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.filter === activeList);
    });
  }

  if (count) {
    count.textContent = `${filtered.length} nomi visualizzati`;
  }

  grid.innerHTML = filtered.length
    ? filtered
        .map((candidate) => {
          const list = candidateList(candidate, data.lists);
          const cvLink = candidate.cv
            ? `<a class="doc-link doc-link--cv" href="${escapeHtml(candidate.cv)}" target="_blank" rel="noopener noreferrer" aria-label="Apri curriculum di ${escapeHtml(candidate.name)}">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm4 18H6V4h7v5h5v11ZM8 15h8v1.5H8V15Zm0-3h8v1.5H8V12Zm0-3h4v1.5H8V9Z"/></svg>
                CV
              </a>`
            : "";
          const casellarioLink = candidate.casellario
            ? `<a class="doc-link doc-link--casellario" href="${escapeHtml(candidate.casellario)}" target="_blank" rel="noopener noreferrer" aria-label="Apri casellario giudiziario di ${escapeHtml(candidate.name)}">
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm-1 14-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6Z"/></svg>
                Casellario
              </a>`
            : "";
          const hasDocs = cvLink || casellarioLink;
          return `
            <article class="candidate-card candidate-card--name" style="--list-color: ${escapeHtml(list.color)}">
              <span class="candidate-number">${escapeHtml(candidate.order || "")}</span>
              <div class="candidate-body">
                <span class="candidate-list">${escapeHtml(list.name)}</span>
                <h3>${escapeHtml(candidate.name)}</h3>
                ${hasDocs ? `<div class="candidate-docs">${cvLink}${casellarioLink}</div>` : ""}
              </div>
            </article>
          `;
        })
        .join("")
    : `<p class="empty-state">Nessun candidato trovato con i filtri selezionati.</p>`;
}

function setupCandidateSearch() {
  const input = document.querySelector("[data-candidate-search]");
  if (!input) return;

  input.addEventListener("input", (event) => {
    searchTerm = event.target.value.trim();
    renderCandidates(window.siteData);
  });
}

window.addEventListener("site-data-ready", (event) => {
  renderFilters(event.detail.lists);
  setupCandidateSearch();
  renderCandidates(event.detail);
});
