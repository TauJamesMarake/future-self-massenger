const API_URL = 'http://localhost:5000/api';

let currentMode = 'future-self';
let messageData = {};

function initPage() {
    // Get mode from sessionStorage
    const mode = sessionStorage.getItem('messageMode') || 'future-self';
    currentMode = mode;


    loadTheme();

    setupFormMode(mode);

    // Close modal when clicking outside
    document.getElementById('confirmation-modal').addEventListener('click', (e) => {
        if (e.target.id === 'confirmation-modal') {
            closeConfirmation();
        }
    });
}
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

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark-mode';
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(savedTheme);
    themeToggle.textContent = savedTheme === 'dark-mode' ? '🌙' : '☀️';
}

// Set up form based on message mode
function setupFormMode(mode) {
    const title = document.getElementById('title');
    const emailGroup = document.getElementById('email-group');
    const schedulingSection = document.getElementById('scheduling-section');

    if (mode === 'future-self') {
        title.textContent = 'What do you want to tell yourself?';
        emailGroup.style.display = 'block';
        schedulingSection.style.display = 'block';
    } else if (mode === 'developer') {
        title.textContent = 'Message for Developer';
        emailGroup.style.display = 'none';
        schedulingSection.style.display = 'none';
    }

    document.getElementById('message').value = '';
    document.getElementById('email').value = '';
    document.getElementById('schedule-checkbox').checked = false;
    toggleScheduling();
}

// Scheduling Toggle
function toggleScheduling() {
    const checkbox = document.getElementById('schedule-checkbox');
    const inputs = document.getElementById('schedule-inputs');

    if (checkbox.checked) {
        inputs.classList.add('active');
    } else {
        inputs.classList.remove('active');
    }
}

// Open Confirmation
function openConfirmation() {
    const message = document.getElementById('message').value.trim();
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
        scheduled: document.getElementById('schedule-checkbox').checked,
        date: document.getElementById('schedule-date').value,
        time: document.getElementById('schedule-time').value
    };

    // Display confirmation
    document.getElementById('modal-message-display').textContent = message;

    let details = '';
    if (currentMode === 'future-self') {
        details = `📧 To: ${email}`;
        if (messageData.scheduled) {
            details += `<br>⏰ Scheduled: ${messageData.date} at ${messageData.time}`;
        } else {
            details += '<br>⏰ Sending: Now';
        }
    } else {
        details = '📧 Sending to developer immediately';
    }

    document.getElementById('modal-details').innerHTML = details;
    document.getElementById('confirmation-modal').classList.add('active');
}

// Close Confirmation
function closeConfirmation() {
    document.getElementById('confirmation-modal').classList.remove('active');
}

// Send Message
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

// Show Loading Overlay
function showLoading(show) {
    const overlay = document.getElementById('loading-overlay');
    overlay.style.display = show ? 'flex' : 'none';
}

// Show Success Popup
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
        goBack();
    }, 3000);
}

function goBack() {
    sessionStorage.removeItem('messageMode');
    window.location.href = 'index.html';
}

initPage();