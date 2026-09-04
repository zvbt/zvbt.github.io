const DEFAULT_DATA = {
  selected: 0,
  workspaces: [],
};

const ICON_CHOICES = [
  { c: "fa-solid fa-briefcase", l: "Work" },
  { c: "fa-solid fa-house", l: "Home" },
  { c: "fa-solid fa-user", l: "Personal" },
  { c: "fa-solid fa-code", l: "Code" },
  { c: "fa-solid fa-terminal", l: "Terminal" },
  { c: "fa-solid fa-bug", l: "Bug" },
  { c: "fa-solid fa-server", l: "Server" },
  { c: "fa-solid fa-database", l: "Database" },
  { c: "fa-solid fa-cloud", l: "Cloud" },
  { c: "fa-solid fa-gamepad", l: "Gaming" },
  { c: "fa-solid fa-dice", l: "Dice" },
  { c: "fa-solid fa-puzzle-piece", l: "Puzzle" },
  { c: "fa-solid fa-book", l: "Book" },
  { c: "fa-solid fa-graduation-cap", l: "School" },
  { c: "fa-solid fa-flask", l: "Science" },
  { c: "fa-solid fa-music", l: "Music" },
  { c: "fa-solid fa-film", l: "Film" },
  { c: "fa-solid fa-headphones", l: "Headphones" },
  { c: "fa-solid fa-camera", l: "Camera" },
  { c: "fa-solid fa-palette", l: "Design" },
  { c: "fa-solid fa-paintbrush", l: "Art" },
  { c: "fa-solid fa-cart-shopping", l: "Shopping" },
  { c: "fa-solid fa-wallet", l: "Wallet" },
  { c: "fa-solid fa-chart-line", l: "Finance" },
  { c: "fa-solid fa-plane", l: "Travel" },
  { c: "fa-solid fa-map", l: "Map" },
  { c: "fa-solid fa-compass", l: "Compass" },
  { c: "fa-solid fa-car", l: "Car" },
  { c: "fa-solid fa-bicycle", l: "Bike" },
  { c: "fa-solid fa-dumbbell", l: "Fitness" },
  { c: "fa-solid fa-heart-pulse", l: "Health" },
  { c: "fa-solid fa-mug-hot", l: "Coffee" },
  { c: "fa-solid fa-pizza-slice", l: "Food" },
  { c: "fa-solid fa-envelope", l: "Mail" },
  { c: "fa-solid fa-comments", l: "Chat" },
  { c: "fa-solid fa-bell", l: "Notifications" },
  { c: "fa-solid fa-calendar", l: "Calendar" },
  { c: "fa-solid fa-folder", l: "Folder" },
  { c: "fa-solid fa-tag", l: "Tag" },
  { c: "fa-solid fa-bookmark", l: "Bookmark" },
  { c: "fa-solid fa-star", l: "Star" },
  { c: "fa-solid fa-heart", l: "Heart" },
  { c: "fa-solid fa-globe", l: "Globe" },
  { c: "fa-solid fa-rocket", l: "Rocket" },
  { c: "fa-solid fa-lightbulb", l: "Ideas" },
  { c: "fa-solid fa-gear", l: "Settings" },
  { c: "fa-solid fa-shield", l: "Security" },
  { c: "fa-solid fa-lock", l: "Private" },
  { c: "fa-solid fa-users", l: "Team" },
  { c: "fa-solid fa-paw", l: "Pets" },
  { c: "fa-solid fa-leaf", l: "Nature" },
  { c: "fa-solid fa-cube", l: "3D" },
  { c: "fa-solid fa-layer-group", l: "Layers" },
  { c: "fa-solid fa-magic", l: "Magic" },
  { c: "fa-solid fa-anchor", l: "Anchor" },
  { c: "fa-solid fa-shapes", l: "Shapes" },
];

let iconMode = "icon";
let selectedIconClass = "";

function setIconMode(mode) {
  iconMode = mode;
  document
    .getElementById("iconModeIconBtn")
    .classList.toggle("active", mode === "icon");
  document
    .getElementById("iconModeUrlBtn")
    .classList.toggle("active", mode === "url");
  document.getElementById("iconModeIconPanel").hidden = mode !== "icon";
  document.getElementById("iconModeUrlPanel").hidden = mode !== "url";
  document.getElementById("iconGrid").hidden = true;
  if (mode === "url") document.getElementById("workspaceIconUrl").focus();
}
function toggleIconPicker() {
  const grid = document.getElementById("iconGrid");
  const show = grid.hidden;
  grid.hidden = !show;
  if (show) {
    renderIconGrid();
    document.getElementById("iconSearch").value = "";
    document.getElementById("iconSearch").focus();
  }
}
function renderIconGrid() {
  const q = document.getElementById("iconSearch").value.trim().toLowerCase();
  const items = ICON_CHOICES.filter(
    (ic) => !q || ic.l.toLowerCase().includes(q),
  );
  document.getElementById("iconGridItems").innerHTML =
    items
      .map(
        (ic) =>
          `<button type="button" class="icon-choice${ic.c === selectedIconClass ? " selected" : ""}" title="${esc(ic.l)}" onclick="pickIcon('${ic.c}','${esc(ic.l)}')"><i class="${ic.c}"></i></button>`,
      )
      .join("") || `<div class="icon-grid-empty">No icons found</div>`;
}
function pickIcon(cls, label) {
  selectedIconClass = cls;
  document.getElementById("iconPreview").innerHTML = `<i class="${cls}"></i>`;
  document.getElementById("iconPickerLabel").textContent = label;
  document.getElementById("iconGrid").hidden = true;
}
function resetIconPicker() {
  selectedIconClass = "";
  iconMode = "icon";
  document.getElementById("iconPreview").innerHTML =
    `<i class="fa-solid fa-shapes"></i>`;
  document.getElementById("iconPickerLabel").textContent = "Choose icon";
  document.getElementById("iconGrid").hidden = true;
  document.getElementById("workspaceIconUrl").value = "";
  document.getElementById("iconModeIconBtn").classList.add("active");
  document.getElementById("iconModeUrlBtn").classList.remove("active");
  document.getElementById("iconModeIconPanel").hidden = false;
  document.getElementById("iconModeUrlPanel").hidden = true;
}
function workspaceIconHtml(icon, name) {
  const letter = esc((name[0] || "?").toUpperCase());
  if (!icon) return letter;
  if (icon.startsWith("fa-")) return `<i class="${icon}"></i>`;
  return `<img src="${escAttr(icon)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${letter}'}))">`;
}

const STORAGE_KEY = "workspaceManagerData";

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return structuredClone(DEFAULT_DATA);
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.workspaces)) return structuredClone(DEFAULT_DATA);
    return {
      selected: Number.isInteger(parsed.selected) ? parsed.selected : 0,
      workspaces: parsed.workspaces,
    };
  } catch (e) {
    return structuredClone(DEFAULT_DATA);
  }
}

let data = loadData();

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save workspaces to localStorage", e);
  }
}

function exportJSON() {
  const out = {
    version: 1,
    workspaces: data.workspaces,
  };
  const blob = new Blob([JSON.stringify(out, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "workspaces.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importJSON() {
  document.getElementById("jsonFile").click();
}

async function handleImport(input) {
  const file = input.files[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const workspaces = Array.isArray(imported) ? imported : imported.workspaces;
    if (!Array.isArray(workspaces)) throw new Error("Missing workspaces array");
    if (
      !workspaces.every(
        (w) => w && typeof w.name === "string" && Array.isArray(w.links),
      )
    )
      throw new Error("Invalid workspace format");
    data.workspaces = workspaces.map((w) => ({
      name: w.name,
      icon: typeof w.icon === "string" ? w.icon : "",
      links: w.links
        .filter(
          (l) => l && typeof l.name === "string" && typeof l.url === "string",
        )
        .map((l) => ({ name: l.name, url: l.url })),
    }));
    data.selected = Math.max(
      0,
      Math.min(data.selected, data.workspaces.length - 1),
    );
    save();
    render();
  } catch (e) {
    alert("Invalid workspace JSON file.");
  } finally {
    input.value = "";
  }
}
function render() {
  const ws = document.getElementById("workspaces"),
    links = document.getElementById("links");
  ws.innerHTML = "";
  data.workspaces.forEach((w, i) => {
    const el = document.createElement("div");
    el.className = "workspace" + (i === data.selected ? " active" : "");
    const iconHtml = workspaceIconHtml(w.icon, w.name);
    el.innerHTML = `<span class="workspace-icon">${iconHtml}</span><span class="workspace-name">${esc(w.name)}</span><small>${w.links.length}</small><button class="del" title="Delete">×</button>`;
    el.onclick = (e) => {
      if (!e.target.classList.contains("del")) {
        data.selected = i;
        save();
        render();
      }
    };
    el.querySelector(".del").onclick = (e) => {
      e.stopPropagation();
      deleteWorkspace(i);
    };
    ws.appendChild(el);
  });
  if (!data.workspaces.length) {
    document.getElementById("title").textContent = "No workspace";
    document.getElementById("subtitle").textContent =
      "Create one to get started";
    links.innerHTML =
      '<div class="empty"><b>No workspaces</b>Create your first workspace.</div>';
    return;
  }
  const w = data.workspaces[data.selected];
  document.getElementById("title").textContent = w.name;
  document.getElementById("subtitle").textContent =
    `${w.links.length} link${w.links.length === 1 ? "" : "s"}`;
  links.innerHTML = w.links.length
    ? w.links
        .map((l, i) => {
          const host = new URL(l.url).hostname || "";
          const letter = esc((host[0] || "?").toUpperCase());
          const iconUrl = host
            ? `https://icons.duckduckgo.com/ip3/${encodeURIComponent(host)}.ico`
            : "";
          return `<div class="link" onclick="window.open('${escAttr(l.url)}','_blank','noopener,noreferrer')">
    <div class="favicon">${iconUrl ? `<img src="${escAttr(iconUrl)}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{textContent:'${letter}'}))">` : letter}</div>
    <div class="linkbody"><div class="linktitle">${esc(l.name)}</div><div class="url">${esc(l.url)}</div></div>
    <button onclick="event.stopPropagation();deleteLink(${i})" title="Delete">×</button>
  </div>`;
        })
        .join("")
    : '<div class="empty"><b>No links yet</b>Add links to this workspace.</div>';
}
function esc(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}
function escAttr(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
function openWorkspaceModal() {
  resetIconPicker();
  document.getElementById("workspaceModal").classList.add("show");
  document.getElementById("workspaceName").focus();
}
function openLinkModal() {
  if (!data.workspaces.length) return openWorkspaceModal();
  document.getElementById("linkModal").classList.add("show");
  document.getElementById("linkName").focus();
}
function closeModals() {
  document
    .querySelectorAll(".modal")
    .forEach((x) => x.classList.remove("show"));
}
function createWorkspace() {
  const n = document.getElementById("workspaceName").value.trim();
  if (!n) return;
  let icon = "";
  if (iconMode === "url") {
    const raw = document.getElementById("workspaceIconUrl").value.trim();
    if (raw) {
      icon = raw;
      try {
        if (!/^https?:\/\//i.test(icon)) icon = "https://" + icon;
        new URL(icon);
      } catch {
        return alert("Invalid icon image URL");
      }
    }
  } else {
    icon = selectedIconClass;
  }
  data.workspaces.push({ name: n, icon, links: [] });
  data.selected = data.workspaces.length - 1;
  save();
  document.getElementById("workspaceName").value = "";
  resetIconPicker();
  closeModals();
  render();
}
function createLink() {
  const n = document.getElementById("linkName").value.trim(),
    raw = document.getElementById("linkUrl").value.trim();
  if (!n || !raw) return;
  let url = raw;
  try {
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    new URL(url);
  } catch {
    return alert("Invalid URL");
  }
  data.workspaces[data.selected].links.push({ name: n, url });
  save();
  document.getElementById("linkName").value = "";
  document.getElementById("linkUrl").value = "";
  closeModals();
  render();
}
function deleteWorkspace(i) {
  if (!confirm(`Delete "${data.workspaces[i].name}"?`)) return;
  data.workspaces.splice(i, 1);
  data.selected = Math.max(
    0,
    Math.min(data.selected, data.workspaces.length - 1),
  );
  save();
  render();
}
function deleteLink(i) {
  data.workspaces[data.selected].links.splice(i, 1);
  save();
  render();
}
document.querySelectorAll(".modal").forEach(
  (m) =>
    (m.onclick = (e) => {
      if (e.target === m) closeModals();
    }),
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModals();
});
document.addEventListener("click", (e) => {
  const grid = document.getElementById("iconGrid"),
    toggle = document.getElementById("iconPickerToggle");
  if (!grid || grid.hidden) return;
  if (!grid.contains(e.target) && !toggle.contains(e.target))
    grid.hidden = true;
});
render();
