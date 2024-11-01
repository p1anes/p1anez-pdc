document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const controllersList = document.getElementById('controllers-list');
    const controllerBoxes = document.getElementById('controller-boxes');
    const messageDisplay = document.getElementById('message-display');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');

    // Get user role and info from local storage
    const userRole = localStorage.getItem('userRole'); // 'pilot' or 'controller'
    const username = localStorage.getItem('username'); // Username
    const callsign = localStorage.getItem('callsign'); // Callsign if pilot

    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Fetch connected controllers from the server
    fetch('/active-users')
        .then(response => response.json())
        .then(data => {
            // Create boxes for each controller
            data.controllers.forEach(controller => {
                const controllerBox = document.createElement('div');
                controllerBox.classList.add('controller-box');
                controllerBox.textContent = `${controller.username} (${controller.callsign})`;
                controllerBox.addEventListener('click', () => {
                    // Set selected controller
                    localStorage.setItem('selectedController', controller.callsign);
                    messageInput.value = `${controller.callsign}, request clearance to `;
                });
                controllerBoxes.appendChild(controllerBox);
            });
        })
        .catch(error => console.error('Error fetching controllers:', error));

    // Sending message logic
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            // Send message to the selected controller
            const selectedController = localStorage.getItem('selectedController');
            fetch('/send-message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: username,
                    message,
                    recipient: selectedController, // Send to selected controller
                }),
            })
            .then(response => response.json())
            .then(data => {
                // Display the message received
                const messageElement = document.createElement('div');
                messageElement.textContent = `${username} (${userRole}): ${message}`;
                messageDisplay.appendChild(messageElement);
                messageInput.value = ''; // Clear the input after sending
            })
            .catch(error => console.error('Error sending message:', error));
        }
    });

    // Preset message functionality
    const presetButtons = document.querySelectorAll('.preset-button');
    presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const type = button.getAttribute('data-type');
            let presetMessage = '';
            if (type === 'clearance') {
                presetMessage = `${localStorage.getItem('selectedController')}, request clearance to `;
            } else if (type === 'altitude') {
                presetMessage = `${localStorage.getItem('selectedController')} request flight level/altitude change to `;
            }
            messageInput.value = presetMessage; // Set the message input to the preset message
        });
    });
});