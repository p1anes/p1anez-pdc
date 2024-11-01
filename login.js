document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById('login-button'); // Adjust the button ID as necessary
    const usernameInput = document.getElementById('username'); // Username input field
    const roleSelect = document.getElementById('role'); // Role dropdown
    const callsignInput = document.getElementById('callsign'); // Callsign input field for pilots
    const positionInput = document.getElementById('position'); // Position input field for controllers

    // Function to handle login
    const handleLogin = () => {
        const username = usernameInput.value.trim();
        const role = roleSelect.value; // 'pilot' or 'controller'
        const callsign = callsignInput.value.trim();
        const position = positionInput.value.trim(); // Get the position input for controllers

        // Validate input
        if (!username || (role === 'pilot' && !callsign) || (role === 'controller' && !position)) {
            alert('Please fill in all fields');
            return;
        }

        // Create user data object
        const userData = { username, role, callsign: role === 'pilot' ? callsign : '', position: role === 'controller' ? position : '' };

        // Send login data to server
        const socket = io(); // Make sure you have the socket.io client set up
        socket.emit('login', userData);

        // Store user info in localStorage for the messaging page
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role);
        localStorage.setItem('callsign', callsign);
        if (role === 'controller') {
            localStorage.setItem('position', position); // Store position if user is a controller
        }

        // Redirect to messaging page after successful login
        window.location.href = 'messaging.html';
    };

    // Listen for login button click
    loginButton.addEventListener('click', handleLogin);
});