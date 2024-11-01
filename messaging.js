const socket = io();

// Handle user login on the messaging page
socket.on('connect', () => {
    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    const callsign = localStorage.getItem('callsign');
    const position = localStorage.getItem('position');

    const userData = {
        id: socket.id,
        username,
        callsign: userRole === 'pilot' ? callsign : '',
        position: userRole === 'controller' ? position : ''
    };

    // Emit user login data to the server
    socket.emit('userLoggedIn', userData);
});

// Update the user list on the webpage
socket.on('updateUserList', (users) => {
    const availableControllers = document.getElementById('availableControllers');
    availableControllers.innerHTML = ''; // Clear existing list

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.callsign})`;
        if (user.position) {
            li.textContent += ` - ${user.position}`;
        }
        availableControllers.appendChild(li);
    });
});