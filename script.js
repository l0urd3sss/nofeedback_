// ⭐ Star rain (trigger manual)
function createStarBurst(count = 16) {
  const starContainer = document.getElementById("star-rain");
  if (!starContainer) return;

  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.textContent = "★";

    const x = Math.random() * window.innerWidth;
    const size = 18 + Math.random() * 10; // 18–28px
    const dur = 0.7 + Math.random() * 0.35; // 0.7–1.05s

    star.style.left = `${x}px`;
    star.style.fontSize = `${size}px`;
    star.style.animationDuration = `${dur}s`;

    starContainer.appendChild(star);
    setTimeout(() => star.remove(), Math.ceil(dur * 1000) + 200);
  }
}

function starRain() {
  createStarBurst(14);
  setTimeout(() => createStarBurst(10), 120);
  setTimeout(() => createStarBurst(8), 240);
}

// ------------------------------
// Lectura de marca (wizard)
// ------------------------------
const questions = [
  {
    id: "q1",
    text: "¿en qué estado sentís que está tu marca hoy?",
    options: [
      { label: "no existe todavía. estoy por arrancar y no sé qué hacer primero", score: { claridad: 2 } },
      { label: "existe pero está todo armado a medias", score: { claridad: 2 } },
      { label: "existe y comunica, pero algo no me cierra", score: { sistema: 1, ajuste: 1 } },
      { label: "existe y funciona, solo quiero ajustar pequeñas cosas", score: { ajuste: 2 } },
    ],
  },
  {
    id: "q2",
    text: "¿qué te cuesta más hoy?",
    options: [
      { label: "saber qué decir", score: { claridad: 2 } },
      { label: "mantener coherencia", score: { sistema: 2 } },
      { label: "bajar ideas a piezas reales", score: { sistema: 1, claridad: 1 } },
      { label: "decidir qué hacer y qué no hacer", score: { claridad: 2 } },
    ],
  },
  {
    id: "q3",
    text: "cuando vas a publicar o armar una pieza, ¿qué pasa?",
    options: [
      { label: "me quedo en blanco", score: { claridad: 2 } },
      { label: "hago algo y después lo cambio mil veces", score: { claridad: 1, sistema: 1 } },
      { label: "publico, pero siento que no construye nada", score: { claridad: 2 } },
      { label: "sale, pero no se siente coherente con el resto", score: { sistema: 2 } },
    ],
  },
  {
    id: "q4",
    text: "siendo honesta/o, ¿qué tenés hoy?",
    options: [
      { label: "nada definido", score: { claridad: 2 } },
      { label: "logo/colores sueltos", score: { claridad: 1, sistema: 1 } },
      { label: "branding “formal” (pdf/guía), pero no lo uso bien", score: { sistema: 2 } },
      { label: "una estética más o menos, pero sin concepto", score: { claridad: 2 } },
    ],
  },
  {
    id: "q5",
    text: "¿qué necesitás ahora mismo?",
    options: [
      { label: "un punto de partida claro", score: { claridad: 2 } },
      { label: "un sistema para comunicar sin romper la marca", score: { sistema: 2 } },
      { label: "que alguien mire desde afuera y me diga qué ajustar y qué cortar", score: { ajuste: 2 } },
      { label: "no sé, pero necesito orden", score: { claridad: 2 } },
    ],
  },
];

const RESULTS = {
  claridad: {
    title: "tu marca necesita claridad",
    text:
      "por lo que respondiste, tu problema no es hacer.\n" +
      "es que todavía no hay una identidad clara que sostenga las decisiones.\n" +
      "antes de diseñar o comunicar, alguien tiene que pensar qué se quiere decir y desde dónde.",
  },
  sistema: {
    title: "tu marca necesita un sistema",
    text:
      "por lo que respondiste, no estás lejos.\n" +
      "pero hoy te falta una identidad usable: reglas, coherencia y bajada a piezas reales.\n" +
      "algo que te permita comunicar sin romper la marca.",
  },
  ajuste: {
    title: "tu marca necesita ajuste y criterio",
    text:
      "por lo que respondiste, tu marca está en movimiento.\n" +
      "el problema es que estás decidiendo a ciegas.\n" +
      "una mirada externa ordena: qué seguir, qué ajustar y qué cortar ya.",
  },
};

// DOM
const optionsEl = document.getElementById("options");
const questionEl = document.querySelector(".question");
const progressEl = document.getElementById("progressText");
const btnBack = document.getElementById("btnBack");

const quizSection = document.getElementById("lectura");
const resultSection = document.getElementById("result");
const resultTitleEl = document.getElementById("resultTitle");
const resultTextEl = document.getElementById("resultText");

const btnStartHero = document.getElementById("btnStartHero");
const btnStartProblem = document.getElementById("btnStartProblem");
const btnRestart = document.getElementById("btnRestart");

if (!optionsEl) {
  console.error("No encuentro el div #options. Revisa que exista: <div id='options'></div>");
}

// State
let currentIndex = 0;
let answers = new Array(questions.length).fill(null);

function scrollToQuiz() {
  if (!quizSection) return;
  quizSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

function resetAll() {
  currentIndex = 0;
  answers = new Array(questions.length).fill(null);
  if (resultSection) resultSection.hidden = true;
  if (quizSection) quizSection.hidden = false;
  renderQuestion();
}

function renderQuestion() {
  if (!optionsEl) return;

  const q = questions[currentIndex];

  if (progressEl) progressEl.textContent = `${currentIndex + 1}/${questions.length}`;

  if (btnBack) {
    btnBack.style.visibility = currentIndex === 0 ? "hidden" : "visible";
  }

  if (questionEl) questionEl.textContent = q.text;

  optionsEl.innerHTML = "";

  q.options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "option";
    btn.type = "button";
    btn.textContent = opt.label;

    btn.addEventListener("click", () => {
      // feedback seleccionado (rápido)
      document.querySelectorAll(".option").forEach(el => el.classList.remove("is-selected"));
      btn.classList.add("is-selected");

      answers[currentIndex] = idx;

      // autopaso (con mini delay para que se note el click)
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          currentIndex += 1;
          renderQuestion();
        } else {
          showResult();
        }
      }, 120);
    });

    optionsEl.appendChild(btn);
  });
}

function showResult() {
  const totals = { claridad: 0, sistema: 0, ajuste: 0 };

  answers.forEach((selectedIdx, qIndex) => {
    if (selectedIdx === null) return;
    const opt = questions[qIndex].options[selectedIdx];
    const s = opt.score || {};
    totals.claridad += s.claridad || 0;
    totals.sistema += s.sistema || 0;
    totals.ajuste += s.ajuste || 0;
  });

    const winner =
    Object.entries(totals).sort((a, b) => b[1] - a[1])[0]?.[0] || "claridad";

    const r = RESULTS[winner];

const leadField = document.getElementById("leadResult");
if (leadField && !leadField.value) {
  leadField.value = "contacto sin lectura de marca";
}


  // pintar resultado en pantalla
  resultTitleEl.textContent = r.title;
  resultTextEl.textContent = r.text;

  quizSection.hidden = true;
  resultSection.hidden = false;
  resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Events
if (btnBack) {
  btnBack.addEventListener("click", () => {
    if (currentIndex === 0) return;
    currentIndex -= 1;
    renderQuestion();
  });
}

if (btnStartHero) {
  btnStartHero.addEventListener("click", () => {
    starRain();
    resetAll();
    scrollToQuiz();
  });
}

if (btnStartProblem) {
  btnStartProblem.addEventListener("click", () => {
    starRain();
    resetAll();
    scrollToQuiz();
  });
}

if (btnRestart) {
  btnRestart.addEventListener("click", () => {
    resetAll();
    scrollToQuiz();
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  renderQuestion();
});
const leadField = document.getElementById("leadResult");
if (leadField) {
  leadField.value = `${r.title} — ${r.text}`;
}
const contactForm = document.querySelector("form[name='contacto']");
const submitBtn = document.getElementById("btnSubmit");

if (contactForm && submitBtn) {
  contactForm.addEventListener("submit", () => {
    submitBtn.textContent = "gracias";
    submitBtn.disabled = true;
    submitBtn.style.opacity = "0.7";
  });
}
