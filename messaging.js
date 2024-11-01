document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const messageDisplay = document.getElementById('message-display');
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');

    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    // Display user info
    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Connect to the Socket.IO server
    const socket = io('http://localhost:3000'); // Explicitly define server address

    // Log connection status
    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    // Listen for user list updates from the server
    socket.on('userList', (users) => {
        const controllerBoxes = document.getElementById('controller-boxes');
        controllerBoxes.innerHTML = ''; // Clear existing boxes
        users.forEach(user => {
            if (user.role === 'controller') { // Only show controllers
                const box = document.createElement('div');
                box.className = 'controller-box';
                box.textContent = `${user.username} (${user.callsign})`;
                controllerBoxes.appendChild(box);
            }
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