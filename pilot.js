const socket = io();
let selectedControllerId = null;

// Register the pilot upon connecting
socket.emit('registerUser', {
    callsign: localStorage.getItem('callsign'),
    position: 'pilot'
});

// Populate the controller list
socket.on('updateControllers', (controllers) => {
    const controllerBoxes = document.getElementById('controller-boxes');
    controllerBoxes.innerHTML = ''; // Clear the list before adding new entries

    controllers.forEach((controller) => {
        const listItem = document.createElement('div');
        listItem.textContent = controller.callsign;
        listItem.classList.add('selectable-user');
        listItem.addEventListener('click', () => {
            selectedControllerId = controller.id;
            highlightSelectedUser(listItem);
        });
        controllerBoxes.appendChild(listItem);
    });
});

// Highlight selected user
function highlightSelectedUser(element) {
    document.querySelectorAll('.selectable-user').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
}

// Request IFR Clearance button
document.getElementById('request-ifr-clearance').addEventListener('click', () => {
    const destination = prompt("Enter destination airport:");
    if (!selectedControllerId || !destination.trim()) {
        alert("Please select a controller and fill in all fields.");
        return;
    }
    const message = `${localStorage.getItem('callsign')}, request clearance to ${destination}`;
    socket.emit('privateMessage', {
        recipientId: selectedControllerId,
        message: message
    });
});

// Request Taxi button
document.getElementById('request-taxi').addEventListener('click', () => {
    if (!selectedControllerId) {
        alert("Please select a controller.");
        return;
    }
    const message = `${localStorage.getItem('callsign')}, request taxi`;
    socket.emit('privateMessage', {
        recipientId: selectedControllerId,
        message: message
    });
});

// Request Flight Level Change button
document.getElementById('request-fl-change').addEventListener('click', () => {
    const climbOrDescend = prompt("Enter 'climb' or 'descend':");
    const flightLevel = prompt("Enter desired flight level or altitude:");
    if (!selectedControllerId || !climbOrDescend.trim() || !flightLevel.trim()) {
        alert("Please select a controller and fill in all fields.");
        return;
    }
    const message = `${localStorage.getItem('callsign')}, request ${climbOrDescend} to ${flightLevel}`;
    socket.emit('privateMessage', {
        recipientId: selectedControllerId,
        message: message
    });
});

// Free Text Message
document.getElementById('send-message-button').addEventListener('click', () => {
    const message = document.getElementById('free-text-message').value;
    if (!selectedControllerId || !message.trim()) {
        alert("Please select a controller and fill in the message.");
        return;
    }
    socket.emit('privateMessage', {
        recipientId: selectedControllerId,
        message: `${localStorage.getItem('callsign')}, ${message}`
    });
    document.getElementById('free-text-message').value = ''; // Clear the text area
});

// Display incoming private messages
socket.on('privateMessage', ({ message, from }) => {
    displayMessage(from, message);
});

function displayMessage(from, message) {
    const messagesContainer = document.getElementById('message-output');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${from}: ${message}`;
    messageElement.classList.add('message');
    messagesContainer.appendChild(messageElement);
}
