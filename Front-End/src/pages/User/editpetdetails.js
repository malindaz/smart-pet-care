import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import axios from "axios";
import Footer from "../../components/Footer";
import "../../css/addnewpet.css";

const EditPetDetails = () => {
  const { petId } = useParams(); 
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/pets/${petId}`);
        setPet(response.data);
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };
    fetchPet();
  }, [petId]);

 
  const handleChange = (e) => {
    setPet({ ...pet, [e.target.name]: e.target.value });
  };

  
  const handleFileChange = (e) => {
    setPet({ ...pet, photo: e.target.files[0] });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    for (const key in pet) {
      if (key !== "photo") {
        formData.append(key, pet[key]);
      }
    }
    if (pet.photo instanceof File) {
      formData.append("photo", pet.photo);
    }

    try {
      await axios.put(`http://localhost:5000/api/pets/${petId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Pet details updated successfully!");
      navigate("/mypets");
    } catch (error) {
      console.error("Error updating pet:", error);
      alert("Failed to update pet.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="malinda-form-container">
        <h1 className="malinda-page-title">Edit Pet Details</h1>
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
            <input type="file" name="photo" accept="image/*" onChange={handleFileChange} />
          </label>
          <div className="malinda-button-container">
            <button type="submit" className="malinda-submit-btn" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Pet"}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default EditPetDetails;
