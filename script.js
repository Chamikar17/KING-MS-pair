const watchBtn = document.getElementById("watchAdBtn");
const pointsSpan = document.getElementById("points");
const progressBar = document.getElementById("progressBar");

let points = 0;
let adWindow = null;
let timer = null;
let count = 0;
const adDuration = 15; // seconds

watchBtn.addEventListener("click", () => {
  if(adWindow && !adWindow.closed){
    alert("Please close the previous ad before starting a new one.");
    return;
  }
  // Open ad in new tab/window
  adWindow = window.open(
    "https://www.profitableratecpm.com/x1fu9w31j?key=9e56e55a3a3f57fab750d1c7a4c9fac4",
    "_blank",
    "width=600,height=400"
  );

  if(!adWindow) {
    alert("Popup blocked! Please allow popups for this site.");
    return;
  }

  // Disable button & reset progress
  watchBtn.disabled = true;
  count = 0;
  progressBar.style.width = "0%";

  // Start timer
  timer = setInterval(() => {
    count++;
    progressBar.style.width = ((count / adDuration) * 100) + "%";

    // After 15 seconds, award point & enable button
    if(count >= adDuration){
      clearInterval(timer);
      if(adWindow && !adWindow.closed){
        alert("Please close the ad tab to claim your point.");
      } else {
        addPoint();
      }
    }
  }, 1000);
});

// Check every second if adWindow closed to give point
setInterval(() => {
  if(adWindow && adWindow.closed){
    clearInterval(timer);
    addPoint();
    watchBtn.disabled = false;
    progressBar.style.width = "0%";
    adWindow = null;
  }
}, 1000);

function addPoint(){
  points++;
  pointsSpan.textContent = points;
}
