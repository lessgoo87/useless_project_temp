document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const mainCounter = document.getElementById('main-counter');
    const brainCellCountDisplay = document.getElementById('brain-cell-count');
    const startButton = document.getElementById('start-button');
    const timerInput = document.getElementById('timer-input');

    let brainCells;
    let timerId;

    // --- Interactive AI Logic ---
    const canvas = document.getElementById('ai-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400; 
    canvas.height = 200;
    let particles = [];
    const particleCount = 50;

    class Particle {
        constructor(x, y, radius, color) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.color = color;
            this.velocity = {
                x: (Math.random() - 0.5) * 1,
                y: (Math.random() - 0.5) * 1
            };
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.closePath();
        }
        update() {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.velocity.x = -this.velocity.x;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.velocity.y = -this.velocity.y;
            }
            this.draw();
        }
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 5 + 2;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const color = getRandomColor();
        particles.push(new Particle(x, y, radius, color));
    }
    
    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
        });
    }
    animate();

    // --- Timer Logic ---
    function updateDisplay() {
        brainCellCountDisplay.textContent = brainCells.toLocaleString();
    }

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
            brainCells--;
            updateDisplay();

            if (brainCells <= 0) {
                clearInterval(timerId);
                brainCellCountDisplay.textContent = "0";
                alert("All your brain cells are gone! Refresh the page to get more.");
            }
        }, 1000);
    }

    startButton.addEventListener('click', startCountdown);
});