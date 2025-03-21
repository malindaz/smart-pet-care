import React, { useState, useEffect } from "react";import { Link, useNavigate } from "react-router-dom";
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
    photo: null,  
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPet({ ...pet, photo: e.target.files[0] });
    console.log("📷 Selected file:", e.target.files[0]); 
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!pet.photo) {
      alert("Please select a pet photo before submitting.");
      return;
    }
  
    const formData = new FormData();
    Object.keys(pet).forEach((key) => formData.append(key, pet[key]));
    formData.append("photo", pet.photo); // Append file separately
  
    try {
      const response = await axios.post("http://localhost:5000/api/pets/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      console.log("Pet added:", response.data);
      alert("Pet added successfully!");
      navigate("/mypets");
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet.");
    }
  };
  
  
  
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const formData = new FormData();
  //     Object.keys(pet).forEach((key) => {
  //       formData.append(key, pet[key]);
  //     });

  //     await axios.post("http://localhost:5000/api/pets/add", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //     });

  //     alert("Pet added successfully!");
  //     navigate("/mypets");
  //   } catch (error) {
  //     console.error("Error adding pet", error);
  //     alert("Failed to add pet.");
  //   }
  // };

  return (
    <>
      <NavBar />
      <div className="malinda-form-container">
        <h1 className="malinda-page-title">Add New Pet</h1>
        <form className="malinda-pet-form" onSubmit={handleSubmit} encType="multipart/form-data">

     
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
          <label>Pet Photo:
            <input type="file" accept="image/*" onChange={handleFileChange} required />
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
