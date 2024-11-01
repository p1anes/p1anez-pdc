document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Event listener for the role selection
    const roleSelect = document.getElementById('role');
    roleSelect.addEventListener('change', (event) => {
        const selectedRole = event.target.value;
        if (selectedRole === 'pilot') {
            document.getElementById('callsign').style.display = 'inline-block';
            document.getElementById('extraInfo').style.display = 'none';
        } else {
            document.getElementById('callsign').style.display = 'none';
            document.getElementById('extraInfo').style.display = 'inline-block';
        }
    });

    // Login form submission
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value.trim();
        const callsign = document.getElementById('callsign').value.trim();
        const position = document.getElementById('extraInfo').value;

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

        // Store user info in localStorage
        const userRole = roleSelect.value;
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('username', username);
        if (userRole === 'pilot') {
            localStorage.setItem('callsign', callsign);
        } else {
            localStorage.setItem('position', position);
        }

        // Redirect to the messaging page (or update UI for messaging)
        window.location.href = 'messaging.html'; // Replace with the actual messaging page URL
    });
});
