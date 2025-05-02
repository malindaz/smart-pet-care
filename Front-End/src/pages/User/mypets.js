import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../../css/mypets.css";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

// Loading component
const LoadingSpinner = () => (
  <div className="malinda-loading-spinner">
    <div className="spinner"></div>
    <p>Loading...</p>
  </div>
);

// Pet Card component
const PetCard = ({ pet, onDelete }) => (
  <div className="malinda-pet-card">
    <div className="malinda-pet-photo">
      <img src={getPhotoUrl(pet)} alt={`${pet.name}`} />
    </div>
    <h3>{pet.name}</h3>
    <p><strong>Species:</strong> {pet.species}</p>
    <p><strong>Breed:</strong> {pet.breed}</p>
    <p><strong>Age:</strong> {pet.age} years</p>
    <p><strong>Weight:</strong> {pet.weight} kg</p>
    <p><strong>Last Checkup:</strong> {new Date(pet.lastCheckup).toLocaleDateString()}</p>
    <div className="malinda-card-buttons">
      <Link to={`/pet-details/${pet._id}`} className="malinda-view-btn">View Details</Link>
      <button onClick={() => onDelete(pet._id)} className="malinda-delete-btn">Delete</button>
    </div>
  </div>
);

// Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="malinda-error-container">
          <h2>Something went wrong.</h2>
          <p>We're sorry, but there was an error loading this content.</p>
          <button 
            onClick={() => this.setState({ hasError: false })} 
            className="malinda-retry-btn"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const getPhotoUrl = (pet) => {
  if (pet.photo) {
    return `http://localhost:5000/${pet.photo}`;
  }

  if (pet.species?.toLowerCase() === "dog") {
    return "/images/dog-placeholder.jpg";
  } else if (pet.species?.toLowerCase() === "cat") {
    return "/images/cat-placeholder.jpg";
  }
  return "/images/pet-placeholder.jpg";
};

const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("pets"); // "pets" or "medical"
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteType, setDeleteType] = useState(""); // "pet" or "record"
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchPets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/pets/all");
      setPets(response.data);
      if (response.data.length > 0) setSelectedPet(response.data[0]); 
    } catch (error) {
      console.error("Error fetching pets:", error);
      setError("Failed to load pets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMedicalRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5000/api/addrecords");
      if (response.data.success && response.data.data.length > 0) {
        setMedicalRecords(response.data.data); // Set medical records from response data
      } else {
        setMedicalRecords([]); // If no records available, set an empty array
      }
    } catch (error) {
      console.error("Error fetching medical records:", error);
      setError("Failed to load medical records. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
      
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPets();
  }, []);

  // Show success message temporarily
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const initiateDeletePet = (petId) => {
    setPetToDelete(petId);
    setDeleteType("pet");
    setShowConfirmModal(true);
  };

  const initiateDeleteRecord = (recordId) => {
    setRecordToDelete(recordId);
    setDeleteType("record");
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (deleteType === "pet") {
        await axios.delete(`http://localhost:5000/api/pets/${petToDelete}`);
        fetchPets();
        setSelectedPet(null);
        setSuccessMessage("Pet deleted successfully");
      } else if (deleteType === "record") {
        await axios.delete(`http://localhost:5000/api/addrecords/${recordToDelete}`);
        fetchMedicalRecords();
        setSuccessMessage("Medical record deleted successfully");
      }
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
      setError(`Failed to delete ${deleteType}. Please try again later.`);
    } finally {
      setShowConfirmModal(false);
      setPetToDelete(null);
      setRecordToDelete(null);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    
    img.src = '../../assets/images/Logo.png';

    img.onload = () => {
      const imgWidth = 50;
      const imgHeight = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.addImage(img, 'PNG', pageWidth - imgWidth - 10, 10, imgWidth, imgHeight);
  
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Registered Pet List', 105, 30, { align: 'center' });
  
      autoTable(doc, {
        startY: 40, 
        head: [['Name', 'Species', 'Breed', 'Age', 'Weight (kg)', 'Last Checkup']],
        body: pets.map(pet => [
          pet.name,
          pet.species,
          pet.breed,
          pet.age,
          pet.weight,
          new Date(pet.lastCheckup).toLocaleDateString()
        ]),
        theme: 'grid',
        margin: { horizontal: 10 },
        styles: {
          fontSize: 10,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: '#073b9c',
          textColor: '#ffffff',
          fontSize: 12
        }
      });
  
      doc.save(`pets-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };
  
    img.onerror = () => {
      console.error('Error loading logo, generating PDF without it');
      
      autoTable(doc, {
        head: [['Name', 'Species', 'Breed', 'Age', 'Weight (kg)', 'Last Checkup']],
        body: pets.map(pet => [
          pet.name,
          pet.species,
          pet.breed,
          pet.age,
          pet.weight,
          new Date(pet.lastCheckup).toLocaleDateString()
        ]),
        theme: 'grid',
        margin: { top: 20 }
      });
      doc.save(`pets-report-${new Date().toISOString().split('T')[0]}.pdf`);
    };
  };

  const handleDownloadMedicalPDF = () => {
    const doc = new jsPDF();
    
    // Add title to the PDF
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Pet Medical Records', 105, 20, { align: 'center' });
  
    // Define table headers and map them to the appropriate fields
    autoTable(doc, {
      startY: 30,
      head: [['Pet ID', 'Age', 'Weight', 'Vaccination Status', 'Symptoms', 'Last Checkup']],
      body: medicalRecords.map(record => [
        record.petId || 'N/A',  // Pet ID
        record.age || 'N/A',  // Age
        record.weight || 'N/A',  // Weight
        record.vaccinationStatus || 'N/A',  // Vaccination Status
        record.symptoms || 'N/A',  // Symptoms
        new Date(record.lastCheckup).toLocaleDateString() || 'Invalid Date',  // Last Checkup
      ]),
      theme: 'grid',  // Apply grid style
      margin: { horizontal: 10 },
      styles: {
        fontSize: 10,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: '#073b9c',
        textColor: '#ffffff',
        fontSize: 12
      }
    });
  
    // Save the generated PDF
    doc.save(`medical-records-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <ErrorBoundary>
      <NavBar />
      <div className="malinda-pet-health-container">
        <h1 className="malinda-page-title">Pet Health Insights</h1>
        <p className="malinda-page-description">
          View and analyze pet health records to ensure their well-being.
        </p>

        {error && (
          <div className="malinda-error-message">
            {error}
            <button onClick={() => setError(null)} className="malinda-dismiss-btn">
              Dismiss
            </button>
          </div>
        )}

        {successMessage && (
          <div className="malinda-success-message">
            {successMessage}
            <button onClick={() => setSuccessMessage(null)} className="malinda-dismiss-btn">
              Dismiss
            </button>
          </div>
        )}

        <div className="malinda-pet-dashboard">
          <div className="malinda-pet-sidebar">
            <h3>My Pets</h3>
            <ul className="malinda-pet-list">
              <li 
                className={`malinda-pet-item ${viewMode === "pets" && selectedPet === "all" ? 'active' : ''}`}
                onClick={() => {
                  setViewMode("pets");
                  setSelectedPet("all");
                }}
              >
                <span className="malinda-pet-name">All Pets</span>
              </li>
              <li 
                className={`malinda-pet-item ${viewMode === "medical" ? 'active' : ''}`}
                onClick={() => {
                  setViewMode("medical");
                  setSelectedPet(null);
                  fetchMedicalRecords();
                }}
              >
                <span className="malinda-pet-name">All Medical Records</span>
              </li>
              {pets.map(pet => (
                <li 
                  key={pet._id} 
                  className={`malinda-pet-item ${viewMode === "pets" && selectedPet && selectedPet._id === pet._id ? 'active' : ''}`}
                  onClick={() => {
                    setViewMode("pets");
                    setSelectedPet(pet);
                  }}
                >
                  <span className="malinda-pet-name">{pet.name}</span>
                  <span className="malinda-pet-species">{pet.species}</span>
                </li>
              ))}
            </ul>
            <Link to="/addnewpet" className="malinda-add-btn">➕ Add New Pet</Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : viewMode === "medical" ? (
            <div className="malinda-all-pets-profile">
              <div className="malinda-all-pets-header">
                <h2>All Medical Records</h2>
                <button onClick={handleDownloadMedicalPDF} className="malinda-download-btn">
                  📄 Download PDF
                </button>
              </div>
              {medicalRecords.length > 0 ? (
                <table className="malinda-medical-table">
                  <thead>
                    <tr>
                      <th>Pet ID</th>
                      <th>Age</th>
                      <th>Weight</th>
                      <th>Vaccination Status</th>
                      <th>Symptoms</th>
                      <th>Last Checkup</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicalRecords.map((record, index) => (
                      <tr key={index}>
                        <td>{record.petId}</td>
                        <td>{record.age}</td>
                        <td>{record.weight}</td>
                        <td>{record.vaccinationStatus}</td>
                        <td>{record.symptoms}</td>
                        <td>{new Date(record.lastCheckup).toLocaleDateString()}</td>
                        <td>
                          <button className="malinda-cancel-btn"
                            onClick={() => initiateDeleteRecord(record._id)} 
                            
                            title="Delete Record"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="malinda-no-records">No medical records available.</p>
              )}
            </div>
          ) : selectedPet === "all" ? (
            <div className="malinda-all-pets-profile">
              <div className="malinda-all-pets-header">
                <h2>All Pets</h2>
                <button onClick={handleDownloadPDF} className="malinda-download-btn">
                  📄 Download PDF
                </button>
              </div>
              <div className="malinda-all-pets-grid">
                {pets.length > 0 ? (
                  pets.map((pet) => (
                    <PetCard
                      key={pet._id}
                      pet={pet}
                      onDelete={initiateDeletePet}
                    />
                  ))
                ) : (
                  <p className="malinda-no-pets">No pets registered. Add a new pet to get started!</p>
                )}
              </div>
            </div>
          ) : selectedPet && (
            <div className="malinda-pet-profile">
              <div className="malinda-profile-header">
                <div className="malinda-pet-photo-large">
                  <img src={getPhotoUrl(selectedPet)} alt={`${selectedPet.name}`} />
                </div>
                <div className="malinda-profile-info">
                  <h2>{selectedPet.name}'s profile</h2>
                  <p><strong>Species:</strong> {selectedPet.species}</p>
                  <p><strong>Breed:</strong> {selectedPet.breed}</p>
                  <p><strong>Age:</strong> {selectedPet.age} years</p>
                  <p><strong>Weight:</strong> {selectedPet.weight} kg</p>
                </div>
              </div>
              
              <div className="malinda-buttons">
                <Link to={`/editpetdetails/${selectedPet._id}`} className="malinda-edit-btn">✏️ Edit Profile</Link>
                <Link to={`/addrecord/${selectedPet._id}`} className="malinda-add-record-btn">➕ Add Medical Record</Link>
                <button onClick={() => initiateDeletePet(selectedPet._id)} className="malinda-delete-btn">🗑️ Delete Profile</button>
              </div>

              <h3>Medical History</h3>
              <div className="malinda-section-content">
                {selectedPet.medicalHistory && selectedPet.medicalHistory.length > 0 ? (
                  <ul className="malinda-medical-list">
                    {selectedPet.medicalHistory.map((record, index) => (
                      <li key={index} className="malinda-medical-item">
                        <div className="malinda-medical-date">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                        <div className="malinda-medical-details">
                          <strong>{record.procedure}</strong>
                          <p>{record.notes}</p>
                        </div>
                        <button 
                          onClick={() => initiateDeleteRecord(record._id)} 
                          className="malinda-record-delete-btn"
                          title="Delete Record"
                        >
                          🗑️
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="malinda-no-records">No medical records available.</p>
                )}
              </div>

              <h3>Vaccination Records</h3>
              <div className="malinda-section-content">
                {selectedPet.vaccination && Object.keys(selectedPet.vaccination).length > 0 ? (
                  <ul className="malinda-vaccination-list">
                    {Object.entries(selectedPet.vaccination).map(([vaccine, details]) => (
                      <li key={vaccine} className="malinda-vaccination-item">
                        <div className="malinda-vaccination-name">
                          {vaccine.toUpperCase()}
                        </div>
                        <div className="malinda-vaccination-details">
                          <p>Date: {new Date(details.date).toLocaleDateString()}</p>
                          <p>Next Due: {new Date(details.dueDate).toLocaleDateString()}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="malinda-no-records">No vaccination records available.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {showConfirmModal && (
          <div className="malinda-modal-overlay">
            <div className="malinda-modal">
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this {deleteType}? This action cannot be undone.</p>
              <div className="malinda-modal-buttons">
                <button 
                  onClick={() => setShowConfirmModal(false)} 
                  className="malinda-cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete} 
                  className="malinda-confirm-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </ErrorBoundary>
  );
};

export default MyPets;