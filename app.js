const socket = io(); // Ensure this connects to your Socket.IO server

document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Event listener for the role selection
    const roleSelect = document.getElementById('role');
    const callsignInput = document.getElementById('callsign');
    const extraInfoInput = document.getElementById('extraInfo');

    roleSelect.addEventListener('change', (event) => {
        const selectedRole = event.target.value;
        callsignInput.style.display = selectedRole === 'pilot' ? 'inline-block' : 'none';
        extraInfoInput.style.display = selectedRole === 'controller' ? 'inline-block' : 'none';
    });

    // Login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const callsign = callsignInput.value.trim();
        const position = extraInfoInput.value;

        // Validation
        if (!username) {
            errorMessage.textContent = 'Username must be filled out.';
            return;
        }

        if (roleSelect.value === 'pilot' && !callsign) {
            errorMessage.textContent = 'Callsign must be filled out.';
            return;
        }

        if (roleSelect.value === 'controller' && !position) {
            errorMessage.textContent = 'Position must be selected.';
            return;
        }

        // Store user info in localStorage for the respective pages
        localStorage.setItem('username', username);
        localStorage.setItem('userRole', roleSelect.value);
        if (roleSelect.value === 'pilot') {
            localStorage.setItem('callsign', callsign);
            window.location.href = 'pilot.html'; // Redirect to pilot page
        } else {
            localStorage.setItem('position', position);
            window.location.href = 'controller.html'; // Redirect to controller page
        }
    });
});