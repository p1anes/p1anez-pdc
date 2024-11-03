const socket = io();
let selectedPilotId = null;

// Register the controller upon connecting
socket.emit('registerUser', {
    callsign: localStorage.getItem('callsign'),
    position: 'controller'
});

// Populate the pilot list
socket.on('updatePilots', (pilots) => {
    const pilotBoxes = document.getElementById('pilot-boxes');
    pilotBoxes.innerHTML = ''; // Clear the list before adding new entries

    pilots.forEach((pilot) => {
        const listItem = document.createElement('div');
        listItem.textContent = pilot.callsign;
        listItem.classList.add('selectable-user');
        listItem.addEventListener('click', () => {
            selectedPilotId = pilot.id;
            highlightSelectedUser(listItem);
        });
        pilotBoxes.appendChild(listItem);
    });
});

// Highlight selected user
function highlightSelectedUser(element) {
    document.querySelectorAll('.selectable-user').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
}

// IFR Clearance button
document.getElementById('if-clearance').addEventListener('click', () => {
    const destination = prompt("Enter destination airport:");
    const departureProcedure = prompt("Enter departure procedure:");
    const initialAltitude = prompt("Enter initial altitude:");
    const squawkCode = Math.floor(1000 + Math.random() * 7999); // Generate a 4-digit squawk code without 8 and 9
    if (!selectedPilotId || !destination.trim() || !departureProcedure.trim() || !initialAltitude.trim()) {
        alert("Please select a pilot and fill in all fields.");
        return;
    }
    const message = `${localStorage.getItem('callsign')}, cleared to ${destination} via ${departureProcedure}, maintain ${initialAltitude}FT, squawk ${squawkCode}`;
    socket.emit('privateMessage', {
        recipientId: selectedPilotId,
        message: message
    });
});

// Flight Level Change button
document.getElementById('fl-change').addEventListener('click', () => {
    const climbOrDescend = prompt("Enter 'climb' or 'descend':");
    const flightLevel = prompt("Enter desired flight level or altitude:");
    if (!selectedPilotId || !climbOrDescend.trim() || !flightLevel.trim()) {
        alert("Please select a pilot and fill in all fields.");
        return;
    }
    const message = `${localStorage.getItem('callsign')}, ${climbOrDescend} to ${flightLevel}`;
    socket.emit('privateMessage', {
        recipientId: selectedPilotId,
        message: message
    });
});

// Vector button
document.getElementById('vector').addEventListener('click', () => {
    const direction = prompt("Enter 'left' or 'right':");
    const heading = prompt("Enter heading in degrees:");
    if (!selectedPilotId || !direction.trim() || !heading.trim()) {
        alert("Please select a pilot and fill in all fields.");
        return;
    }
    const message = `${localStorage.getItem('callsign')}, turn ${direction} heading ${heading} degrees`;
    socket.emit('privateMessage', {
        recipientId: selectedPilotId,
        message: message
    });
});

// Free Text Message
document.getElementById('send-message-button').addEventListener('click', () => {
    const message = document.getElementById('free-text-message').value;
    if (!selectedPilotId || !message.trim()) {
        alert("Please select a pilot and fill in the message.");
        return;
    }
    socket.emit('privateMessage', {
        recipientId: selectedPilotId,
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
