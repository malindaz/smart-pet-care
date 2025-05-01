const chatbotService = require('../services/chatbotService');

exports.processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    // Validate input
    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a message'
      });
    }

    // Process the message through the service layer
    const response = await chatbotService.processMessage(message);
    
    // Return the response
    return res.status(200).json({
      success: true,
      data: response
    });
    
  } catch (error) {
    console.error('Error in chatbot controller:', error);
    return res.status(500).json({
      success: false,
      error: 'Something went wrong, please try again'
    });
  }
};