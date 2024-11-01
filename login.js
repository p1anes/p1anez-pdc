document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.getElementById('login-button');
    const usernameInput = document.getElementById('username');
    const roleSelect = document.getElementById('role');
    const callsignInput = document.getElementById('callsign');
    const positionInput = document.getElementById('extraInfo'); // Updated to match your HTML ID for controllers

    const socket = io('http://localhost:3000'); // Ensure correct connection URL to your server

    // Function to handle login
    const handleLogin = () => {
        const username = usernameInput.value.trim();
        const role = roleSelect.value;
        const callsign = callsignInput.value.trim();
        const position = positionInput.value; 

        // Validate input
        if (!username || (role === 'pilot' && !callsign) || (role === 'controller' && !position)) {
            alert('Please fill in all fields');
            return;
        }

        // Create user data object
        const userData = { username, role, callsign: role === 'pilot' ? callsign : '', position: role === 'controller' ? position : '' };

        // Emit login data to server
        socket.emit('login', userData);

        // Store user info in localStorage for the messaging page
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', role);
        localStorage.setItem('callsign', callsign);
        if (role === 'controller') {
            localStorage.setItem('position', position);
        }

        // Redirect to messaging page
        window.location.href = 'messaging.html';
    };

    // Listen for login button click
    loginButton.addEventListener('click', handleLogin);
});
