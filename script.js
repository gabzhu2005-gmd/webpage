const root = document.documentElement;
const body = document.body;
const siteIndex = document.querySelector(".site-index");
const portalMenu = document.querySelector(".portal-menu");
const portalTrigger = document.querySelector(".portal-trigger");
const routeLinks = [...document.querySelectorAll("[data-route]")];
const views = [...document.querySelectorAll("[data-view]")];

const routeLabels = {
  home: "01 / 05",
  archive: "ARCHIVE",
  notes: "NOTES",
  breathe: "BREATHE",
};

function currentRoute() {
  const route = window.location.hash.replace("#", "");
  return routeLabels[route] ? route : "home";
}

function closePortal() {
  portalMenu.classList.remove("is-open");
  portalTrigger.setAttribute("aria-expanded", "false");
}

function showRoute(route, shouldScroll = true) {
  const nextRoute = routeLabels[route] ? route : "home";
  views.forEach((view) => {
    const active = view.dataset.view === nextRoute;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
  routeLinks.forEach((link) => link.classList.toggle("is-active", link.dataset.route === nextRoute));
  body.dataset.route = nextRoute;
  siteIndex.textContent = routeLabels[nextRoute];
  document.title = nextRoute === "home"
    ? "The Difficulty of Saying I Love You"
    : `${routeLabels[nextRoute]} — The Difficulty of Saying I Love You`;
  if (portalMenu.contains(document.activeElement)) document.activeElement.blur();
  closePortal();
  if (shouldScroll) window.scrollTo({ top: 0, behavior: "instant" });
}

portalTrigger.addEventListener("click", () => {
  const open = portalMenu.classList.toggle("is-open");
  portalTrigger.setAttribute("aria-expanded", String(open));
});

document.addEventListener("click", (event) => {
  if (!portalMenu.contains(event.target)) closePortal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePortal();
});

window.addEventListener("hashchange", () => showRoute(currentRoute()));
showRoute(currentRoute(), false);

const hero = document.querySelector(".hero");
const enterButton = document.querySelector(".enter-button");
let spotlightLocked = false;

function moveSpotlight(clientX, clientY) {
  const rect = hero.getBoundingClientRect();
  const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
  const y = Math.max(0, Math.min(rect.height, clientY - rect.top));
  root.style.setProperty("--spot-x", `${x}px`);
  root.style.setProperty("--spot-y", `${y}px`);
}

hero.addEventListener("pointermove", (event) => {
  if (!spotlightLocked) moveSpotlight(event.clientX, event.clientY);
});

hero.addEventListener("pointerdown", (event) => {
  if (event.target.closest(".enter-button")) return;
  spotlightLocked = !spotlightLocked;
  moveSpotlight(event.clientX, event.clientY);
  hero.classList.toggle("is-locked", spotlightLocked);
});

enterButton.addEventListener("click", () => {
  document.querySelector("#contradiction").scrollIntoView({ behavior: "smooth" });
});

const sections = [...document.querySelectorAll(".view-home [data-index]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    if (currentRoute() !== "home") return;
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) siteIndex.textContent = `${visible.target.dataset.index} / 05`;
  },
  { threshold: [0.22, 0.5, 0.72] },
);
sections.forEach((section) => sectionObserver.observe(section));

const contradiction = document.querySelector(".contradiction");
const wordSwitch = document.querySelector(".word-switch");
const wrongSaid = document.querySelector(".wrong-said");
const wrongMeant = document.querySelector(".wrong-meant");
const wrongTranslation = document.querySelector(".wrong-translation");
const wordPairs = [
  { said: "LEAVE ME ALONE.", meant: "ARE YOU HOME YET?", translation: "真正想问的是：你到家了吗？" },
  { said: "I DON'T CARE.", meant: "I WAS WORRIED.", translation: "藏在后面的是：我其实很担心你。" },
  { said: "WHATEVER.", meant: "PLEASE TAKE CARE.", translation: "没有说完整的是：请照顾好自己。" },
  { said: "DON'T WAIT UP.", meant: "LEAVE A LIGHT ON.", translation: "真正期待的是：给我留一盏灯。" },
];
let wordPairIndex = 0;
let showingMeaning = false;

wordSwitch.addEventListener("click", () => {
  showingMeaning = !showingMeaning;
  contradiction.classList.toggle("is-revealed", showingMeaning);
  wordSwitch.setAttribute("aria-pressed", String(showingMeaning));
  if (!showingMeaning) {
    wordPairIndex = (wordPairIndex + 1) % wordPairs.length;
    window.setTimeout(() => {
      const pair = wordPairs[wordPairIndex];
      wrongSaid.textContent = pair.said;
      wrongMeant.textContent = pair.meant;
      wrongTranslation.textContent = pair.translation;
    }, 260);
  }
});

const prologue = document.querySelector(".prologue");
const prologueObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  }),
  { threshold: 0.08 },
);
prologueObserver.observe(prologue);
document.querySelectorAll(".fragment").forEach((fragment) => prologueObserver.observe(fragment));

const geometry = document.querySelector(".geometry");
const geometryStage = document.querySelector(".geometry-stage");
const threadPull = document.querySelector("#thread-pull");
const threadOutput = document.querySelector(".thread-output");

function updateThreadPull() {
  const value = Number(threadPull.value);
  geometry.style.setProperty("--pull", value);
  geometryStage.classList.toggle("is-released", value >= 72);
  threadOutput.textContent = `${value}%`;
}
threadPull.addEventListener("input", updateThreadPull);
updateThreadPull();

const finale = document.querySelector(".finale");
const actionSvg = document.querySelector(".action-thread");
const actionLine = actionSvg.querySelector("line");
const actionWords = [...document.querySelectorAll(".action-words button")];

function setActionThread(target) {
  const sectionRect = finale.getBoundingClientRect();
  const targetRect = target.getBoundingClientRect();
  actionSvg.setAttribute("viewBox", `0 0 ${sectionRect.width} ${sectionRect.height}`);
  actionLine.setAttribute("x1", sectionRect.width / 2);
  actionLine.setAttribute("y1", sectionRect.height * 0.48);
  actionLine.setAttribute("x2", targetRect.left - sectionRect.left + targetRect.width / 2);
  actionLine.setAttribute("y2", targetRect.top - sectionRect.top + targetRect.height / 2);
}

actionWords.forEach((word) => {
  ["pointerenter", "focus", "click", "pointerdown"].forEach((eventName) => {
    word.addEventListener(eventName, () => setActionThread(word));
  });
});

const againButton = document.querySelector(".again-button");
const echoContainer = document.querySelector(".love-echoes");
const againStatus = document.querySelector(".again-status");
const echoPositions = [[8, 18, -8], [68, 12, 5], [17, 44, 4], [74, 39, -4], [43, 58, 8], [6, 73, -3], [68, 76, 6], [35, 88, -6]];
let echoCount = 0;

againButton.addEventListener("click", () => {
  const [left, top, rotation] = echoPositions[echoCount % echoPositions.length];
  const echo = document.createElement("span");
  echo.className = "love-echo";
  echo.textContent = "I LOVE YOU";
  echo.style.left = `${left}%`;
  echo.style.top = `${top}%`;
  echo.style.rotate = `${rotation}deg`;
  echoContainer.append(echo);
  echoCount += 1;
  againStatus.textContent = `I love you, repeated ${echoCount} ${echoCount === 1 ? "time" : "times"}.`;
  if (echoContainer.children.length > echoPositions.length * 2) echoContainer.firstElementChild.remove();
});

window.addEventListener("resize", () => {
  const activeWord = document.activeElement?.closest?.(".action-words button");
  if (activeWord) setActionThread(activeWord);
});

const archiveFilters = [...document.querySelectorAll(".archive-controls button")];
const archiveCards = [...document.querySelectorAll(".archive-card")];
archiveFilters.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    archiveFilters.forEach((item) => item.classList.toggle("is-active", item === button));
    archiveCards.forEach((card) => card.classList.toggle("is-filtered", filter !== "all" && card.dataset.medium !== filter));
  });
});

const NOTES_KEY = "love-buffer-notes-v1";
const noteForm = document.querySelector(".note-form");
const noteText = document.querySelector("#note-text");
const characterCount = document.querySelector(".character-count");
const noteWall = document.querySelector(".note-wall");
const emptyWall = document.querySelector(".empty-wall");
const noteStatus = document.querySelector(".note-status");
const exportNotesButton = document.querySelector(".export-notes");
const clearNotesButton = document.querySelector(".clear-notes");
let notes = [];

try {
  notes = JSON.parse(localStorage.getItem(NOTES_KEY) || "[]");
  if (!Array.isArray(notes)) notes = [];
} catch {
  notes = [];
}

function persistNotes() {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

function formatNoteDate(value) {
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function renderNotes() {
  noteWall.querySelectorAll(".note-card").forEach((card) => card.remove());
  emptyWall.hidden = notes.length > 0;
  notes.forEach((note, index) => {
    const card = document.createElement("article");
    card.className = "note-card";
    card.dataset.color = note.color;
    card.style.setProperty("--note-rotate", `${((note.id % 7) - 3) * 0.45}deg`);
    const content = document.createElement("p");
    content.textContent = note.text;
    const footer = document.createElement("footer");
    const date = document.createElement("time");
    date.dateTime = note.createdAt;
    date.textContent = `${String(index + 1).padStart(2, "0")} · ${formatNoteDate(note.createdAt)}`;
    const remove = document.createElement("button");
    remove.className = "delete-note";
    remove.type = "button";
    remove.setAttribute("aria-label", "Remove this note");
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      notes = notes.filter((item) => item.id !== note.id);
      persistNotes();
      renderNotes();
      noteStatus.textContent = "Note removed.";
    });
    footer.append(date, remove);
    card.append(content, footer);
    noteWall.append(card);
  });
}

noteText.addEventListener("input", () => {
  characterCount.textContent = `${noteText.value.length} / 280`;
});

noteForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = noteText.value.trim();
  if (!text) return;
  const color = new FormData(noteForm).get("note-color") || "paper";
  notes.unshift({ id: Date.now(), text, color, createdAt: new Date().toISOString() });
  persistNotes();
  renderNotes();
  noteForm.reset();
  noteText.value = "";
  characterCount.textContent = "0 / 280";
  noteStatus.textContent = "Saved here, quietly.";
});

clearNotesButton.addEventListener("click", () => {
  if (!notes.length) return;
  if (!window.confirm("Clear every note from this device? This cannot be undone.")) return;
  notes = [];
  persistNotes();
  renderNotes();
  noteStatus.textContent = "The wall is clear.";
});

function wrapCanvasText(context, text, maxWidth) {
  const lines = [];
  text.split("\n").forEach((paragraph) => {
    const words = paragraph.split(/\s+/);
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (context.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
  });
  return lines;
}

exportNotesButton.addEventListener("click", async () => {
  if (!notes.length) {
    noteStatus.textContent = "Write one note before exporting.";
    return;
  }
  await document.fonts.ready;
  const canvas = document.querySelector(".export-canvas");
  const context = canvas.getContext("2d");
  const columns = notes.length === 1 ? 1 : 2;
  const cardWidth = columns === 1 ? 1180 : 680;
  const cardHeight = 390;
  const gap = 44;
  const rows = Math.ceil(notes.length / columns);
  canvas.width = 1600;
  canvas.height = Math.max(1100, 280 + rows * (cardHeight + gap));
  context.fillStyle = "#f5f4ef";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#11100f";
  context.font = '54px "PT Serif Caption", Georgia, serif';
  context.fillText("WORDS I COULD NOT SAY YET", 90, 105);
  context.fillStyle = "#7c7872";
  context.font = '22px "PT Serif Caption", Georgia, serif';
  context.fillText("A small archive of care · The Difficulty of Saying I Love You", 92, 150);
  notes.forEach((note, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const x = columns === 1 ? 210 : 90 + col * (cardWidth + gap);
    const y = 220 + row * (cardHeight + gap);
    const palette = note.color === "violet" ? ["#c67aca", "#11100f"] : note.color === "ink" ? ["#11100f", "#f5f4ef"] : ["#ebe8de", "#11100f"];
    context.fillStyle = "rgba(17,16,15,0.08)";
    context.fillRect(x + 12, y + 15, cardWidth, cardHeight);
    context.fillStyle = palette[0];
    context.fillRect(x, y, cardWidth, cardHeight);
    context.fillStyle = palette[1];
    context.font = '34px "PT Serif Caption", Georgia, serif';
    wrapCanvasText(context, note.text, cardWidth - 80).slice(0, 6).forEach((line, lineIndex) => {
      context.fillText(line, x + 40, y + 72 + lineIndex * 48);
    });
    context.globalAlpha = 0.58;
    context.font = '18px "PT Serif Caption", Georgia, serif';
    context.fillText(formatNoteDate(note.createdAt).toUpperCase(), x + 40, y + cardHeight - 38);
    context.globalAlpha = 1;
  });
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `love-notes-${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
    URL.revokeObjectURL(url);
    noteStatus.textContent = "Image exported.";
  }, "image/png");
});

renderNotes();

const breathSpace = document.querySelector(".breath-space");
const breathCue = document.querySelector(".breath-cue");
const breathTime = document.querySelector(".breath-time");
const breathStart = document.querySelector(".breath-start");
const breathReset = document.querySelector(".breath-reset");
const durationButtons = [...document.querySelectorAll(".duration-controls button")];
const soundToggle = document.querySelector(".sound-toggle");
let selectedSeconds = 60;
let remainingSeconds = selectedSeconds;
let breathRunning = false;
let timerId = null;
let lastTick = 0;
let cycleElapsed = 0;

function displayBreathTime() {
  const seconds = Math.max(0, Math.ceil(remainingSeconds));
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  breathTime.textContent = `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
  breathTime.dateTime = `PT${seconds}S`;
}

function updateBreathCue() {
  const phase = cycleElapsed % 12;
  breathCue.textContent = phase < 4 ? "INHALE" : phase < 6 ? "HOLD" : "EXHALE";
}

function stopBreathing(finished = false) {
  breathRunning = false;
  window.clearInterval(timerId);
  timerId = null;
  breathSpace.classList.remove("is-running");
  breathStart.textContent = remainingSeconds <= 0 ? "BEGIN AGAIN" : "CONTINUE";
  breathCue.textContent = finished ? "YOU ARE HERE" : "PAUSED";
}

function tickBreathing() {
  const now = performance.now();
  const delta = (now - lastTick) / 1000;
  lastTick = now;
  remainingSeconds -= delta;
  cycleElapsed += delta;
  updateBreathCue();
  displayBreathTime();
  if (remainingSeconds <= 0) {
    remainingSeconds = 0;
    displayBreathTime();
    stopBreathing(true);
  }
}

breathStart.addEventListener("click", () => {
  if (breathRunning) {
    stopBreathing();
    return;
  }
  if (remainingSeconds <= 0) {
    remainingSeconds = selectedSeconds;
    cycleElapsed = 0;
  }
  breathRunning = true;
  lastTick = performance.now();
  breathSpace.classList.add("is-running");
  breathStart.textContent = "PAUSE";
  updateBreathCue();
  timerId = window.setInterval(tickBreathing, 200);
});

function resetBreathing() {
  window.clearInterval(timerId);
  timerId = null;
  breathRunning = false;
  remainingSeconds = selectedSeconds;
  cycleElapsed = 0;
  breathSpace.classList.remove("is-running");
  breathCue.textContent = "READY";
  breathStart.textContent = "BEGIN";
  displayBreathTime();
}

breathReset.addEventListener("click", resetBreathing);
durationButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedSeconds = Number(button.dataset.minutes) * 60;
    durationButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    resetBreathing();
  });
});

let audioContext = null;
let ambientNodes = [];

function stopAmbient() {
  ambientNodes.forEach((node) => {
    try { node.stop?.(); } catch {}
    try { node.disconnect?.(); } catch {}
  });
  ambientNodes = [];
  if (audioContext) audioContext.close();
  audioContext = null;
  soundToggle.setAttribute("aria-pressed", "false");
  soundToggle.textContent = "AMBIENT TONE: OFF";
}

soundToggle.addEventListener("click", async () => {
  if (audioContext) {
    stopAmbient();
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    soundToggle.textContent = "AUDIO NOT AVAILABLE";
    return;
  }
  audioContext = new AudioContextClass();
  await audioContext.resume();
  const master = audioContext.createGain();
  master.gain.value = 0.028;
  master.connect(audioContext.destination);
  const toneA = audioContext.createOscillator();
  const toneB = audioContext.createOscillator();
  const toneBGain = audioContext.createGain();
  const lfo = audioContext.createOscillator();
  const lfoGain = audioContext.createGain();
  toneA.type = "sine";
  toneA.frequency.value = 174;
  toneB.type = "sine";
  toneB.frequency.value = 261;
  toneBGain.gain.value = 0.22;
  lfo.frequency.value = 0.083;
  lfoGain.gain.value = 0.008;
  toneA.connect(master);
  toneB.connect(toneBGain).connect(master);
  lfo.connect(lfoGain).connect(master.gain);
  [toneA, toneB, lfo].forEach((node) => node.start());
  ambientNodes = [toneA, toneB, toneBGain, lfo, lfoGain, master];
  soundToggle.setAttribute("aria-pressed", "true");
  soundToggle.textContent = "AMBIENT TONE: ON";
});

displayBreathTime();
