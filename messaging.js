document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const controllerBoxes = document.getElementById('controller-boxes');
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');

    // Retrieve user information from local storage
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    // Display user info on the page
    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Connect to the Socket.IO server
    const socket = io(); // Ensure this connects to the server

    // Emit a login event with user data
    socket.emit('login', {
        username,
        role: userRole,
        callsign: localStorage.getItem('callsign'), // Assuming callsign is stored in localStorage
        position: localStorage.getItem('position') // Assuming position is stored in localStorage
    });

    // Listen for user list updates from the server
    socket.on('userList', (users) => {
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

    // Send a message when the send button is clicked
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value;
        if (message) {
            // Emit the message to the server (you might want to add a specific event for this)
            socket.emit('message', { from: username, content: message });
            messageInput.value = ''; // Clear the input after sending
        }
    });
});