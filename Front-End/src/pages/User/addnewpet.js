import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../css/addnewpet.css";
import axios from "axios";
import Footer from "../../components/Footer";

const AddNewPet = () => {
  const navigate = useNavigate();
  const [pet, setPet] = useState({
    name: "",
    species: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    microchipID: "",
    lastCheckup: "",
    ownerName: "",
  });

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/pets/add", pet);
      alert("Pet added successfully!");
      navigate("/mypets");
    } catch (error) {
      console.error("Error adding pet", error);
      alert("Failed to add pet.");
    }
  };

  return (
    <>
      <NavBar />
      <div className="malinda-form-container">
        <h1 className="malinda-page-title">Add New Pet</h1>
        <form className="malinda-pet-form" onSubmit={handleSubmit}>
          <label>Name:
            <input type="text" name="name" value={pet.name} onChange={handleChange} required />
          </label>
          <label>Species:
            <input type="text" name="species" value={pet.species} onChange={handleChange} required />
          </label>
          <label>Breed:
            <input type="text" name="breed" value={pet.breed} onChange={handleChange} />
          </label>
          <label>Age (years):
            <input type="number" name="age" value={pet.age} onChange={handleChange} min="1" />
          </label>
          <label>Weight (kg):
            <input type="number" name="weight" value={pet.weight} onChange={handleChange} min="0.1" step="0.1" required />
          </label>
          <label>Gender:
            <select name="gender" value={pet.gender} onChange={handleChange} required>
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </label>
          <label>Microchip ID:
            <input type="text" name="microchipID" value={pet.microchipID} onChange={handleChange} />
          </label>
          <label>Last Checkup Date:
            <input type="date" name="lastCheckup" value={pet.lastCheckup} onChange={handleChange} required />
          </label>
          <label>Owner Name:
            <input type="text" name="ownerName" value={pet.ownerName} onChange={handleChange} required />
          </label>
          <div className="malinda-button-container">
            <Link to="/mypets" className="malinda-cancel-btn">Cancel</Link>
            <button type="submit" className="malinda-submit-btn">Add Pet</button>
          </div>
        </form>
      </div>
      <Footer/>
    </>
  );
};

export default AddNewPet;
