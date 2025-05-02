import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../css/addrecord.css";
import Footer from "../../components/Footer";

const AddRecord = () => {
  const navigate = useNavigate();
  const [record, setRecord] = useState({
    age: "",
    weight: "",
    vaccinationStatus: "",
    symptoms: "",
    symptomsDuration: "",
    lastCheckup: "",
    historicalRecords: "",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    let newErrors = {};

   
    if (record.age === "" || isNaN(record.age)) {
      newErrors.age = "Age is required and must be a valid number.";
    } else if (parseFloat(record.age) < 0 || record.age.length > 2) {
      newErrors.age = "Age must be a positive number with up to two digits.";
    }

    if (record.weight === "" || isNaN(record.weight)) {
      newErrors.weight = "Weight is required and must be a valid number.";
    } else if (parseFloat(record.weight) <= 0 || record.weight.length > 4) {
      newErrors.weight = "Weight must be a positive number with up to two digits.";
    }

   
    if (!record.vaccinationStatus) {
      newErrors.vaccinationStatus = "Please select vaccination status.";
    }

   
    if (!record.symptoms || record.symptoms.trim() === "") {
      newErrors.symptoms = "Symptoms description is required.";
    } else if (record.symptoms.trim().length < 5) {
      newErrors.symptoms = "Please provide a more detailed description of symptoms (at least 5 characters).";
    }

    
    if (record.symptomsDuration && record.symptomsDuration.trim().length < 3) {
      newErrors.symptomsDuration = "Duration must be at least 3 characters long.";
    }

    
    if (!record.lastCheckup) {
      newErrors.lastCheckup = "Last checkup date is required.";
    } else {
      const checkupDate = new Date(record.lastCheckup);
      const today = new Date();
      if (checkupDate > today) {
        newErrors.lastCheckup = "Checkup date cannot be in the future.";
      }
    }

    
    if (record.historicalRecords && record.historicalRecords.trim().length < 5) {
      newErrors.historicalRecords = "Please provide a more detailed history (at least 5 characters).";
    }

    
    if (record.description && record.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/addrecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
  
      const data = await response.json();
      
      if (data.success) {
        alert(`Pet health record submitted successfully! Pet ID: ${data.petId}`);
        navigate("/mypets"); 
      } else {
        setErrors({ submit: data.error || "Failed to submit record" });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the record. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="malinda-form-container">
        <h1 className="malinda-page-title">Add Pet Health Record</h1>
        
        <form className="malinda-pet-form" onSubmit={handleSubmit}>
          <label>Age (in years):
            <input
              type="number"
              name="age"
              value={record.age}
              onChange={handleChange}
              min="0"
              max="99"
              step="1"
              required
            />
            {errors.age && <span className="malinda-error-message">{errors.age}</span>}
          </label>

          <label>Weight (kg):
            <input
              type="number"
              name="weight"
              value={record.weight}
              onChange={handleChange}
              min="0"
              max="99.9"
              step="0.1"
              required
            />
            {errors.weight && <span className="malinda-error-message">{errors.weight}</span>}
          </label>

          <label>Vaccination Status:
            <select
              name="vaccinationStatus"
              value={record.vaccinationStatus}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Select Status</option>
              <option value="up-to-date">Up to date</option>
              <option value="partially-vaccinated">Partially vaccinated</option>
              <option value="not-vaccinated">Not vaccinated</option>
              <option value="unknown">Unknown</option>
            </select>
            {errors.vaccinationStatus && <span className="malinda-error-message">{errors.vaccinationStatus}</span>}
          </label>

          <label>Symptoms:
            <textarea
              name="symptoms"
              value={record.symptoms}
              onChange={handleChange}
              required
              className="malinda-textarea"
            ></textarea>
            {errors.symptoms && <span className="malinda-error-message">{errors.symptoms}</span>}
          </label>

          <label>Duration of Symptoms:
            <input
              type="text"
              name="symptomsDuration"
              value={record.symptomsDuration}
              onChange={handleChange}
              placeholder="e.g., 3 days, 2 weeks"
            />
            {errors.symptomsDuration && <span className="malinda-error-message">{errors.symptomsDuration}</span>}
          </label>

          <label>Last Checkup Date:
            <input
              type="date"
              name="lastCheckup"
              value={record.lastCheckup}
              onChange={handleChange}
              required
            />
            {errors.lastCheckup && <span className="malinda-error-message">{errors.lastCheckup}</span>}
          </label>

          <label>Historical Medical Records:
            <textarea
              name="historicalRecords"
              value={record.historicalRecords}
              onChange={handleChange}
              placeholder="Enter any previous medical history if available"
              className="malinda-textarea"
            ></textarea>
            {errors.historicalRecords && <span className="malinda-error-message">{errors.historicalRecords}</span>}
          </label>

          <label>Description:
            <textarea
              name="description"
              value={record.description}
              onChange={handleChange}
              className="malinda-textarea"
            ></textarea>
            {errors.description && <span className="malinda-error-message">{errors.description}</span>}
          </label>

          <div className="malinda-button-container">
            <Link to="/mypets" className="malinda-cancel-btn">Cancel</Link>
            <button type="submit" className="malinda-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Record"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddRecord;
