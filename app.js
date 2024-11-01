document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const userInfo = document.getElementById('user-info');
    const controllersList = document.getElementById('controllers-list');
    const controllerBoxes = document.getElementById('controller-boxes');
    const messageDisplay = document.getElementById('message-display');
    const messageInput = document.getElementById('message-input');
    const sendMessageButton = document.getElementById('send-message');
    const errorMessage = document.getElementById('error-message');

    // Event listener for the role selection
    const roleSelect = document.getElementById('role');
    roleSelect.addEventListener('change', (event) => {
        const selectedRole = event.target.value;
        if (selectedRole === 'pilot') {
            document.getElementById('callsign').style.display = 'inline-block';
            document.getElementById('extraInfo').style.display = 'none';
        } else {
            document.getElementById('callsign').style.display = 'none';
            document.getElementById('extraInfo').style.display = 'inline-block';
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const callsign = document.getElementById('callsign').value.trim();
        const position = document.getElementById('extraInfo').value;

        if (!username) {
            errorMessage.textContent = 'Username must be filled out.';
            return;
        }

        if (roleSelect.value === 'pilot' && !callsign) {
            errorMessage.textContent = 'Callsign must be filled out.';
            return;
        }

        if (roleSelect.value === 'controller' && position === '') {
            errorMessage.textContent = 'Position must be selected.';
            return;
        }

        // Store user info in localStorage
        const userRole = roleSelect.value;
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('username', username);
        if (userRole === 'pilot') {
            localStorage.setItem('callsign', callsign);
        } else {
            localStorage.setItem('position', position);
        }

        // Redirect to the messaging page (or update UI for messaging)
        window.location.href = 'messaging.html'; // Replace with the actual messaging page URL
    });

    // Here, you will fetch the connected controllers from your server.
    fetch('/api/controllers') // Adjust the API endpoint as necessary
        .then(response => response.json())
        .then(controllers => {
            controllers.forEach(controller => {
                const controllerBox = document.createElement('div');
                controllerBox.classList.add('controller-box');
                controllerBox.textContent = controller.name; // Use the actual controller name from the server
                controllerBox.addEventListener('click', () => {
                    // Set selected controller
                    localStorage.setItem('selectedController', controller.name);
                    messageInput.value = `${controller.name}, request clearance to `;
                });
                controllerBoxes.appendChild(controllerBox);
            });
        })
        .catch(error => {
            console.error('Error fetching controllers:', error);
        });

    // Sending message logic
    sendMessageButton.addEventListener('click', () => {
        const message = messageInput.value.trim();
        if (message) {
            // Display the message
            const messageElement = document.createElement('div');
            messageElement.textContent = `${localStorage.getItem('username')} (${localStorage.getItem('userRole')}): ${message}`;
            messageDisplay.appendChild(messageElement);
            messageInput.value = ''; // Clear the input after sending

            // Send the message to the server
            fetch('/api/sendMessage', { // Adjust the API endpoint as necessary
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: localStorage.getItem('username'),
                    role: localStorage.getItem('userRole'),
                    message: message,
                    recipient: localStorage.getItem('selectedController'), // Optional, depending on your backend logic
                }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Message sent successfully:', data);
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
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