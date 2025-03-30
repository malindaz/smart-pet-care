import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../css/Pharmacy/PharmacyRegistration.css';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';

const PharmacyRegistration = () => {
  const [pharmacyData, setPharmacyData] = useState({
    pharmacyName: '',
    businessRegistrationNumber: '',
    ownerFirstName: '',
    ownerLastName: '',
    email: '',
    phone: '',
    pharmacyLicenseNumber: '',
    licenseIssuingAuthority: '',
    licenseExpiryDate: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    description: '',
    specializedServices: [],
    deliveryAvailable: false,
    onlineOrderingAvailable: false,
    emergencyServices: false
  });

  const [operatingHours, setOperatingHours] = useState({
    monday: { open: '', close: '' },
    tuesday: { open: '', close: '' },
    wednesday: { open: '', close: '' },
    thursday: { open: '', close: '' },
    friday: { open: '', close: '' },
    saturday: { open: '', close: '' },
    sunday: { open: '', close: '' }
  });

  const [pharmacistDetails, setPharmacistDetails] = useState([
    { 
      firstName: '', 
      lastName: '', 
      licenseNumber: '', 
      licenseExpiryDate: '' 
    }
  ]);

  const [files, setFiles] = useState({
    businessRegistrationDocument: null,
    pharmacyLicenseDocument: null,
    profileImage: null
  });

  const [serviceInput, setServiceInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPharmacyData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setOperatingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const handlePharmacistChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPharmacists = [...pharmacistDetails];
    updatedPharmacists[index][name] = value;
    setPharmacistDetails(updatedPharmacists);
  };

  const addPharmacist = () => {
    setPharmacistDetails([
      ...pharmacistDetails, 
      { 
        firstName: '', 
        lastName: '', 
        licenseNumber: '', 
        licenseExpiryDate: '' 
      }
    ]);
  };

  const removePharmacist = (index) => {
    const updatedPharmacists = pharmacistDetails.filter((_, i) => i !== index);
    setPharmacistDetails(updatedPharmacists);
  };

  const addService = () => {
    if (serviceInput.trim() && !pharmacyData.specializedServices.includes(serviceInput.trim())) {
      setPharmacyData(prev => ({
        ...prev,
        specializedServices: [...prev.specializedServices, serviceInput.trim()]
      }));
      setServiceInput('');
    }
  };

  const removeService = (service) => {
    setPharmacyData(prev => ({
      ...prev,
      specializedServices: prev.specializedServices.filter(s => s !== service)
    }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prev => ({
      ...prev,
      [name]: selectedFiles[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // Add pharmacy data
    Object.keys(pharmacyData).forEach(key => {
      if (key === 'specializedServices') {
        formData.append(key, JSON.stringify(pharmacyData[key]));
      } else {
        formData.append(key, pharmacyData[key]);
      }
    });

    // Add operating hours
    formData.append('operatingHours', JSON.stringify(operatingHours));

    // Add pharmacist details
    formData.append('pharmacistDetails', JSON.stringify(pharmacistDetails));

    // Add files
    Object.keys(files).forEach(key => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    try {
      const response = await axios.post('http://localhost:5000/api/Pharmacys/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success(response.data.message);
      // Reset form or redirect
    } catch (error) {
      console.error('Pharmacy registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit pharmacy registration');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pharmacy-registration-loading">
        <div className="pharmacy-registration-spinner"></div>
        <p>Processing pharmacy registration...</p>
      </div>
    );
  }

  return (
    <>
      <NavBar />
      <div className="pharmacy-registration-container">
        <h1 className="pharmacy-registration-title">Pharmacy Registration</h1>
        
        <form onSubmit={handleSubmit} className="pharmacy-registration-form">
          {/* Business Information Section */}
          <div className="pharmacy-registration-section">
            <h2>Business Information</h2>
            <div className="pharmacy-registration-grid">
              <input 
                type="text" 
                name="pharmacyName" 
                placeholder="Pharmacy Name" 
                value={pharmacyData.pharmacyName}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="businessRegistrationNumber" 
                placeholder="Business Registration Number" 
                value={pharmacyData.businessRegistrationNumber}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Owner Information Section */}
          <div className="pharmacy-registration-section">
            <h2>Owner Information</h2>
            <div className="pharmacy-registration-grid">
              <input 
                type="text" 
                name="ownerFirstName" 
                placeholder="First Name" 
                value={pharmacyData.ownerFirstName}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="ownerLastName" 
                placeholder="Last Name" 
                value={pharmacyData.ownerLastName}
                onChange={handleChange}
                required 
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email" 
                value={pharmacyData.email}
                onChange={handleChange}
                required 
              />
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number" 
                value={pharmacyData.phone}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* License Information Section */}
          <div className="pharmacy-registration-section">
            <h2>License Information</h2>
            <div className="pharmacy-registration-grid">
              <input 
                type="text" 
                name="pharmacyLicenseNumber" 
                placeholder="Pharmacy License Number" 
                value={pharmacyData.pharmacyLicenseNumber}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="licenseIssuingAuthority" 
                placeholder="Issuing Authority" 
                value={pharmacyData.licenseIssuingAuthority}
                onChange={handleChange}
                required 
              />
              <input 
                type="date" 
                name="licenseExpiryDate" 
                placeholder="License Expiry Date" 
                value={pharmacyData.licenseExpiryDate}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Location Details Section */}
          <div className="pharmacy-registration-section">
            <h2>Location Details</h2>
            <div className="pharmacy-registration-grid">
              <input 
                type="text" 
                name="addressLine1" 
                placeholder="Address Line 1" 
                value={pharmacyData.addressLine1}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="addressLine2" 
                placeholder="Address Line 2 (Optional)" 
                value={pharmacyData.addressLine2}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="city" 
                placeholder="City" 
                value={pharmacyData.city}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="state" 
                placeholder="State" 
                value={pharmacyData.state}
                onChange={handleChange}
                required 
              />
              <input 
                type="text" 
                name="zipCode" 
                placeholder="Zip Code" 
                value={pharmacyData.zipCode}
                onChange={handleChange}
                required 
              />
            </div>
          </div>

          {/* Operational Hours Section */}
          <div className="pharmacy-registration-section">
            <h2>Operating Hours</h2>
            {Object.keys(operatingHours).map(day => (
              <div key={day} className="pharmacy-registration-hours-row">
                <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                <input 
                  type="time" 
                  placeholder="Open" 
                  value={operatingHours[day].open}
                  onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                />
                <input 
                  type="time" 
                  placeholder="Close" 
                  value={operatingHours[day].close}
                  onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Additional Details Section */}
          <div className="pharmacy-registration-section">
            <h2>Additional Details</h2>
            <div className="pharmacy-registration-services">
              <div className="pharmacy-registration-service-input">
                <input 
                  type="text" 
                  placeholder="Add Specialized Service" 
                  value={serviceInput}
                  onChange={(e) => setServiceInput(e.target.value)}
                />
                <button type="button" onClick={addService}>Add Service</button>
              </div>
              <div className="pharmacy-registration-service-list">
                {pharmacyData.specializedServices.map(service => (
                  <span key={service} className="pharmacy-registration-service-tag">
                    {service}
                    <button type="button" onClick={() => removeService(service)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pharmacy-registration-checkboxes">
              <label>
                <input 
                  type="checkbox" 
                  name="deliveryAvailable"
                  checked={pharmacyData.deliveryAvailable}
                  onChange={handleChange}
                />
                Delivery Available
              </label>
              <label>
                <input 
                  type="checkbox" 
                  name="onlineOrderingAvailable"
                  checked={pharmacyData.onlineOrderingAvailable}
                  onChange={handleChange}
                />
                Online Ordering Available
              </label>
              <label>
                <input 
                  type="checkbox" 
                  name="emergencyServices"
                  checked={pharmacyData.emergencyServices}
                  onChange={handleChange}
                />
                Emergency Services
              </label>
            </div>
          </div>

          {/* Pharmacists Section */}
          <div className="pharmacy-registration-section">
            <h2>Pharmacist Details</h2>
            {pharmacistDetails.map((pharmacist, index) => (
              <div key={index} className="pharmacy-registration-pharmacist-card">
                <div className="pharmacy-registration-grid">
                  <input 
                    type="text" 
                    name="firstName"
                    placeholder="First Name"
                    value={pharmacist.firstName}
                    onChange={(e) => handlePharmacistChange(index, e)}
                    required
                  />
                  <input 
                    type="text" 
                    name="lastName"
                    placeholder="Last Name"
                    value={pharmacist.lastName}
                    onChange={(e) => handlePharmacistChange(index, e)}
                    required
                  />
                  <input 
                    type="text" 
                    name="licenseNumber"
                    placeholder="License Number"
                    value={pharmacist.licenseNumber}
                    onChange={(e) => handlePharmacistChange(index, e)}
                    required
                  />
                  <input 
                    type="date" 
                    name="licenseExpiryDate"
                    placeholder="License Expiry Date"
                    value={pharmacist.licenseExpiryDate}
                    onChange={(e) => handlePharmacistChange(index, e)}
                    required
                  />
                </div>
                {pharmacistDetails.length > 1 && (
                  <button 
                    type="button" 
                    className="pharmacy-registration-remove-pharmacist"
                    onClick={() => removePharmacist(index)}
                  >
                    Remove Pharmacist
                  </button>
                )}
              </div>
            ))}
            <button 
              type="button" 
              className="pharmacy-registration-add-pharmacist"
              onClick={addPharmacist}
            >
              Add Another Pharmacist
            </button>
          </div>

          {/* Document Upload Section */}
          <div className="pharmacy-registration-section">
            <h2>Document Uploads</h2>
            <div className="pharmacy-registration-upload-grid">
              <div className="pharmacy-registration-upload-field">
                <label>Business Registration Document</label>
                <input 
                  type="file" 
                  name="businessRegistrationDocument"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,image/*"
                  required
                />
                {files.businessRegistrationDocument && (
                  <span>{files.businessRegistrationDocument.name}</span>
                )}
              </div>
              <div className="pharmacy-registration-upload-field">
                <label>Pharmacy License Document</label>
                <input 
                  type="file" 
                  name="pharmacyLicenseDocument"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,image/*"
                  required
                />
                {files.pharmacyLicenseDocument && (
                  <span>{files.pharmacyLicenseDocument.name}</span>
                )}
              </div>
              <div className="pharmacy-registration-upload-field">
                <label>Profile Image (Optional)</label>
                <input 
                  type="file" 
                  name="profileImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {files.profileImage && (
                  <span>{files.profileImage.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="pharmacy-registration-section">
            <h2>Pharmacy Description</h2>
            <textarea 
              name="description"
              placeholder="Tell us about your pharmacy (max 500 characters)"
              value={pharmacyData.description}
              onChange={handleChange}
              maxLength={500}
            />
          </div>

          <div className="pharmacy-registration-submit">
            <button type="submit">Submit Pharmacy Registration</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default PharmacyRegistration;