document.addEventListener("DOMContentLoaded", () => {
    const roleSelect = document.getElementById('role');
    const callsignInput = document.getElementById('callsign');
    const extraInfoInput = document.getElementById('extraInfo');

    // Show or hide fields based on role selection
    roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'pilot') {
            callsignInput.style.display = 'block';
            extraInfoInput.style.display = 'none';
        } else if (roleSelect.value === 'controller') {
            callsignInput.style.display = 'none';
            extraInfoInput.style.display = 'block';
        } else {
            callsignInput.style.display = 'none';
            extraInfoInput.style.display = 'none';
        }
    });
});