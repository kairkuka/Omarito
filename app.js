const stateKey = "omarito-prototype-state-v1";

const lessons = [
  {
    id: 1,
    phaseId: 1,
    title: "At a cafe",
    subtitle: "Order drinks and snacks",
    icon: "☕",
    blocks: [
      { id: "video", label: "Omarito video", route: "/lesson/1/video", icon: "▶" },
      { id: "vocabulary", label: "Vocabulary", route: "/lesson/1/vocabulary", icon: "🧠" },
      { id: "listening", label: "Listening", route: "/lesson/1/listening", icon: "🎧" },
      { id: "pronunciation", label: "Pronunciation", route: "/lesson/1/pronunciation", icon: "🔊" },
      { id: "speaking", label: "Speaking", route: "/lesson/1/speaking", icon: "🎙" },
      { id: "quiz", label: "Quiz", route: "/lesson/1/quiz", icon: "✓" },
      { id: "review", label: "Review", route: "/lesson/1/review", icon: "★" }
    ]
  },
  {
    id: 2,
    phaseId: 1,
    title: "Directions",
    subtitle: "Ask where things are",
    icon: "🗺",
    blocks: [
      { id: "video", label: "Street clip", route: "/lesson/2/video", icon: "▶" },
      { id: "vocabulary", label: "Place words", route: "/lesson/2/vocabulary", icon: "🧠" },
      { id: "quiz", label: "Quick check", route: "/lesson/2/quiz", icon: "✓" }
    ]
  },
  {
    id: 3,
    phaseId: 2,
    title: "Small talk",
    subtitle: "Make it sound natural",
    icon: "💬",
    blocks: [
      { id: "video", label: "Greeting clip", route: "/lesson/3/video", icon: "▶" },
      { id: "speaking", label: "Pronunciation", route: "/lesson/3/speaking", icon: "🎙" },
      { id: "quiz", label: "Recall", route: "/lesson/3/quiz", icon: "✓" }
    ]
  }
];

const phases = [
  { id: 1, title: "Phase 1", subtitle: "Everyday basics", route: "/phase/1" },
  { id: 2, title: "Phase 2", subtitle: "Sound more natural", route: "/phase/2" },
  { id: 3, title: "Phase 3", subtitle: "Fast native phrases", route: "/phase/3" }
];

const feedItems = [
  {
    lessonId: 1,
    route: "/lesson/1/video",
    media: "",
    caption: "Instead of very clean, say spotless",
    title: "Appearance intensifiers",
    likes: "1.2K",
    comments: "489",
    shares: "67"
  },
  {
    lessonId: 1,
    route: "/lesson/1/video?mode=question",
    media: "order",
    caption: "Can I get a coffee, please?",
    title: "Cafe request",
    likes: "932",
    comments: "144",
    shares: "28"
  },
  {
    lessonId: 1,
    route: "/lesson/1/pronunciation",
    media: "",
    caption: "Make please softer at the end",
    title: "Pronunciation mini-lesson",
    likes: "781",
    comments: "98",
    shares: "35"
  }
];

const lessonCopy = {
  1: {
    phrase: "Can I get a coffee, please?",
    prompt: "What did Omarito ask for?",
    answer: "coffee",
    softWord: "please",
    vocab: [["coffee", "Drink made from beans"], ["tea", "Another drink"], ["bill", "Payment request"]]
  },
  2: {
    phrase: "Where is the station?",
    prompt: "What place did Omarito ask for?",
    answer: "station",
    softWord: "where",
    vocab: [["station", "Train or metro place"], ["street", "Road in a city"], ["corner", "Place where roads meet"]]
  },
  3: {
    phrase: "How's it going?",
    prompt: "Which greeting did Omarito use?",
    answer: "going",
    softWord: "how's",
    vocab: [["going", "Casual greeting word"], ["great", "Positive answer"], ["busy", "Common small-talk reply"]]
  }
};

const explorerGroups = [
  {
    title: "Onboarding",
    links: [
      ["Welcome", "/"],
      ["Language", "/onboarding/language"],
      ["Goal", "/onboarding/goal"],
      ["Level", "/onboarding/level"],
      ["Omarito Intro", "/onboarding/intro"],
      ["First Completion", "/onboarding/complete"]
    ]
  },
  {
    title: "Home",
    links: [
      ["Feed", "/feed"],
      ["Home", "/home"],
      ["Journey", "/journey"],
      ["Phase 1", "/phase/1"],
      ["Phase 2 Locked", "/phase/2"],
      ["Lesson Overview", "/lesson/1"],
      ["Loading", "/loading"],
      ["Modal Sheet", "/modal-demo"]
    ]
  },
  {
    title: "Learning",
    links: [
      ["Video", "/lesson/1/video"],
      ["Video + Question", "/lesson/1/video?mode=question"],
      ["Video + Vocab", "/lesson/1/video?mode=vocabulary"],
      ["Video Explain", "/lesson/1/video?mode=explanation"],
      ["Video Completed", "/lesson/1/video-completed"],
      ["Next Transition", "/lesson/1/transition"],
      ["Vocabulary", "/lesson/1/vocabulary"],
      ["Word Recall", "/lesson/1/vocabulary?mode=recall"],
      ["Translation", "/lesson/1/vocabulary?mode=translate"],
      ["Review", "/lesson/1/review"]
    ]
  },
  {
    title: "Exercises",
    links: [
      ["Listening Choice", "/lesson/1/listening?mode=choice"],
      ["Listening Typing", "/lesson/1/listening?mode=typing"],
      ["Pronunciation", "/lesson/1/pronunciation"],
      ["Speaking Listen", "/lesson/1/speaking"],
      ["Recording", "/lesson/1/speaking?state=recording"],
      ["Processing", "/lesson/1/speaking?state=processing"],
      ["Result", "/lesson/1/speaking?state=result"],
      ["Quiz Choice", "/lesson/1/quiz?type=choice"],
      ["Fill Blank", "/lesson/1/quiz?type=fill"],
      ["Translation Quiz", "/lesson/1/quiz?type=translation"],
      ["Matching", "/lesson/1/quiz?type=matching"],
      ["Ordering", "/lesson/1/quiz?type=ordering"]
    ]
  },
  {
    title: "Progress + Account",
    links: [
      ["Progress", "/progress"],
      ["Lesson Complete", "/lesson/1/complete"],
      ["Phase Complete", "/phase/1/complete"],
      ["Achievement", "/achievement"],
      ["Profile", "/profile"],
      ["Settings", "/settings"]
    ]
  }
];

const defaultState = {
  language: "Spanish",
  goal: "Travel",
  level: "Starter",
  streak: 21,
  points: 1000,
  completed: [],
  selectedAnswers: {},
  typedAnswers: {},
  audioPlaying: "",
  recordingState: "idle",
  recordingMode: "",
  recordingMs: 0,
  recordingError: "",
  notifications: true,
  sound: true,
  haptics: true,
  autoplay: false,
  dailyGoal: "10 min"
};

let appState = loadState();
let typingRenderTimer;
let activeUtterance;
let mediaRecorder;
let recordingStream;
let recordingTimer;
let recordingStartedAt = 0;
let recordedChunks = [];
let lastRecordingUrl = "";

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(stateKey));
    return saved ? { ...defaultState, ...saved, audioPlaying: "" } : { ...defaultState };
  } catch {
    return { ...defaultState };
  }
}

function saveState() {
  localStorage.setItem(stateKey, JSON.stringify(appState));
}

function resetState() {
  appState = { ...defaultState, completed: [], selectedAnswers: {}, typedAnswers: {} };
  saveState();
  navigate("/prototype");
}

function navigate(path) {
  history.pushState({}, "", path);
  render();
}

window.addEventListener("popstate", render);

let touchStartY = 0;
let touchStartX = 0;
let pointerStartY = 0;
let pointerStartX = 0;
let wheelSwipeLocked = false;

document.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  touchStartY = touch.clientY;
  touchStartX = touch.clientX;
}, { passive: true });

document.addEventListener("touchend", (event) => {
  const screen = event.target.closest("[data-swipe-next]");
  if (!screen) return;
  const touch = event.changedTouches[0];
  const deltaY = touchStartY - touch.clientY;
  const deltaX = Math.abs(touchStartX - touch.clientX);
  if (deltaY > 72 && deltaX < 90) navigate(screen.dataset.swipeNext);
}, { passive: true });

document.addEventListener("pointerdown", (event) => {
  pointerStartY = event.clientY;
  pointerStartX = event.clientX;
});

document.addEventListener("pointerup", (event) => {
  const screen = event.target.closest("[data-swipe-next]");
  if (!screen) return;
  const deltaY = pointerStartY - event.clientY;
  const deltaX = Math.abs(pointerStartX - event.clientX);
  if (deltaY > 72 && deltaX < 90) navigate(screen.dataset.swipeNext);
});

document.addEventListener("wheel", (event) => {
  const screen = event.target.closest("[data-swipe-next]");
  if (!screen || wheelSwipeLocked || event.deltaY < 80) return;
  wheelSwipeLocked = true;
  navigate(screen.dataset.swipeNext);
  window.setTimeout(() => {
    wheelSwipeLocked = false;
  }, 650);
}, { passive: true });

document.addEventListener("click", (event) => {
  const link = event.target.closest("[data-link]");
  if (link) {
    event.preventDefault();
    navigate(link.dataset.link);
    return;
  }

  const action = event.target.closest("[data-action]");
  if (!action) return;
  handleAction(action).catch((error) => {
    console.error(error);
  });
});

document.addEventListener("input", (event) => {
  const input = event.target.closest("[data-type-answer]");
  if (!input) return;
  appState.typedAnswers[input.dataset.typeAnswer] = input.value;
  saveState();
  window.clearTimeout(typingRenderTimer);
  typingRenderTimer = window.setTimeout(render, 180);
});

async function handleAction(action) {
  const name = action.dataset.action;
  const value = action.dataset.value;

  if (name === "reset") {
    resetState();
    return;
  }

  if (name === "set-language") {
    appState.language = value;
    saveState();
    render();
    return;
  }

  if (name === "set-goal") {
    appState.goal = value;
    saveState();
    render();
    return;
  }

  if (name === "set-level") {
    appState.level = value;
    saveState();
    render();
    return;
  }

  if (name === "select-answer") {
    appState.selectedAnswers[action.dataset.question] = value;
    saveState();
    render();
    return;
  }

  if (name === "reset-question") {
    delete appState.selectedAnswers[action.dataset.question];
    delete appState.typedAnswers[action.dataset.question];
    saveState();
    render();
    return;
  }

  if (name === "play-phrase") {
    playPhrase(value, action.dataset.key || "phrase");
    return;
  }

  if (name === "complete-block") {
    completeBlock(Number(action.dataset.lesson), action.dataset.block);
    const next = action.dataset.next;
    navigate(next || "/lesson/1");
    return;
  }

  if (name === "complete-lesson") {
    completeLesson(Number(action.dataset.lesson || 1));
    navigate(action.dataset.next || "/lesson/1/complete");
    return;
  }

  if (name === "record") {
    if (value === "recording") await startRecording();
    if (value === "processing") stopRecording();
    if (value === "idle") resetRecording();
    return;
  }

  if (name === "toggle") {
    appState[value] = !appState[value];
    saveState();
    render();
    return;
  }
}

function playPhrase(text, key) {
  if (!text) return;
  window.speechSynthesis?.cancel();
  appState.audioPlaying = key;
  saveState();
  render();

  if ("speechSynthesis" in window && "SpeechSynthesisUtterance" in window) {
    activeUtterance = new SpeechSynthesisUtterance(text);
    activeUtterance.lang = "en-US";
    activeUtterance.rate = 0.82;
    activeUtterance.pitch = 1;
    activeUtterance.onend = clearAudioPlaying;
    activeUtterance.onerror = clearAudioPlaying;
    window.speechSynthesis.speak(activeUtterance);
    return;
  }

  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.frequency.value = 660;
    gain.gain.value = 0.04;
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    window.setTimeout(() => {
      oscillator.stop();
      clearAudioPlaying();
    }, 420);
  } catch {
    window.setTimeout(clearAudioPlaying, 420);
  }
}

function clearAudioPlaying() {
  appState.audioPlaying = "";
  saveState();
  render();
}

async function startRecording() {
  resetRecording({ keepIdle: true });
  appState.recordingState = "recording";
  appState.recordingMode = "microphone";
  appState.recordingError = "";
  appState.recordingMs = 0;
  saveState();
  render();

  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    startSimulatedRecording("Microphone API is not available in this browser preview.");
    return;
  }

  try {
    recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];
    mediaRecorder = new MediaRecorder(recordingStream);
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size) recordedChunks.push(event.data);
    };
    mediaRecorder.onstop = finishRealRecording;
    recordingStartedAt = Date.now();
    mediaRecorder.start();
    startRecordingTimer();
  } catch (error) {
    startSimulatedRecording("Microphone permission was not granted. Showing simulated scoring.");
  }
}

function startSimulatedRecording(message) {
  appState.recordingState = "recording";
  appState.recordingMode = "simulated";
  appState.recordingError = message;
  appState.recordingMs = 0;
  recordingStartedAt = Date.now();
  saveState();
  render();
  startRecordingTimer();
}

function startRecordingTimer() {
  window.clearInterval(recordingTimer);
  recordingTimer = window.setInterval(() => {
    appState.recordingMs = Date.now() - recordingStartedAt;
    saveState();
    render();
  }, 500);
}

function stopRecording() {
  window.clearInterval(recordingTimer);
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    return;
  }
  finishSimulatedRecording();
}

function finishRealRecording() {
  cleanupRecordingStream();
  window.clearInterval(recordingTimer);
  const blob = new Blob(recordedChunks, { type: mediaRecorder?.mimeType || "audio/webm" });
  if (lastRecordingUrl) URL.revokeObjectURL(lastRecordingUrl);
  lastRecordingUrl = URL.createObjectURL(blob);
  appState.recordingState = "processing";
  appState.recordingMode = "microphone";
  appState.recordingMs = Math.max(appState.recordingMs, Date.now() - recordingStartedAt);
  saveState();
  render();
  window.setTimeout(showRecordingResult, 900);
}

function finishSimulatedRecording() {
  appState.recordingState = "processing";
  appState.recordingMode = "simulated";
  appState.recordingMs = Math.max(appState.recordingMs, Date.now() - recordingStartedAt);
  saveState();
  render();
  window.setTimeout(showRecordingResult, 900);
}

function showRecordingResult() {
  appState.recordingState = "result";
  saveState();
  render();
}

function resetRecording(options = {}) {
  window.clearInterval(recordingTimer);
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.onstop = null;
    mediaRecorder.stop();
  }
  cleanupRecordingStream();
  mediaRecorder = undefined;
  recordedChunks = [];
  if (lastRecordingUrl) {
    URL.revokeObjectURL(lastRecordingUrl);
    lastRecordingUrl = "";
  }
  if (!options.keepIdle) {
    appState.recordingState = "idle";
    appState.recordingMode = "";
    appState.recordingMs = 0;
    appState.recordingError = "";
    saveState();
    render();
  }
}

function cleanupRecordingStream() {
  recordingStream?.getTracks().forEach((track) => track.stop());
  recordingStream = undefined;
}

function completeBlock(lessonId, blockId) {
  const key = `${lessonId}:${blockId}`;
  if (!appState.completed.includes(key)) {
    appState.completed.push(key);
    appState.points += 80;
  }
  saveState();
}

function completeLesson(lessonId) {
  const lesson = findLesson(lessonId);
  lesson.blocks.forEach((block) => completeBlock(lessonId, block.id));
}

function findLesson(id) {
  return lessons.find((lesson) => lesson.id === Number(id)) || lessons[0];
}

function copyForLesson(id) {
  return lessonCopy[Number(id)] || lessonCopy[1];
}

function lessonProgress(lessonId) {
  const lesson = findLesson(lessonId);
  const done = lesson.blocks.filter((block) => appState.completed.includes(`${lesson.id}:${block.id}`)).length;
  return Math.round((done / lesson.blocks.length) * 100);
}

function phaseProgress(phaseId) {
  const phaseLessons = lessons.filter((lesson) => lesson.phaseId === Number(phaseId));
  const total = phaseLessons.reduce((sum, lesson) => sum + lesson.blocks.length, 0);
  const done = phaseLessons.reduce(
    (sum, lesson) => sum + lesson.blocks.filter((block) => appState.completed.includes(`${lesson.id}:${block.id}`)).length,
    0
  );
  return total ? Math.round((done / total) * 100) : 0;
}

function isPhaseUnlocked(phaseId) {
  if (Number(phaseId) === 1) return true;
  if (Number(phaseId) === 2) return phaseProgress(1) >= 100;
  return phaseProgress(2) >= 100;
}

function isLessonUnlocked(lessonId) {
  const id = Number(lessonId);
  if (id === 1) return true;
  if (id === 2) return lessonProgress(1) >= 100;
  const lesson = findLesson(id);
  return isPhaseUnlocked(lesson.phaseId);
}

function statusBar(dark = false) {
  return `
    <div class="status ${dark ? "dark" : ""}">
      <span>9:41</span>
      <span class="island"></span>
      <span><span class="signal">|||</span>⌁ ▰</span>
    </div>
  `;
}

function topBar(title, options = {}) {
  const dark = options.dark ? "dark" : "";
  const right = options.right || "";
  const back = options.back === false ? "" : `<button class="icon-btn" data-link="${options.backTo || "/home"}" aria-label="Back">‹</button>`;
  return `
    <div class="topbar ${dark}">
      <div>${back}</div>
      <div class="topbar-title">${title}</div>
      <div>${right}</div>
    </div>
  `;
}

function bottomNav(active = "home", three = false) {
  const items = three
    ? [
        ["feed", "📹", "Feed", "/feed"],
        ["journey", "🗺", "Map", "/journey"],
        ["profile", "👦", "Profile", "/profile"]
      ]
    : [
        ["home", "🏠", "Home", "/home"],
        ["feed", "📹", "Feed", "/feed"],
        ["journey", "🗺", "Map", "/journey"],
        ["profile", "👦", "Me", "/profile"]
      ];
  return `
    <nav class="bottom-nav ${three ? "three" : ""}" aria-label="Main navigation">
      ${items
        .map(
          ([id, icon, label, route]) => `
          <button class="nav-item ${active === id ? "active" : ""}" data-link="${route}">
            <span class="emoji">${icon}</span><span>${label}</span>
          </button>
        `
        )
        .join("")}
    </nav>
  `;
}

function prototypeFab(options = {}) {
  if (options.hideExplorer || window.location.pathname === "/prototype") return "";
  return `<button class="prototype-fab" data-link="/prototype" aria-label="Open UX Explorer">⌘</button>`;
}

function wrap(content, options = {}) {
  return `
    <div class="device">
      <main class="screen ${options.className || ""}" ${options.swipeNext ? `data-swipe-next="${options.swipeNext}"` : ""}>
        ${content}
        ${prototypeFab(options)}
      </main>
    </div>
  `;
}

function scrollScreen(content, options = {}) {
  return wrap(`
    ${statusBar(options.dark)}
    ${options.topbar || ""}
    <div class="scroll">${content}</div>
    ${options.nav || ""}
  `);
}

function renderChoice({ icon, title, subtitle, selected, action, value }) {
  return `
    <button class="choice ${selected ? "selected" : ""}" data-action="${action}" data-value="${value}">
      <span class="choice-icon">${icon}</span>
      <span class="choice-text"><strong>${title}</strong><span>${subtitle}</span></span>
    </button>
  `;
}

function renderWelcome() {
  return wrap(`
    <div class="hero-media"></div>
    ${statusBar(true)}
    <div class="media-overlay" style="height: calc(100% - 30px);">
      <div class="caption-pill">Short videos, real phrases, fast practice.</div>
      <h1 class="page-title" style="color:white;">Learn languages with Omarito</h1>
      <p class="creator-subtitle">Swipe through creator-led lessons, then answer, speak, and unlock the next phase.</p>
      <div class="spacer"></div>
      <button class="button yellow" data-link="/onboarding/language">START</button>
      <div class="spacer"></div>
      <button class="button ghost" data-link="/prototype">EXPLORE PROTOTYPE</button>
    </div>
  `);
}

function renderLanguage() {
  const languages = [
    ["🇪🇸", "Spanish", "Cafe, travel, everyday phrases"],
    ["🇫🇷", "French", "Polite phrases and pronunciation"],
    ["🇯🇵", "Japanese", "Useful phrases and listening"],
    ["🇬🇧", "English", "Fluency, vocabulary, accent"]
  ];
  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">Choose language</h1>
      <p class="lead">Start with one journey. More languages can sit beside it later.</p>
      <div class="choice-grid">
        ${languages.map(([icon, title, subtitle]) => renderChoice({
          icon,
          title,
          subtitle,
          selected: appState.language === title,
          action: "set-language",
          value: title
        })).join("")}
      </div>
      <div class="spacer"></div>
      <button class="button" data-link="/onboarding/goal">CONTINUE</button>
    </div>
  `, { topbar: topBar("", { backTo: "/" }) });
}

function renderGoal() {
  const goals = [
    ["✈️", "Travel", "Order, ask, get around"],
    ["💬", "Conversation", "Respond faster in daily life"],
    ["🎧", "Listening", "Catch phrases in short clips"],
    ["🔥", "Streak mode", "Build a daily habit"]
  ];
  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">Pick goal</h1>
      <p class="lead">${appState.language} lessons adapt around your focus.</p>
      <div class="choice-grid">
        ${goals.map(([icon, title, subtitle]) => renderChoice({
          icon,
          title,
          subtitle,
          selected: appState.goal === title,
          action: "set-goal",
          value: title
        })).join("")}
      </div>
      <div class="spacer"></div>
      <button class="button" data-link="/onboarding/level">CONTINUE</button>
    </div>
  `, { topbar: topBar("", { backTo: "/onboarding/language" }) });
}

function renderLevel() {
  const levels = [
    ["🌱", "Starter", "I know a few words"],
    ["🥉", "Bronze", "I can build simple phrases"],
    ["🥈", "Silver", "I understand slow speech"],
    ["🥇", "Gold", "I want speed and nuance"]
  ];
  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">Set level</h1>
      <p class="lead">Prototype uses local state, so you can change it anytime.</p>
      <div class="choice-grid">
        ${levels.map(([icon, title, subtitle]) => renderChoice({
          icon,
          title,
          subtitle,
          selected: appState.level === title,
          action: "set-level",
          value: title
        })).join("")}
      </div>
      <div class="spacer"></div>
      <button class="button" data-link="/onboarding/intro">MEET OMARITO</button>
    </div>
  `, { topbar: topBar("", { backTo: "/onboarding/goal" }) });
}

function renderIntro() {
  return wrap(`
    <div class="hero-media order"></div>
    ${statusBar(true)}
    ${topBar("Omarito", { dark: true, backTo: "/onboarding/level" })}
    <button class="play-button" data-action="play-phrase" data-key="intro-video" data-value="Learn the phrase, then practice it right away." aria-label="Play intro">${appState.audioPlaying === "intro-video" ? "…" : "▶"}</button>
    <div class="video-sheet">
      <p class="sheet-title">Creator-led lessons</p>
      <p class="sheet-copy">Watch short clips, pull out useful phrases, then practice immediately.</p>
      <button class="button" data-link="/lesson/1/video">START FIRST LESSON</button>
    </div>
  `);
}

function renderOnboardingComplete() {
  return completionScreen({
    title: "First lesson ready",
    subtitle: "You unlocked the At a cafe path.",
    badge: "☕",
    button: "GO HOME",
    link: "/home"
  });
}

function renderHome() {
  const phase = phaseProgress(1);
  const lesson2Unlocked = isLessonUnlocked(2);
  return scrollScreen(`
    <div class="purple-panel">
      <div class="content-top">
        <div class="phase-top">
          <span class="badge yellow">🔥 ${appState.streak}</span>
          <button class="icon-btn glass-btn" data-link="/settings" aria-label="Settings">⚙</button>
        </div>
        <h1 class="page-title" style="color:white;">Continue learning</h1>
        <p class="lead" style="color:rgba(255,255,255,.78)">Next: ask for a drink and make the phrase sound natural.</p>
        <button class="button yellow" data-link="/lesson/1">RESUME LESSON</button>
      </div>
    </div>
    <h2 class="section-title">Today</h2>
    ${lessonRow(lessons[0], lessonProgress(1), lessonProgress(1) >= 100 ? "Done" : "+12%", "/lesson/1")}
    ${lessonRow({ ...lessons[1], title: "Word recall", subtitle: "Coffee words under pressure" }, lessonProgress(2), lesson2Unlocked ? "+10%" : "Locked", "/lesson/2")}
    <h2 class="section-title">Journey</h2>
    ${phaseCard(phases[0], phase)}
    ${phaseCard(phases[1], phaseProgress(2))}
  `, { nav: bottomNav("home") });
}

function renderJourney() {
  const progress = phaseProgress(1);
  const lesson2Unlocked = isLessonUnlocked(2);
  return scrollScreen(`
    <div class="purple-panel">
      ${topBar("At a cafe", { dark: true, backTo: "/home" })}
      <div class="progress-card" style="--progress:${Math.max(progress, 18)}%">
        <div class="progress-head"><span>Topic progress</span><span>${appState.points}/1800 ⭐</span></div>
        <div class="progress-track"><div class="progress-fill"></div></div>
        <div class="medals">
          <div class="medal"><span class="medal-icon">🥉</span><span>Bronze</span></div>
          <div class="medal"><span class="medal-icon">🥈</span><span>Silver</span></div>
          <div class="medal"><span class="medal-icon">🥇</span><span>Gold</span></div>
          <div class="medal"><span class="medal-icon">💎</span><span>Legend</span></div>
        </div>
      </div>
    </div>
    <h2 class="section-title">Lessons</h2>
    ${lessonRow(lessons[0], lessonProgress(1), "+12%", "/lesson/1")}
    ${lessonRow({ ...lessons[1], title: "Your order", subtitle: "Ask for a drink and a bite" }, lessonProgress(2), lesson2Unlocked ? "+10%" : "Locked", "/lesson/2")}
    ${lessonRow({ id: 4, title: "Make it yours", subtitle: "Choose size and milk", icon: "❤️" }, 68, "-14%", "/lesson/1/vocabulary?mode=translate")}
    ${lessonRow({ id: 5, title: "To go, please", subtitle: "Stay or take away", icon: "🛍" }, 68, "+10%", "/lesson/1/listening")}
    ${lessonRow({ id: 6, title: "Time to pay", subtitle: "Ask for the bill and pay", icon: "🧾" }, 68, "-8%", "/lesson/1/quiz?type=choice")}
  `, { nav: bottomNav("journey") });
}

function lessonRow(lesson, percent, delta, route) {
  const down = String(delta).startsWith("-");
  const flat = String(delta).toLowerCase().includes("locked") || String(delta).includes("0%");
  return `
    <button class="lesson-row" data-link="${route}">
      <span class="lesson-icon">${lesson.icon || "☕"}</span>
      <span>
        <p class="lesson-title">${lesson.title}</p>
        <span class="lesson-subtitle">${lesson.subtitle}</span>
      </span>
      <span>
        <span class="percent">${percent}%</span>
        <span class="delta ${down ? "down" : ""} ${flat ? "flat" : ""}">${delta}</span>
      </span>
      <span class="chev">›</span>
    </button>
  `;
}

function phaseCard(phase, progress, options = {}) {
  const unlocked = options.unlocked ?? isPhaseUnlocked(phase.id);
  const state = progress >= 100 ? "Completed" : unlocked ? "Unlocked" : "Locked";
  return `
    <button class="phase-card ${unlocked ? "" : "locked"}" data-link="${phase.route}">
      <div class="phase-top">
        <div>
          <div class="phase-name">${phase.title}</div>
          <div class="phase-meta">${phase.subtitle}</div>
        </div>
        <span class="badge ${progress >= 100 ? "green" : unlocked ? "purple" : ""}">${state}</span>
      </div>
      <div class="mini-progress" style="--value:${progress}%"><span></span></div>
    </button>
  `;
}

function renderPhase(id) {
  const phase = phases.find((item) => item.id === Number(id)) || phases[0];
  const unlocked = isPhaseUnlocked(phase.id);
  const phaseLessons = lessons.filter((lesson) => lesson.phaseId === phase.id);
  if (!unlocked) {
    return scrollScreen(`
      <div class="completion-hero">
        <div class="big-badge">🔒</div>
        <h1 class="page-title">${phase.title} locked</h1>
        <p class="lead">Complete Phase ${phase.id - 1} to open ${phase.subtitle.toLowerCase()}.</p>
        <button class="button" data-link="/phase/${phase.id - 1}">VIEW REQUIRED PHASE</button>
      </div>
    `, { topbar: topBar("Locked phase", { backTo: "/journey" }), nav: bottomNav("journey") });
  }

  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">${phase.title}</h1>
      <p class="lead">${phase.subtitle}. ${phaseProgress(phase.id)}% complete.</p>
      ${phaseLessons.map((lesson) => lessonRow(lesson, lessonProgress(lesson.id), lessonProgress(lesson.id) >= 100 ? "Done" : "+10%", `/lesson/${lesson.id}`)).join("")}
      <h2 class="section-title">States</h2>
      ${phaseCard(phases[0], phaseProgress(1))}
      ${phaseCard(phases[1], phaseProgress(2))}
      ${phaseCard(phases[2], phaseProgress(3))}
    </div>
  `, { topbar: topBar(phase.title, { backTo: "/journey" }), nav: bottomNav("journey") });
}

function renderLesson(id) {
  const lesson = findLesson(id);
  if (!isLessonUnlocked(lesson.id)) {
    return scrollScreen(`
      <div class="completion-hero">
        <div class="big-badge">🔒</div>
        <h1 class="page-title">${lesson.title} locked</h1>
        <p class="lead">Finish ${lesson.id === 2 ? lessons[0].title : "the previous phase"} to open this lesson.</p>
        <button class="button" data-link="${lesson.id === 2 ? "/lesson/1" : "/journey"}">VIEW REQUIRED STEP</button>
      </div>
    `, { topbar: topBar("Locked lesson", { backTo: "/journey" }), nav: bottomNav("journey") });
  }
  const progress = lessonProgress(lesson.id);
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">${lesson.icon} ${progress}% complete</span>
      <h1 class="page-title">${lesson.title}</h1>
      <p class="lead">${lesson.subtitle}. Short blocks keep the loop fast: watch, answer, speak, continue.</p>
      <button class="button" data-link="${nextBlockRoute(lesson)}">${progress ? "CONTINUE" : "START"}</button>
      <h2 class="section-title">Blocks</h2>
      ${lesson.blocks.map((block) => blockRow(lesson.id, block)).join("")}
    </div>
  `, { topbar: topBar("Lesson", { backTo: "/journey" }), nav: bottomNav("journey") });
}

function nextBlockRoute(lesson) {
  const next = lesson.blocks.find((block) => !appState.completed.includes(`${lesson.id}:${block.id}`));
  return next ? next.route : `/lesson/${lesson.id}/complete`;
}

function blockRow(lessonId, block) {
  const done = appState.completed.includes(`${lessonId}:${block.id}`);
  return `
    <button class="lesson-row" data-link="${block.route}">
      <span class="lesson-icon">${done ? "✓" : block.icon}</span>
      <span>
        <p class="lesson-title">${block.label}</p>
        <span class="lesson-subtitle">${done ? "Complete" : "Ready"}</span>
      </span>
      <span class="badge ${done ? "green" : "purple"}">${done ? "Done" : "Open"}</span>
      <span class="chev">›</span>
    </button>
  `;
}

function renderFeed() {
  return wrap(`
    <div class="feed-stack">
      ${feedItems.map((item, index) => `
        <section class="feed-card">
          <div class="hero-media ${item.media}"></div>
          ${index === 0 ? `
            ${statusBar(true)}
            <div class="topbar dark">
              <div><span class="badge yellow">🔥 ${appState.streak}</span></div>
              <div class="topbar-title">Feed</div>
              <div></div>
            </div>
          ` : ""}
          <button class="play-button" data-link="${item.route}" aria-label="Open lesson">▶</button>
          <div class="video-progress"><span style="--value:${Math.max(18, lessonProgress(item.lessonId))}%"></span></div>
          <div class="side-actions">
            <div><div class="action-dot">👦</div></div>
            <div><div class="action-dot">♥</div><span>${item.likes}</span></div>
            <div><div class="action-dot">•••</div><span>${item.comments}</span></div>
            <div><div class="action-dot">↗</div><span>${item.shares}</span></div>
          </div>
          <div class="media-overlay">
            <div class="caption-pill">${item.caption}</div>
            <div class="creator-name">Omarito</div>
            <div class="creator-subtitle">${item.title}</div>
          </div>
        </section>
      `).join("")}
    </div>
    ${bottomNav("feed", true)}
  `, { className: "feed-screen" });
}

function renderVideo(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const params = new URLSearchParams(location.search);
  const mode = params.get("mode") || "video";
  const sheet = {
    video: ["Quick phrase", copy.phrase, "FINISH CLIP", `/lesson/${lesson.id}/video-completed`],
    question: ["Tiny check", lesson.id === 1 ? "Which word makes the request polite?" : copy.prompt, "ANSWER", `/lesson/${lesson.id}/quiz?type=choice`],
    vocabulary: ["Words from clip", copy.vocab.map(([word]) => word).join(", "), "LEARN WORDS", `/lesson/${lesson.id}/vocabulary`],
    explanation: ["Why it works", `${copy.phrase} is a useful short phrase for ${lesson.subtitle.toLowerCase()}.`, "CONTINUE", `/lesson/${lesson.id}/listening`]
  }[mode];

  return wrap(`
    <div class="hero-media ${mode === "explanation" ? "order" : ""}"></div>
    ${statusBar(true)}
    ${topBar(lesson.title, { dark: true, backTo: `/lesson/${lesson.id}` })}
    <button class="play-button" data-action="play-phrase" data-key="video-${lesson.id}-${mode}" data-value="${sheet[1]}" aria-label="Play">${appState.audioPlaying === `video-${lesson.id}-${mode}` ? "…" : "▶"}</button>
    <div class="media-overlay">
      <div class="caption-pill">Watch the phrase in context</div>
      <div class="creator-name">Omarito</div>
      <div class="creator-subtitle">${lesson.subtitle}</div>
    </div>
    <div class="video-sheet">
      <p class="sheet-title">${sheet[0]}</p>
      <p class="sheet-copy">${sheet[1]}</p>
      <button class="button" data-action="complete-block" data-lesson="${lesson.id}" data-block="video" data-next="${sheet[3]}">${sheet[2]}</button>
    </div>
  `, { swipeNext: `/lesson/${lesson.id}/video-completed` });
}

function renderVideoCompleted(id) {
  const lesson = findLesson(id);
  return completionScreen({
    title: "Video complete",
    subtitle: "Clip saved. Next block turns the phrase into usable words.",
    badge: "▶",
    button: "NEXT CONTENT",
    link: `/lesson/${lesson.id}/transition?next=vocabulary`,
    secondButton: ["LESSON OVERVIEW", `/lesson/${lesson.id}`]
  });
}

function renderTransition(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const next = new URLSearchParams(location.search).get("next") || "vocabulary";
  const nextRoute = `/lesson/${lesson.id}/${next}`;
  return wrap(`
    ${statusBar()}
    ${topBar("Next", { backTo: `/lesson/${lesson.id}` })}
    <div class="transition-wrap">
      <div class="transition-card">
        <span class="badge green">Saved</span>
        <h1 class="page-title">Swipe into practice</h1>
        <p class="lead">From clip to exercise: use the same phrase immediately.</p>
        <div class="lesson-row">
          <span class="lesson-icon">${next === "vocabulary" ? "🧠" : "✓"}</span>
          <span>
            <p class="lesson-title">${next === "vocabulary" ? "Vocabulary" : "Next block"}</p>
            <span class="lesson-subtitle">${copy.phrase}</span>
          </span>
          <span class="chev">›</span>
          <span></span>
        </div>
        <button class="button" data-link="${nextRoute}">CONTINUE</button>
      </div>
    </div>
  `, { swipeNext: nextRoute });
}

function renderVocabulary(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const mode = new URLSearchParams(location.search).get("mode") || "intro";
  const answer = appState.selectedAnswers[`vocab-${mode}`];
  const correctValue = mode === "translate" ? "natural-request" : copy.answer;
  const isCorrect = answer === correctValue;
  const title = mode === "recall" ? "Recall the word" : mode === "translate" ? "Translate phrase" : "New word";
  const prompt = mode === "translate" ? copy.phrase : copy.answer;

  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Vocabulary</span>
      <h1 class="page-title">${title}</h1>
      <div class="vocab-card">
        <div>
          <div class="vocab-word">${prompt}</div>
          <div class="vocab-translation">${mode === "translate" ? "Pick the natural meaning" : "cafe order word"}</div>
        </div>
      </div>
      <div class="choice-grid">
        ${
          mode === "translate"
            ? `
              ${answerOption("vocab-" + mode, "natural-request", copy.phrase, "Natural useful phrase", correctValue)}
              ${answerOption("vocab-" + mode, "literal-bad", `I need ${copy.answer} now.`, "Too direct", correctValue)}
              ${answerOption("vocab-" + mode, "wrong-topic", "This is spotless.", "Different topic", correctValue)}
            `
            : `
              ${copy.vocab.map(([word, subtitle]) => answerOption("vocab-" + mode, word, word, subtitle, correctValue)).join("")}
            `
        }
      </div>
      <div class="spacer"></div>
      ${answer ? feedback(isCorrect, isCorrect ? "Nice recall" : mode === "translate" ? "Pick the natural useful phrase." : `Close. ${copy.answer} is the target word.`) : ""}
      ${
        answer && !isCorrect
          ? `<button class="button ghost" data-action="reset-question" data-question="vocab-${mode}">TRY AGAIN</button>`
          : `<button class="button" ${answer ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="vocabulary" data-next="/lesson/${lesson.id}/listening">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar(lesson.title, { backTo: `/lesson/${lesson.id}` }) });
}

function answerOption(question, value, title, subtitle, correctValue = "coffee") {
  const selected = appState.selectedAnswers[question] === value;
  const correct = selected && value === correctValue;
  const incorrect = selected && !correct;
  return `
    <button class="choice ${selected ? "selected" : ""} ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}" data-action="select-answer" data-question="${question}" data-value="${value}">
      <span class="choice-icon">${correct ? "✓" : incorrect ? "×" : " "}</span>
      <span class="choice-text"><strong>${title}</strong><span>${subtitle}</span></span>
    </button>
  `;
}

function feedback(ok, text) {
  return `<div class="feedback ${ok ? "ok" : "bad"}"><span>${ok ? "✓" : "×"}</span><span>${text}</span></div>`;
}

function renderListening(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const mode = new URLSearchParams(location.search).get("mode") || "choice";
  const question = `listening-${mode}`;
  const answer = appState.selectedAnswers[question];
  const typed = appState.typedAnswers[question] || "";
  const normalize = (text) => text.trim().toLowerCase().replace(/[?.!,']/g, "");
  const typedOk = normalize(typed) === normalize(copy.phrase);
  const ready = mode === "typing" ? typed.length > 3 : Boolean(answer);
  const ok = mode === "typing" ? typedOk : answer === copy.answer;
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Listening</span>
      <h1 class="page-title">${mode === "typing" ? "Type what you hear" : copy.prompt}</h1>
      <div class="audio-card">
        <div class="phase-top">
          <button class="icon-btn" data-action="play-phrase" data-key="listening-${lesson.id}-${mode}" data-value="${copy.phrase}" aria-label="Play audio">${appState.audioPlaying === `listening-${lesson.id}-${mode}` ? "…" : "▶"}</button>
          <strong>0:08</strong>
        </div>
        <div class="wave">
          ${Array.from({ length: 18 }, (_, index) => `<span style="--h:${18 + ((index * 17) % 46)}px"></span>`).join("")}
        </div>
      </div>
      ${
        mode === "typing"
          ? `<input class="type-input" data-type-answer="${question}" value="${typed}" placeholder="Type phrase..." />`
          : `<div class="choice-grid">
              ${answerOption(question, copy.answer, copy.answer, copy.phrase, copy.answer)}
              ${answerOption(question, "water", "water", "A different answer", copy.answer)}
              ${answerOption(question, "bill", "bill", "A payment phrase", copy.answer)}
            </div>`
      }
      <div class="spacer"></div>
      ${ready ? feedback(ok, ok ? "You heard it" : "Listen once more, then retry.") : ""}
      ${
        ready && !ok
          ? `<button class="button ghost" data-action="reset-question" data-question="${question}">RETRY</button>`
          : `<button class="button" ${ready ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="listening" data-next="/lesson/${lesson.id}/pronunciation">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar(lesson.title, { backTo: `/lesson/${lesson.id}` }) });
}

function renderPronunciation(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const question = `pronunciation-stress-${lesson.id}`;
  const answer = appState.selectedAnswers[question];
  const ok = answer === copy.softWord;
  const phraseWords = copy.phrase.replace(/[?.,]/g, "").split(" ");
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Pronunciation</span>
      <h1 class="page-title">Tap the soft ending</h1>
      <p class="lead">Listen, then choose the word that should drop in volume.</p>
      <div class="audio-card">
        <div class="phase-top">
          <button class="icon-btn" data-action="play-phrase" data-key="pronunciation-${lesson.id}" data-value="${copy.phrase}" aria-label="Play phrase">${appState.audioPlaying === `pronunciation-${lesson.id}` ? "…" : "▶"}</button>
          <strong>${copy.phrase}</strong>
        </div>
        <div class="syllables">
          ${phraseWords.map((word) => `<button class="chip ${answer === word.toLowerCase() ? "selected" : ""}" data-action="select-answer" data-question="${question}" data-value="${word.toLowerCase()}">${word}</button>`).join("")}
        </div>
      </div>
      ${answer ? feedback(ok, ok ? "Good ear" : "The polite ending is softer.") : ""}
      ${
        answer && !ok
          ? `<button class="button ghost" data-action="reset-question" data-question="${question}">TRY AGAIN</button>`
          : `<button class="button" ${answer ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="pronunciation" data-next="/lesson/${lesson.id}/speaking">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar(lesson.title, { backTo: `/lesson/${lesson.id}` }) });
}

function formatMs(ms) {
  const seconds = Math.max(0, Math.round(ms / 1000));
  return `0:${String(seconds).padStart(2, "0")}`;
}

function renderSpeaking(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const forced = new URLSearchParams(location.search).get("state");
  const state = forced || appState.recordingState;
  const title = state === "recording" ? "Recording..." : state === "processing" ? "Checking sound" : state === "result" ? "Pronunciation result" : "Say the phrase";
  const padAction = state === "recording" ? "processing" : "recording";
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Speaking</span>
      <h1 class="page-title">${title}</h1>
      <p class="lead">${copy.phrase}</p>
      ${
        state === "result"
          ? `<div class="result-ring">92</div><p class="lead" style="text-align:center">Clear rhythm. Make please softer at the end.</p>${lastRecordingUrl ? `<audio class="recording-playback" controls src="${lastRecordingUrl}"></audio>` : `<p class="lead small" style="text-align:center">${appState.recordingError || "Simulated microphone result."}</p>`}`
          : `<button class="record-pad ${state}" data-action="record" data-value="${padAction}" aria-label="Record">${state === "processing" ? "…" : "🎙"}</button>`
      }
      ${state === "recording" ? `<div class="recording-status"><span></span><strong>${formatMs(appState.recordingMs)}</strong><em>${appState.recordingMode === "microphone" ? "Recording microphone" : "Preview recording"}</em></div>` : ""}
      ${appState.recordingError && state !== "result" ? `<p class="lead small">${appState.recordingError}</p>` : ""}
      ${
        state === "idle"
          ? `<button class="button" data-action="record" data-value="recording">START RECORDING</button>`
          : state === "recording"
            ? `<button class="button" data-action="record" data-value="processing">STOP</button>`
            : state === "processing"
              ? `<button class="button" disabled>PROCESSING</button>`
              : `<div class="reset-row"><button class="button ghost" data-action="record" data-value="idle">RETRY</button><button class="button" data-action="complete-block" data-lesson="${lesson.id}" data-block="speaking" data-next="/lesson/${lesson.id}/quiz?type=ordering">CONTINUE</button></div>`
      }
    </div>
  `, { topbar: topBar(lesson.title, { backTo: `/lesson/${lesson.id}` }) });
}

function renderQuiz(id) {
  const lesson = findLesson(id);
  const type = new URLSearchParams(location.search).get("type") || (lesson.id === 1 ? "ordering" : "choice");
  if (type === "ordering") return renderOrdering(id);
  if (type === "matching") return renderMatching(id);
  if (type === "fill") return renderFillBlank(id);
  if (type === "translation") return renderTranslationQuiz(id);
  return renderMultipleChoice(id);
}

function renderOrdering(id) {
  const lesson = findLesson(id);
  const question = "order-phrase";
  const selected = (appState.selectedAnswers[question] || "").split("|").filter(Boolean);
  const words = ["Can", "I", "get", "a", "coffee", "please"];
  const available = words.filter((word) => !selected.includes(word));
  const correct = selected.join(" ") === "Can I get a coffee please";
  return wrap(`
    ${questionHeader("/lesson/" + lesson.id)}
    <div class="exercise">
      <h1>Put the words in order</h1>
      <div class="answer-zone">
        ${selected.map((word) => `<button class="chip" data-action="select-answer" data-question="${question}" data-value="${selected.filter((item) => item !== word).join("|")}">${word}</button>`).join("")}
      </div>
      <div class="word-bank">
        ${available.map((word) => `<button class="chip" data-action="select-answer" data-question="${question}" data-value="${[...selected, word].join("|")}">${word}</button>`).join("")}
        ${Array.from({ length: Math.max(0, 6 - available.length) }, () => `<span class="chip ghost">_</span>`).join("")}
      </div>
      <div class="exercise-footer">
        ${selected.length === words.length ? feedback(correct, correct ? "Amazing!" : "Almost. Try the cafe phrase order.") : ""}
        ${
          selected.length === words.length && !correct
            ? `<button class="button ghost" data-action="select-answer" data-question="${question}" data-value="">TRY AGAIN</button>`
            : `<button class="button" ${selected.length === words.length ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="quiz" data-next="/lesson/${lesson.id}/review">CHECK</button>`
        }
      </div>
    </div>
  `);
}

function renderMultipleChoice(id) {
  const lesson = findLesson(id);
  const copy = copyForLesson(lesson.id);
  const question = `quiz-choice-${lesson.id}`;
  const answer = appState.selectedAnswers[question];
  const correctValue = lesson.id === 1 ? "please" : copy.answer;
  const ok = answer === correctValue;
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Quiz</span>
      <h1 class="page-title">${lesson.id === 1 ? "Which word makes the request polite?" : copy.prompt}</h1>
      <div class="choice-grid">
        ${lesson.id === 1
          ? `
            ${answerOption(question, "please", "please", "Softens the request", correctValue)}
            ${answerOption(question, "very", "very", "Intensifier", correctValue)}
            ${answerOption(question, "bill", "bill", "Thing you ask for", correctValue)}
          `
          : `
            ${answerOption(question, copy.answer, copy.answer, copy.phrase, correctValue)}
            ${answerOption(question, "coffee", "coffee", "Different lesson", correctValue)}
            ${answerOption(question, "bill", "bill", "Different request", correctValue)}
          `
        }
      </div>
      <div class="spacer"></div>
      ${answer ? feedback(ok, ok ? "Correct" : "Try the word from this clip.") : ""}
      ${
        answer && !ok
          ? `<button class="button ghost" data-action="reset-question" data-question="${question}">TRY AGAIN</button>`
          : `<button class="button" ${answer ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="quiz" data-next="/lesson/${lesson.id}/review">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar("Quiz", { backTo: `/lesson/${lesson.id}` }) });
}

function renderFillBlank(id) {
  const lesson = findLesson(id);
  const question = "fill-blank";
  const answer = appState.selectedAnswers[question];
  const ok = answer === "get";
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Fill in blank</span>
      <h1 class="page-title">Can I ___ a coffee, please?</h1>
      <div class="chips">
        ${["take", "get", "make", "see"].map((word) => `<button class="chip ${answer === word ? "selected" : ""}" data-action="select-answer" data-question="${question}" data-value="${word}">${word}</button>`).join("")}
      </div>
      <div class="spacer"></div>
      ${answer ? feedback(ok, ok ? "Natural order phrase" : "Use get for this cafe request.") : ""}
      ${
        answer && !ok
          ? `<button class="button ghost" data-action="reset-question" data-question="${question}">TRY AGAIN</button>`
          : `<button class="button" ${answer ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="quiz" data-next="/lesson/${lesson.id}/review">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar("Quiz", { backTo: `/lesson/${lesson.id}` }) });
}

function renderTranslationQuiz(id) {
  const lesson = findLesson(id);
  const question = "quiz-translation";
  const answer = appState.selectedAnswers[question];
  const ok = answer === "can-get-coffee";
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Translation</span>
      <h1 class="page-title">Choose the natural translation</h1>
      <div class="vocab-card">
        <div>
          <div class="vocab-word">Можно кофе, пожалуйста?</div>
          <div class="vocab-translation">Cafe request</div>
        </div>
      </div>
      <div class="choice-grid">
        ${answerOption(question, "can-get-coffee", "Can I get a coffee, please?", "Natural cafe English", "can-get-coffee")}
        ${answerOption(question, "i-am-coffee", "I am coffee, please.", "Wrong meaning", "can-get-coffee")}
        ${answerOption(question, "clean-coffee", "The coffee is spotless.", "Different topic", "can-get-coffee")}
      </div>
      <div class="spacer"></div>
      ${answer ? feedback(ok, ok ? "Natural translation" : "Pick the useful cafe request.") : ""}
      ${
        answer && !ok
          ? `<button class="button ghost" data-action="reset-question" data-question="${question}">TRY AGAIN</button>`
          : `<button class="button" ${answer ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="quiz" data-next="/lesson/${lesson.id}/review">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar("Quiz", { backTo: `/lesson/${lesson.id}` }) });
}

function renderMatching(id) {
  const lesson = findLesson(id);
  const question = "match";
  const answer = appState.selectedAnswers[question];
  const ok = answer === "bill";
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Matching</span>
      <h1 class="page-title">Match the meaning</h1>
      <p class="lead">Pick the phrase for "the check / payment paper".</p>
      <div class="match-grid">
        ${["coffee", "bill", "milk", "please"].map((word) => `<button class="choice ${answer === word ? "selected" : ""} ${answer === word && ok ? "correct" : ""} ${answer === word && !ok ? "incorrect" : ""}" data-action="select-answer" data-question="${question}" data-value="${word}"><span class="choice-text"><strong>${word}</strong><span>${word === "bill" ? "payment paper" : "cafe word"}</span></span></button>`).join("")}
      </div>
      <div class="spacer"></div>
      ${answer ? feedback(ok, ok ? "Matched" : "Bill means the check.") : ""}
      ${
        answer && !ok
          ? `<button class="button ghost" data-action="reset-question" data-question="${question}">TRY AGAIN</button>`
          : `<button class="button" ${answer ? "" : "disabled"} data-action="complete-block" data-lesson="${lesson.id}" data-block="quiz" data-next="/lesson/${lesson.id}/review">CONTINUE</button>`
      }
    </div>
  `, { topbar: topBar("Quiz", { backTo: `/lesson/${lesson.id}` }) });
}

function questionHeader(backTo) {
  return `
    <div class="question-progress">
      <button class="icon-btn" data-link="${backTo}" aria-label="Close">×</button>
      <div class="bar" style="--value:32%"><span></span></div>
      <div class="q-count">1/3</div>
    </div>
  `;
}

function renderReview(id) {
  const lesson = findLesson(id);
  return scrollScreen(`
    <div class="content-top">
      <span class="badge green">Review</span>
      <h1 class="page-title">Quick review</h1>
      <p class="lead">All key phrases from this lesson.</p>
      ${[
        ["Can I get a coffee, please?", "Natural cafe request"],
        ["to go", "Take away"],
        ["the bill", "Payment request"]
      ].map(([title, subtitle]) => `<div class="lesson-row"><span class="lesson-icon">★</span><span><p class="lesson-title">${title}</p><span class="lesson-subtitle">${subtitle}</span></span><span class="badge green">Saved</span><span></span></div>`).join("")}
      <button class="button green" data-action="complete-lesson" data-lesson="${lesson.id}" data-next="/lesson/${lesson.id}/complete">FINISH LESSON</button>
    </div>
  `, { topbar: topBar("Review", { backTo: `/lesson/${lesson.id}` }) });
}

function renderLessonComplete(id) {
  const lesson = findLesson(id);
  const phaseDone = phaseProgress(lesson.phaseId) >= 100;
  const nextLesson = lessons.find((item) => item.phaseId === lesson.phaseId && item.id > lesson.id);
  return completionScreen({
    title: `${lesson.title} complete`,
    subtitle: phaseDone ? "Phase progress is complete. Next phase can unlock now." : `${nextLesson?.title || "Next lesson"} is now available. Phase progress updated.`,
    badge: "🏆",
    button: phaseDone ? "COMPLETE PHASE" : "NEXT LESSON",
    link: phaseDone ? `/phase/${lesson.phaseId}/complete` : `/lesson/${nextLesson?.id || lesson.id}`,
    secondButton: ["VIEW PROGRESS", "/progress"]
  });
}

function renderPhaseComplete(id) {
  return completionScreen({
    title: `Phase ${id} complete`,
    subtitle: "New phase unlocked. Your learning path now has harder clips.",
    badge: "🥇",
    button: "OPEN NEXT PHASE",
    link: `/phase/${Number(id) + 1}`,
    secondButton: ["ACHIEVEMENT", "/achievement"]
  });
}

function renderAchievement() {
  return completionScreen({
    title: "Milestone earned",
    subtitle: "Bronze Cafe badge added to your profile.",
    badge: "🥉",
    button: "VIEW PROFILE",
    link: "/profile",
    secondButton: ["BACK TO EXPLORER", "/prototype"]
  });
}

function completionScreen({ title, subtitle, badge, button, link, secondButton }) {
  return scrollScreen(`
    <div class="completion-hero">
      <div class="big-badge">${badge}</div>
      <h1 class="page-title">${title}</h1>
      <p class="lead">${subtitle}</p>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">+80</div><div class="stat-label">XP earned</div></div>
        <div class="stat-card"><div class="stat-value">${appState.streak}</div><div class="stat-label">Day streak</div></div>
      </div>
      <button class="button" data-link="${link}">${button}</button>
      ${secondButton ? `<div class="spacer"></div><button class="button ghost" data-link="${secondButton[1]}">${secondButton[0]}</button>` : ""}
    </div>
  `, { topbar: topBar("", { backTo: "/home" }) });
}

function renderProgress() {
  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">Progress</h1>
      <p class="lead">${appState.language} journey. ${appState.points} XP total.</p>
      <div class="stats-grid">
        <div class="stat-card"><div class="stat-value">${phaseProgress(1)}%</div><div class="stat-label">Phase 1</div></div>
        <div class="stat-card"><div class="stat-value">${lessonProgress(1)}%</div><div class="stat-label">Current lesson</div></div>
        <div class="stat-card"><div class="stat-value">${appState.streak}</div><div class="stat-label">Streak</div></div>
        <div class="stat-card"><div class="stat-value">${appState.completed.length}</div><div class="stat-label">Blocks done</div></div>
      </div>
      <h2 class="section-title">Achievements</h2>
      ${phaseCard({ id: 10, title: "Bronze Cafe", subtitle: "Complete first cafe loop", route: "/achievement" }, Math.min(100, lessonProgress(1)), { unlocked: true })}
      ${phaseCard({ id: 11, title: "Fast Listener", subtitle: "Finish listening checks", route: "/lesson/1/listening" }, appState.completed.includes("1:listening") ? 100 : 30, { unlocked: true })}
    </div>
  `, { topbar: topBar("Progress", { backTo: "/home" }), nav: bottomNav("profile") });
}

function renderProfile() {
  return scrollScreen(`
    <div class="profile-head">
      <div class="avatar">👦</div>
      <h1 class="page-title">Omarito learner</h1>
      <p class="lead">${appState.level} • ${appState.goal} • ${appState.language}</p>
    </div>
    <div class="stats-grid">
      <div class="stat-card"><div class="stat-value">${appState.points}</div><div class="stat-label">XP</div></div>
      <div class="stat-card"><div class="stat-value">${appState.streak}</div><div class="stat-label">Streak</div></div>
      <div class="stat-card"><div class="stat-value">${appState.completed.length}</div><div class="stat-label">Blocks</div></div>
      <div class="stat-card"><div class="stat-value">🥉</div><div class="stat-label">Best badge</div></div>
    </div>
    <h2 class="section-title">Saved phrases</h2>
    ${["Can I get a coffee, please?", "To go, please", "Can I get the bill?"].map((phrase) => `<div class="setting-row"><strong>${phrase}</strong><span class="badge purple">Practice</span></div>`).join("")}
  `, { topbar: topBar("Profile", { backTo: "/home", right: `<button class="icon-btn" data-link="/settings">⚙</button>` }), nav: bottomNav("profile") });
}

function renderSettings() {
  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">Settings</h1>
      <p class="lead">Prototype preferences are local only.</p>
      ${settingRow("Language", appState.language, "/onboarding/language")}
      ${settingRow("Daily goal", appState.dailyGoal, "/onboarding/goal")}
      ${toggleRow("Notifications", "notifications")}
      ${toggleRow("Sound effects", "sound")}
      ${toggleRow("Haptics", "haptics")}
      ${toggleRow("Autoplay clips", "autoplay")}
      ${settingRow("Account", "Prototype user", "/profile")}
      <div class="spacer"></div>
      <button class="button ghost" data-link="/prototype">OPEN UX EXPLORER</button>
    </div>
  `, { topbar: topBar("Settings", { backTo: "/profile" }) });
}

function settingRow(label, value, route) {
  return `<button class="setting-row" data-link="${route}"><strong>${label}</strong><span>${value} ›</span></button>`;
}

function toggleRow(label, key) {
  const on = Boolean(appState[key]);
  return `<div class="setting-row"><strong>${label}</strong><button class="toggle ${on ? "" : "off"}" data-action="toggle" data-value="${key}" aria-label="${label}"><span></span></button></div>`;
}

function renderLoadingState() {
  return scrollScreen(`
    <div class="content-top">
      <span class="badge purple">Loading state</span>
      <h1 class="page-title">Preparing next clip</h1>
      <p class="lead">This is the lightweight transition state used before a lesson block loads.</p>
      <div class="loading-card">
        <div class="loader-ring"></div>
        <div>
          <p class="lesson-title">Syncing progress</p>
          <span class="lesson-subtitle">Local prototype state</span>
        </div>
      </div>
      <button class="button" data-link="/lesson/1/transition">CONTINUE</button>
    </div>
  `, { topbar: topBar("Loading", { backTo: "/prototype" }) });
}

function renderModalDemo() {
  return wrap(`
    ${statusBar()}
    ${topBar("Sheet", { backTo: "/prototype" })}
    <div class="modal-backdrop">
      <div class="sheet-modal">
        <span class="sheet-handle"></span>
        <h1 class="sheet-title">Keep streak?</h1>
        <p class="sheet-copy">Turn on notifications for a short daily Omarito practice reminder.</p>
        <button class="button" data-action="toggle" data-value="notifications">TOGGLE NOTIFICATIONS</button>
        <div class="spacer"></div>
        <button class="button ghost" data-link="/settings">SETTINGS</button>
      </div>
    </div>
  `);
}

function renderExplorer() {
  return scrollScreen(`
    <div class="explorer-hero">
      <h1>UX Explorer</h1>
      <p>Jump through every product area, reset progress, or follow the normal flow.</p>
    </div>
    <div class="reset-row">
      <button class="button yellow" data-link="/home">NORMAL FLOW</button>
      <button class="button ghost" data-action="reset">RESET</button>
    </div>
    ${explorerGroups.map((group) => `
      <section class="explorer-card">
        <h2>${group.title}</h2>
        <div class="route-grid">
          ${group.links.map(([label, route]) => `<button class="route-button" data-link="${route}">${label}</button>`).join("")}
        </div>
      </section>
    `).join("")}
  `, { topbar: topBar("Prototype", { backTo: "/home" }) });
}

function renderNotFound() {
  return scrollScreen(`
    <div class="content-top">
      <h1 class="page-title">Screen not found</h1>
      <p class="lead">Use the explorer to jump back into the prototype.</p>
      <button class="button" data-link="/prototype">OPEN EXPLORER</button>
    </div>
  `);
}

function render() {
  const path = window.location.pathname;
  const app = document.querySelector("#app");
  let html;

  if (path === "/") html = renderWelcome();
  else if (path === "/onboarding/language") html = renderLanguage();
  else if (path === "/onboarding/goal") html = renderGoal();
  else if (path === "/onboarding/level") html = renderLevel();
  else if (path === "/onboarding/intro") html = renderIntro();
  else if (path === "/onboarding/complete") html = renderOnboardingComplete();
  else if (path === "/home") html = renderHome();
  else if (path === "/feed") html = renderFeed();
  else if (path === "/journey") html = renderJourney();
  else if (path === "/progress") html = renderProgress();
  else if (path === "/profile") html = renderProfile();
  else if (path === "/settings") html = renderSettings();
  else if (path === "/prototype") html = renderExplorer();
  else if (path === "/achievement") html = renderAchievement();
  else if (path === "/loading") html = renderLoadingState();
  else if (path === "/modal-demo") html = renderModalDemo();
  else if (path.startsWith("/phase/") && path.endsWith("/complete")) html = renderPhaseComplete(path.split("/")[2]);
  else if (path.startsWith("/phase/")) html = renderPhase(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/complete")) html = renderLessonComplete(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/video-completed")) html = renderVideoCompleted(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/transition")) html = renderTransition(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/video")) html = renderVideo(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/vocabulary")) html = renderVocabulary(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/listening")) html = renderListening(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/pronunciation")) html = renderPronunciation(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/speaking")) html = renderSpeaking(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/quiz")) html = renderQuiz(path.split("/")[2]);
  else if (path.startsWith("/lesson/") && path.endsWith("/review")) html = renderReview(path.split("/")[2]);
  else if (path.startsWith("/lesson/")) html = renderLesson(path.split("/")[2]);
  else html = renderNotFound();

  app.innerHTML = html;
}

render();
