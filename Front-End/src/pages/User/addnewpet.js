import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../css/addnewpet.css";  // Updated CSS import

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Pet Data:", pet);
    alert("Pet added successfully!");
    navigate("/mypets");
  };

  return (
    <>
      <NavBar />
      <div className="form-container">
        <h1 className="page-title">Add New Pet</h1>
        <form className="pet-form" onSubmit={handleSubmit}>
          <label>Name:
            <input type="text" 
            name="name" 
            value={pet.name} 
            onChange={handleChange} 
            required />
          </label>

          <label>Species:
            <input type="text" 
            name="species" 
            value={pet.species} 
            onChange={handleChange} 
            required />
          </label>

          <label>Breed:
            <input type="text" 
            name="breed" 
            value={pet.breed} 
            onChange={handleChange} />
          </label>

          <label>Age (years):
            <input type="number" 
            name="age" value={pet.age} 
            onChange={handleChange} 
            min="1" />
          </label>

          <label>Weight (kg):
            <input type="number" 
            name="weight" 
            value={pet.weight} 
            onChange={handleChange} 
            min="0.1"
            step="0.1"
            required />
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

          <div className="button-container">
              <Link to="/mypets" className="cancel-btn">Cancel</Link>
            <button type="submit" className="submit-btn">Add Pet</button>
             
            </div>

        </form>
      </div>
    </>
  );
};

export default AddNewPet;
