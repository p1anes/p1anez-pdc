document.addEventListener("DOMContentLoaded", () => {
    const userInfo = document.getElementById('user-info');
    const controllersList = document.getElementById('controllers-list');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');

    // Load user data from local storage
    const userRole = localStorage.getItem('userRole'); // 'pilot' or 'controller'
    const username = localStorage.getItem('username'); // Replace with actual username
    const callsign = localStorage.getItem('callsign'); // Replace with actual callsign if pilot

    userInfo.textContent = `Logged in as: ${username} (${userRole})`;

    // Check if user is a pilot and fetch controllers
    if (userRole === 'pilot') {
        fetch('/api/controllers')
            .then(response => response.json())
            .then(controllers => {
                controllers.forEach(controller => {
                    const controllerBox = document.createElement('div');
                    controllerBox.classList.add('controller-box');
                    controllerBox.textContent = controller.username; // Display username instead
                    controllerBox.addEventListener('click', () => {
                        localStorage.setItem('selectedController', controller.username);
                        messageInput.value = `${controller.username}, request clearance to `;
                    });
                    controllersList.appendChild(controllerBox);
                });
            })
            .catch(error => console.error('Error fetching controllers:', error));
    }

    // Sending message logic
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        const sender = username;
        const role = userRole;
        const recipient = localStorage.getItem('selectedController');

        if (message && recipient) {
            fetch('/api/sendMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sender, role, message, recipient }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const messageElement = document.createElement('div');
                    messageElement.textContent = `${role} ${sender}: ${message}`;
                    document.getElementById('message-display').appendChild(messageElement);
                    messageInput.value = ''; // Clear the input after sending
                } else {
                    console.error(data.error);
                }
            })
            .catch(error => console.error('Error sending message:', error));
        } else {
            console.error('Message or recipient is missing.');
        }
    });
});