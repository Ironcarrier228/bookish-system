const versions = [
  {
    id: "1-20-5",
    title: "Minecraft 1.20.5 — Trails & Tales",
    date: "2024-05-07",
    tags: ["release", "vanilla"],
    image: "/images/1-20-5.png",
    note: "Улучшения блокады и исправления стабильности."
  },
  {
    id: "1-21",
    title: "Minecraft 1.21 — Combat tweaks",
    date: "2024-11-12",
    tags: ["snapshot", "combat"],
    image: "/images/1-21.png",
    note: "Тест боевой механики и баланс предметов."
  },
  // Добавь свои версии здесь
];

const grid = document.getElementById("version-grid");
const timeline = document.getElementById("timeline");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");

function render() {
  const query = searchInput.value.trim().toLowerCase();
  const sort = sortSelect.value;

  let filtered = versions.filter(v => {
    const text = `${v.title} ${v.id} ${v.tags.join(" ")}`.toLowerCase();
    return !query || text.includes(query);
  });

  if (sort === "newest") filtered.sort((a,b) => b.date.localeCompare(a.date));
  if (sort === "oldest") filtered.sort((a,b) => a.date.localeCompare(b.date));
  if (sort === "name")   filtered.sort((a,b) => a.title.localeCompare(b.title));

  grid.innerHTML = filtered.map(v => cardHTML(v)).join("");
  timeline.innerHTML = filtered
    .slice() // копия
    .sort((a,b) => b.date.localeCompare(a.date))
    .map(v => timelineItemHTML(v))
    .join("");

  // Привязка событий
  [...document.querySelectorAll(".card")].forEach(el => {
    el.addEventListener("click", () => openModal(el.dataset.id));
  });
}
function cardHTML(v) {
  return `
    <article class="card" data-id="${v.id}" tabindex="0">
      <img class="card-media" src="${v.image}" alt="Скриншот версии ${v.title}">
      <div class="card-body">
        <h3 class="card-title">${v.title}</h3>
        <div class="card-meta">
          <span class="badge" title="Дата">${new Date(v.date).toLocaleDateString()}</span>
          <span class="badge" title="Теги">${v.tags.join(", ")}</span>
        </div>
      </div>
    </article>
  `;
}
function timelineItemHTML(v) {
  return `
    <li>
      <div class="item-title">${v.title}</div>
      <div class="item-note">${new Date(v.date).toLocaleDateString()} — ${v.note}</div>
    </li>
  `;
}

function openModal(id) {
  const v = versions.find(x => x.id === id);
  if (!v) return;
  modalBody.innerHTML = `
    <h3 style="margin-top:0">${v.title}</h3>
    <img class="card-media" src="${v.image}" alt="Скриншот версии ${v.title}">
    <p style="margin:12px 0">${v.note}</p>
    <div class="card-meta">
      <span class="badge">${new Date(v.date).toLocaleDateString()}</span>
      <span class="badge">${v.tags.join(", ")}</span>
    </div>
  `;
  modal.showModal();
}
document.querySelector(".modal-close").addEventListener("click", () => modal.close());
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.open) modal.close();
});
document.querySelector(".theme-toggle").addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("light");
  // Можно расширить хранение темы в localStorage
});

searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

// Инициализация
render();
