document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const messageDisplay = document.getElementById('message-display');
    const sendMessageButton = document.getElementById('send-message');
    const messageInput = document.getElementById('message-input');

    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');

    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    const socket = io('http://localhost:3000');

    socket.on('connect', () => {
        console.log('Connected to server');
    });

    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });

    // Listen for user list updates from the server
    socket.on('userList', (users) => {
        console.log('Received user list:', users); // Log received user list

        const controllerBoxes = document.getElementById('controller-boxes');
        controllerBoxes.innerHTML = ''; // Clear existing boxes

        users.forEach(user => {
            if (user.role === 'controller') { // Only show controllers
                const box = document.createElement('div');
                box.className = 'controller-box';
                box.textContent = `${user.username} (${user.position || user.callsign})`;
                controllerBoxes.appendChild(box);
            }
        });
    });
});