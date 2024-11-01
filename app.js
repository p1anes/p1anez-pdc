document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById('role');
    const usernameInput = document.getElementById('username');
    const callsignInput = document.getElementById('callsign');
    const extraInfoInput = document.getElementById('extraInfo');
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('error-message');

    // Handle role selection
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'pilot') {
            callsignInput.style.display = 'block'; // Show callsign input
            extraInfoInput.style.display = 'none'; // Hide position dropdown
        } else if (roleSelect.value === 'controller') {
            callsignInput.style.display = 'none'; // Hide callsign input
            extraInfoInput.style.display = 'block'; // Show position dropdown
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission
        const username = usernameInput.value.trim();
        const callsign = callsignInput.value.trim();
        const position = extraInfoInput.value;

        // Validate inputs
        if (roleSelect.value === 'pilot') {
            if (!username || !callsign) {
                errorMessage.textContent = "You must fill out all fields.";
                return;
            }
        } else {
            if (!username || !position) {
                errorMessage.textContent = "You must fill out all fields.";
                return;
            }
        }

        // If all validations pass, redirect to the messaging page
        errorMessage.textContent = ""; // Clear error message
        window.location.href = 'messaging.html'; // Redirect to messaging page
    });
});