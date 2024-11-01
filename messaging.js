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
    
    // Check if the availableControllers element exists
    if (!availableControllers) {
        console.error('Element with id "availableControllers" not found.');
        return; // Exit if the element does not exist
    }

    availableControllers.innerHTML = ''; // Clear existing list

    if (users.length === 0) {
        availableControllers.innerHTML = '<li>No controllers available</li>'; // Inform if no controllers are available
        return;
    }

    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = `${user.username} (${user.callsign})`;
        if (user.position) {
            li.textContent += ` - ${user.position}`;
        }
        availableControllers.appendChild(li);
    });
});