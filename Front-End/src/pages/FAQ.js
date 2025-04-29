// FAQ.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../src/css/FAQ.css";
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Predefined FAQ data for the static version
  const staticFaqs = [
    {
      id: 1,
      category: 'appointments',
      question: 'How do I book an appointment for my pet?',
      answer: 'You can book an appointment through our "Book Appointment" page. Select your pet, choose a preferred date and time, and select the type of appointment. You ll receive a confirmation email once your appointment is scheduled.'
    },
    {
      id: 2,
      category: 'appointments',
      question: 'Can I reschedule or cancel my appointment?',
      answer: 'Yes, you can reschedule or cancel your appointment up to 24 hours before the scheduled time without any charge. Simply log in to your account, go to "My Appointments," and select the appointment you wish to modify.'
    },
    {
      id: 3,
      category: 'appointments',
      question: 'What information do I need to provide when booking an appointment?',
      answer: 'You ll need to provide your pets information (name, species, breed, age), the reason for the visit, and select a preferred date and time. If you have specific concerns, you can add details in the notes section.'
    },
    {
      id: 4,
      category: 'pharmacy',
      question: 'How do I order medications for my pet?',
      answer: 'You can order medications from our pharmacy section. Simply search for the required medication, add it to your cart, and proceed to checkout. You may need to upload a prescription for certain medications.'
    },
    {
      id: 5,
      category: 'pharmacy',
      question: 'How long does it take to process and deliver pharmacy orders?',
      answer: 'Most pharmacy orders are processed within 24-48 hours. Delivery time depends on your location, but typically takes 2-5 business days. For urgent medications, we offer expedited shipping options.'
    },
    {
      id: 6,
      category: 'pharmacy',
      question: 'Do you offer prescription refills?',
      answer: 'Yes, we offer prescription refills. Log into your account, navigate to "My Prescriptions," and select the medication you need refilled. Our veterinary team will review and approve refills for existing prescriptions.'
    },
    {
      id: 7,
      category: 'veterinarians',
      question: 'How do I apply to work as a veterinarian at your facility?',
      answer: 'You can apply through our "Apply as Vet" page. Submit your resume, credentials, and professional information. Our HR team will review your application and contact you for an interview if your qualifications match our requirements.'
    },
    {
      id: 8,
      category: 'veterinarians',
      question: 'What qualifications do you require for veterinarians?',
      answer: 'We require a Doctor of Veterinary Medicine (DVM) degree from an accredited institution, a valid veterinary license in the state, and at least 2 years of clinical experience. Specialized certifications are a plus but not mandatory.'
    },
    {
      id: 9,
      category: 'pets',
      question: 'How do I add a new pet to my account?',
      answer: 'To add a new pet, go to the "My Pets" section and click on "Add New Pet." Fill in your pets details including name, species, breed, date of birth, weight, and upload a photo if you d like. You can also add notes about any special conditions or allergies.'
    },
    {
      id: 10,
      category: 'pets',
      question: 'Can I manage multiple pets under one account?',
      answer: 'Yes, you can add and manage multiple pets under a single account. Each pet will have its own profile with separate medical records, appointment history, and medication schedules.'
    },
    {
      id: 11,
      category: 'records',
      question: 'How do I access my pet\'s medical records?',
      answer: 'You can access medical records through the "Medical Records" section of your account. Select the pet you want to view records for, and youll see a complete history of visits, diagnoses, treatments, and prescribed medications.'
    },
    {
      id: 12,
      category: 'records',
      question: 'How do I add previous medical records to my pet\'s profile?',
      answer: 'To add previous medical records, go to your pet\'s profile, select "Medical Records," and click on "Add Previous Records." You can upload documents or fill in details manually. Our veterinary team will verify and integrate these records into your pet\'s medical history.'
    },
    {
      id: 13,
      category: 'records',
      question: 'Can I share my pet\'s medical records with another veterinarian?',
      answer: 'Yes, you can share your pet\'s medical records with other veterinarians. In the "Medical Records" section, select the records you want to share and click on "Share Records." You can then choose to email the records or generate a secure link that can be accessed by another veterinarian.'
    },
    {
      id: 14,
      category: 'general',
      question: 'What payment methods do you accept?',
      answer: 'We accept most major credit cards (Visa, MasterCard, American Express, Discover), debit cards, and PayPal. For in-person visits, we also accept cash and personal checks. We also work with pet insurance providers for direct billing.'
    },
    {
      id: 15,
      category: 'general',
      question: 'Do you offer emergency services?',
      answer: 'Yes, we offer emergency veterinary services 24/7. For emergencies during regular business hours, call our main number. For after-hours emergencies, call our emergency hotline provided on our contact page.'
    }
  ];

  // Simulate API fetch (in a real app, replace with actual API call)
  useEffect(() => {
    // Simulating API call with setTimeout
    const fetchFAQs = async () => {
      try {
        // In a real application, replace this with actual API call
        // const response = await axios.get('/api/faqs');
        // setFaqs(response.data);

        // Using static data instead
        setTimeout(() => {
          setFaqs(staticFaqs);
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching FAQs:', error);
        setIsLoading(false);
        // Fallback to static data in case of error
        setFaqs(staticFaqs);
      }
    };

    fetchFAQs();
  }, []);

  // Toggle FAQ open/closed state
  const toggleFAQ = (id) => {
    setFaqs(faqs.map(faq => {
      if (faq.id === id) {
        return { ...faq, isOpen: !faq.isOpen };
      }
      return faq;
    }));
  };

  // Filter FAQs based on category and search term
  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // List of categories for the filter
  const categories = [
    { value: 'all', label: 'All Questions' },
    { value: 'appointments', label: 'Appointments' },
    { value: 'pharmacy', label: 'Pharmacy' },
    { value: 'veterinarians', label: 'Veterinarians' },
    { value: 'pets', label: 'Pet Management' },
    { value: 'records', label: 'Medical Records' },
    { value: 'general', label: 'General Questions' }
  ];

  return (
    <div className="faq-container">
      <NavBar />
      <div className="faq-container-2">
        <div className="faq-header">
          <h1>Frequently Asked Questions</h1>
          <p>Find answers to common questions about our pet health care services</p>

          <div className="faq-search">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="faq-categories">
            {categories.map(category => (
              <button
                key={category.value}
                className={`category-btn ${activeCategory === category.value ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.value)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        <div className="faq-content">
          {isLoading ? (
            <div className="loading">Loading FAQs...</div>
          ) : filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => (
              <div
                className={`faq-item ${faq.isOpen ? 'open' : ''}`}
                key={faq.id}
                onClick={() => toggleFAQ(faq.id)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-icon">{faq.isOpen ? '−' : '+'}</span>
                </div>
                {faq.isOpen && (
                  <div className="faq-answer">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No FAQ matches your search. Please try another query or category.</p>
            </div>
          )}
        </div>

        <div className="faq-footer">
          <p>Can't find what you're looking for? <a href="/contact">Contact our support team</a></p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FAQ;