import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../../css/mypets.css";

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch all pets from the API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pets/all"); // Adjust the API URL
        const data = await response.json();
        setPets(data);
        if (data.length > 0) setSelectedPet(data[0]); // Default to first pet
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  return (
    <>
      <NavBar />
      <div className="malinda-pet-health-container">
        <h1 className="malinda-page-title">Pet Health Insights</h1>
        <p className="malinda-page-description">
          View and analyze pet health records to ensure their well-being.
        </p>

        <div className="malinda-pet-dashboard">
          {/* Sidebar */}
          <div className="malinda-pet-sidebar">
            <h3>My Pets</h3>
            <ul className="malinda-pet-list">
              <li 
                className={`malinda-pet-item ${selectedPet === "all" ? 'active' : ''}`}
                onClick={() => setSelectedPet("all")}
              >
                <span className="malinda-pet-name">All Pets</span>
              </li>
              {pets.map(pet => (
                <li 
                  key={pet.id} 
                  className={`malinda-pet-item ${selectedPet && selectedPet.id === pet.id ? 'active' : ''}`}
                  onClick={() => setSelectedPet(pet)}
                >
                  <span className="malinda-pet-name">{pet.name}</span>
                  <span className="malinda-pet-species">{pet.species}</span>
                </li>
              ))}
            </ul>
            <Link to="/addnewpet" className="malinda-add-btn">➕ Add New Pet</Link>
          </div>

          {/* Show All Pets */}
          {selectedPet === "all" ? (
            <div className="malinda-all-pets-profile">
              <h2>All Pets</h2>
              {loading ? <p>Loading pets...</p> : (
                <div className="malinda-all-pets-grid">
                  {pets.map((pet) => (
                    <div key={pet.id} className="malinda-pet-card">
                      <h3>{pet.name}</h3>
                      <p><strong>Species:</strong> {pet.species}</p>
                      <p><strong>Breed:</strong> {pet.breed}</p>
                      <p><strong>Age:</strong> {pet.age} years</p>
                      <p><strong>Weight:</strong> {pet.weight} kg</p>
                      <p><strong>Last Checkup:</strong> {new Date(pet.lastCheckup).toLocaleDateString()}</p>
                      <Link to={`/pet-details/${pet.id}`} className="malinda-view-btn">View Details</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            selectedPet && (
              <div className="malinda-pet-profile">
                <h2>{selectedPet.name}'s Profile</h2>
                <p><strong>Species:</strong> {selectedPet.species}</p>
                <p><strong>Breed:</strong> {selectedPet.breed}</p>
                <p><strong>Age:</strong> {selectedPet.age} years</p>
                <p><strong>Weight:</strong> {selectedPet.weight} kg</p>
                
                {/* Buttons for Editing Profile & Adding Medical Records */}
                <div className="malinda-buttons">
                  <Link to={`/editpetdetails/${selectedPet.id}`} className="malinda-edit-btn">✏️ Edit Profile</Link>
                  <Link to={`/add-medical-record/${selectedPet.id}`} className="malinda-add-btn">➕ Add Medical Record</Link>
                </div>

                <h3>Medical History</h3>
                <ul>
                  {selectedPet.medicalHistory && selectedPet.medicalHistory.length > 0 ? (
                    selectedPet.medicalHistory.map((record, index) => (
                      <li key={index}>
                        <strong>{record.date}:</strong> {record.procedure} - {record.notes}
                      </li>
                    ))
                  ) : (
                    <p>No medical records available.</p>
                  )}
                </ul>

                <h3>Vaccination Records</h3>
                <ul>
                  {selectedPet.vaccination ? (
                    Object.entries(selectedPet.vaccination).map(([vaccine, details]) => (
                      <li key={vaccine}>
                        <strong>{vaccine.toUpperCase()}:</strong> {details.date} (Next: {details.dueDate})
                      </li>
                    ))
                  ) : (
                    <p>No vaccination records available.</p>
                  )}
                </ul>
              </div>
            )
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MyPets;
