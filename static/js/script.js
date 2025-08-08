document.getElementById("remove-btn").addEventListener("click", () => {
    fetch("/remove_braincell", { method: "POST" })
        .then(res => res.json())
        .then(data => {
            document.getElementById("braincells").textContent = data.braincells;
            document.getElementById("quote").textContent = data.message;

            // Chaos animations
            if (data.braincells <= 5 && data.braincells > 2) {
                document.body.style.transform = "rotate(1deg)";
                setTimeout(() => document.body.style.transform = "rotate(0deg)", 100);
            } else if (data.braincells <= 2 && data.braincells > 0) {
                document.body.style.filter = "grayscale(30%)";
            } else if (data.braincells === 0) {
                document.body.style.transform = "rotate(180deg)";
                document.body.style.filter = "grayscale(100%)";
            }
        });
});
