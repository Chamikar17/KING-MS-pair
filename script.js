let points = 0;
const btn = document.getElementById("watchAdBtn");
const pointsDisplay = document.getElementById("points");
const progressBar = document.getElementById("progressBar");

btn.addEventListener("click", () => {
  btn.disabled = true;
  progressBar.style.width = "0%";

  let duration = 15; // seconds
  let current = 0;

  const interval = setInterval(() => {
    current++;
    let percent = (current / duration) * 100;
    progressBar.style.width = percent + "%";

    if (current >= duration) {
      clearInterval(interval);
      points++;
      pointsDisplay.textContent = points;
      btn.disabled = false;
      openAd();
    }
  }, 1000);
});

function openAd() {
  window.open("https://www.profitableratecpm.com/x1fu9w31j?key=9e56e55a3a3f57fab750d1c7a4c9fac4", "_blank");
}
