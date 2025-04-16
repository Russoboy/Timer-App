let timerInterval;
let elapsedTime = 0;
let isRunning = false;
let isCountdown = false;
let laps = []; // Array to store lap times

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const startCountdown = document.getElementById("start-countdown");
const resumeBtn = document.getElementById('resume-btn');
const alertSound = document.getElementById('alert-sound');
const lapBtn = document.getElementById('lap-btn'); // New lap button
const lapsList = document.getElementById('laps-list'); // Container for laps

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

function saveTimer() {
    localStorage.setItem("elapsedTime", elapsedTime);
    localStorage.setItem("isRunning", isRunning);
    localStorage.setItem("isCountdown", isCountdown);
    localStorage.setItem("laps", JSON.stringify(laps)); // Save laps data
}

function loadTimer() {
    const savedTime = localStorage.getItem("elapsedTime");
    const runningState = localStorage.getItem("isRunning");
    const countdownState = localStorage.getItem("isCountdown");
    const savedLaps = localStorage.getItem("laps");

    if (savedTime) {
        elapsedTime = parseInt(savedTime);
        updateDisplay();
    }
    
    if (countdownState) {
        isCountdown = countdownState === "true";
    }

    if (savedLaps) {
        laps = JSON.parse(savedLaps);
        renderLaps(); // Display saved laps
    }

    if (runningState === "true") {
         startBtn.click();
    }
}

function makeSound() {
    alertSound.play();
}

// Render laps to the DOM
function renderLaps() {
    lapsList.innerHTML = ''; // Clear existing laps
    
    if (laps.length === 0) {
        return; // No laps to display
    }
    
    laps.forEach((lap, index) => {
        const lapItem = document.createElement('div');
        lapItem.className = 'lap-item';
        
        // Calculate lap interval (time since previous lap)
        let lapInterval = lap;
        if (index > 0) {
            lapInterval = lap - laps[index - 1];
        }
        
        lapItem.innerHTML = `
            <span class="lap-number">Lap ${index + 1}</span>
            <span class="total-time">Total: ${formatTime(lap)}</span>
            <span class="lap-interval">Interval: ${formatTime(lapInterval)}</span>
        `;
        
        lapsList.appendChild(lapItem);
    });
}

// Record lap time
lapBtn.addEventListener("click", () => {
    if (isRunning && !isCountdown) { // Only allow laps in stopwatch mode
        laps.push(elapsedTime);
        renderLaps();
        saveTimer();
    }
});

// Start Stopwatch
startBtn.addEventListener("click", () => {
    if (!isRunning) {
        isCountdown = false;
        isRunning = true;
        timerInterval = setInterval(() => {
            elapsedTime += 10;
            updateDisplay();
            saveTimer();
        }, 10);
    }
});

resumeBtn.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        
        if (isCountdown) {
            // Resume countdown behavior
            timerInterval = setInterval(() => {
                if (elapsedTime <= 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "TIME'S UP!";
                    isRunning = false;
                    makeSound();
                } else {
                    elapsedTime -= 1000;
                    updateDisplay();
                    saveTimer();
                }
            }, 1000);
        } else {
            // Resume stopwatch behavior
            timerInterval = setInterval(() => {
                elapsedTime += 10;
                updateDisplay();
                saveTimer();
            }, 10);
        }
    }
});

// Pause Stopwatch
pauseBtn.addEventListener("click", () => {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        saveTimer();
    }
});

// Reset Both Stopwatch & Countdown
resetBtn.addEventListener("click", () => {
    clearInterval(timerInterval);
    elapsedTime = 0;
    isRunning = false;
    isCountdown = false;
    laps = []; // Clear laps
    renderLaps(); // Update laps display
    updateDisplay();
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("isRunning");
    localStorage.removeItem("isCountdown");
    localStorage.removeItem("laps");
});

// Start Countdown Timer
startCountdown.addEventListener("click", () => {
    if (!isRunning) {
        let hours = parseInt(document.getElementById("hour-down-timer").value) || 0;
        let minutes = parseInt(document.getElementById("minute-down-timer").value) || 0;
        let seconds = parseInt(document.getElementById("seconds-down-timer").value) || 0;

        elapsedTime = (hours * 3600 + minutes * 60 + seconds) * 1000;
        updateDisplay();

        if (elapsedTime > 0) {
            isCountdown = true;
            isRunning = true;
            // Clear laps when starting countdown
            laps = [];
            renderLaps();
            
            timerInterval = setInterval(() => {
                if (elapsedTime <= 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "TIME'S UP!";
                    isRunning = false;
                    makeSound();
                } else {
                    elapsedTime -= 1000;
                    updateDisplay();
                    saveTimer();
                }
            }, 1000);
        }
    }
});

// Keyboard Shortcuts
document.addEventListener("keydown", (event) => {
    if (event.shiftKey) {
        switch (event.key.toUpperCase()) {
            case 'S': startBtn.click(); break;
            case 'P': pauseBtn.click(); break;
            case 'E': resetBtn.click(); break;
            case 'C': startCountdown.click(); break;
            case 'R': resumeBtn.click(); break;
            case 'L': lapBtn.click(); break; // Added keyboard shortcut for lap
        }
    }
});

document.addEventListener("DOMContentLoaded", loadTimer);

// Initialize display
updateDisplay();
