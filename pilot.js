const socket = io();
let selectedControllerId = null;

// Display logged-in user info
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem('username');
    const callsign = localStorage.getItem('callsign');

    document.getElementById('user-info').textContent = `Logged in as: ${username} (${callsign})`;
    
    // Load available controllers
    socket.emit('requestControllers'); // Request the list of controllers
});

// Update available controllers list
socket.on('updateControllers', (controllers) => {
    const availableControllers = document.getElementById('available-controllers');
    availableControllers.innerHTML = ''; // Clear existing list

    controllers.forEach(controller => {
        const controllerBox = document.createElement('div');
        controllerBox.textContent = `${controller.username} (${controller.position})`;
        controllerBox.addEventListener('click', () => {
            selectedControllerId = controller.id; // Store selected controller ID
        });
        availableControllers.appendChild(controllerBox);
    });
});

// Handle sending messages
document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message-input').value.trim();
    if (message) {
        socket.emit('privateMessage', { recipientId: selectedControllerId, message });
        document.getElementById('message-input').value = ''; // Clear input
    } else {
        alert('Type a message before sending.');
    }
});

// Handle premade message button clicks
document.querySelectorAll('.premade-button').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.message;
        let premadeMessage = '';

        if (selectedControllerId) {
            const destination = prompt("Enter destination airport:") || 'destination';
            const flightLevel = prompt("Enter flight level or altitude:") || 'FL';

            switch (action) {
                case "Request IFR Clearance":
                    premadeMessage = `${document.getElementById('user-info').textContent.split(' ')[2]}, ${callsign}, request clearance to ${destination}`;
                    break;
                case "Request Taxi":
                    premadeMessage = `${document.getElementById('user-info').textContent.split(' ')[2]}, ${callsign}, request taxi`;
                    break;
                case "Request FL Change":
                    const climbOrDescend = prompt("Choose: climb or descend") || 'climb';
                    premadeMessage = `${document.getElementById('user-info').textContent.split(' ')[2]}, ${callsign}, request ${climbOrDescend} to ${flightLevel}`;
                    break;
            }

            if (premadeMessage) {
                document.getElementById('message-input').value = premadeMessage; // Set message input to premade message
            }
        } else {
            alert("Select a controller before sending a message.");
        }
    });
});
