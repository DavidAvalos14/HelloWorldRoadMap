const DATA_URL = "sessions.json";

const teamPresenters = ["David", "Alfredo", "Isaac", "Nano", "Samce", "Brian"];

const fallbackSessions = [
  { topic: "Arrays & Hashing", presenter: "Brian", date: "2026-03-27", status: "Programado", notes: "Asignado desde pizarron" },
  { topic: "Two Pointers", presenter: "David", date: "2026-03-30", status: "Programado", notes: "Asignado desde pizarron" },
  { topic: "Stack", presenter: "Nano", date: "2026-04-06", status: "Programado", notes: "Asignado desde pizarron" },
  { topic: "Binary Search", presenter: "Nano", date: "2026-04-06", status: "Programado", notes: "Asignado desde pizarron" },
  { topic: "Sliding Window", presenter: "Isaac", date: "2026-04-10", status: "Programado", notes: "Asignado desde pizarron" },
  { topic: "Linked List", presenter: "Alfredo", date: "2026-04-17", status: "Programado", notes: "Asignado desde pizarron" },
  { topic: "Trees", presenter: "Samce", date: "2026-04-24", status: "Programado", notes: "Asignado desde pizarron" }
];

const searchInput = document.getElementById("search");
const filterPresenterInput = document.getElementById("filter-presenter");
const filterStatusInput = document.getElementById("filter-status");
const reloadButton = document.getElementById("reload-json");
const statusLabel = document.getElementById("json-status");

const statsContainer = document.getElementById("stats");
const presenterLoadContainer = document.getElementById("presenter-load");
const sessionBody = document.getElementById("session-body");
const timelineContainer = document.getElementById("timeline");
const rowTemplate = document.getElementById("session-row-template");

let sessions = [];

init();

async function init() {
  searchInput.addEventListener("input", renderAll);
  filterPresenterInput.addEventListener("change", renderAll);
  filterStatusInput.addEventListener("change", renderAll);
  reloadButton.addEventListener("click", loadSharedSessions);

  fillPresenterFilter();
  await loadSharedSessions();
}

async function loadSharedSessions() {
  statusLabel.textContent = "Cargando sessions.json...";

  try {
    const response = await fetch(`${DATA_URL}?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const parsed = await response.json();
    sessions = normalizeSessions(parsed);
    statusLabel.textContent = `Datos compartidos cargados: ${sessions.length} temas.`;
  } catch (error) {
    sessions = normalizeSessions(fallbackSessions);
    statusLabel.textContent = "No se pudo cargar sessions.json. Mostrando datos base.";
    console.error("Error cargando sessions.json:", error);
  }

  fillPresenterFilter();
  renderAll();
}

function normalizeSessions(rawSessions) {
  if (!Array.isArray(rawSessions)) {
    return [];
  }

  return rawSessions
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const topic = typeof item.topic === "string" ? item.topic.trim() : "";
      const presenter = typeof item.presenter === "string" ? item.presenter.trim() : "Por asignar";
      const date = typeof item.date === "string" ? item.date : "";
      const status = ["Pendiente", "Programado", "Completado"].includes(item.status)
        ? item.status
        : "Pendiente";
      const notes = typeof item.notes === "string" ? item.notes.trim() : "";

      return {
        id: crypto.randomUUID(),
        topic,
        presenter,
        date,
        status,
        notes
      };
    })
    .filter((item) => item.topic);
}

function fillPresenterFilter() {
  const presenters = Array.from(new Set(teamPresenters));

  sessions
    .map((session) => session.presenter)
    .filter((name) => Boolean(name) && name !== "Por asignar")
    .forEach((name) => {
      if (!presenters.includes(name)) {
        presenters.push(name);
      }
    });

  presenters.sort((a, b) => a.localeCompare(b, "es"));

  const previous = filterPresenterInput.value || "Todos";
  filterPresenterInput.innerHTML = ["Todos", ...presenters]
    .map((name) => {
      const label = name === "Todos" ? "Todos los expositores" : name;
      return `<option value="${name}">${label}</option>`;
    })
    .join("");

  if (["Todos", ...presenters].includes(previous)) {
    filterPresenterInput.value = previous;
  }
}

function getFilteredSessions() {
  const query = searchInput.value.trim().toLowerCase();
  const byPresenter = filterPresenterInput.value;
  const byStatus = filterStatusInput.value;

  return sessions
    .filter((session) => {
      const matchTopic = session.topic.toLowerCase().includes(query);
      const matchPresenter = byPresenter === "Todos" || session.presenter === byPresenter;
      const matchStatus = byStatus === "Todos" || session.status === byStatus;
      return matchTopic && matchPresenter && matchStatus;
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return a.topic.localeCompare(b.topic, "es");
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });
}

function renderAll() {
  const visibleSessions = getFilteredSessions();
  renderStats();
  renderPresenterLoad();
  renderTable(visibleSessions);
  renderTimeline(visibleSessions);
}

function renderStats() {
  const total = sessions.length;
  const planned = sessions.filter((session) => session.status === "Programado").length;
  const completed = sessions.filter((session) => session.status === "Completado").length;

  statsContainer.innerHTML = `
    <article class="stat-card">
      <p>Total temas</p>
      <strong>${total}</strong>
    </article>
    <article class="stat-card">
      <p>Programados</p>
      <strong>${planned}</strong>
    </article>
    <article class="stat-card">
      <p>Completados</p>
      <strong>${completed}</strong>
    </article>
  `;
}

function renderPresenterLoad() {
  const countByPresenter = sessions.reduce((acc, session) => {
    if (!session.presenter || session.presenter === "Por asignar") {
      return acc;
    }
    acc[session.presenter] = (acc[session.presenter] || 0) + 1;
    return acc;
  }, {});

  const entries = Object.entries(countByPresenter).sort((a, b) => b[1] - a[1]);
  if (!entries.length) {
    presenterLoadContainer.innerHTML = '<div class="empty">Aun no hay expositores registrados.</div>';
    return;
  }

  const max = Math.max(...entries.map((entry) => entry[1]));
  presenterLoadContainer.innerHTML = entries
    .map(([name, count]) => {
      const width = Math.round((count / max) * 100);
      return `
        <div class="presenter-row">
          <span>${name}</span>
          <div class="bar"><span style="width: ${width}%"></span></div>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join("");
}

function renderTable(items) {
  sessionBody.innerHTML = "";

  if (!items.length) {
    sessionBody.innerHTML = `
      <tr>
        <td colspan="5">
          <div class="empty">No hay resultados para este filtro.</div>
        </td>
      </tr>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();
  items.forEach((session) => {
    const row = rowTemplate.content.firstElementChild.cloneNode(true);
    row.querySelector(".topic-cell").textContent = session.topic;
    row.querySelector(".presenter-cell").textContent = session.presenter || "Por asignar";
    row.querySelector(".date-cell").textContent = session.date ? formatDate(session.date) : "Sin fecha";
    row.querySelector(".status-cell").innerHTML = `<span class="pill ${session.status}">${session.status}</span>`;
    row.querySelector(".notes-cell").textContent = session.notes || "-";
    fragment.appendChild(row);
  });

  sessionBody.appendChild(fragment);
}

function renderTimeline(items) {
  const upcoming = items.filter((item) => item.date).slice(0, 6);

  if (!upcoming.length) {
    timelineContainer.innerHTML = '<div class="empty">Agrega fechas en sessions.json para ver la agenda.</div>';
    return;
  }

  timelineContainer.innerHTML = upcoming
    .map(
      (item) => `
      <article class="timeline-item">
        <strong>${item.topic}</strong>
        <p class="meta">${formatDate(item.date)} | ${item.presenter || "Por asignar"} | ${item.status}</p>
      </article>
    `
    )
    .join("");
}

function formatDate(isoDate) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(`${isoDate}T00:00:00`));
}
