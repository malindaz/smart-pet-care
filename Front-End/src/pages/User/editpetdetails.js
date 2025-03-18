import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../css/addnewpet.css";
import axios from "axios";
import Footer from "../../components/Footer";

const EditPet = () => {
  const navigate = useNavigate();
  const { petId } = useParams(); // Extract petId from the URL
  console.log("Pet ID:", petId); // Log to debug the petId

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

  useEffect(() => {
    // Check if petId is valid before making API request
    if (!petId) {
      console.error("No pet ID found");
      return;
    }

    const fetchPetData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/${petId}`);
        console.log("Fetched pet data:", response.data);
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };

    fetchPetData();
  }, [petId]);

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/pets/${petId}`, pet);
      alert("Pet details updated successfully");
      navigate("/mypets");
    } catch (error) {
      console.error("Error updating pet data:", error);
      alert("Failed to update pet details");
    }
  };

  return (
    <>
      <NavBar />
      <div className="malinda-form-container">
        <h1 className="malinda-page-title">Edit Pet Details</h1>
        <form className="malinda-pet-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={pet.name} onChange={handleChange} required />

          <label>Species:</label>
          <input type="text" name="species" value={pet.species} onChange={handleChange} required />

          <label>Breed:</label>
          <input type="text" name="breed" value={pet.breed} onChange={handleChange} />

          <label>Age (years):</label>
          <input type="number" name="age" value={pet.age} onChange={handleChange} min="1" />

          <label>Weight (kg):</label>
          <input type="number" name="weight" value={pet.weight} onChange={handleChange} min="0.1" step="0.1" required />

          <label>Gender:</label>
          <select name="gender" value={pet.gender} onChange={handleChange} required>
            <option value="" disabled>Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <label>Microchip ID:</label>
          <input type="text" name="microchipID" value={pet.microchipID} onChange={handleChange} />

          <label>Last Checkup Date:</label>
          <input type="date" name="lastCheckup" value={pet.lastCheckup ? pet.lastCheckup.split("T")[0] : ""} onChange={handleChange} required />

          <label>Owner Name:</label>
          <input type="text" name="ownerName" value={pet.ownerName} onChange={handleChange} required />

          <div className="malinda-button-container">
            <Link to="/mypets" className="malinda-cancel-btn">Cancel</Link>
            <button type="submit" className="malinda-submit-btn">Update Pet</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditPet;
