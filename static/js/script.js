// script.js — handles UI, timer, backend calls, and effects

const API = {
  getCount: () => fetch("/get_braincells").then(r => r.json()),
  updateCount: (delta = -1) => fetch("/update_braincells", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ delta })
  }).then(r => r.json()),
  reset: () => fetch("/reset", { method: "POST" }).then(r => r.json())
};

let braincells = 50;
let timerInterval = null;
let decaySeconds = 60; // default
let secondsLeft = 1500; // default 25*60

// quotes for ranges
const QUOTES = {
  high: ["Knowledge is power. You’re running on fumes.", "Go on, pretend you're efficient."],
  mid: ["You clicked that like it was a good idea.", "Your attention span just sent a resignation letter."],
  low: ["That violin? That's your dignity leaving.", "One winged braincell just flew away."],
  zero: ["Congratulations. You’ve reached the intellectual level of a cheese stick.", "Stupidity intensifies..."]
};

// DOM
const welcomeScreen = document.getElementById("welcomeScreen");
const appRoot = document.getElementById("app");
const enterBtn = document.getElementById("enterBtn");
const braincellEl = document.getElementById("braincellCount");
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const sacrificeBtn = document.getElementById("sacrificeBtn");
const timerMinutesInput = document.getElementById("timerMinutes");
const decaySecondsInput = document.getElementById("decaySeconds");
const quoteText = document.getElementById("quoteText");
const violinAudio = document.getElementById("violin");
const popAudio = document.getElementById("pop");
const whisperAudio = document.getElementById("whisper");
const adModal = document.getElementById("adModal");
const buyBrick = document.getElementById("buyBrick");
const closeAd = document.getElementById("closeAd");
const leaderModal = document.getElementById("leaderModal");
const leaderboardBtn = document.getElementById("leaderboardBtn");
const leaderList = document.getElementById("leaderList");
const closeLeader = document.getElementById("closeLeader");

// helper: format seconds
function fmtSecs(s){
  s = Math.max(0, Math.floor(s));
  const m = Math.floor(s/60);
  const sec = s % 60;
  return `${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}`;
}

// update UI based on braincell count
function updateUIState(){
  braincellEl.textContent = braincells;
  // choose quote
  let qset = QUOTES.high;
  if (braincells > 5) qset = QUOTES.high;
  else if (braincells >= 3) qset = QUOTES.mid;
  else if (braincells >= 1) qset = QUOTES.low;
  else qset = QUOTES.zero;

  quoteText.textContent = qset[Math.floor(Math.random()*qset.length)];

  // visual effects
  const app = document.querySelector(".app");
  if (!app) return;
  // >5 normal
  if (braincells > 5) {
    app.classList.remove("shake","grayscale");
    // mild motivational — no sound
  } else if (braincells >= 3) {
    // shake
    app.classList.add("shake");
    setTimeout(()=> app.classList.remove("shake"), 400);
  } else if (braincells >= 1) {
    // sad violin + floating braincell animation
    violinAudio.currentTime = 0; violinAudio.play().catch(()=>{});
    spawnFloatingBrain();
    // change Sacrifice button label
    sacrificeBtn.textContent = "Sacrifice More";
  } else {
    // 0: grayscale + flip + whispers + assistant message
    app.classList.add("grayscale");
    whisperAudio.currentTime = 0; whisperAudio.play().catch(()=>{});
    // show assistant message
    alert("Neuron™: Congratulations. You've reached the intellectual level of a cheese stick.");
  }
}

// spawn floating brain animation element
function spawnFloatingBrain(){
  const el = document.createElement("div");
  el.className = "float";
  el.textContent = "🧠";
  el.style.position = "fixed";
  // spawn near braincell count
  const rect = braincellEl.getBoundingClientRect();
  el.style.left = (rect.left + rect.width/2) + "px";
  el.style.top = (rect.top) + "px";
  el.style.fontSize = "28px";
  el.style.zIndex = 50;
  document.body.appendChild(el);
  // remove after animation
  setTimeout(()=> el.remove(), 2600);
}

// fetch current count then decrement once for "open"
async function initCountAndDecayOnOpen(){
  try{
    const data = await API.getCount();
    braincells = Number(data.count || 0);
    updateUIState();
    // decrement once for opening the app / visit
    const res = await API.updateCount(-1);
    braincells = Number(res.count);
    updateUIState();
    // update displayed
    braincellEl.textContent = braincells;
  }catch(err){
    console.error("Failed to init count", err);
  }
}

// update count locally and on server
async function changeBraincells(delta){
  try{
    const res = await API.updateCount(delta);
    braincells = Number(res.count);
    updateUIState();
  }catch(err){
    console.error("update failed", err);
    // fallback local update
    braincells = Math.max(0, braincells + delta);
    updateUIState();
  }
}

// timer logic
function startTimer(){
  // read inputs
  const minutes = Math.max(1, parseInt(timerMinutesInput.value) || 25);
  decaySeconds = Math.max(5, parseInt(decaySecondsInput.value) || 60);
  secondsLeft = minutes * 60;
  clearInterval(timerInterval);
  updateTimerOnce();
  startBtn.disabled = true;
  pauseBtn.disabled = false;

  timerInterval = setInterval(()=> {
    secondsLeft--;
    // if decay tick (every decaySeconds)
    if (secondsLeft >= 0 && (secondsLeft % decaySeconds === 0)) {
      // make server decrement by 1
      changeBraincells(-1);
      popAudio.currentTime = 0; popAudio.play().catch(()=>{});
      notifyUser(`${braincells} braincells remaining. Ouch.`);
    }
    updateTimerOnce();
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      notifyUser("⏰ Timer finished. Roasting time.");
      // optionally play final sound
      violinAudio.currentTime = 0; violinAudio.play().catch(()=>{});
    }
  }, 1000);
}

function updateTimerOnce(){
  timerDisplay.textContent = fmtSecs(secondsLeft);
}

function pauseTimer(){
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

// small UI interactions
enterBtn.addEventListener("click", async () => {
  // entering the app also counts as interaction: server update happened during init already,
  // but let's ensure one more decrement if you want (commented)
  // await changeBraincells(-1);
  welcomeScreen.style.display = "none";
  appRoot.style.display = "block";
  // request notification permission for "notifications you'll regret"
  if ("Notification" in window && Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

// general "sacrifice" button
sacrificeBtn.addEventListener("click", ()=> changeBraincells(-1));

// start/pause/reset
startBtn.addEventListener("click", startTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", async ()=>{
  if (!confirm("Reset braincells to 50?")) return;
  const res = await API.reset();
  braincells = Number(res.count);
  updateUIState();
});

// ad modal
let adTimer = setTimeout(()=> {
  adModal.setAttribute("aria-hidden", "false");
}, 20000); // show ad after 20s

closeAd.addEventListener("click", ()=> adModal.setAttribute("aria-hidden", "true"));
buyBrick.addEventListener("click", ()=> {
  alert("Transaction failed: Your dignity is not accepted as payment.");
  adModal.setAttribute("aria-hidden", "true");
});

// leaderboard (fake)
leaderboardBtn.addEventListener("click", ()=>{
  const rats = [
    {name: "Lab Rat #23", iq: (Math.random()*10+0.1).toFixed(2)},
    {name: "Rock with Moss", iq: (Math.random()*0.5+0.01).toFixed(2)},
    {name: "Goldfish", iq: (Math.random()*2+0.5).toFixed(2)},
    {name: "You", iq: braincells.toFixed(2)}
  ];
  leaderList.innerHTML = rats.map(r => `<li>${r.name} — IQ: ${r.iq}</li>`).join("");
  leaderModal.setAttribute("aria-hidden", "false");
});
closeLeader.addEventListener("click", ()=> leaderModal.setAttribute("aria-hidden", "true"));

// Notifications helper (works while tab open, will not show when browser/tab closed unless you implement push service worker)
function notifyUser(text){
  if (!("Notification" in window)) return;
  if (Notification.permission === "granted") {
    new Notification("Braincell Counter", { body: text, icon: "/static/images/welcome-bg.jpg" });
  }
}

// click anywhere => interaction decrements (configurable). Avoid over-decrement by throttling.
let lastInteraction = 0;
document.addEventListener("click", async (e)=>{
  // if click is on certain buttons, we handle separately
  if (["enterBtn","startBtn","pauseBtn","resetBtn","sacrificeBtn","buyBrick"].includes(e.target.id)) return;
  const now = Date.now();
  if (now - lastInteraction > 2000) { // throttle 2s
    lastInteraction = now;
    await changeBraincells(-1);
  }
});

// init on load
window.addEventListener("DOMContentLoaded", async ()=>{
  await initCountAndDecayOnOpen();
  // set initial displayed timer and decay values
  updateTimerOnce();
});
