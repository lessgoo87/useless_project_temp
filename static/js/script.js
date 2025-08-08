let braincells = 50;
let username = "";
let isGlobal = false;

function startGame() {
    username = document.getElementById("username").value.trim();
    if (!username) {
        alert("Enter your name!");
        return;
    }
    isGlobal = document.querySelector('input[name="mode"]:checked').value === "global";

    document.getElementById("welcome-screen").classList.add("hidden");
    document.getElementById("game-screen").classList.remove("hidden");
    document.getElementById("braincells").innerText = braincells;
}

function loseBraincell() {
    if (braincells > 0) {
        braincells--;
        document.getElementById("braincells").innerText = braincells;
    }
    if (braincells === 0) {
        saveScore();
        alert("You’ve reached the intellectual level of a cheese stick 🧀");
    }
}

function saveScore() {
    fetch("/submit_score", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({name: username, score: braincells, global: isGlobal})
    }).then(res => res.json()).then(data => {
        console.log(data);
    });
}
