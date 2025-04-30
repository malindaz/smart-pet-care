import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    emergencyServices: false,
    agreeToTerms: false
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
  const [errors, setErrors] = useState({});
  const [formStep, setFormStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

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
    if (pharmacistDetails.length > 1) {
      const updatedPharmacists = pharmacistDetails.filter((_, i) => i !== index);
      setPharmacistDetails(updatedPharmacists);
    } else {
      toast.warning('At least one pharmacist is required');
    }
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

  // Form validation
  const validateForm = (step) => {
    let tempErrors = {};
    let isValid = true;

    // Validate based on current step
    if (step === 1) {
      if (!pharmacyData.pharmacyName.trim()) {
        tempErrors.pharmacyName = 'Pharmacy name is required';
        isValid = false;
      }
      
      if (!pharmacyData.businessRegistrationNumber.trim()) {
        tempErrors.businessRegistrationNumber = 'Business registration number is required';
        isValid = false;
      }
      
      if (!pharmacyData.ownerFirstName.trim()) {
        tempErrors.ownerFirstName = 'First name is required';
        isValid = false;
      }
      
      if (!pharmacyData.ownerLastName.trim()) {
        tempErrors.ownerLastName = 'Last name is required';
        isValid = false;
      }
      
      if (!pharmacyData.email.trim()) {
        tempErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(pharmacyData.email)) {
        tempErrors.email = 'Email is invalid';
        isValid = false;
      }
      
      if (!pharmacyData.phone.trim()) {
        tempErrors.phone = 'Phone number is required';
        isValid = false;
      } else if (!/^\d{10}$/.test(pharmacyData.phone.replace(/[^0-9]/g, ''))) {
        tempErrors.phone = 'Phone number should be 10 digits';
        isValid = false;
      }
    } else if (step === 2) {
      if (!pharmacyData.pharmacyLicenseNumber.trim()) {
        tempErrors.pharmacyLicenseNumber = 'Pharmacy license number is required';
        isValid = false;
      }
      
      if (!pharmacyData.licenseIssuingAuthority.trim()) {
        tempErrors.licenseIssuingAuthority = 'Licensing authority is required';
        isValid = false;
      }
      
      if (!pharmacyData.licenseExpiryDate) {
        tempErrors.licenseExpiryDate = 'License expiry date is required';
        isValid = false;
      } else {
        const today = new Date();
        const expiryDate = new Date(pharmacyData.licenseExpiryDate);
        if (expiryDate <= today) {
          tempErrors.licenseExpiryDate = 'License must not be expired';
          isValid = false;
        }
      }
      
      // Validate pharmacist details
      pharmacistDetails.forEach((pharmacist, index) => {
        if (!pharmacist.firstName.trim()) {
          tempErrors[`pharmacist.${index}.firstName`] = 'First name is required';
          isValid = false;
        }
        if (!pharmacist.lastName.trim()) {
          tempErrors[`pharmacist.${index}.lastName`] = 'Last name is required';
          isValid = false;
        }
        if (!pharmacist.licenseNumber.trim()) {
          tempErrors[`pharmacist.${index}.licenseNumber`] = 'License number is required';
          isValid = false;
        }
        if (!pharmacist.licenseExpiryDate) {
          tempErrors[`pharmacist.${index}.licenseExpiryDate`] = 'Expiry date is required';
          isValid = false;
        }
      });
      
      if (!files.pharmacyLicenseDocument) {
        tempErrors.pharmacyLicenseDocument = 'Pharmacy license document is required';
        isValid = false;
      }
      
      if (!files.businessRegistrationDocument) {
        tempErrors.businessRegistrationDocument = 'Business registration document is required';
        isValid = false;
      }
    } else if (step === 3) {
      if (!pharmacyData.addressLine1.trim()) {
        tempErrors.addressLine1 = 'Address is required';
        isValid = false;
      }
      
      if (!pharmacyData.city.trim()) {
        tempErrors.city = 'City is required';
        isValid = false;
      }
      
      if (!pharmacyData.state.trim()) {
        tempErrors.state = 'State is required';
        isValid = false;
      }
      
      if (!pharmacyData.zipCode.trim()) {
        tempErrors.zipCode = 'ZIP code is required';
        isValid = false;
      } else if (!/^\d{5}(-\d{4})?$/.test(pharmacyData.zipCode)) {
        tempErrors.zipCode = 'Invalid ZIP code format';
        isValid = false;
      }
      
      // Validate operating hours
      let hasOperatingHours = false;
      for (const day in operatingHours) {
        if (operatingHours[day].open && operatingHours[day].close) {
          hasOperatingHours = true;
          if (operatingHours[day].open >= operatingHours[day].close) {
            tempErrors[`operatingHours.${day}`] = 'End time must be after start time';
            isValid = false;
          }
        }
      }
      
      if (!hasOperatingHours) {
        tempErrors.operatingHours = 'At least one day\'s operating hours must be set';
        isValid = false;
      }
    } else if (step === 4) {
      if (!pharmacyData.description.trim()) {
        tempErrors.description = 'Pharmacy description is required';
        isValid = false;
      } else if (pharmacyData.description.trim().length < 50) {
        tempErrors.description = 'Description should be at least 50 characters';
        isValid = false;
      }
      
      if (!files.profileImage) {
        tempErrors.profileImage = 'Profile image is required';
        isValid = false;
      }
      
      if (!pharmacyData.agreeToTerms) {
        tempErrors.agreeToTerms = 'You must agree to the terms and conditions';
        isValid = false;
      }
    }

    setErrors(tempErrors);
    return isValid;
  };

  // Handle step navigation
  const goToNextStep = () => {
    if (validateForm(formStep)) {
      setFormStep(prevStep => prevStep + 1);
      window.scrollTo(0, 0);
    } else {
      toast.error('Please fix the errors before proceeding');
    }
  };

  const goToPrevStep = () => {
    setFormStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(formStep)) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
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
      
      const response = await axios.post('http://localhost:5000/api/Pharmacys/apply', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Registration submitted successfully! We will review your application and contact you soon.');
      
      // Reset form after successful submission
      setTimeout(() => {
        setPharmacyData({
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
          emergencyServices: false,
          agreeToTerms: false
        });
        setOperatingHours({
          monday: { open: '', close: '' },
          tuesday: { open: '', close: '' },
          wednesday: { open: '', close: '' },
          thursday: { open: '', close: '' },
          friday: { open: '', close: '' },
          saturday: { open: '', close: '' },
          sunday: { open: '', close: '' }
        });
        setPharmacistDetails([{ 
          firstName: '', 
          lastName: '', 
          licenseNumber: '', 
          licenseExpiryDate: '' 
        }]);
        setFiles({
          businessRegistrationDocument: null,
          pharmacyLicenseDocument: null,
          profileImage: null
        });
        setFormStep(1);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting registration:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Registration failed: ${error.response.data.message}`);
      } else {
        toast.error('Registration failed. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    return (
      <div className="pharmacy-progress-container">
        <div className="pharmacy-progress-bar">
          <div 
            className="pharmacy-progress-fill" 
            style={{ width: `${(formStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="pharmacy-step-indicators">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`pharmacy-step-indicator ${i + 1 <= formStep ? 'active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="pharmacy-step-labels">
          <span className={formStep === 1 ? 'pharmacy-current-step' : ''}>Personal Info</span>
          <span className={formStep === 2 ? 'pharmacy-current-step' : ''}>Credentials</span>
          <span className={formStep === 3 ? 'pharmacy-current-step' : ''}>Practice Details</span>
          <span className={formStep === 4 ? 'pharmacy-current-step' : ''}>Final Details</span>
        </div>
      </div>
    );
  };

  // Render form based on current step
  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="pharmacy-form-step">
            <h3>Personal Information</h3>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="pharmacyName">Pharmacy Name*</label>
                <input
                  type="text"
                  id="pharmacyName"
                  name="pharmacyName"
                  value={pharmacyData.pharmacyName}
                  onChange={handleChange}
                  className={errors.pharmacyName ? 'pharmacy-input-error' : ''}
                />
                {errors.pharmacyName && <span className="pharmacy-error">{errors.pharmacyName}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="businessRegistrationNumber">Business Registration Number*</label>
                <input
                  type="text"
                  id="businessRegistrationNumber"
                  name="businessRegistrationNumber"
                  value={pharmacyData.businessRegistrationNumber}
                  onChange={handleChange}
                  className={errors.businessRegistrationNumber ? 'pharmacy-input-error' : ''}
                />
                {errors.businessRegistrationNumber && <span className="pharmacy-error">{errors.businessRegistrationNumber}</span>}
              </div>
            </div>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="ownerFirstName">Owner First Name*</label>
                <input
                  type="text"
                  id="ownerFirstName"
                  name="ownerFirstName"
                  value={pharmacyData.ownerFirstName}
                  onChange={handleChange}
                  className={errors.ownerFirstName ? 'pharmacy-input-error' : ''}
                />
                {errors.ownerFirstName && <span className="pharmacy-error">{errors.ownerFirstName}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="ownerLastName">Owner Last Name*</label>
                <input
                  type="text"
                  id="ownerLastName"
                  name="ownerLastName"
                  value={pharmacyData.ownerLastName}
                  onChange={handleChange}
                  className={errors.ownerLastName ? 'pharmacy-input-error' : ''}
                />
                {errors.ownerLastName && <span className="pharmacy-error">{errors.ownerLastName}</span>}
              </div>
            </div>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={pharmacyData.email}
                  onChange={handleChange}
                  className={errors.email ? 'pharmacy-input-error' : ''}
                />
                {errors.email && <span className="pharmacy-error">{errors.email}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="phone">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={pharmacyData.phone}
                  onChange={handleChange}
                  placeholder="(XXX) XXX-XXXX"
                  className={errors.phone ? 'pharmacy-input-error' : ''}
                />
                {errors.phone && <span className="pharmacy-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="pharmacy-form-actions">
              <button 
                type="button" 
                className="pharmacy-btn pharmacy-btn-next" 
                onClick={goToNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="pharmacy-form-step">
            <h3>Professional Credentials</h3>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="pharmacyLicenseNumber">Pharmacy License Number*</label>
                <input
                  type="text"
                  id="pharmacyLicenseNumber"
                  name="pharmacyLicenseNumber"
                  value={pharmacyData.pharmacyLicenseNumber}
                  onChange={handleChange}
                  className={errors.pharmacyLicenseNumber ? 'pharmacy-input-error' : ''}
                />
                {errors.pharmacyLicenseNumber && <span className="pharmacy-error">{errors.pharmacyLicenseNumber}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="licenseIssuingAuthority">Licensing Authority*</label>
                <input
                  type="text"
                  id="licenseIssuingAuthority"
                  name="licenseIssuingAuthority"
                  value={pharmacyData.licenseIssuingAuthority}
                  onChange={handleChange}
                  className={errors.licenseIssuingAuthority ? 'pharmacy-input-error' : ''}
                />
                {errors.licenseIssuingAuthority && <span className="pharmacy-error">{errors.licenseIssuingAuthority}</span>}
              </div>
            </div>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="licenseExpiryDate">License Expiry Date*</label>
                <input
                  type="date"
                  id="licenseExpiryDate"
                  name="licenseExpiryDate"
                  value={pharmacyData.licenseExpiryDate}
                  onChange={handleChange}
                  className={errors.licenseExpiryDate ? 'pharmacy-input-error' : ''}
                />
                {errors.licenseExpiryDate && <span className="pharmacy-error">{errors.licenseExpiryDate}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="pharmacyLicenseDocument">Upload License Document (PDF/JPG)*</label>
                <input
                  type="file"
                  id="pharmacyLicenseDocument"
                  name="pharmacyLicenseDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className={errors.pharmacyLicenseDocument ? 'pharmacy-input-error' : ''}
                />
                {errors.pharmacyLicenseDocument && <span className="pharmacy-error">{errors.pharmacyLicenseDocument}</span>}
              </div>
            </div>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="businessRegistrationDocument">Business Registration Document*</label>
                <input
                  type="file"
                  id="businessRegistrationDocument"
                  name="businessRegistrationDocument"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className={errors.businessRegistrationDocument ? 'pharmacy-input-error' : ''}
                />
                {errors.businessRegistrationDocument && <span className="pharmacy-error">{errors.businessRegistrationDocument}</span>}
              </div>
            </div>
            
            <h4>Pharmacist Details</h4>
            {pharmacistDetails.map((pharmacist, index) => (
              <div key={index} className="pharmacy-pharmacist-entry">
                <div className="pharmacy-form-row">
                  <div className="pharmacy-form-group">
                    <label htmlFor={`pharmacist.${index}.firstName`}>First Name*</label>
                    <input
                      type="text"
                      id={`pharmacist.${index}.firstName`}
                      name="firstName"
                      value={pharmacist.firstName}
                      onChange={(e) => handlePharmacistChange(index, e)}
                      className={errors[`pharmacist.${index}.firstName`] ? 'pharmacy-input-error' : ''}
                    />
                    {errors[`pharmacist.${index}.firstName`] && 
                      <span className="pharmacy-error">{errors[`pharmacist.${index}.firstName`]}</span>}
                  </div>
                  <div className="pharmacy-form-group">
                    <label htmlFor={`pharmacist.${index}.lastName`}>Last Name*</label>
                    <input
                      type="text"
                      id={`pharmacist.${index}.lastName`}
                      name="lastName"
                      value={pharmacist.lastName}
                      onChange={(e) => handlePharmacistChange(index, e)}
                      className={errors[`pharmacist.${index}.lastName`] ? 'pharmacy-input-error' : ''}
                    />
                    {errors[`pharmacist.${index}.lastName`] && 
                      <span className="pharmacy-error">{errors[`pharmacist.${index}.lastName`]}</span>}
                  </div>
                </div>
                <div className="pharmacy-form-row">
                  <div className="pharmacy-form-group">
                    <label htmlFor={`pharmacist.${index}.licenseNumber`}>License Number*</label>
                    <input
                      type="text"
                      id={`pharmacist.${index}.licenseNumber`}
                      name="licenseNumber"
                      value={pharmacist.licenseNumber}
                      onChange={(e) => handlePharmacistChange(index, e)}
                      className={errors[`pharmacist.${index}.licenseNumber`] ? 'pharmacy-input-error' : ''}
                    />
                    {errors[`pharmacist.${index}.licenseNumber`] && 
                      <span className="pharmacy-error">{errors[`pharmacist.${index}.licenseNumber`]}</span>}
                  </div>
                  <div className="pharmacy-form-group">
                    <label htmlFor={`pharmacist.${index}.licenseExpiryDate`}>License Expiry Date*</label>
                    <input
                      type="date"
                      id={`pharmacist.${index}.licenseExpiryDate`}
                      name="licenseExpiryDate"
                      value={pharmacist.licenseExpiryDate}
                      onChange={(e) => handlePharmacistChange(index, e)}
                      className={errors[`pharmacist.${index}.licenseExpiryDate`] ? 'pharmacy-input-error' : ''}
                    />
                    {errors[`pharmacist.${index}.licenseExpiryDate`] && 
                      <span className="pharmacy-error">{errors[`pharmacist.${index}.licenseExpiryDate`]}</span>}
                  </div>
                  {pharmacistDetails.length > 1 && (
                    <button 
                      type="button" 
                      className="pharmacy-btn pharmacy-btn-remove" 
                      onClick={() => removePharmacist(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="pharmacy-btn pharmacy-btn-add" onClick={addPharmacist}>
              Add Pharmacist
            </button>
            
            <div className="pharmacy-form-actions">
              <button 
                type="button" 
                className="pharmacy-btn pharmacy-btn-prev" 
                onClick={goToPrevStep}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="pharmacy-btn pharmacy-btn-next" 
                onClick={goToNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="pharmacy-form-step">
            <h3>Practice Details</h3>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group pharmacy-full-width">
                <label htmlFor="addressLine1">Street Address*</label>
                <input
                  type="text"
                  id="addressLine1"
                  name="addressLine1"
                  value={pharmacyData.addressLine1}
                  onChange={handleChange}
                  className={errors.addressLine1 ? 'pharmacy-input-error' : ''}
                />
                {errors.addressLine1 && <span className="pharmacy-error">{errors.addressLine1}</span>}
              </div>
            </div>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group pharmacy-full-width">
                <label htmlFor="addressLine2">Street Address Line 2 (Optional)</label>
                <input
                  type="text"
                  id="addressLine2"
                  name="addressLine2"
                  value={pharmacyData.addressLine2}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={pharmacyData.city}
                  onChange={handleChange}
                  className={errors.city ? 'pharmacy-input-error' : ''}
                />
                {errors.city && <span className="pharmacy-error">{errors.city}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="state">State*</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={pharmacyData.state}
                  onChange={handleChange}
                  className={errors.state ? 'pharmacy-input-error' : ''}
                />
                {errors.state && <span className="pharmacy-error">{errors.state}</span>}
              </div>
              <div className="pharmacy-form-group">
                <label htmlFor="zipCode">ZIP Code*</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={pharmacyData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? 'pharmacy-input-error' : ''}
                />
                {errors.zipCode && <span className="pharmacy-error">{errors.zipCode}</span>}
              </div>
            </div>
            
            <h4>Operating Hours</h4>
            {errors.operatingHours && <span className="pharmacy-error pharmacy-full-width">{errors.operatingHours}</span>}
            {Object.keys(operatingHours).map(day => (
              <div key={day} className="pharmacy-form-row pharmacy-hours-row">
                <div className="pharmacy-form-group">
                  <label>{day.charAt(0).toUpperCase() + day.slice(1)}</label>
                </div>
                <div className="pharmacy-form-group">
                  <input 
                    type="time" 
                    placeholder="Open" 
                    value={operatingHours[day].open}
                    onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                    className={errors[`operatingHours.${day}`] ? 'pharmacy-input-error' : ''}
                  />
                </div>
                <div className="pharmacy-form-group">
                  <input 
                    type="time" 
                    placeholder="Close" 
                    value={operatingHours[day].close}
                    onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                    className={errors[`operatingHours.${day}`] ? 'pharmacy-input-error' : ''}
                  />
                </div>
                {errors[`operatingHours.${day}`] && 
                  <span className="pharmacy-error">{errors[`operatingHours.${day}`]}</span>}
              </div>
            ))}
            
            <h4>Services</h4>
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <div className="pharmacy-service-input">
                  <input 
                    type="text" 
                    placeholder="Add Specialized Service" 
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                  />
                  <button type="button" className="pharmacy-btn pharmacy-btn-add" onClick={addService}>
                    Add Service
                  </button>
                </div>
                <div className="pharmacy-service-list">
                  {pharmacyData.specializedServices.map(service => (
                    <span key={service} className="pharmacy-service-tag">
                      {service}
                      <button type="button" onClick={() => removeService(service)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="pharmacy-form-row">
              <div className="pharmacy-form-group">
                <div className="pharmacy-checkbox">
                  <input
                    type="checkbox"
                    id="deliveryAvailable"
                    name="deliveryAvailable"
                    checked={pharmacyData.deliveryAvailable}
                    onChange={handleChange}
                  />
                  <label htmlFor="deliveryAvailable">Delivery Available</label>
                </div>
              </div>
              <div className="pharmacy-form-group">
                <div className="pharmacy-checkbox">
                  <input
                    type="checkbox"
                    id="onlineOrderingAvailable"
                    name="onlineOrderingAvailable"
                    checked={pharmacyData.onlineOrderingAvailable}
                    onChange={handleChange}
                  />
                  <label htmlFor="onlineOrderingAvailable">Online Ordering Available</label>
                </div>
              </div>
              <div className="pharmacy-form-group">
                <div className="pharmacy-checkbox">
                  <input
                    type="checkbox"
                    id="emergencyServices"
                    name="emergencyServices"
                    checked={pharmacyData.emergencyServices}
                    onChange={handleChange}
                  />
                  <label htmlFor="emergencyServices">Emergency Services</label>
                </div>
              </div>
            </div>
            
            <div className="pharmacy-form-actions">
              <button 
                type="button" 
                className="pharmacy-btn pharmacy-btn-prev" 
                onClick={goToPrevStep}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="pharmacy-btn pharmacy-btn-next" 
                onClick={goToNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="pharmacy-form-step">
            <h3>Final Details</h3>
            <div className="pharmacy-form-group">
              <label htmlFor="description">Pharmacy Description (min 50 characters)*</label>
              <textarea
                id="description"
                name="description"
                rows="5"
                value={pharmacyData.description}
                onChange={handleChange}
                placeholder="Tell us about your pharmacy, services offered, specialties, and what makes your pharmacy unique..."
                className={errors.description ? 'pharmacy-input-error' : ''}
              ></textarea>
              <div className="pharmacy-character-count">
                {pharmacyData.description.length} / 50 characters minimum
              </div>
              {errors.description && <span className="pharmacy-error">{errors.description}</span>}
            </div>
            
            <div className="pharmacy-form-group">
              <label htmlFor="profileImage">Pharmacy Profile Image*</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className={errors.profileImage ? 'pharmacy-input-error' : ''}
              />
              <div className="pharmacy-hint">Please upload a professional image of your pharmacy (JPG, PNG)</div>
              {errors.profileImage && <span className="pharmacy-error">{errors.profileImage}</span>}
              {files.profileImage && (
                <div className="pharmacy-image-preview">
                  <img 
                    src={URL.createObjectURL(files.profileImage)} 
                    alt="Profile Preview" 
                  />
                </div>
              )}
            </div>
            
            <div className="pharmacy-form-group">
              <div className="pharmacy-checkbox">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={pharmacyData.agreeToTerms}
                  onChange={handleChange}
                  className={errors.agreeToTerms ? 'pharmacy-input-error' : ''}
                />
                <label htmlFor="agreeToTerms">
                  I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and 
                  <a href="/privacy" target="_blank"> Privacy Policy</a>*
                </label>
              </div>
              {errors.agreeToTerms && <span className="pharmacy-error">{errors.agreeToTerms}</span>}
            </div>
            
            <div className="pharmacy-form-actions">
              <button 
                type="button" 
                className="pharmacy-btn pharmacy-btn-prev" 
                onClick={goToPrevStep}
              >
                Previous
              </button>
              <button 
                type="submit" 
                className="pharmacy-btn pharmacy-btn-submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar />
      <div className="pharmacy-registration-container">
        <ToastContainer position="top-right" autoClose={5000} />
        <div className="pharmacy-registration-header">
          <h2>Register Your Pharmacy</h2>
          <p>Complete the application form below to register your pharmacy on our platform.</p>
        </div>
        
        {renderProgressBar()}
        
        <form onSubmit={handleSubmit} className="pharmacy-registration-form">
          {renderFormStep()}
        </form>
        
        <div className="pharmacy-info-box">
          <h4>What happens next?</h4>
          <ol>
            <li>Our team will review your registration (typically within 3-5 business days)</li>
            <li>We may contact you for additional information or verification</li>
            <li>Once approved, you'll receive access to our pharmacy portal</li>
            <li>You can start fulfilling prescriptions and serving customers!</li>
          </ol>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PharmacyRegistration;
