document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const chatSection = document.getElementById('chatSection');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const messageContainer = document.getElementById('messageContainer');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const messageInput = document.getElementById('messageInput');
  
    const roleSelect = document.getElementById('role');
    const extraInfoInput = document.getElementById('extraInfo');
    
    let role, username, extraInfo;
  
    // Show or hide the position dropdown based on role selection
    roleSelect.addEventListener('change', () => {
      if (roleSelect.value === 'controller') {
        extraInfoInput.style.display = 'block';
      } else {
        extraInfoInput.style.display = 'none';
      }
    });
  
    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      role = roleSelect.value;
      username = document.getElementById('username').value;
      extraInfo = extraInfoInput.value;
  
      if (!username || (role === 'controller' && !extraInfo)) {
        alert("Please enter all required fields.");
        return;
      }
  
      // Display the chat section and hide the login section
      loginSection.style.display = 'none';
      chatSection.style.display = 'block';
  
      // Set welcome message
      welcomeMessage.textContent = `Welcome, ${username} (${role === 'pilot' ? extraInfo : `Position: ${extraInfo}`})`;
  
      // Initialize chat (for now, only locally)
      initializeChat();
    });
  
    // Send message on button click
    sendMessageButton.addEventListener('click', sendMessage);
  
    // Add enter key support for message input
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  
    // Basic message handling (for demonstration)
    function initializeChat() {
      const placeholderMessages = [
        { sender: "Controller1", text: "Qatari-7007, you're cleared for takeoff." },
        { sender: "Pilot Qatari-7007", text: "Requesting altitude change to FL320." }
      ];
  
      placeholderMessages.forEach(msg => {
        displayMessage(msg.sender, msg.text);
      });
    }
  
    function sendMessage() {
      const message = messageInput.value.trim();
      if (!message) return;
  
      displayMessage(username, message);
      messageInput.value = '';
    }
  
    function displayMessage(sender, text) {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${sender}: ${text}`;
      messageContainer.appendChild(messageElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  });