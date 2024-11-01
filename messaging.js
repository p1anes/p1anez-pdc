document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const messageDisplay = document.getElementById('message-display');
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');

    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    // Display user info
    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Fetch available controllers
    fetch('/api/controllers') // Adjust your endpoint accordingly
        .then(response => response.json())
        .then(data => {
            const controllerBoxes = document.getElementById('controller-boxes');
            data.forEach(controller => {
                const box = document.createElement('div');
                box.className = 'controller-box';
                box.textContent = `${controller.username} (${controller.callsign})`;
                controllerBoxes.appendChild(box);
            });
        });

    // Message sending functionality
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            const messageElement = document.createElement('div');
            messageElement.textContent = `${username} (${userRole}): ${message}`;
            messageDisplay.appendChild(messageElement);
            messageInput.value = ''; // Clear input
            // Optionally, send the message to your server here
        }
    });
});
