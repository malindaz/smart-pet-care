import React, { useState, useEffect } from "react";
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
    photo: null,  
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    let newErrors = {};

    // Name and Owner Name - Only letters and spaces
    const nameRegex = /^[A-Za-z\s]+$/;
    if (!pet.name.match(nameRegex)) {
      newErrors.name = "Name should contain only letters.";
    }
    if (!pet.ownerName.match(nameRegex)) {
      newErrors.ownerName = "Owner Name should contain only letters.";
    }

    // Species and Breed - Only letters, spaces, and hyphens
    const speciesRegex = /^[A-Za-z\s-]+$/;
    if (pet.species && !pet.species.match(speciesRegex)) {
      newErrors.species = "Species should contain only letters.";
    }
    if (pet.breed && !pet.breed.match(speciesRegex)) {
      newErrors.breed = "Breed should contain only letters.";
    }

    // Age - Minimum 1
    if (pet.age < 1 || isNaN(pet.age)) {
      newErrors.age = "Age must be at least 1 year.";
    }

    // Weight - Minimum 0.1 kg
    if (pet.weight < 0.1 || isNaN(pet.weight)) {
      newErrors.weight = "Weight must be at least 0.1 kg.";
    }

    // Gender - Required selection
    if (!pet.gender) {
      newErrors.gender = "Please select a gender.";
    }

    // Microchip ID - Only alphanumeric
    const microchipRegex = /^[A-Za-z0-9]+$/;
    if (pet.microchipID && !pet.microchipID.match(microchipRegex)) {
      newErrors.microchipID = "Microchip ID should be alphanumeric.";
    }

    // Last Checkup Date - Should not be a future date
    if (pet.lastCheckup) {
      const today = new Date().toISOString().split("T")[0];
      if (pet.lastCheckup > today) {
        newErrors.lastCheckup = "Last Checkup date cannot be in the future.";
      }
    }

    // Pet Photo - Required
    if (!pet.photo) {
      newErrors.photo = "Please select a pet photo.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setPet({ ...pet, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    const formData = new FormData();
    for (const key in pet) {
      if (key !== 'photo') {
        formData.append(key, pet[key]);
      }
    }
    formData.append("photo", pet.photo);

    try {
      const response = await axios.post("http://localhost:5000/api/pets/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 10000
      });

      alert("Pet added successfully!");
      navigate("/mypets");
    } catch (error) {
      console.error("Error adding pet:", error);
      alert("Failed to add pet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="malinda-form-container">
        <h1 className="malinda-page-title">Add New Pet</h1>
        <form className="malinda-pet-form" onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Name:
            <input type="text" name="name" value={pet.name} onChange={handleChange} required />
            {errors.name && <span className="malinda-error-message">{errors.name}</span>}
          </label>

          <label>Species:
            <input type="text" name="species" value={pet.species} onChange={handleChange} required />
            {errors.species && <span className="malinda-error-message">{errors.species}</span>}
          </label>

          <label>Breed:
            <input type="text" name="breed" value={pet.breed} onChange={handleChange} />
            {errors.breed && <span className="malinda-error-message">{errors.breed}</span>}
          </label>

          <label>Age (years):
            <input type="number" name="age" value={pet.age} onChange={handleChange} min="1" />
            {errors.age && <span className="malinda-error-message">{errors.age}</span>}
          </label>

          <label>Weight (kg):
            <input type="number" name="weight" value={pet.weight} onChange={handleChange} min="0.1" step="0.1" required />
            {errors.weight && <span className="malinda-error-message">{errors.weight}</span>}
          </label>

          <label>Gender:
            <select name="gender" value={pet.gender} onChange={handleChange} required>
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            {errors.gender && <span className="malinda-error-message">{errors.gender}</span>}
          </label>

          <label>Microchip ID:
            <input type="text" name="microchipID" value={pet.microchipID} onChange={handleChange} />
            {errors.microchipID && <span className="malinda-error-message">{errors.microchipID}</span>}
          </label>

          <label>Last Checkup Date:
            <input type="date" name="lastCheckup" value={pet.lastCheckup} onChange={handleChange} required />
            {errors.lastCheckup && <span className="malinda-error-message">{errors.lastCheckup}</span>}
          </label>

          <label>Owner Name:
            <input type="text" name="ownerName" value={pet.ownerName} onChange={handleChange} required />
            {errors.ownerName && <span className="malinda-error-message">{errors.ownerName}</span>}
          </label>

          <label>Pet Photo:
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} required />
            {errors.photo && <span className="malinda-error-message">{errors.photo}</span>}
          </label>

          <div className="malinda-button-container">
            <Link to="/mypets" className="malinda-cancel-btn">Cancel</Link>
            <button type="submit" className="malinda-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default AddNewPet;