const ChatbotModel = require("../Models/ChatbotModel");

const ChatbotController = {
    async getPrediction(req, res) {
        try {
            const { symptoms } = req.body;
            if (!symptoms) return res.status(400).json({ error: "Symptoms are required" });

            const prediction = await ChatbotModel.predictDisease(symptoms);
            res.json(prediction);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = ChatbotController;
