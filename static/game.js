let round = 1;
let totalScore = 0;
let current = null;
let shuffleInterval;
let currentCard;
let participant_id = "user_" + Date.now();

let lieCount = 0;
let auditCount = 0;

const deck = [
  { value: 1, img: "/static/cards/A.png" },
  { value: 2, img: "/static/cards/2.png" },
  { value: 3, img: "/static/cards/3.png" },
  { value: 4, img: "/static/cards/4.png" },
  { value: 5, img: "/static/cards/5.png" },
  { value: 6, img: "/static/cards/6.png" },
  { value: 7, img: "/static/cards/7.png" },
  { value: 8, img: "/static/cards/8.png" },
  { value: 9, img: "/static/cards/9.png" },
  { value: 10, img: "/static/cards/10.png" },
];

function getBlock(round) {
  if (round <= 5) return 1;
  if (round <= 10) return 2;
  return 3;
}

function getProbability(block) {
  if (block === 1) return 0.2;
  if (block === 2) return 0.5;
  return 0.8;
}

function updateUI(V_R, P) {
  document.getElementById("roundNumber").innerText = round;
  document.getElementById("auditProb").innerText = P;
}

function updateRules(V_R, V_D) {
  const ruleNoAudit = document.getElementById("ruleNoAudit");
  const ruleAudit = document.getElementById("ruleAudit");
  const warning = document.getElementById("warning");

  ruleNoAudit.innerText = "—";
  ruleAudit.innerText = "—";
  warning.innerText = "";

  if (V_D === null || isNaN(V_D)) return;

  if (V_D < 1 || V_D > 10) {
    warning.innerText = "El número debe estar entre 1 y 10.";
    return;
  }

  if (V_D < V_R) {
    warning.innerText = "No puedes declarar un número menor que el real.";
    return;
  }

  ruleNoAudit.innerText = `ganas ${V_D} puntos.`;

  if (V_D === V_R) {
    ruleAudit.innerText = `ganas ${V_R} puntos.`;
  } else {
    ruleAudit.innerText = `pierdes ${V_D - V_R} puntos.`;
  }
}

function startShuffle() {
  const cardImg = document.getElementById("cardImg");
  cardImg.classList.add("shuffling");

  shuffleInterval = setInterval(() => {
    const randomCard = deck[Math.floor(Math.random() * deck.length)];
    cardImg.src = randomCard.img;
  }, 80);
}

function stopShuffle() {
  clearInterval(shuffleInterval);

  currentCard = deck[Math.floor(Math.random() * deck.length)];
  const cardImg = document.getElementById("cardImg");
  cardImg.src = currentCard.img;
  cardImg.classList.remove("shuffling");

  return currentCard.value;
}

function startRound() {
  document.getElementById("declaredNumber").disabled = true;
  startShuffle();

  setTimeout(() => {
    const V_R = stopShuffle();
    const block = getBlock(round);
    const P = getProbability(block);

    current = { V_R, P };
    updateUI(V_R, P);

    document.getElementById("declaredNumber").disabled = false;
  }, 1200);
}

function auditOccurs(P) {
  return Math.random() < P;
}

function calculatePoints(V_R, V_D, audit) {
  if (!audit) return V_D;
  if (V_D === V_R) return V_R;
  return -(V_D - V_R);
}

// -----------------------------
// NUEVAS FUNCIONES (GUARDADO)
// -----------------------------
async function saveRound(data) {
  await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function getPercentile(pid) {
  const resp = await fetch(`/leaderboard/${pid}`);
  return await resp.json();
}

// -----------------------------
// EVENTOS
// -----------------------------
document.getElementById("declaredNumber").addEventListener("input", () => {
  const value = document.getElementById("declaredNumber").value;
  const V_D = value === "" ? null : parseInt(value);
  updateRules(current.V_R, V_D);
});

document.getElementById("submitBtn").addEventListener("click", async () => {
  const value = document.getElementById("declaredNumber").value;
  const V_D = parseInt(value);
  const V_R = current.V_R;
  const P = current.P;

  const resultDiv = document.getElementById("result");

  if (isNaN(V_D) || V_D < 1 || V_D > 10) {
    resultDiv.innerHTML =
      "<span class='error'>Introduce un número entre 1 y 10.</span>";
    return;
  }

  if (V_D < V_R) {
    resultDiv.innerHTML =
      "<span class='error'>No puedes declarar un número menor que el real.</span>";
    return;
  }

  const audit = auditOccurs(P);
  const points = calculatePoints(V_R, V_D, audit);
  totalScore += points;

  // actualizar contadores
  if (V_D !== V_R) lieCount++;
  if (audit) auditCount++;

  let auditLine = audit
    ? "<span class='audit'>Has sido auditado.</span>"
    : "<span class='no-audit'>No has sido auditado.</span>";

  let pointsLine = `Puntos de esta ronda: ${points}.`;
  let totalLine = `Puntuación acumulada: ${totalScore}.`;

  resultDiv.innerHTML = `
    ${auditLine}<br>
    ${pointsLine}<br>
    ${totalLine}
  `;

  // Guardar en backend
  const data = {
    participant_id,
    round,
    block: getBlock(round),
    probability: P,
    V_R,
    V_D,
    difference: V_D - V_R,
    audit,
    points,
    total_score: totalScore,
    timestamp: new Date().toISOString(),
  };

  await saveRound(data);

  round++;

  if (round <= 15) {
    document.getElementById("declaredNumber").value = "";
    updateRules(null, null);
    startRound();
  } else {
    document.getElementById("submitBtn").disabled = true;

    // guardar estadísticas para thanks.html
    localStorage.setItem("totalScore", totalScore);
    localStorage.setItem("lieCount", lieCount);
    localStorage.setItem("auditCount", auditCount);

    // redirigir automáticamente a thanks.html
    setTimeout(() => {
      window.location.href = "/thanks"; // cambia según tu ruta
    }, 1000);
  }
});

startRound();
