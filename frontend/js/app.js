const API_URL = 'http://localhost:5000/api';

let currentMode = 'future-self';
let messageData = {};

// light/dark theme toggle
const themeToggle = document.getElementById('global-theme-toggle');
themeToggle.addEventListener('click', toggleTheme);

function placeToggle(pageId) {
    const homeSlot = document.getElementById('toggle-placeholder');
    const messageSlot = document.getElementById('toggle-placeholder');

    if (pageId === 'homepage') {
        homeSlot.appendChild(themeToggle);
    } else if (pageId === 'message-input') {
        messageSlot.appendChild(themeToggle);
    }
}

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

// Page Navigation

function goToPage(pageId, mode = null) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (mode) {
        currentMode = mode;
        const title = document.getElementById('form-title');
        const emailGroup = document.getElementById('email-group');
        const schedulingSection = document.getElementById('scheduling-section');
        const formLabel = document.querySelector('.form-group label[for="message"]');

        if (currentMode === 'future-self') {
            title.textContent = 'Message to Future You';
            emailGroup.style.display = 'block';
            schedulingSection.style.display = 'block';
        } else if (currentMode === 'developer') {
            title.textContent = 'Message for Developer';
            formLabel.textContent = 'What do you want to tell the developer?';
            emailGroup.style.display = 'none';
            schedulingSection.style.display = 'none';
        }

        document.getElementById('message').value = '';
        document.getElementById('email').value = '';
        document.getElementById('schedule-checkbox').checked = false;
        toggleScheduling();
        placeToggle(pageId);
    }

}

// Scheduling toggle
function toggleScheduling() {
    const checkbox = document.getElementById('schedule-checkbox');
    const inputs = document.getElementById('schedule-inputs');

    if (checkbox.checked) {
        inputs.classList.add('active');
    } else {
        inputs.classList.remove('active');
    }
}

// Open confirmation
function openConfirmation() {
    const message =

        document.getElementById('message').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!message) {
        alert('Please write a message');
        return;
    }

    if (currentMode === 'future-self' && !email) {
        alert('Please enter your email address');
        return;
    }

    if (currentMode === 'future-self') {
        const scheduled = document.getElementById('schedule-checkbox').checked;
        if (scheduled) {
            const date = document.getElementById('schedule-date').value;
            const time = document.getElementById('schedule-time').value;
            if (!date || !time) {
                alert('Please select a date and time');
                return;
            }
        }
    }

    messageData = {
        message: message,
        email: email,
        mode: currentMode,
        scheduled:

            document.getElementById('schedule-checkbox').checked,
        date: document.getElementById('schedule-date').value,
        time: document.getElementById('schedule-time').value
    };

    // Display confirmation
    document.getElementById('modal-message-display').textContent = message;

    let details = '';
    if (currentMode === 'future-self') {
        details = `To: ${email}`;
        if (messageData.scheduled) {
            details += `<br>Scheduled: ${messageData.date} at ${messageData.time}`;

        } else {
            details += '<br>Sending: Now';
        }
    } else {
        details = 'Sending to developer immediately';
    }

    document.getElementById('modal-details').innerHTML = details;
    document.getElementById('confirmation-modal').classList.add('active');
}

// Close confirmation
function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('active');
}

// Sendmessage

async function sendMessage() {
    closeConfirmation();
    showLoading(true);

    try {
        let response;

        if (currentMode === 'future-self') {
            if (messageData.scheduled) {
                // Send scheduled message
                response = await fetch(`${API_URL}/messages/send-scheduled`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: messageData.message,
                        email: messageData.email,
                        scheduledDate: messageData.date,

                        scheduledTime: messageData.time
                    })
                });
            } else {
                // Send immediately to self
                const now = new Date();
                response = await fetch(`${API_URL}/messages/send-scheduled`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: messageData.message,
                        email: messageData.email,
                        scheduledDate: now.toISOString().split('T')[0],
                        scheduledTime: now.toTimeString().slice(0, 5)
                    })

                });
            }
        } else {
            // Send to developer
            response = await fetch(`${API_URL}/messages/send-immediate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: messageData.message
                })
            });
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send message');

        }

        showLoading(false);
        showSuccess();

    } catch (error) {
        showLoading(false);
        alert(`Error: ${error.message}`);
        console.error('Send error:', error);
    }
}

// loading overlay
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Show success popup
function showSuccess() {
    const successPopup = document.getElementById('success-popup');
    const successMessage = document.getElementById('success-message');

    if (currentMode === 'future-self') {
        if (messageData.scheduled) {
            successMessage.textContent = `Scheduled for ${messageData.date} at ${messageData.time}! 🚀`;
        } else {
            successMessage.textContent = 'Message sent to your email! 📬';
        }
    } else {
        successMessage.textContent = 'Thanks for the message! Developer will see it soon 💌';
    }

    successPopup.style.display = 'block';

    setTimeout(() => {
        successPopup.style.display = 'none';
        goToPage('homepage');
    }, 3000);
}

// Auto-hide welcome screen
setTimeout(() => {
    document.getElementById('welcome-screen').classList.remove('active');
    document.getElementById('homepage').classList.add('active');
}, 3000);

// Close modal when clicking outside

document.getElementById('confirmation-modal').addEventListener('click', (e) => {
    if (e.target.id === 'confirmation-modal') {
        closeConfirmation();
    }
});

// Initialize theme on page load
loadTheme();
