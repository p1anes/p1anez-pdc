document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const controllersList = document.getElementById('controllers-list');
    const controllerBoxes = document.getElementById('controller-boxes');
    const messageDisplay = document.getElementById('message-display');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');

    // Simulate user role and info (replace with actual user data)
    const userRole = localStorage.getItem('userRole'); // 'pilot' or 'controller'
    const username = localStorage.getItem('username'); // Replace with actual username
    const callsign = localStorage.getItem('callsign'); // Replace with actual callsign if pilot

    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Simulate connected controllers (replace this with actual dynamic data)
    const connectedControllers = [
        { name: 'RobloxMaster6 (IRFD_TWR)' },
        { name: 'RobloxMaster8 (IMLR_TWR)' },
        // Add more controller names as necessary
    ];

    // Create boxes for each controller
    connectedControllers.forEach(controller => {
        const controllerBox = document.createElement('div');
        controllerBox.classList.add('controller-box');
        controllerBox.textContent = controller.name;
        controllerBox.addEventListener('click', () => {
            // Set selected controller
            localStorage.setItem('selectedController', controller.name);
            messageInput.value = `${controller.name}, request clearance to `;
        });
        controllerBoxes.appendChild(controllerBox);
    });

    // Sending message logic
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            // Display the message
            const messageElement = document.createElement('div');
            messageElement.textContent = `${username} (${userRole}): ${message}`;
            messageDisplay.appendChild(messageElement);
            messageInput.value = ''; // Clear the input after sending
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