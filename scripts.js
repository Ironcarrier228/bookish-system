// Версии 1.16–1.20
const versions = [
  {
    id: "1-20",
    title: "Minecraft 1.20 — Trails & Tales",
    date: "2023-06-07",
    tags: ["release", "vanilla"],
    image: "/images/1.20.png",
    note: "Версия с бамбуком, книжными полками, археологией и вишнёвыми биомами."
  },
  {
    id: "1-19",
    title: "Minecraft 1.19 — The Wild Update",
    date: "2022-06-07",
    tags: ["release", "warden"],
    image: "/images/1.19.png",
    note: "Глубокие тёмные биомы, древние города и хранитель (Warden)."
  },
  {
    id: "1-18",
    title: "Minecraft 1.18 — Caves & Cliffs: Part II",
    date: "2021-11-30",
    tags: ["release", "worldgen"],
    image: "/images/1.18.png",
    note: "Новый генератор мира, горы и пещеры на другом уровне."
  },
  {
    id: "1-17",
    title: "Minecraft 1.17 — Caves & Cliffs: Part I",
    date: "2021-06-08",
    tags: ["release", "mobs"],
    image: "/images/1.17.png",
    note: "Аметист, медь, аксолотли и козы — подготовка к крупным пещерам."
  },
  {
    id: "1-16",
    title: "Minecraft 1.16 — Nether Update",
    date: "2020-06-23",
    tags: ["release", "nether"],
    image: "/images/1.16.png",
    note: "Переработан Незер: биомы, пиглины, древние обломки и новые блоки."
  }
];

const grid = document.getElementById("version-grid");
const timeline = document.getElementById("timeline");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const themeToggleBtn = document.querySelector(".theme-toggle");

// Рендер
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

  // View Transitions при перестроении
  const updateUI = () => {
    grid.innerHTML = filtered.map(v => cardHTML(v)).join("");
    timeline.innerHTML = filtered
      .slice()
      .sort((a,b) => b.date.localeCompare(a.date))
      .map(v => timelineItemHTML(v))
      .join("");

    // События
    [...document.querySelectorAll(".card")].forEach(el => {
      el.addEventListener("click", () => openModal(el.dataset.id));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openModal(el.dataset.id);
      });
    });
  };

  if (document.startViewTransition) {
    document.startViewTransition(updateUI);
  } else {
    updateUI();
  }
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

// Модалка
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
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.open) modal.close(); });

// Тема: auto/light/dark с localStorage
function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "auto";
  applyTheme(saved);
}
initTheme();

themeToggleBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme") || "auto";
  const next = current === "auto" ? "dark" : current === "dark" ? "light" : "auto";
  applyTheme(next);
  localStorage.setItem("theme", next);
});

// Поиск/сортировка
searchInput.addEventListener("input", render);
sortSelect.addEventListener("change", render);

// Инициализация
render();
