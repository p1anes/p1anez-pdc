const socket = io(); // Ensure this connects to your Socket.IO server

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Event listener for the role selection
    const roleSelect = document.getElementById('role');
    roleSelect.addEventListener('change', (event) => {
        const selectedRole = event.target.value;
        document.getElementById('callsign').style.display = selectedRole === 'pilot' ? 'inline-block' : 'none';
        document.getElementById('extraInfo').style.display = selectedRole === 'controller' ? 'inline-block' : 'none';
    });

    // Login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const callsign = document.getElementById('callsign').value.trim();
        const position = document.getElementById('extraInfo').value;

        // Validation
        if (!username) {
            errorMessage.textContent = 'Username must be filled out.';
            return;
        }

        if (roleSelect.value === 'pilot' && !callsign) {
            errorMessage.textContent = 'Callsign must be filled out.';
            return;
        }

        if (roleSelect.value === 'controller' && position === '') {
            errorMessage.textContent = 'Position must be selected.';
            return;
        }

        // Create user data object
        const userData = { username, role: roleSelect.value, callsign, position };

        // Emit login data to the server
        socket.emit('userLoggedIn', userData);

        // Store user info in localStorage for the messaging page
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', roleSelect.value);
        localStorage.setItem('callsign', callsign);
        if (roleSelect.value === 'controller') {
            localStorage.setItem('position', position);
        }

        // Redirect to messaging page
        window.location.href = 'messaging.html';
    });
});