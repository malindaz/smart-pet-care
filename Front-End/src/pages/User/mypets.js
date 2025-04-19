import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../../css/mypets.css";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";



const MyPets = () => {
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [loading, setLoading] = useState(true);



    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pets/all"); 
        const data = await response.json();
        setPets(data);
        if (data.length > 0) setSelectedPet(data[0]); 
      } catch (error) {
        console.error("Error fetching pets:", error);
      } finally {
        setLoading(false);
      }
    };

      
  useEffect(() => {
    window.scrollTo(0, 0);
    
    fetchPets();
  }, []);


  const handleDeletePet = async (petId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this pet?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/pets/${petId}`);
      alert("Pet deleted successfully!");
      fetchPets(); 
      setSelectedPet(null); 
    } catch (error) {
      console.error("Error deleting pet:", error);
      alert("Failed to delete pet.");
    }
  };

  const getPhotoUrl = (pet) => {
    if (pet.photo) {
      return `http://localhost:5000/${pet.photo}`;
    }
  
    
    if (pet.species.toLowerCase() === "dog") {
      return "/images/dog-placeholder.jpg";
    } else if (pet.species.toLowerCase() === "cat") {
      return "/images/cat-placeholder.jpg";
    }
    return "/images/pet-placeholder.jpg";
  };
  

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const img = new Image();
    
    
    img.src = '../../assets/images/Logo.png';

    
    img.onload = () => {
      // Add logo to top-right corner
      const imgWidth = 50;
      const imgHeight = 20;
      const pageWidth = doc.internal.pageSize.getWidth();
      doc.addImage(img, 'PNG', pageWidth - imgWidth - 10, 10, imgWidth, imgHeight);
  
      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Registered Pet List', 105, 30, { align: 'center' });
  
      // Add table
      autoTable(doc, {
        startY: 40, // Adjust based on title and logo height
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
  
    // Handle image loading error
    img.onerror = () => {
      console.error('Error loading logo, generating PDF without it');
      // Generate PDF without logo if image fails to load
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

  
 


  return (
    <>
      <NavBar />
      <div className="malinda-pet-health-container">
        <h1 className="malinda-page-title">Pet Health Insights</h1>
        <p className="malinda-page-description">
          View and analyze pet health records to ensure their well-being.
        </p>

        <div className="malinda-pet-dashboard">
          
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

          
          {selectedPet === "all" ? (
            <div className="malinda-all-pets-profile">
              <div className="malinda-all-pets-header">
              <h2>All Pets</h2>
              <button onClick={handleDownloadPDF} className="malinda-download-btn">
                  📄 Download PDF
                </button>
                </div>
              {loading ? <p>Loading pets...</p> : (
                <div className="malinda-all-pets-grid">
                  {pets.map((pet) => (
                    <div key={pet.id} className="malinda-pet-card">
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
                        <Link to={`/pet-details/${pet.id}`} className="malinda-view-btn">View Details</Link>
                        <button onClick={() => handleDeletePet(pet._id)} className="malinda-delete-btn">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            selectedPet && (
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
                <Link to={`/addrecord/${selectedPet.id}`} className="malinda-add-record-btn">➕ Add Medical Record</Link>
                 { /*<Link to={`/uploadphoto/${selectedPet.id}`} className="malinda-upload-photo-btn">📷 Upload Photo</Link>*/}
                  <button onClick={() => handleDeletePet(selectedPet._id)} className="malinda-delete-btn">🗑️ Delete Profile</button>
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