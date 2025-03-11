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
      <div className="add-record-container">
        <h2>Add Pet Health Record</h2>
        <form onSubmit={handleSubmit} className="record-form" >
          <label className="record-text">Pet Name:</label>
          <input
            type="text"
            name="petName"
            value={record.petName}
            onChange={handleChange}
            required
          />

          <label className="record-text">Age (in years):</label>
          <input
            type="number"
            name="age"
            value={record.age}
            onChange={handleChange}
            min="1"
            required
          />

          <label className="record-text">Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={record.weight}
            onChange={handleChange}
            min="1"
            step="0.1"
            required
          />

          <label className="record-text">Breed:</label>
          <input
            type="text"
            name="breed"
            value={record.breed}
            onChange={handleChange}
            required
          />

          <label className="record-text">Symptoms:</label>
          <textarea
            name="symptoms"
            value={record.symptoms}
            onChange={handleChange}
            required
          ></textarea>

          <label className="record-text">Last Checkup Date:</label>
          <input
            type="date"
            name="lastCheckup"
            value={record.lastCheckup}
            onChange={handleChange}
            required
          />

          <label className="record-text">Description:</label>
          <textarea
            name="description"
            value={record.description}
            onChange={handleChange}
          ></textarea>
            
          <button type="submit" className="button">Submit Record</button>
        </form>
      </div>
    </>
  );
};

export default AddRecord;
