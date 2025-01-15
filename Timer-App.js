let timerInterval;
let elapsedTime = 0; // Tracks time in milliseconds
let isRunning = false;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

// Format time into HH:MM:SS:MS
function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");
    const milliseconds = String(ms % 1000).padStart(3, "0");
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
}

// Update the display
function updateDisplay() {
    timerDisplay.textContent = formatTime(elapsedTime);
}

// Start the timer
startBtn.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            elapsedTime += 10; // Increment by 10ms
            updateDisplay();
        }, 10); // Update every 10ms
    }
});

// Pause the timer
pauseBtn.addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
    }
});

// Reset the timer
resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    updateDisplay();
});

// Initialize display
updateDisplay();
