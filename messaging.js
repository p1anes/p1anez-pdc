document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const controllersList = document.getElementById('controllers-list');
    const controllerBoxes = document.getElementById('controller-boxes');
    const messageDisplay = document.getElementById('message-display');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');

    // Initialize socket.io
    const socket = io();

    const userRole = localStorage.getItem('userRole'); // 'pilot' or 'controller'
    const username = localStorage.getItem('username'); // Replace with actual username
    const callsign = localStorage.getItem('callsign'); // Replace with actual callsign if pilot

    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Send user data on login
    socket.emit('login', { username, role: userRole, callsign });

    // Listen for updated user list
    socket.on('userList', (users) => {
        controllerBoxes.innerHTML = ''; // Clear current boxes
        users.forEach(user => {
            if (user.role === 'controller') {
                const controllerBox = document.createElement('div');
                controllerBox.classList.add('controller-box');
                controllerBox.textContent = user.username + (user.callsign ? ` (${user.callsign})` : '');
                controllerBox.addEventListener('click', () => {
                    localStorage.setItem('selectedController', user.username);
                    messageInput.value = `${user.username}, request clearance to `;
                });
                controllerBoxes.appendChild(controllerBox);
            }
        });
    });

    // Sending message logic
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        const selectedController = localStorage.getItem('selectedController');

        if (message && selectedController) {
            // Emit the message to the selected controller
            socket.emit('sendMessage', {
                sender: username,
                message: message,
                recipient: selectedController,
            });

            // Display the message locally
            const messageElement = document.createElement('div');
            messageElement.textContent = `${username} (Pilot): ${message}`;
            messageDisplay.appendChild(messageElement);
            messageInput.value = ''; // Clear the input after sending
        }
    });

    // Listen for incoming messages
    socket.on('receiveMessage', (data) => {
        const { sender, message } = data;
        const messageElement = document.createElement('div');
        messageElement.textContent = `${sender} (Controller): ${message}`;
        messageDisplay.appendChild(messageElement);
    });
});