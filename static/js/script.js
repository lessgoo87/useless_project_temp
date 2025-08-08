// script.js
const API = {
  getCount: "/api/get_count",
  dec: "/api/decrement",
  leaderboard: "/api/leaderboard",
  setCount: "/api/set_count"
};

let braincellCount = 50;
let interactionLock = false;
let timerInterval = null;
let secondsLeft = 0;
let whisperAudio = null;
let violinAudio = null;
let adDingAudio = null;

// UI elements
const welcomeScreen = document.getElementById("welcomeScreen");
const enterBtn = document.getElementById("enterBtn");
const mainApp = document.getElementById("mainApp");
const braincellDisplay = () => document.getElementById("braincellCount");
const quoteEl = document.getElementById("currentQuote");
const timerDisplay = document.getElementById("timerDisplay");
const minutesInput = document.getElementById("minutesInput");

// preload audios (user must supply files)
try { violinAudio = new Audio('/static/sounds/sad-violin.mp3'); violinAudio.loop = false } catch(e){}
try { whisperAudio = new Audio('/static/sounds/whisper-loop.mp3'); whisperAudio.loop = true } catch(e){}
try { adDingAudio = new Audio('/static/sounds/ad-ding.mp3'); } catch(e){}

// quotes
const quotes = {
  high: ["Knowledge is power. You're running on fumes.","You're doing fine. For a potato."],
  mid: ["You clicked that like it was a good idea.","Half-brained effort — commendable."],
  low: ["One tiny braincell remains, handle with care.","You might be a plot twist in evolution."],
  zero: ["Congratulations. You’ve reached the intellectual level of a cheese stick.","Neuron™ has left the chat."]
};

function setQuoteForCount(n){
  let q = "";
  if(n > 5) q = quotes.high[Math.floor(Math.random()*quotes.high.length)];
  else if(n >= 3) q = quotes.mid[Math.floor(Math.random()*quotes.mid.length)];
  else if(n >= 1) q = quotes.low[Math.floor(Math.random()*quotes.low.length)];
  else q = quotes.zero[Math.floor(Math.random()*quotes.zero.length)];
  if(quoteEl) quoteEl.innerText = q;
}

// fetch current count from server
async function fetchCount(){
  try {
    const res = await fetch(API.getCount);
    const j = await res.json();
    braincellCount = j.count;
    if(braincellDisplay()) braincellDisplay().innerText = braincellCount;
    setQuoteForCount(braincellCount);
    applyVisuals();
  } catch(e){
    console.error("fetchCount", e);
  }
}

// decrement via server
async function decrementLocal(){
  try {
    const res = await fetch(API.dec, {method:'POST'});
    const j = await res.json();
    braincellCount = j.count;
    if(braincellDisplay()) braincellDisplay().innerText = braincellCount;
    setQuoteForCount(braincellCount);
    applyVisuals();
    maybeNotification();
  } catch(e){ console.error("decrement", e) }
}

// call decrement on page load once (opening the app removes 1 braincell)
async function openDecrement(){
  await decrementLocal();
}

// apply visuals & behavior by braincell count
function applyVisuals(){
  // remove any previous special classes
  document.body.classList.remove('zero-mode');
  // remove shake quickly
  const main = document.querySelector('.main') || document.querySelector('.topbar');
  if(main) main.classList.remove('shake');

  // stop/stop audios
  if(whisperAudio && whisperAudio.pause) whisperAudio.pause();

  if(braincellCount > 5){
    // normal motivational
    setQuoteForCount(braincellCount);
  } else if(braincellCount >= 3){
    // shake UI a bit
    if(main) {
      main.classList.add('shake');
      setTimeout(()=> main.classList.remove('shake'), 400);
    }
  } else if(braincellCount >= 1){
    // sad violin & floating brain animation
    if(violinAudio && violinAudio.play) violinAudio.play();
    createFloatingBrain();
  } else { // zero
    // chaos: grayscale, flip, whispers, neuron modal
    document.body.classList.add('zero-mode');
    if(whisperAudio && whisperAudio.play) whisperAudio.play();
    showNeuron();
  }
}

// create tiny floating brain element (removed after animation)
function createFloatingBrain(){
  const el = document.createElement('div');
  el.className = 'floating-brain';
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 2200);
}

// Neuron assistant modal
function showNeuron(){
  const modal = document.getElementById('neuronModal');
  if(modal) modal.style.display = 'flex';
}
function closeNeuron(){
  const modal = document.getElementById('neuronModal');
  if(modal) modal.style.display = 'none';
}

// interaction handling (debounced so we don't kill many braincells accidentally)
function interactionHandler(){
  if(interactionLock) return;
  interactionLock = true;
  decrementLocal();
  setTimeout(()=> interactionLock = false, 5000); // 5s cooldown
}

// timer logic (user-customizable minutes)
function startTimer(){
  // clear if existing
  clearInterval(timerInterval);
  const mins = Math.max(1, parseInt(minutesInput.value || 25));
  secondsLeft = mins * 60;
  updateTimerUI(secondsLeft);
  // every second tick - every minute (when secondsLeft % 60 == 0) we'll call decrementLocal()
  timerInterval = setInterval(() => {
    secondsLeft--;
    if(secondsLeft <= 0){
      clearInterval(timerInterval);
      updateTimerUI(0);
      // final ring & roast
      if(adDingAudio && adDingAudio.play) adDingAudio.play();
      alert("⏰ Time's up! You roasted your braincells a little more.");
    } else {
      if(secondsLeft % 60 === 0){
        // reduce braincell per minute
        decrementLocal();
      }
      updateTimerUI(secondsLeft);
    }
  }, 1000);
}

function pauseTimer(){
  clearInterval(timerInterval);
}

function resetTimer(){
  clearInterval(timerInterval);
  const mins = Math.max(1, parseInt(minutesInput.value || 25));
  secondsLeft = mins * 60;
  updateTimerUI(secondsLeft);
}

// update timer UI
function updateTimerUI(s){
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if(timerDisplay) timerDisplay.innerText = `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

// notifications
function maybeNotification(){
  if(!("Notification" in window)) return;
  if(Notification.permission === "granted"){
    // show a quick notification on low counts, or every time it hits zero
    if(braincellCount <= 0){
      new Notification("Braincell Counter", { body: "Congratulations. All braincells expired." });
    } else if (Math.random() < 0.1){
      new Notification("Braincell Counter", { body: "We regret to inform you your last braincell has expired." });
    }
  }
}

// request permission for notifications
function initNotifications(){
  if(!("Notification" in window)) return;
  if(Notification.permission === "default"){
    Notification.requestPermission().then(p=>{
      console.log("Notification permission:", p);
    });
  }
}

// Leaderboard functions
async function openLeaderboard(){
  try {
    const res = await fetch(API.leaderboard);
    const j = await res.json();
    const list = document.getElementById('leaderList');
    list.innerHTML = "";
    j.leaderboard.forEach(e=>{
      const li = document.createElement('li');
      li.innerText = `${e.name} — IQ ${e.iq}`;
      list.appendChild(li);
    });
    document.getElementById('leaderModal').style.display = 'flex';
  } catch(e){ console.error(e) }
}
function closeLeader(){ document.getElementById('leaderModal').style.display = 'none' }

// Brick Ad modal
function openBrick(){ document.getElementById('brickModal').style.display = 'flex'}
function closeBrick(){ document.getElementById('brickModal').style.display = 'none'}
function buyBrick(){
  // play ding, pretend to sell
  if(adDingAudio && adDingAudio.play) adDingAudio.play();
  alert("Thanks for buying the Premium Brick. It did nothing. +0.001 braincells incoming (maybe).");
  closeBrick();
}

// Self reflection (shows a small summary)
function selfReflect(){
  const el = document.getElementById('resultArea');
  el.innerText = `You've got ${braincellCount} braincells remaining. Consider meditation or a snack.`;
}

// init wiring
window.addEventListener('load', async ()=>{
  // fetch initial count
  await fetchCount();
  // open-decrement (opening app removes 1)
  await openDecrement();
  // wire up enter button
  enterBtn?.addEventListener('click', ()=>{
    welcomeScreen.style.display = 'none';
    mainApp.style.display = 'block';
    initNotifications();
  });

  // wire timer controls
  document.getElementById('startTimerBtn')?.addEventListener('click', startTimer);
  document.getElementById('pauseTimerBtn')?.addEventListener('click', pauseTimer);
  document.getElementById('resetTimerBtn')?.addEventListener('click', resetTimer);

  document.getElementById('leaderBtn')?.addEventListener('click', openLeaderboard);
  document.getElementById('selfReflectBtn')?.addEventListener('click', selfReflect);
  document.getElementById('brickAdBtn')?.addEventListener('click', openBrick);

  // global interaction handlers (clicks, keys) -> decrement with cooldown
  ['click','keydown','touchstart'].forEach(evt=>{
    window.addEventListener(evt, interactionHandler, {passive:true});
  });
});
