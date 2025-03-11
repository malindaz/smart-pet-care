import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../css/mypets.css";

const MyPets = () => {
 
  const [pets, setPets] = useState([
    {
      id: 1,
      name: "Max",
      species: "Dog",
      breed: "Golden Retriever",
      age: 5,
      weight: 12,
      gender: "Male",
      microchipID: "985121082374568",
      lastCheckup: "2025-02-15",
      ownerName: "John Smith",
      medicalHistory: [
        { date: "2024-12-10", procedure: "Annual Vaccination", notes: "All vaccines updated" },
        { date: "2025-01-20", procedure: "Dental Cleaning", notes: "Mild tartar buildup" },
        { date: "2025-02-15", procedure: "Regular Checkup", notes: "Healthy condition" }
      ],
      medications: [
        { name: "Heartworm Prevention", dosage: "1 tablet", frequency: "Monthly", startDate: "2024-01-01", endDate: "Ongoing" }
      ],
      allergies: ["Chicken", "Certain grasses"],
      dietaryNeeds: "Premium dry kibble, 2 cups daily",
      exerciseRoutine: "30-minute walks twice daily",
      vaccination: {
        rabies: { date: "2024-12-10", dueDate: "2025-12-10" },
        dhpp: { date: "2024-12-10", dueDate: "2025-12-10" },
        bordetella: { date: "2024-09-05", dueDate: "2025-03-05" }
      }
    },
    {
      id: 2,
      name: "Luna",
      species: "Cat",
      breed: "Siamese",
      age: 3,
      weight: 4.5,
      gender: "Female",
      microchipID: "985121082398765",
      lastCheckup: "2025-01-30",
      ownerName: "Sarah Johnson",
      medicalHistory: [
        { date: "2024-11-15", procedure: "Annual Vaccination", notes: "All vaccines updated" },
        { date: "2025-01-30", procedure: "Regular Checkup", notes: "Healthy condition" }
      ],
      medications: [],
      allergies: ["Dairy"],
      dietaryNeeds: "Wet food twice daily, 1/4 cup dry food",
      exerciseRoutine: "Indoor play sessions, 15 minutes twice daily",
      vaccination: {
        rabies: { date: "2024-11-15", dueDate: "2025-11-15" },
        fvrcp: { date: "2024-11-15", dueDate: "2025-11-15" }
      }
    }
  ]);

  const [selectedPet, setSelectedPet] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  // Function to handle pet selection
  const handlePetSelect = (pet) => {
    setSelectedPet(pet);
    setActiveTab("basic");
  };

  // Auto-select first pet on component mount
  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0]);
    }
  }, [pets]);

  return (
    <>
      <NavBar />
      <div className="pet-health-container">
        <h1 className="page-title">Pet Health Insights</h1>
        <p className="page-description">
          View and analyze pet health records to ensure their well-being.
        </p>

        <div className="pet-dashboard">
          {/* Pet Selection Sidebar */}
          <div className="pet-sidebar">
            <h3>My Pets</h3>
            <ul className="pet-list">
              {pets.map(pet => (
                <li 
                  key={pet.id} 
                  className={`pet-item ${selectedPet && selectedPet.id === pet.id ? 'active' : ''}`}
                  onClick={() => handlePetSelect(pet)}
                >
                  <span className="pet-name">{pet.name}</span>
                  <span className="pet-species">{pet.species}</span>
                </li>
              ))}
            </ul>
            <Link to="/aecord" className="add-btn">➕ Add New Pet</Link>
          </div>

          {/* Pet Profile Display Area */}
          {selectedPet ? (
            <div className="pet-profile">
              <div className="profile-header">
                <h2>{selectedPet.name}'s Profile</h2>
                <div className="profile-actions">
                  <Link to={`/edit-pet/${selectedPet.id}`} className="edit-btn">Edit Profile</Link>
                  <Link to={`/addrecord/`} className="add-record-btn">Add Health Record</Link>
                </div>
              </div>

              {/* Profile Navigation Tabs */}
              <div className="profile-tabs">
                <button 
                  className={`tab-btn ${activeTab === 'basic' ? 'active' : ''}`}
                  onClick={() => setActiveTab('basic')}
                >
                  Basic Info
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'medical' ? 'active' : ''}`}
                  onClick={() => setActiveTab('medical')}
                >
                  Medical History
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
                  onClick={() => setActiveTab('care')}
                >
                  Care Plan
                </button>
                <button 
                  className={`tab-btn ${activeTab === 'vaccinations' ? 'active' : ''}`}
                  onClick={() => setActiveTab('vaccinations')}
                >
                  Vaccinations
                </button>
              </div>

              {/* Basic Information Tab */}
              {activeTab === 'basic' && (
                <div className="profile-section">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Species:</span>
                      <span className="info-value">{selectedPet.species}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Breed:</span>
                      <span className="info-value">{selectedPet.breed}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Age:</span>
                      <span className="info-value">{selectedPet.age} years</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Weight:</span>
                      <span className="info-value">{selectedPet.weight} kg</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Gender:</span>
                      <span className="info-value">{selectedPet.gender}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Microchip ID:</span>
                      <span className="info-value">{selectedPet.microchipID}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Owner:</span>
                      <span className="info-value">{selectedPet.ownerName}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Last Checkup:</span>
                      <span className="info-value">{new Date(selectedPet.lastCheckup).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Medical History Tab */}
              {activeTab === 'medical' && (
                <div className="profile-section">
                  <h3>Medical History</h3>
                  {selectedPet.medicalHistory.length > 0 ? (
                    <table className="medical-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Procedure</th>
                          <th>Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPet.medicalHistory.map((record, index) => (
                          <tr key={index}>
                            <td>{new Date(record.date).toLocaleDateString()}</td>
                            <td>{record.procedure}</td>
                            <td>{record.notes}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-data">No medical history recorded</p>
                  )}

                  <h3>Medications</h3>
                  {selectedPet.medications.length > 0 ? (
                    <table className="medical-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Dosage</th>
                          <th>Frequency</th>
                          <th>Started</th>
                          <th>End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPet.medications.map((med, index) => (
                          <tr key={index}>
                            <td>{med.name}</td>
                            <td>{med.dosage}</td>
                            <td>{med.frequency}</td>
                            <td>{med.startDate}</td>
                            <td>{med.endDate}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="no-data">No current medications</p>
                  )}

                  <h3>Allergies</h3>
                  {selectedPet.allergies.length > 0 ? (
                    <ul className="allergies-list">
                      {selectedPet.allergies.map((allergy, index) => (
                        <li key={index}>{allergy}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-data">No known allergies</p>
                  )}
                </div>
              )}

              {/* Care Plan Tab */}
              {activeTab === 'care' && (
                <div className="profile-section">
                  <div className="care-item">
                    <h3>Dietary Needs</h3>
                    <p>{selectedPet.dietaryNeeds || "No specific dietary needs recorded"}</p>
                  </div>
                  <div className="care-item">
                    <h3>Exercise Routine</h3>
                    <p>{selectedPet.exerciseRoutine || "No exercise routine recorded"}</p>
                  </div>
                  <div className="care-item">
                    <h3>Special Care Instructions</h3>
                    <p>{selectedPet.specialCare || "No special care instructions"}</p>
                  </div>
                </div>
              )}

              {/* Vaccinations Tab */}
              {activeTab === 'vaccinations' && (
                <div className="profile-section">
                  <h3>Vaccination Records</h3>
                  <table className="vaccination-table">
                    <thead>
                      <tr>
                        <th>Vaccine</th>
                        <th>Last Date</th>
                        <th>Due Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPet.vaccination && Object.entries(selectedPet.vaccination).map(([vaccine, details], index) => {
                        const dueDate = new Date(details.dueDate);
                        const today = new Date();
                        const daysDiff = Math.floor((dueDate - today) / (1000 * 60 * 60 * 24));
                        let status = "Up to date";
                        let statusClass = "status-ok";
                        
                        if (daysDiff < 0) {
                          status = "Overdue";
                          statusClass = "status-overdue";
                        } else if (daysDiff < 30) {
                          status = "Due soon";
                          statusClass = "status-warning";
                        }
                        
                        return (
                          <tr key={index}>
                            <td>{vaccine.toUpperCase()}</td>
                            <td>{new Date(details.date).toLocaleDateString()}</td>
                            <td>{new Date(details.dueDate).toLocaleDateString()}</td>
                            <td className={statusClass}>{status}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="no-pet-selected">
              <p>Select a pet or add a new one to view their health profile</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyPets;