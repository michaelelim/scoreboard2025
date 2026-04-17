document.addEventListener('DOMContentLoaded', () => {
    const scoreElements = document.querySelectorAll('.score');
    const startButton = document.getElementById('start');
    const stopButton = document.getElementById('stop');
    const resetButton = document.getElementById('reset');
    const timerElement = document.getElementById('timerDisplay');
    const teamA = document.getElementById('teamA');
    const teamB = document.getElementById('teamB');
    const teamANameInput = document.getElementById('teamAName');
    const teamBNameInput = document.getElementById('teamBName');
    const toggleButton = document.getElementById('toggleControls');
    const controls = document.getElementById('controls');
    const app = document.getElementById('app');
    const changeColorA = document.getElementById('changeColorA');
    const changeColorB = document.getElementById('changeColorB');
    const toggleClockButton = document.getElementById('toggleClock');
    const countdownInput = document.getElementById('countdownInput');

    let scores = [0, 0];
    let timer;
    let seconds = 0;
    let isClockMode = false;
    let countdownSeconds = 0;
    let mode = 0; // 0: Stopwatch, 1: Clock, 2: Countdown Timer

    const colors = [
        '#2F4F4F', // Dark Slate Gray
        '#556B2F', // Dark Olive Green
        '#8B0000', // Dark Red
        '#483D8B', // Dark Slate Blue
        '#2E8B57', // Sea Green
        '#4B0082', // Indigo
        '#800000', // Maroon
        '#191970', // Midnight Blue
        '#008080', // Teal
        '#B8860B',  // Dark Goldenrod
        '#000000', // Black
    ];

    let colorIndexA = 0;
    let colorIndexB = 0;

    function updateScores() {
        scoreElements.forEach((el, index) => {
            el.textContent = scores[index];
        });
    }

    function updateTimer() {
        const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        timerElement.textContent = `${hrs}:${mins}:${secs}`;
    }

    function updateClock() {
        const now = new Date();
        let hrs = now.getHours();
        const mins = String(now.getMinutes()).padStart(2, '0');
        const secs = String(now.getSeconds()).padStart(2, '0');
        const ampm = hrs >= 12 ? 'PM' : 'AM';
        hrs = hrs % 12 || 12; // Convert to 12-hour format
        timerElement.textContent = `${String(hrs).padStart(2, '0')}:${mins}:${secs} ${ampm}`;
    }

    function updateCountdown() {
        const hrs = String(Math.floor(countdownSeconds / 3600)).padStart(2, '0');
        const mins = String(Math.floor((countdownSeconds % 3600) / 60)).padStart(2, '0');
        const secs = String(countdownSeconds % 60).padStart(2, '0');
        timerElement.textContent = `${hrs}:${mins}:${secs} - Timer`;
    }

    function parseTimeInput(input) {
        const parts = input.split(':');
        const mins = parseInt(parts[0], 10) || 0;
        const secs = parseInt(parts[1], 10) || 0;
        return mins * 60 + secs;
    }

    function startStopwatch() {
        if (!timer) {
            timer = setInterval(() => {
                seconds++;
                updateTimer();
            }, 1000);
        }
    }

    startButton.addEventListener('click', () => {
        if (mode === 0 && !timer) { // Stopwatch
            timer = setInterval(() => {
                seconds++;
                updateTimer();
            }, 1000);
        } //else if (mode === 2 && !timer) { // Countdown Timer
            //timer = setInterval(() => {
                //if (countdownSeconds > 0) {
                    //countdownSeconds--;
                    //updateCountdown();
                //} else {
                    //clearInterval(timer);
                    //alert('Time is up!');
                //}
            //}, 1000);
        //}
    });

    stopButton.addEventListener('click', () => {
        clearInterval(timer);
        timer = null;
    });

    resetButton.addEventListener('click', () => {
        scores = [0, 0];
        seconds = 0;
        updateScores();
        updateTimer();
        clearInterval(timer);
        timer = null;
    });

    teamA.addEventListener('click', (e) => {
        const rect = teamA.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width / 2) {
            scores[0]--;
        } else {
            scores[0]++;
        }
        updateScores();
    });

    teamB.addEventListener('click', (e) => {
        const rect = teamB.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        if (clickX < rect.width / 2) {
            scores[1]--;
        } else {
            scores[1]++;
        }
        updateScores();
    });

    // Names are now in the top timer bar, no sync needed

    toggleButton.textContent = '-';

    toggleButton.addEventListener('click', () => {
        controls.classList.toggle('show');
        app.classList.toggle('expanded');
        toggleButton.textContent = controls.classList.contains('show') ? '−' : '+';
    });

    countdownInput.addEventListener('input', () => {
        countdownSeconds = parseTimeInput(countdownInput.value);
        updateCountdown();
    });

    countdownSeconds = parseTimeInput(countdownInput.value);
    updateCountdown();

    countdownInput.style.display = 'block';

    toggleClockButton.addEventListener('click', () => {
        // mode = (mode + 1) % 2;
        mode = (mode + 1) % 2; // Only cycle between Stopwatch and Clock
        clearInterval(timer);

        if (mode === 0) { // Stopwatch
            countdownInput.style.display = 'none';
            seconds = 0;
            updateTimer();
        } else if (mode === 1) { // Clock
            countdownInput.style.display = 'none';
            timer = setInterval(updateClock, 1000);
        } else if (mode === 2) { // Countdown Timer
            countdownInput.style.display = 'block';
            countdownInput.value = '55:00';
            countdownSeconds = parseTimeInput(countdownInput.value);
            updateCountdown();
        }
    });

    changeColorA.addEventListener('click', (e) => {
        e.stopPropagation();
        teamA.style.backgroundColor = colors[colorIndexA];
        colorIndexA = (colorIndexA + 1) % colors.length;
    });

    changeColorB.addEventListener('click', (e) => {
        e.stopPropagation();
        teamB.style.backgroundColor = colors[colorIndexB];
        colorIndexB = (colorIndexB + 1) % colors.length;
    });

    updateScores();
    updateTimer();

    // Call the start function for the stopwatch
    if (mode === 0) { // Ensure it's in stopwatch mode
        startStopwatch();
    }
});
