import React, { useState } from "react";
import NavBar from "../../components/NavBar";
import "../../css/addrecord.css";
import Footer from "../../components/Footer";

const AddRecord = () => {
  const [record, setRecord] = useState({
    petName: "",
    species: "",
    breed: "",
    gender: "",
    age: "",
    weight: "",
    vaccinationStatus: "",
    symptoms: "",
    symptomsDuration: "",
    lastCheckup: "",
    historicalRecords: "",
    description: "",
  });

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/addrecords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
  
      const data = await response.json();
      console.log("API Response:", data); 
  
      if (data.success) {
        alert(`Pet health record submitted successfully! Pet ID: ${data.petId}`);
        setRecord({
          petName: "",
          species: "",
          breed: "",
          gender: "",
          age: "",
          weight: "",
          vaccinationStatus: "",
          symptoms: "",
          symptomsDuration: "",
          lastCheckup: "",
          historicalRecords: "",
          description: "",
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the record. Please try again.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="malinda-add-record-container">
        <h2 className="malinda-h2">Add Pet Health Record</h2>
        <form onSubmit={handleSubmit} className="malinda-record-form">
          
          
          <label className="malinda-record-text malinda-label">Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={record.petName}
            onChange={handleChange}
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Species:</label>
          <input
            type="text"
            name="species"
            value={record.species}
            onChange={handleChange}
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Breed:</label>
          <input
            type="text"
            name="breed"
            value={record.breed}
            onChange={handleChange}
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Gender:</label>
          <select 
            name="gender"
            value={record.gender}
            onChange={handleChange}
            required
            className="malinda-input malinda-record-text"
          >
            <option value="" disabled>Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="unknown">Unknown</option>
          </select>

          <label className="malinda-record-text malinda-label">Age (in years):</label>
          <input
            type="number"
            name="age"
            value={record.age}
            onChange={handleChange}
            min="0"
            step="1"
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={record.weight}
            onChange={handleChange}
            min="0"
            step="0.1"
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Vaccination Status:</label>
          <select
            name="vaccinationStatus"
            value={record.vaccinationStatus}
            onChange={handleChange}
            required
            className="malinda-input"
          >
            <option value="">Select Status</option>
            <option value="up-to-date">Up to date</option>
            <option value="partially-vaccinated">Partially vaccinated</option>
            <option value="not-vaccinated">Not vaccinated</option>
            <option value="unknown">Unknown</option>
          </select>

          <label className="malinda-record-text malinda-label">Symptoms:</label>
          <textarea
            name="symptoms"
            value={record.symptoms}
            onChange={handleChange}
            required
            className="malinda-textarea"
          ></textarea>

          <label className="malinda-record-text malinda-label">Duration of Symptoms:</label>
          <input
            type="text"
            name="symptomsDuration"
            value={record.symptomsDuration}
            onChange={handleChange}
            placeholder="e.g., 3 days, 2 weeks"
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Last Checkup Date:</label>
          <input
            type="date"
            name="lastCheckup"
            value={record.lastCheckup}
            onChange={handleChange}
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Historical Medical Records:</label>
          <textarea
            name="historicalRecords"
            value={record.historicalRecords}
            onChange={handleChange}
            placeholder="Enter any previous medical history if available"
            className="malinda-textarea malinda-placeholder"
          ></textarea>

          <label className="malinda-record-text malinda-label">Description:</label>
          <textarea
            name="description"
            value={record.description}
            onChange={handleChange}
            className="malinda-textarea"
          ></textarea>

          <button type="submit" className="malinda-button">Submit Record</button>
        </form>
      </div>
      <Footer/>
    </>
  );
};

export default AddRecord;