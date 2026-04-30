function renderAdminPanels(data) {
  const target = document.querySelector("[data-admin-panels]");
  if (!target) return;

  target.innerHTML = `
    <article class="data-panel">
      <h2>Liste</h2>
      <p>${data.lists.length} liste configurate.</p>
      <ul>
        ${data.lists.map((list) => `<li>${escapeHtml(list.name)} <code>${escapeHtml(list.id)}</code></li>`).join("")}
      </ul>
    </article>
    <article class="data-panel">
      <h2>Candidati</h2>
      <p>${data.candidates.length} nomi candidati configurati.</p>
      <ul>
        <li>Modifica nome, numero e lista in <code>assets/data/site-data.json</code>.</li>
        <li>Per aggiungere nuovi dettagli in futuro, puoi estendere ogni candidato con altri campi.</li>
      </ul>
    </article>
    <article class="data-panel">
      <h2>Programma e social</h2>
      <p>${data.program.length} punti programma configurati.</p>
      <ul>
        <li>Aggiorna le voci dell'array <code>program</code>.</li>
        <li>Aggiorna i link dell'array <code>social</code>.</li>
      </ul>
    </article>
  `;
}

window.addEventListener("site-data-ready", (event) => {
  renderAdminPanels(event.detail);
});
