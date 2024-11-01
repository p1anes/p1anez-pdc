document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginSection = document.getElementById('loginSection');
    const chatSection = document.getElementById('chatSection');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const messageContainer = document.getElementById('messageContainer');
    const sendMessageButton = document.getElementById('sendMessageButton');
    const messageInput = document.getElementById('messageInput');
    
    let role, username, extraInfo;
  
    // Handle login form submission
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
  
      role = document.getElementById('role').value;
      username = document.getElementById('username').value;
      extraInfo = document.getElementById('extraInfo').value;
  
      if (!username || !extraInfo) {
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
      // Placeholder messages (replace this with real-time updates later)
      const placeholderMessages = [
        { sender: "Controller1", text: "Qatari-7007, you're cleared for takeoff." },
        { sender: "Pilot Qatari-7007", text: "Requesting altitude change to FL320." }
      ];
  
      // Display placeholder messages
      placeholderMessages.forEach(msg => {
        displayMessage(msg.sender, msg.text);
      });
    }
  
    // Send message function
    function sendMessage() {
      const message = messageInput.value.trim();
      if (!message) return;
  
      // Display the message in the chat
      displayMessage(username, message);
      messageInput.value = '';  // Clear input field
  
      // Placeholder for sending the message (implement real-time functionality later)
      console.log(`Sent message: ${message}`);
    }
  
    // Display message in the chat container
    function displayMessage(sender, text) {
      const messageElement = document.createElement('div');
      messageElement.textContent = `${sender}: ${text}`;
      messageContainer.appendChild(messageElement);
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  });