// leer datos del juego
const totalScore = localStorage.getItem("totalScore");
const lieCount = localStorage.getItem("lieCount");
const auditCount = localStorage.getItem("auditCount");

const scoreText = document.getElementById("scoreText");
const percentileText = document.getElementById("percentileText");
const summaryText = document.getElementById("summaryText");

scoreText.innerHTML = `<strong>Puntuación total:</strong> ${totalScore}`;

// resumen de comportamiento
summaryText.innerHTML = `
  Mentiste <strong>${lieCount}</strong> veces.<br />
  Fuiste auditado <strong>${auditCount}</strong> veces.
`;

// pedir percentil al backend
async function loadPercentile() {
  try {
    const resp = await fetch("/leaderboard");
    const data = await resp.json();

    if (data.percentile !== undefined) {
      percentileText.innerHTML = `
        Obtuviste más puntos que el <strong>${data.percentile}%</strong> de los participantes.
      `;
    }
  } catch (e) {
    percentileText.innerHTML = "";
  }
}

loadPercentile();

