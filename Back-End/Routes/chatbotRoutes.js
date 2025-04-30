const express = require("express");
const ChatbotController = require("../Controllers/ChatbotController");
const router = express.Router();

router.post("/predict", ChatbotController.getPrediction);

module.exports = router;
