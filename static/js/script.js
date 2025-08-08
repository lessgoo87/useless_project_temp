document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainCounter = document.getElementById('main-counter');
    const brainCellCountDisplay = document.getElementById('brain-cell-count');
    const startButton = document.getElementById('start-button');
    const timerInput = document.getElementById('timer-input');

    let brainCells;
    let timerId;

    // Function to update the display
    function updateDisplay() {
        // Format the number with commas for better readability
        brainCellCountDisplay.textContent = brainCells.toLocaleString();
    }

    // Function to start the countdown
    function startCountdown() {
        const duration = parseInt(timerInput.value, 10);
        
        if (isNaN(duration) || duration <= 0) {
            alert("Please enter a valid number of seconds.");
            return;
        }

        brainCells = duration;
        updateDisplay();
        
        welcomeScreen.classList.add('hidden');
        mainCounter.classList.remove('hidden');
        
        timerId = setInterval(() => {
            // Decrease the number of "brain cells"
            brainCells--;
            
            // Update the display
            updateDisplay();

            // Stop the timer if the count reaches zero
            if (brainCells <= 0) {
                clearInterval(timerId);
                brainCellCountDisplay.textContent = "0";
                alert("All your brain cells are gone! Refresh the page to get more.");
            }
        }, 1000); // Update every 1000 milliseconds (1 second)
    }

    // Add a click event listener to the button
    startButton.addEventListener('click', startCountdown);
});