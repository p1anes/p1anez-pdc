const socket = io();
let selectedPilotId = null;

socket.emit('registerUser', {
    callsign: localStorage.getItem('callsign'), 
    position: 'controller'
});

// Fetch available pilots
socket.emit('requestPilots');

// Populate the pilot list
socket.on('updatePilots', (pilots) => {
    const pilotBoxes = document.getElementById('pilot-boxes');
    pilotBoxes.innerHTML = ''; // Clear existing list

    pilots.forEach(pilot => {
        const pilotBox = document.createElement('div');
        pilotBox.classList.add('user-box');
        pilotBox.setAttribute('data-id', pilot.id);
        pilotBox.textContent = `${pilot.callsign} - ${pilot.username}`;

        pilotBox.addEventListener('click', () => {
            // Remove 'selected' styling from other boxes
            document.querySelectorAll('.user-box').forEach(box => box.classList.remove('selected-user'));
            // Apply 'selected' styling to the clicked box
            pilotBox.classList.add('selected-user');
            selectedPilotId = pilot.id; // Store selected pilot ID
        });

        pilotBoxes.appendChild(pilotBox);
    });
});

// Handle button clicks to create messages
document.getElementById('if-clearance').addEventListener('click', () => {
    const destination = prompt("Enter the destination:");
    const procedure = prompt("Enter the departure procedure:");
    const initialAltitude = prompt("Enter initial altitude:");
    const squawk = Math.floor(Math.random() * 10000).toString().padStart(4, '0').replace(/[89]/g, '0'); // Generate 4 digit squawk code
    if (selectedPilotId && destination && procedure && initialAltitude) {
        const message = `${selectedPilotId}, ${localStorage.getItem('position')}, hello! Cleared to ${destination} via ${procedure}, maintain initial ${initialAltitude}FT, squawk ${squawk}`;
        document.getElementById('message-output').textContent = message; // Display message
        socket.emit('privateMessage', { recipientId: selectedPilotId, message });
    } else {
        alert("Please select a pilot and fill all fields.");
    }
});

document.getElementById('fl-change').addEventListener('click', () => {
    const direction = prompt("Enter climb or descend:");
    const altitude = prompt("Enter flight level or altitude:");
    if (selectedPilotId && direction && altitude) {
        const message = `${selectedPilotId}, ${direction} to ${altitude}.`;
        document.getElementById('message-output').textContent = message; // Display message
        socket.emit('privateMessage', { recipientId: selectedPilotId, message });
    } else {
        alert("Please select a pilot and enter climb/descend and altitude.");
    }
});

document.getElementById('vector').addEventListener('click', () => {
    const turn = prompt("Enter Left or Right:");
    const heading = prompt("Enter heading in degrees:");
    if (selectedPilotId && turn && heading) {
        const message = `${selectedPilotId} turn ${turn} heading ${heading}° degrees.`;
        document.getElementById('message-output').textContent = message; // Display message
        socket.emit('privateMessage', { recipientId: selectedPilotId, message });
    } else {
        alert("Please select a pilot and enter turn and heading.");
    }
});
