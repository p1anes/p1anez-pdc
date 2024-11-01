document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const userInfo = document.getElementById('user-info');
    const controllersList = document.getElementById('controllers-list');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');

    // Handle form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent the form from submitting traditionally

        const username = document.getElementById('username').value;
        const role = document.getElementById('role').value;
        const callsign = role === 'pilot' ? document.getElementById('callsign').value : '';

        // Make an API call to log in
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, role, callsign }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', role);
                localStorage.setItem('callsign', callsign);
                userInfo.textContent = `Logged in as: ${username} (${role})`;
                fetchControllers(); // Fetch controllers after logging in
            } else {
                // Handle login error
                console.error(data.error);
            }
        })
        .catch(error => console.error('Error logging in:', error));
    });

    // Function to fetch connected controllers
    function fetchControllers() {
        fetch('/api/controllers')
            .then(response => response.json())
            .then(controllers => {
                controllersList.innerHTML = ''; // Clear previous list
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
        const sender = localStorage.getItem('username');
        const role = localStorage.getItem('userRole');
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