const { spawn } = require('child_process');
const path = require('path');

// Detect if this is a greeting based on simple patterns
function isGreeting(message) {
  const greetingPatterns = [
    /\b(hi|hello|hey|greetings|howdy)\b/i,
    /\bhow are you\b/i,
    /\bgood (morning|afternoon|evening|day)\b/i,
    /\bthanks|thank you\b/i,
    /\bbye|goodbye|see you\b/i
  ];
  
  return greetingPatterns.some(pattern => pattern.test(message));
}

exports.processMessage = async (message) => {
  try {
    // Clean up the message
    const cleanedMessage = message.trim();
    
    // Path to Python script
    const pythonScriptPath = path.join(__dirname, '..', 'ml', 'chatbot.py');
    
    // Spawn Python process
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [pythonScriptPath, cleanedMessage]);
      
      let responseData = '';
      let errorData = '';
      
      // Collect data from stdout
      pythonProcess.stdout.on('data', (data) => {
        responseData += data.toString();
      });
      
      // Collect any errors
      pythonProcess.stderr.on('data', (data) => {
        console.error(`Python stderr: ${data}`);
        errorData += data.toString();
      });
      
      // Handle process completion
      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python process exited with code ${code}`);
          console.error(`Error data: ${errorData}`);
          
          // If we can't connect to Python, provide a fallback response
          if (isGreeting(cleanedMessage)) {
            return resolve({
              type: 'greeting',
              message: 'Hello! How can I help your pet today?'
            });
          } else {
            return resolve({
              type: 'error',
              message: 'I apologize, but I\'m having trouble processing your request. Could you try again or rephrase?'
            });
          }
        }
        
        try {
          // Parse the JSON response from Python
          const response = JSON.parse(responseData);
          resolve(response);
        } catch (error) {
          console.error('Failed to parse Python response:', error);
          console.error('Raw response:', responseData);
          reject(new Error('Failed to parse chatbot response'));
        }
      });
      
      // Handle process errors
      pythonProcess.on('error', (error) => {
        console.error(`Error spawning Python process: ${error}`);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error in chatbot service:', error);
    throw error;
  }
};