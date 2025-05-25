document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playBtn");
  const pointsDisplay = document.getElementById("points");

  if (pointsDisplay) {
    let points = localStorage.getItem("points") || 0;
    pointsDisplay.textContent = points;
  }

  if (playBtn) {
    playBtn.addEventListener("click", () => {
      window.location.href = "ad.html";
    });
  }
});
