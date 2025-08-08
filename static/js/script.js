function startApp() {
    document.getElementById("welcomeScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
}

let timer;
let minutes = 25;
let seconds = 0;
let braincellCount = 5;

function updateTimerDisplay() {
    const timerElement = document.getElementById("timer");
    let minStr = minutes < 10 ? "0" + minutes : minutes;
    let secStr = seconds < 10 ? "0" + seconds : seconds;
    timerElement.innerText = `${minStr}:${secStr}`;
}

function startTimer() {
    timer = setInterval(() => {
        if (seconds === 0) {
            if (minutes === 0) {
                clearInterval(timer);
                alert("Congrats! Timer done. But at what cost to your braincells?");
                return;
            }
            minutes--;
            seconds = 59;
        } else {
            seconds--;
        }

        // Every 5 minutes (when seconds == 0), lose a braincell
        if (seconds === 0 && minutes % 5 === 0) {
            loseBraincell();
        }

        updateTimerDisplay();
    }, 1000);
}

function loseBraincell() {
    braincellCount--;
    if (braincellCount < 0) {
        alert("You're running on borrowed neurons now...");
        braincellCount = 0;
    }
    document.getElementById("braincellCount").innerText = braincellCount;
}
