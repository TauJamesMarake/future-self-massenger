
// light/dark theme toggle
const themeToggle = document.getElementById('global-theme-toggle');
themeToggle.addEventListener('click', toggleTheme);

function toggleTheme() {
    const body = document.body;
    const toggle = document.querySelector('.theme-toggle');

    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        toggle.textContent = '☀️';
        localStorage.setItem('theme', 'light-mode');
    }
    else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        toggle.textContent = '🌙';
        localStorage.setItem('theme', 'dark-mode');
    }
}

// Load saved theme
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(savedTheme);
    // const toggle = document.querySelector('.theme-toggle');
    themeToggle.textContent = savedTheme === 'dark-mode' ? '🌙' : '☀️';
}

// Navigate to message input page
function goToPage(mode) {
    // Store the mode in sessionStorage
    sessionStorage.setItem('messageMode', mode);
    window.location.href = 'message-input.html';
}

// auto-hide welcome screen
setTimeout(() => {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('homepage').classList.add('active');
}, 3000);

// Initialize theme on page load
loadTheme();