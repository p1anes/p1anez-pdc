const socket = io();
let selectedPilotId = null;

// Display logged-in user info
document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem('username');
    const position = localStorage.getItem('position');

    document.getElementById('user-info').textContent = `Logged in as: ${username} (${position})`;
    
    // Load available pilots
    socket.emit('requestPilots'); // Request the list of pilots
});

// Update available pilots list
socket.on('updatePilots', (pilots) => {
    const availablePilots = document.getElementById('available-pilots');
    availablePilots.innerHTML = ''; // Clear existing list

    pilots.forEach(pilot => {
        const pilotBox = document.createElement('div');
        pilotBox.textContent = `${pilot.username} (${pilot.callsign})`;
        pilotBox.addEventListener('click', () => {
            selectedPilotId = pilot.id; // Store selected pilot ID
        });
        availablePilots.appendChild(pilotBox);
    });
});

// Handle sending messages
document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message-input').value.trim();
    if (message) {
        socket.emit('privateMessage', { recipientId: selectedPilotId, message });
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

        if (selectedPilotId) {
            const destination = prompt("Enter destination airport:") || 'destination';
            const departureProcedure = prompt("Enter departure procedure:") || 'procedure';
            const initialAltitude = prompt("Enter initial altitude (FT):") || 'initial altitude';
            const squawk = Math.floor(Math.random() * 9000) + 1000; // Random 4-digit number without 8 and 9

            switch (action) {
                case "IFR Clearance":
                    premadeMessage = `${document.getElementById('user-info').textContent.split(' ')[2]}, ${selectedPilotId}, hello! Cleared to ${destination} via ${departureProcedure}, maintain initial ${initialAltitude}FT, squawk ${squawk}`;
                    break;
                case "FL Change":
                    const climbOrDescend = prompt("Choose: climb or descend") || 'climb';
                    const flightLevel = prompt("Enter flight level or altitude:") || 'FL';
                    premadeMessage = `${selectedPilotId}, ${climbOrDescend} to ${flightLevel}`;
                    break;
                case "Vector":
                    const turnDirection = prompt("Choose: Left or Right") || 'Left';
                    const heading = prompt("Enter heading in degrees:") || '000';
                    premadeMessage = `${selectedPilotId} turn ${turnDirection} heading ${heading}° degrees`;
                    break;
            }

            if (premadeMessage) {
                document.getElementById('message-input').value = premadeMessage; // Set message input to premade message
            }
        } else {
            alert("Select a pilot before sending a message.");
        }
    });
});
