document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById('role');
    const usernameInput = document.getElementById('username');
    const callsignInput = document.getElementById('callsign');
    const controllerUsernameInput = document.getElementById('controllerUsername');
    const extraInfoInput = document.getElementById('extraInfo');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Show or hide fields based on role selection
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'pilot') {
            callsignInput.style.display = 'block'; // Show callsign input for pilots
            controllerUsernameInput.closest('.input-group').style.display = 'none'; // Hide controller username input
            extraInfoInput.closest('.input-group').style.display = 'none'; // Hide position dropdown for pilots
        } else if (roleSelect.value === 'controller') {
            callsignInput.style.display = 'none'; // Hide callsign input for controllers
            controllerUsernameInput.closest('.input-group').style.display = 'block'; // Show controller username input
            extraInfoInput.closest('.input-group').style.display = 'block'; // Show position dropdown for controllers
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission
        const username = usernameInput.value.trim();
        const callsign = callsignInput.value.trim();
        const controllerUsername = controllerUsernameInput.value.trim();
        const position = extraInfoInput.value;

        // Validate inputs
        if (roleSelect.value === 'pilot') {
            if (!username || !callsign) {
                errorMessage.textContent = "You must fill out all fields.";
                return;
            }
        } else {
            if (!controllerUsername || !position) {
                errorMessage.textContent = "You must fill out all fields.";
                return;
            }
        }

        // If all validations pass, redirect to the messaging page
        errorMessage.textContent = ""; // Clear error message
        window.location.href = 'messaging.html'; // Redirect to messaging page
    });
});