const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

// Route for chatbot interaction
router.post('/chat', chatbotController.processMessage);

module.exports = router;