// Mini Chat JavaScript - Wrapped to avoid global conflicts
(function() {
  // API URL for backend communication
  const API_URL = 'http://10.247.4.130:8006';

  // Generate a random session ID for the chat
  let sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
      // Create mini chat button and container elements
      createMiniChatElements();
      
      // Initialize event listeners
      initMiniChatEventListeners();
    });
  }

// Function to create mini chat elements
function createMiniChatElements() {
  // Create mini chat button
  const miniChatButton = document.createElement('button');
  miniChatButton.id = 'mini-chat-button';
  miniChatButton.className = 'mini-chat-button';
  miniChatButton.innerHTML = '<span class="mini-chat-button-icon">💬</span>';
  document.body.appendChild(miniChatButton);
  
  // Create mini chat container
  const miniChatContainer = document.createElement('div');
  miniChatContainer.id = 'mini-chat-container';
  miniChatContainer.className = 'mini-chat-container';
  
  // Add HTML structure for mini chat
  miniChatContainer.innerHTML = `
    <div class="mini-chat-header">
      <h3>GenAI Doc Quest</h3>
      <div class="mini-chat-header-controls">
        <button id="mini-chat-refresh" class="mini-chat-control-btn" title="Start new conversation">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36a.25.25 0 0 1 .192-.41zm-11 2h3.932a.25.25 0 0 0 .192-.41L2.692 6.23a.25.25 0 0 0-.384 0L.342 8.59A.25.25 0 0 0 .534 9z"/>
            <path fill-rule="evenodd" d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 8.757 2.182.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z"/>
          </svg>
        </button>
        <button id="mini-chat-maximize" class="mini-chat-control-btn" title="Open full chat">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"/>
          </svg>
        </button>
        <button id="mini-chat-close" class="mini-chat-close">&times;</button>
      </div>
    </div>
    <div id="mini-chat-messages" class="mini-chat-messages">
      <div class="mini-chat-message ai">
        <div class="message-text">
          <p>Hi, 😊 Welcome to GenAI Doc Quest! How can I assist you today?</p>
        </div>
      </div>
    </div>
    <div class="mini-chat-input-area">
      <div class="mini-chat-input-wrapper">
        <textarea id="mini-chat-input" class="mini-chat-input" placeholder="Type your query here" rows="1"></textarea>
        <button id="mini-chat-send" class="mini-chat-send" disabled>➤</button>
      </div>
    </div>
    <div class="mini-chat-quick-actions">
      <button class="mini-chat-quick-action">What is this product?</button>
      <button class="mini-chat-quick-action">Show me examples</button>
      <button class="mini-chat-quick-action">How do I get started?</button>
      <button class="mini-chat-quick-action">Troubleshooting guide</button>
      <button class="mini-chat-quick-action">Contact support</button>
    </div>
  `;
  
  document.body.appendChild(miniChatContainer);
}

// Function to initialize event listeners
function initMiniChatEventListeners() {
  const miniChatButton = document.getElementById('mini-chat-button');
  const miniChatContainer = document.getElementById('mini-chat-container');
  const miniChatClose = document.getElementById('mini-chat-close');
  const miniChatInput = document.getElementById('mini-chat-input');
  const miniChatSend = document.getElementById('mini-chat-send');
  const miniChatMessages = document.getElementById('mini-chat-messages');
  const quickActions = document.querySelectorAll('.mini-chat-quick-action');
  
  // Toggle mini chat visibility
  miniChatButton.addEventListener('click', function() {
    miniChatContainer.classList.toggle('active');
    if (miniChatContainer.classList.contains('active')) {
      miniChatInput.focus();
    }
  });
  
  // Close mini chat
  miniChatClose.addEventListener('click', function() {
    miniChatContainer.classList.remove('active');
  });
  
  // Refresh button - start new conversation
  const miniChatRefresh = document.getElementById('mini-chat-refresh');
  miniChatRefresh.addEventListener('click', function() {
    // Clear all messages
    while (miniChatMessages.firstChild) {
      miniChatMessages.removeChild(miniChatMessages.firstChild);
    }
    
    // Add welcome message back
    const welcomeMessage = document.createElement('div');
    welcomeMessage.className = 'mini-chat-message ai';
    const messageText = document.createElement('div');
    messageText.className = 'message-text';
    messageText.innerHTML = '<p>Hi, 😊 Welcome to GenAI Doc Quest! How can I assist you today?</p>';
    welcomeMessage.appendChild(messageText);
    miniChatMessages.appendChild(welcomeMessage);
    
    // Generate a new session ID
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Clear input field
    miniChatInput.value = '';
    miniChatSend.disabled = true;
  });
  
  // Maximize button - open full chat in new tab
  const miniChatMaximize = document.getElementById('mini-chat-maximize');
  miniChatMaximize.addEventListener('click', function() {
    window.open('http://10.190.172.76:3002/', '_blank');
  });
  
  // Enable/disable send button based on input
  miniChatInput.addEventListener('input', function() {
    miniChatSend.disabled = !miniChatInput.value.trim();
    
    // Auto resize textarea
    miniChatInput.style.height = 'auto';
    miniChatInput.style.height = (miniChatInput.scrollHeight) + 'px';
  });
  
  // Handle enter key press
  miniChatInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!miniChatSend.disabled) {
        sendMessage();
      }
    }
  });
  
  // Send message on button click
  miniChatSend.addEventListener('click', sendMessage);
  
  // Quick action buttons
  quickActions.forEach(button => {
    button.addEventListener('click', function() {
      const actionText = button.textContent;
      addUserMessage(actionText);
      
      // Show processing animation
      showProcessingAnimation();
      
      // Send the quick action text to the backend
      askQuestion(actionText);
    });
  });
  
  // Function to send user message
  function sendMessage() {
    const message = miniChatInput.value.trim();
    if (!message) return;
    
    // Add user message to chat
    addUserMessage(message);
    
    // Clear input and reset height
    miniChatInput.value = '';
    miniChatInput.style.height = 'auto';
    miniChatSend.disabled = true;
    
    // Show processing animation
    showProcessingAnimation();
    
    // Send the message to the backend API
    askQuestion(message);
  }
  
  // Function to send question to backend API
  async function askQuestion(question) {
    try {
      const requestData = {
        question,
        id: sessionId
      };
      
      // Make API request to backend
      const response = await fetch(`${API_URL}/ask-agent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Remove processing animation
      removeProcessingAnimation();
      
      // Add AI response from backend
      addAIMessage(data.answer || "I'm sorry, I couldn't process your request at this time.");
      
    } catch (error) {
      console.error('Error asking question:', error);
      
      // Remove processing animation
      removeProcessingAnimation();
      
      // Show error message
      addAIMessage("I'm sorry, there was an error processing your request. Please try again later.");
    }
  }
  
  // Function to add user message
  function addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'mini-chat-message user';
    messageElement.textContent = message;
    miniChatMessages.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Function to add AI message with markdown support and message-text structure
  function addAIMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'mini-chat-message ai';
    
    // Create message-text div
    const messageTextDiv = document.createElement('div');
    messageTextDiv.className = 'message-text';
    
    // Use marked.js to parse markdown and insert into message-text div
    try {
      // Configure marked to use proper HTML structure
      if (typeof marked !== 'undefined') {
        messageTextDiv.innerHTML = marked.parse(message);
        
        // Make all links open in new tab and clean up link text
        const links = messageTextDiv.querySelectorAll('a');
        links.forEach(link => {
          link.setAttribute('target', '_blank');
          link.setAttribute('rel', 'noopener noreferrer');

          // Extract last folder or file name from URL
          const url = link.getAttribute('href');
          let cleanName = url.split('/').filter(Boolean).pop() || link.textContent;

          // Remove file extensions or trailing slashes
          cleanName = cleanName.replace(/\.(html|htm|dita|xml|md)$/i, '');

          // Replace underscores and hyphens with spaces
          cleanName = cleanName.replace(/[_-]/g, ' ');

          // Capitalize first letter of each word
          cleanName = cleanName.replace(/\b\w/g, l => l.toUpperCase());

          // Update the link text
          link.textContent = cleanName.trim();
        });
        
        // Convert multiple consecutive links into a list
        formatConsecutiveLinks(messageTextDiv);
      } else {
        // Fallback if marked.js is not loaded
        messageTextDiv.innerHTML = formatSimpleMarkdown(message);
      }
    } catch (error) {
      console.error('Error parsing markdown:', error);
      messageTextDiv.textContent = message;
    }
    
    messageElement.appendChild(messageTextDiv);
    miniChatMessages.appendChild(messageElement);
    scrollToBottom();
  }
  
  // Function to format consecutive links into a list
  function formatConsecutiveLinks(container) {
    const paragraphs = container.querySelectorAll('p');
    
    paragraphs.forEach(p => {
      const links = p.querySelectorAll('a');
      
      // If paragraph has multiple links, check if they should be in a list
      if (links.length > 1) {
        // Check if links are the main content (not embedded in text)
        const textContent = p.textContent.trim();
        const linkTexts = Array.from(links).map(link => link.textContent.trim());
        const allLinkText = linkTexts.join('').length;
        const totalText = textContent.length;
        
        // If links make up most of the content (>70%), convert to list
        if (allLinkText / totalText > 0.7) {
          const ul = document.createElement('ul');
          
          links.forEach(link => {
            const li = document.createElement('li');
            li.appendChild(link.cloneNode(true));
            ul.appendChild(li);
          });
          
          p.replaceWith(ul);
        }
      }
    });
  }
  
  // Simple markdown formatter as fallback
  function formatSimpleMarkdown(text) {
    // Convert markdown-style text to HTML
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '</p><p>');
    html = '<p>' + html + '</p>';
    
    // Lists (basic)
    html = html.replace(/<p>- (.*?)<\/p>/g, '<ul><li>$1</li></ul>');
    html = html.replace(/<p>\* (.*?)<\/p>/g, '<ul><li>$1</li></ul>');
    
    return html;
  }
  
  // Function to show processing animation
  function showProcessingAnimation() {
    const processingElement = document.createElement('div');
    processingElement.className = 'mini-chat-processing';
    processingElement.id = 'mini-chat-processing';
    processingElement.innerHTML = `
      <div class="mini-chat-processing-dot"></div>
      <div class="mini-chat-processing-dot"></div>
      <div class="mini-chat-processing-dot"></div>
    `;
    miniChatMessages.appendChild(processingElement);
    scrollToBottom();
  }
  
  // Function to remove processing animation
  function removeProcessingAnimation() {
    const processingElement = document.getElementById('mini-chat-processing');
    if (processingElement) {
      processingElement.remove();
    }
  }
  
  // Function to scroll chat to bottom
  function scrollToBottom() {
    miniChatMessages.scrollTop = miniChatMessages.scrollHeight;
  }
}
})(); // End of IIFE
