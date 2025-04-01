import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../css/Chatbot.css";

const Chatbot = () => {
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { 
            text: "Hello! I'm your pet health assistant. Describe your pet's symptoms, and I'll try to identify possible health issues.",
            sender: "bot" 
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const chatbotRef = useRef(null);

    // Auto-scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Close chatbot when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const toggleChatbot = () => {
        setIsOpen(!isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message to chat
        const userMessage = { text: input, sender: "user" };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setInput("");

        try {
            // Send symptoms to API
            const res = await axios.post("http://localhost:5000/api/chatbot/predict", { 
                symptoms: input 
            });
            
            // Create bot response
            const disease = res.data.disease;
            let botResponse = `Based on the symptoms, your pet might have ${disease}.`;
            
            // Add some care advice based on the disease
            const advice = getCareAdvice(disease);
            if (advice) {
                botResponse += ` ${advice}`;
            }
            
            // Add bot message to chat
            setMessages(prev => [...prev, { text: botResponse, sender: "bot" }]);
        } catch (error) {
            console.error("Error:", error);
            setMessages(prev => [...prev, { 
                text: "Sorry, I couldn't process your request. Please try again.",
                sender: "bot" 
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Get care advice based on disease
    const getCareAdvice = (disease) => {
        const adviceMap = {
            "Gastroenteritis": "Ensure your pet has access to fresh water to prevent dehydration. Consider a bland diet of boiled chicken and rice.",
            "Parvovirus": "This is serious! Please seek immediate veterinary care as this disease can be life-threatening.",
            "Kennel Cough": "Keep your pet in a warm, humid environment and ensure they rest. Consult your vet for medication.",
            "Upper Respiratory Infection": "Keep your pet warm and make sure they're eating and drinking. A humidifier might help ease breathing.",
            "Skin Allergy": "Try to identify and remove allergens from your pet's environment. Your vet may recommend antihistamines.",
            "Ear Infection": "Avoid getting water in your pet's ears and consult your vet for proper cleaning solution.",
            "Arthritis": "Ensure your pet has a comfortable bed and consider joint supplements recommended by your vet.",
            "Diabetes": "Monitor your pet's water intake and urination. Your vet will recommend a specialized diet.",
            "Bloat": "This is an emergency! Seek immediate veterinary care as this condition can be fatal.",
            "Anemia": "Keep your pet warm and calm. Your vet might recommend iron supplements.",
            "Asthma": "Keep your pet away from potential triggers like smoke or dust. Consult your vet for medication.",
            "Conjunctivitis": "Gently clean your pet's eyes with a warm, damp cloth. Avoid touching your own eyes after handling.",
            "Anxiety Disorder": "Create a calm environment and maintain a consistent routine for your pet.",
            "Lyme Disease": "This requires antibiotics. Contact your vet for proper treatment.",
            "Epilepsy": "Keep your pet away from stairs or water during seizures. Note the duration and frequency.",
            "Dental Disease": "Consider dental treats and toys. Your vet may recommend a professional cleaning.",
            "Hotspot": "Keep the area clean and prevent your pet from licking or scratching it.",
            "Malnutrition": "Gradually introduce a balanced diet appropriate for your pet's species, age, and size."
        };
        
        return adviceMap[disease] || "Please consult your veterinarian for proper diagnosis and treatment.";
    };

    return (
        <div className="chatbot-wrapper" ref={chatbotRef}>
            {/* Chatbot Icon Button */}
            <button 
                className={`chatbot-icon ${isOpen ? 'active' : ''}`} 
                onClick={toggleChatbot}
                aria-label="Open AI Chat Assistant"
            >
                <div className="chatbot-icon-inner">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1H3a3 3 0 0 1-3-3v-3a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z"></path>
                        <circle cx="7.5" cy="11.5" r="1.5"></circle>
                        <circle cx="16.5" cy="11.5" r="1.5"></circle>
                    </svg>
                </div>
                <span>Ask AI</span>
            </button>
            
            {/* Chatbot Dialog */}
            {isOpen && (
                <div className="chatbot-container">
                    <div className="chatbot-header">
                        <h2>Pet Health Assistant</h2>
                        <p>Identify possible health issues based on symptoms</p>
                        <button className="close-button" onClick={toggleChatbot}>
                            &times;
                        </button>
                    </div>
                    
                    <div className="messages-container">
                        {messages.map((message, index) => (
                            <div 
                                key={index} 
                                className={`message ${message.sender === "bot" ? "bot-message" : "user-message"}`}
                            >
                                {message.text}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="message bot-message loading">
                                <span>.</span><span>.</span><span>.</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                    
                    <form onSubmit={handleSubmit} className="input-form">
                        <input 
                            type="text" 
                            value={input} 
                            onChange={(e) => setInput(e.target.value)} 
                            placeholder="Describe your pet's symptoms..."
                            disabled={isLoading}
                        />
                        <button type="submit" disabled={isLoading}>
                            {isLoading ? "Analyzing..." : "Send"}
                        </button>
                    </form>
                    
                    <div className="disclaimer">
                        <p>Note: This tool provides preliminary guidance only and is not a substitute for professional veterinary care.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;