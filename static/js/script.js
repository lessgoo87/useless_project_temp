function removeBraincell() {
    fetch('/remove', { method: 'POST' })
    .then(response => response.json())
    .then(data => {
        document.getElementById('braincellDisplay').innerText =
            `Remaining Braincells: ${data.braincells}`;

        if (data.braincells <= 5 && data.braincells > 3) {
            document.body.classList.add("shake");
        } else if (data.braincells <= 3 && data.braincells > 1) {
            let brain = document.createElement("div");
            brain.innerText = "🧠";
            brain.classList.add("brain-fly");
            brain.style.left = `${Math.random() * window.innerWidth}px`;
            document.body.appendChild(brain);
            setTimeout(() => brain.remove(), 3000);
        } else if (data.braincells <= 0) {
            document.body.style.transform = "rotate(180deg)";
            document.body.style.filter = "grayscale(100%)";
            alert("🧀 Congratulations. You’ve reached the intellectual level of a cheese stick.");
        }
    });
}

function addToLeaderboard() {
    let username = document.getElementById("username").value;
    fetch('/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username })
    })
    .then(() => location.reload());
}
