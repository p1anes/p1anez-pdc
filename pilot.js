const socket = io();
let selectedControllerId = null;

socket.emit('registerUser' , {
    callsign: localStorage.getItem('callsign'),
    position: 'pilot'
});

// Fetch available controllers
socket.emit('requestControllers');

// Populate the controller list
socket.on('updateControllers', (controllers) => {
    const controllerBoxes = document.getElementById('controller-boxes');
    controllerBoxes.innerHTML = ''; // Clear existing list

    controllers.forEach(controller => {
        const controllerBox = document.createElement('div');
        controllerBox.classList.add('user-box');
        controllerBox.setAttribute('data-id', controller.id);
        controllerBox.textContent = `${controller.callsign} - ${controller.position}`;

        controllerBox.addEventListener('click', () => {
            // Remove 'selected' styling from other boxes
            document.querySelectorAll('.user-box').forEach(box => box.classList.remove('selected-user'));
            // Apply 'selected' styling to the clicked box
            controllerBox.classList.add('selected-user');
            selectedControllerId = controller.id; // Store selected controller ID
        });

        controllerBoxes.appendChild(controllerBox);
    });
});

// Handle button clicks to create messages
document.getElementById('request-ifr-clearance').addEventListener('click', () => {
    const destination = prompt("Enter the destination airport:");
    if (selectedControllerId && destination) {
        const message = `${selectedControllerId}, ${localStorage.getItem('callsign')}, request IFR clearance to ${destination}`;
        document.getElementById('message-output').textContent = message; // Display message
        socket.emit('privateMessage', { recipientId: selectedControllerId, message });
    } else {
        alert("Please select a controller and enter a destination.");
    }
});

document.getElementById('request-taxi').addEventListener('click', () => {
    if (selectedControllerId) {
        const message = `${selectedControllerId}, ${localStorage.getItem('callsign')}, request taxi.`;
        document.getElementById('message-output').textContent = message; // Display message
        socket.emit('privateMessage', { recipientId: selectedControllerId, message });
    } else {
        alert("Please select a controller.");
    }
});

document.getElementById('request-fl-change').addEventListener('click', () => {
    const direction = prompt("Enter climb or descend:");
    const altitude = prompt("Enter flight level or altitude:");
    if (selectedControllerId && direction && altitude) {
        const message = `${selectedControllerId}, ${localStorage.getItem('callsign')}, request ${direction} to ${altitude}`;
        document.getElementById('message-output').textContent = message; // Display message
        socket.emit('privateMessage', { recipientId: selectedControllerId, message });
    } else {
        alert("Please select a controller and enter climb/descend and altitude.");
    }
});