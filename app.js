document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById('role');
    const callsignInput = document.getElementById('callsign');
    const extraInfoInput = document.getElementById('extraInfo');
    const loginForm = document.getElementById('loginForm');

    // Callsign field always shown for pilots
    callsignInput.style.display = 'block';

    // Show or hide fields based on role selection
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'pilot') {
            extraInfoInput.style.display = 'none'; // Hide position dropdown for pilots
        } else if (roleSelect.value === 'controller') {
            extraInfoInput.style.display = 'block'; // Show position dropdown for controllers
        } else {
            extraInfoInput.style.display = 'none';
        }
    });

    // Handle login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the default form submission
        window.location.href = 'messaging.html'; // Redirect to messaging page
    });
});