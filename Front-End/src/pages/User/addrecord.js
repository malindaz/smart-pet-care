import React, { useState } from "react";
import NavBar from "../../components/NavBar"; // Adjust the path as needed
import "../../css/addrecord.css"; // Make sure this file exists

const AddRecord = () => {
  const [record, setRecord] = useState({
    petName: "",
    age: "",
    weight: "",
    breed: "",
    symptoms: "",
    lastCheckup: "",
    description: "",
  });

  const handleChange = (e) => {
    setRecord({ ...record, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Pet Health Record Submitted:", record);
    alert("Pet health record submitted successfully!");
  };

  return (
    <>
      <NavBar />
      <div className="malinda-add-record-container">
        <h2 className="malinda-h2">Add Pet Health Record</h2>
        <form onSubmit={handleSubmit} className="malinda-record-form" >
          <label className="malinda-record-text malinda-label">Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={record.petName}
            onChange={handleChange}
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Age (in years):</label>
          <input
            type="number"
            name="age"
            value={record.age}
            onChange={handleChange}
            min="1"
            required
            className="malinda-input"
          />

          <label className="malinda-record-text malinda-label">Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={record.weight}
            onChange={handleChange}
            min="1"
            step="0.1"
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

          <label className="malinda-record-text malinda-label">Symptoms:</label>
          <textarea
            name="symptoms"
            value={record.symptoms}
            onChange={handleChange}
            required
            className="malinda-textarea"
          ></textarea>

          <label className="malinda-record-text malinda-label">Last Checkup Date:</label>
          <input
            type="date"
            name="lastCheckup"
            value={record.lastCheckup}
            onChange={handleChange}
            required
            className="malinda-input"
          />

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
    </>
  );
};

export default AddRecord;