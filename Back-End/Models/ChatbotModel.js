const axios = require("axios");

class ChatbotModel {
    static async predictDisease(symptoms) {
        try {
            const response = await axios.post("http://127.0.0.1:5000/predict", { symptoms });
            return response.data;
        } catch (error) {
            throw new Error("Error communicating with ML API");
        }
    }
}

module.exports = ChatbotModel;
