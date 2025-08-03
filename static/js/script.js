document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');

    userInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            const userMessage = userInput.value.trim();
            if (userMessage !== '') {
                appendUserMessage(userMessage);

                // Send a POST request to the Flask server
                fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ user_message: userMessage }),
                })
                .then(response => response.json())
                .then(data => {
                    const botResponse = data.bot_response;
                    appendBotMessage(botResponse);
                })
                .catch(error => console.error('Error:', error));

                // Clear the user input
                userInput.value = '';
            }
        }
    });


    function appendUserMessage(message) {
        // Create the main user message element
        const userMessageElement = document.createElement('div');
        userMessageElement.classList.add('super'); // Adding "super" class to the parent div
    
        // Create a new div element for the child with classes "message" and "user-message"
        const childDiv = document.createElement('div');
        childDiv.classList.add('message', 'user-message');
        childDiv.textContent = message;
    
        // Append the child div inside the user message element (which is the parent)
        userMessageElement.appendChild(childDiv);
    
        // Append the user message element to the chatMessages container (assuming chatMessages is defined somewhere)
        chatMessages.appendChild(userMessageElement);
    }
    
    
    
    

    // function appendUserMessage(message) {
    //     const userMessageElement = document.createElement('div');
    //     userMessageElement.classList.add('message', 'user-message');
    //     userMessageElement.textContent = message;
    //     chatMessages.appendChild(userMessageElement);
    // }

    function appendBotMessage(message) {
        const botMessageElement = document.createElement('div');
        botMessageElement.classList.add('message', 'bot-message');
        botMessageElement.textContent = message;
        chatMessages.appendChild(botMessageElement);
        // Scroll to the bottom of the chat messages
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});
