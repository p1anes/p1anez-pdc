document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    let selectedUserId = null;

    // Handle user login on the messaging page
    socket.on('connect', () => {
        const username = localStorage.getItem('username');
        const userRole = localStorage.getItem('userRole');
        const callsign = localStorage.getItem('callsign');
        const position = localStorage.getItem('position');

        const userData = {
            id: socket.id,
            username,
            role: userRole,
            callsign: userRole === 'pilot' ? callsign : '',
            position: userRole === 'controller' ? position : ''
        };

        // Emit user login data to the server
        socket.emit('userLoggedIn', userData);
    });

    // Update the user list on the webpage
    socket.on('updateUserList', (users) => {
        const availableUsers = document.getElementById('available-users'); // Correct ID
        availableUsers.innerHTML = ''; // Clear existing list

        users.forEach(user => {
            const userBox = document.createElement('div');
            userBox.classList.add('user-box');
            userBox.setAttribute('data-id', user.id);
            userBox.textContent = `${user.username} (${user.role === 'controller' ? user.position : user.callsign}) - ${user.role}`;

            userBox.addEventListener('click', () => {
                // Remove 'selected' styling from other boxes
                document.querySelectorAll('.user-box').forEach(box => box.classList.remove('selected-user'));
                // Apply 'selected' styling to the clicked box
                userBox.classList.add('selected-user');
                selectedUserId = user.id;
            });

            availableUsers.appendChild(userBox);
        });
    });

    // Handle sending messages
    document.getElementById('send-message').addEventListener('click', () => {
        const message = document.getElementById('message-input').value.trim();
        if (message && selectedUserId) {
            socket.emit('privateMessage', { recipientId: selectedUserId, message });
            document.getElementById('message-input').value = ''; // Clear input
        } else {
            alert('Select a user to message and type a message');
        }
    });

    // Display received messages with sender info
    socket.on('receiveMessage', (data) => {
        const receivedMessages = document.getElementById('received-messages'); // Correct ID
        const messageBox = document.createElement('div');
        messageBox.classList.add('message-box');

        const senderInfo = document.createElement('div');
        senderInfo.classList.add('sender-info');
        senderInfo.textContent = `From: ${data.fromUser} (${data.fromRole})`; // Ensure it matches the server response

        const messageContent = document.createElement('p');
        messageContent.textContent = data.message;

        messageBox.appendChild(senderInfo);
        messageBox.appendChild(messageContent);
        receivedMessages.appendChild(messageBox);
    });
});