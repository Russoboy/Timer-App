let timerInterval;
let elapsedTime = 0;
let isRunning = false;

const timerDisplay = document.getElementById("timer-display");
const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");
const startCountdown = document.getElementById("start-countdown");
const resumeBtn = document.getElementById('resume-btn')
const alertSound = document.getElementById('alert-sound')
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
}

function loadTimer() {
    const savedTime = localStorage.getItem("elapsedTime");
    const runningState = localStorage.getItem("isRunning");
    
    if (savedTime) {
        elapsedTime = parseInt(savedTime);
        updateDisplay();
    }
    
    if (runningState === "true") {
        // startBtn.click();
    }
}

function makeSound() {
    alertSound.play();
}

// Start Stopwatch
startBtn.addEventListener("click", () => {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            elapsedTime += 10;
            updateDisplay();
        }, 10);
    }
});

resumeBtn.addEventListener("click", ()=>{
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            elapsedTime += 10;
            updateDisplay();
        }, 10);
    }

})

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
    updateDisplay();
    localStorage.removeItem("elapsedTime");
    localStorage.removeItem("isRunning");
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
            isRunning = true;
            timerInterval = setInterval(() => {
                if (elapsedTime <= 0) {
                    clearInterval(timerInterval);
                    timerDisplay.textContent = "TIME'S UP!";
                    isRunning = false;
                    makeSound();
                    // alert("Time is Up");
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
        }
    }
});

document.addEventListener("DOMContentLoaded", loadTimer);

// Initialize display
updateDisplay();
