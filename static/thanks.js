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

// guardar email (SIN participant_id)
document.getElementById("saveEmailBtn").addEventListener("click", async () => {
  const email = document.getElementById("emailInput").value;

  if (!email) return;

  await fetch("/save_email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  document.getElementById("emailInput").value = "";
  alert("¡Gracias! Tu email ha sido guardado 😊");
});
