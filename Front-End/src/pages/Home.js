import React from 'react';
import { Calendar, HeartPulse, Pill, ShieldCheck, MessageCircle, ArrowRight, Search } from 'lucide-react';
import '../css/Homepage.css';
import NavBar  from '../components/NavBar';
import Footer  from '../components/Footer';
import ChatbotIcon from '../components/Chatbot';
import heroPetImage from '../assets/images/hero-pet.jpg';
import aiAssistantImage from '../assets/images/ai-assistant.jpg';
import testimonial1Image from '../assets/images/testimonial-1.jpg';
import testimonial2Image from '../assets/images/testimonial-2.jpg';
import testimonial3Image from '../assets/images/testimonial-3.jpg';


const Home = () => {
  return (
    <div className="homepage-container">
      <NavBar />
      
      {/* Hero Section */}
      <section className="homepage-hero">
        <div className="homepage-hero-content">
          <h1>Complete Health Care For Your Furry Friends</h1>
          <p>An all-in-one platform to manage your pet's health, appointments, medications, and more</p>
          <div className="homepage-search-box">
            <input type="text" placeholder="Search for services, medications, etc." />
            <button className="homepage-search-btn">
              <Search size={20} />
            </button>
          </div>
          <div className="homepage-hero-btns">
            <button className="homepage-primary-btn" onClick={() => window.location.href = '/register'}>Get Started <ArrowRight size={16} /></button>
            <button className="homepage-secondary-btn"  onClick={() => window.location.href = '/appointment-form'}>Book Appointment</button>
          </div>
        </div>
        <div className="homepage-hero-image">
          <img src={heroPetImage} alt="Happy dog and cat" />
        </div>
      </section>

      {/* Services Section */}
      <section className="homepage-services">
        <h2>Our Services</h2>
        <p className="homepage-section-subtitle">Everything you need for your pet's well-being</p>
        
        <div className="homepage-services-grid">
          <div className="homepage-service-card">
            <div className="homepage-service-icon">
            <MessageCircle size={40} color="#00C2CB" />
            </div>
            <h3>AI Health Assistant</h3>
            <p>Get instant answers about your pet's symptoms and basic health concerns</p>
          </div>
          
          
          <div className="homepage-service-card">
            <div className="homepage-service-icon">
              <HeartPulse size={40} color="#00C2CB" />
            </div>
            <h3>Health Records</h3>
            <p>Track your pet's health history, vaccinations, and medical documents</p>
          </div>
          
          <div className="homepage-service-card">
            <div className="homepage-service-icon">
              <Pill size={40} color="#00C2CB" />
            </div>
            <h3>Pharmacy</h3>
            <p>Order medications and supplements with home delivery options</p>
          </div>
          
          <div className="homepage-service-card">
            <div className="homepage-service-icon">
              <Calendar size={40} color="#00C2CB" />
            </div>
            <h3>Appointment Scheduling</h3>
            <p>Book appointments with veterinarians online and manage your schedule</p>
          </div>
        </div>
      </section>

      {/* Health Assistant Highlight */}
      <section className="homepage-ai-assistant">
        <div className="homepage-ai-content">
          <h2>AI-Powered Health Assistant</h2>
          <p>Our intelligent chatbot helps identify potential health issues and provides immediate guidance for your pets.</p>
          <ul className="homepage-feature-list">
            <li><ShieldCheck size={20} color="#00C2CB" /> Symptom identification</li>
            <li><ShieldCheck size={20} color="#00C2CB" /> First-aid instructions</li>
            <li><ShieldCheck size={20} color="#00C2CB" /> Behavior analysis</li>
            <li><ShieldCheck size={20} color="#00C2CB" /> Diet recommendations</li>
          </ul>
          <button className="homepage-primary-btn">Try Health Assistant <ArrowRight size={16} /></button>
        </div>
        <div className="homepage-ai-image">
          <img src={aiAssistantImage} alt="AI pet health assistant" />
        </div>
      </section>

      {/* Testimonials */}
      <section className="homepage-testimonials">
        <h2>What Pet Parents Say</h2>
        <p className="homepage-section-subtitle">Stories from our happy customers</p>
        
        <div className="homepage-testimonial-carousel">
          <div className="homepage-testimonial-card">
            <div className="homepage-testimonial-image">
              <img src={testimonial1Image} alt="Pet owner testimonial" />
            </div>
            <p>"The AI assistant helped me identify my dog's skin condition quickly. The appointment scheduling was seamless, and we got the right treatment within hours!"</p>
            <h4>Sarah & Max</h4>
          </div>
          
          <div className="homepage-testimonial-card">
            <div className="homepage-testimonial-image">
              <img src={testimonial2Image} alt="Pet owner testimonial" />
            </div>
            <p>"Having all my cat's health records in one place has made vet visits so much easier. The medication reminders are a lifesaver!"</p>
            <h4>James & Whiskers</h4>
          </div>
          
          <div className="homepage-testimonial-card">
            <div className="homepage-testimonial-image">
              <img src={testimonial3Image} alt="Pet owner testimonial" />
            </div>
            <p>"I love that I can order prescription food and medications through the same platform. It's convenient and always arrives on time."</p>
            <h4>Emma & Buddy</h4>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="homepage-cta">
        <div className="homepage-cta-content">
          <h2>Ready to give your pet the best care?</h2>
          <p>Join thousands of pet parents who trust our platform for their furry friends' health needs.</p>
          <button className="homepage-primary-btn">Create Free Account <ArrowRight size={16} /></button>
        </div>
      </section>
      <ChatbotIcon />
      <Footer />
    </div>
  );
};

export default Home;