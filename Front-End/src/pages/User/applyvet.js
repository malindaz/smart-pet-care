import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../../css/User/applyvet.css';
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";

const ApplyVet = () => {
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseIssuingAuthority: '',
    licenseExpiryDate: '',
    specialization: '',
    yearsOfExperience: '',
    clinicName: '',
    clinicAddress: '',
    city: '',
    state: '',
    zipCode: '',
    availableDays: [],
    availableTimeStart: '',
    availableTimeEnd: '',
    education: [{ institution: '', degree: '', yearCompleted: '' }],
    profileImage: null,
    licenseCopy: null,
    additionalCertifications: [],
    emergencyServices: false,
    homeVisits: false,
    bio: '',
    agreeToTerms: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const totalSteps = 4;

  // Available specializations
  const specializations = [
    'General Practice',
    'Surgery',
    'Dentistry',
    'Dermatology',
    'Cardiology',
    'Neurology',
    'Ophthalmology',
    'Oncology',
    'Exotic Animals',
    'Emergency & Critical Care',
    'Other'
  ];

  // Days of the week
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
  ];

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'checkbox' && name === 'availableDays') {
      let updatedDays = [...formData.availableDays];
      if (checked) {
        updatedDays.push(value);
      } else {
        updatedDays = updatedDays.filter(day => day !== value);
      }
      setFormData({ ...formData, availableDays: updatedDays });
    } else if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear error when user starts typing in a field that had an error
    if (errors[name]) {
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleEducationChange = (index, e) => {
    const { name, value } = e.target;
    const fieldName = name.split('.')[2]; // Get the third part (institution, degree, yearCompleted)
    
    const updatedEducation = [...formData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [fieldName]: value
    };
    
    setFormData({
      ...formData,
      education: updatedEducation
    });
    
    // Clear error for this field if it exists
    const errorKey = `education.${index}.${fieldName}`;
    if (errors[errorKey]) {
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[errorKey];
        return updatedErrors;
      });
    }
  };

  // Add more education field
  const addEducationField = () => {
    setFormData({
      ...formData,
      education: [...formData.education, { institution: '', degree: '', yearCompleted: '' }]
    });
  };

  // Remove education field
  const removeEducationField = (index) => {
    if (formData.education.length > 1) {
      const updatedEducation = formData.education.filter((_, i) => i !== index);
      setFormData({ ...formData, education: updatedEducation });
    } else {
      toast.warning('At least one education entry is required');
    }
  };

  // Add certification
  const addCertification = () => {
    setFormData({
      ...formData,
      additionalCertifications: [...formData.additionalCertifications, { name: '', issuingBody: '', year: '' }]
    });
  };

  const handleCertificationChange = (index, e) => {
    const { name, value } = e.target;
    const fieldName = name.split('.')[2]; // Get the third part
    const updatedCertifications = [...formData.additionalCertifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [fieldName]: value
    };
    setFormData({ ...formData, additionalCertifications: updatedCertifications });
  };

  // Remove certification
  const removeCertification = (index) => {
    const updatedCertifications = formData.additionalCertifications.filter((_, i) => i !== index);
    setFormData({ ...formData, additionalCertifications: updatedCertifications });
  };

  // Form validation
  const validateForm = (step) => {
    let tempErrors = {};
    let isValid = true;

    // Validate based on current step
    if (step === 1) {
      // First Name validation
      if (!formData.firstName.trim()) {
        tempErrors.firstName = 'First name is required';
        isValid = false;
      } else if (formData.firstName.trim().length < 2) {
        tempErrors.firstName = 'First name must be at least 2 characters';
        isValid = false;
      } else if (!/^[a-zA-Z\s'-]+$/.test(formData.firstName)) {
        tempErrors.firstName = 'First name can only contain letters, spaces, hyphens and apostrophes';
        isValid = false;
      }
      
      // Last Name validation
      if (!formData.lastName.trim()) {
        tempErrors.lastName = 'Last name is required';
        isValid = false;
      } else if (formData.lastName.trim().length < 2) {
        tempErrors.lastName = 'Last name must be at least 2 characters';
        isValid = false;
      } else if (!/^[a-zA-Z\s'-]+$/.test(formData.lastName)) {
        tempErrors.lastName = 'Last name can only contain letters, spaces, hyphens and apostrophes';
        isValid = false;
      }
      
      // Email validation
      if (!formData.email.trim()) {
        tempErrors.email = 'Email is required';
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        tempErrors.email = 'Enter a valid email address';
        isValid = false;
      }
      
      // Phone number validation
      if (!formData.phone.trim()) {
        tempErrors.phone = 'Phone number is required';
        isValid = false;
      } else {
        // Clean phone number of non-numeric characters for validation
        const cleanedPhone = formData.phone.replace(/[^0-9]/g, '');
        if (cleanedPhone.length !== 10) {
          tempErrors.phone = 'Phone number must be 10 digits';
          isValid = false;
        }
      }
    } else if (step === 2) {
      // License number validation
      if (!formData.licenseNumber.trim()) {
        tempErrors.licenseNumber = 'License number is required';
        isValid = false;
      } else if (formData.licenseNumber.trim().length < 5) {
        tempErrors.licenseNumber = 'License number should be at least 5 characters';
        isValid = false;
      }
      
      // Licensing authority validation
      if (!formData.licenseIssuingAuthority.trim()) {
        tempErrors.licenseIssuingAuthority = 'Licensing authority is required';
        isValid = false;
      } else if (formData.licenseIssuingAuthority.trim().length < 3) {
        tempErrors.licenseIssuingAuthority = 'Please enter a valid licensing authority';
        isValid = false;
      }
      
      // License expiry date validation
      if (!formData.licenseExpiryDate) {
        tempErrors.licenseExpiryDate = 'License expiry date is required';
        isValid = false;
      } else {
        const today = new Date();
        const expiryDate = new Date(formData.licenseExpiryDate);
        if (expiryDate <= today) {
          tempErrors.licenseExpiryDate = 'License must not be expired';
          isValid = false;
        }
      }
      
      // Specialization validation
      if (!formData.specialization) {
        tempErrors.specialization = 'Specialization is required';
        isValid = false;
      }
      
      // Years of experience validation
      if (!formData.yearsOfExperience) {
        tempErrors.yearsOfExperience = 'Years of experience is required';
        isValid = false;
      } else if (isNaN(formData.yearsOfExperience) || Number(formData.yearsOfExperience) < 0) {
        tempErrors.yearsOfExperience = 'Please enter a valid number of years';
        isValid = false;
      }
      
      // Education validation - check each entry
      formData.education.forEach((edu, index) => {
        if (!edu.institution.trim()) {
          tempErrors[`education.${index}.institution`] = 'Institution name is required';
          isValid = false;
        }
        
        if (!edu.degree.trim()) {
          tempErrors[`education.${index}.degree`] = 'Degree is required';
          isValid = false;
        }
        
        if (!edu.yearCompleted.trim()) {
          tempErrors[`education.${index}.yearCompleted`] = 'Year completed is required';
          isValid = false;
        } else if (!/^\d{4}$/.test(edu.yearCompleted.trim())) {
          tempErrors[`education.${index}.yearCompleted`] = 'Enter a valid 4-digit year';
          isValid = false;
        } else {
          const year = parseInt(edu.yearCompleted.trim());
          const currentYear = new Date().getFullYear();
          if (year > currentYear || year < 1900) {
            tempErrors[`education.${index}.yearCompleted`] = `Year must be between 1900 and ${currentYear}`;
            isValid = false;
          }
        }
      });
      
      // License copy validation
      if (!formData.licenseCopy) {
        tempErrors.licenseCopy = 'License copy is required';
        isValid = false;
      } else {
        // Check file type if file is selected
        const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedFileTypes.includes(formData.licenseCopy.type)) {
          tempErrors.licenseCopy = 'File must be PDF, JPG, or PNG';
          isValid = false;
        }
      }
      
      // Validate additional certifications if any
      formData.additionalCertifications.forEach((cert, index) => {
        // Only validate if at least one field is filled in
        if (cert.name.trim() || cert.issuingBody.trim() || cert.year.trim()) {
          if (!cert.year.trim()) {
            tempErrors[`certification.${index}.year`] = 'Year is required';
            isValid = false;
          } else if (!/^\d{4}$/.test(cert.year.trim())) {
            tempErrors[`certification.${index}.year`] = 'Enter a valid 4-digit year';
            isValid = false;
          }
          
          if (!cert.name.trim()) {
            tempErrors[`certification.${index}.name`] = 'Certification name is required';
            isValid = false;
          }
          
          if (!cert.issuingBody.trim()) {
            tempErrors[`certification.${index}.issuingBody`] = 'Issuing body is required';
            isValid = false;
          }
        }
      });
    } else if (step === 3) {
      // Clinic name validation
      if (!formData.clinicName.trim()) {
        tempErrors.clinicName = 'Clinic name is required';
        isValid = false;
      } else if (formData.clinicName.trim().length < 3) {
        tempErrors.clinicName = 'Clinic name must be at least 3 characters';
        isValid = false;
      }
      
      // Address validation
      if (!formData.clinicAddress.trim()) {
        tempErrors.clinicAddress = 'Clinic address is required';
        isValid = false;
      } else if (formData.clinicAddress.trim().length < 5) {
        tempErrors.clinicAddress = 'Please enter a complete address';
        isValid = false;
      }
      
      // City validation
      if (!formData.city.trim()) {
        tempErrors.city = 'City is required';
        isValid = false;
      } else if (!/^[a-zA-Z\s'-]+$/.test(formData.city)) {
        tempErrors.city = 'Enter a valid city name';
        isValid = false;
      }
      
      // State validation
      if (!formData.state.trim()) {
        tempErrors.state = 'State is required';
        isValid = false;
      } else if (!/^[a-zA-Z\s]+$/.test(formData.state)) {
        tempErrors.state = 'Enter a valid state name';
        isValid = false;
      }
      
      // ZIP code validation
      if (!formData.zipCode.trim()) {
        tempErrors.zipCode = 'ZIP code is required';
        isValid = false;
      } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
        tempErrors.zipCode = 'Enter a valid ZIP code (e.g., 12345 or 12345-6789)';
        isValid = false;
      }
      
      // Available days validation
      if (formData.availableDays.length === 0) {
        tempErrors.availableDays = 'Please select at least one available day';
        isValid = false;
      }
      
      // Time validation
      if (!formData.availableTimeStart) {
        tempErrors.availableTimeStart = 'Start time is required';
        isValid = false;
      }
      
      if (!formData.availableTimeEnd) {
        tempErrors.availableTimeEnd = 'End time is required';
        isValid = false;
      } else if (formData.availableTimeStart && formData.availableTimeEnd && formData.availableTimeStart >= formData.availableTimeEnd) {
        tempErrors.availableTimeEnd = 'End time must be after start time';
        isValid = false;
      }
    } else if (step === 4) {
      // Bio validation
      if (!formData.bio.trim()) {
        tempErrors.bio = 'Professional bio is required';
        isValid = false;
      } else if (formData.bio.trim().length < 100) {
        tempErrors.bio = `Bio should be at least 100 characters (currently ${formData.bio.trim().length})`;
        isValid = false;
      }
      
      // Profile image validation
      if (!formData.profileImage) {
        tempErrors.profileImage = 'Profile image is required';
        isValid = false;
      } else {
        // Validate image type
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedImageTypes.includes(formData.profileImage.type)) {
          tempErrors.profileImage = 'File must be JPG or PNG';
          isValid = false;
        }
        
        // Validate image size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (formData.profileImage.size > maxSize) {
          tempErrors.profileImage = 'Image must be less than 5MB';
          isValid = false;
        }
      }
      
      // Terms and conditions validation
      if (!formData.agreeToTerms) {
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
      // Scroll to the first error
      const firstErrorField = document.querySelector('.applyvet-input-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
    }
  };

  const goToPrevStep = () => {
    setFormStep(prevStep => prevStep - 1);
    window.scrollTo(0, 0);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm(formStep)) {
      toast.error('Please fix the errors before submitting');
      // Scroll to the first error
      const firstErrorField = document.querySelector('.applyvet-input-error');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorField.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data object for file uploads
      const submitData = new FormData();
      
      // Add all form data to FormData with proper error handling
      for (const key in formData) {
        if (key === 'education' || key === 'additionalCertifications' || key === 'availableDays') {
          // Always provide a fallback empty array for these fields
          submitData.append(key, JSON.stringify(formData[key] || []));
        } else if (key === 'profileImage' || key === 'licenseCopy') {
          // Only append files if they exist
          if (formData[key]) {
            submitData.append(key, formData[key]);
          }
        } else if (key === 'yearsOfExperience') {
          // Ensure numeric fields are not undefined
          submitData.append(key, formData[key] || '0');
        } else if (typeof formData[key] === 'boolean') {
          // Handle boolean values
          submitData.append(key, formData[key]);
        } else {
          // For other fields, convert undefined or null to empty string
          submitData.append(key, formData[key] == null ? '' : formData[key]);
        }
      }
      
      // Submit form data to API
      const response = await axios.post('http://localhost:5000/api/veterinarians/apply', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      toast.success('Application submitted successfully! We will review your application and contact you soon.');
      
      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          licenseNumber: '',
          licenseIssuingAuthority: '',
          licenseExpiryDate: '',
          specialization: '',
          yearsOfExperience: '',
          clinicName: '',
          clinicAddress: '',
          city: '',
          state: '',
          zipCode: '',
          availableDays: [],
          availableTimeStart: '',
          availableTimeEnd: '',
          education: [{ institution: '', degree: '', yearCompleted: '' }],
          profileImage: null,
          licenseCopy: null,
          additionalCertifications: [],
          emergencyServices: false,
          homeVisits: false,
          bio: '',
          agreeToTerms: false
        });
        setFormStep(1);
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Application failed: ${error.response.data.message}`);
      } else {
        toast.error('Application failed. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    return (
      <>
      <NavBar/>
      <div className="applyvet-progress-container">
        <div className="applyvet-progress-bar">
          <div 
            className="applyvet-progress-fill" 
            style={{ width: `${(formStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="applyvet-step-indicators">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div 
              key={i} 
              className={`applyvet-step-indicator ${i + 1 <= formStep ? 'applyvet-active' : ''}`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="applyvet-step-labels">
          <span className={formStep === 1 ? 'applyvet-current-step' : ''}>Personal Info</span>
          <span className={formStep === 2 ? 'applyvet-current-step' : ''}>Credentials</span>
          <span className={formStep === 3 ? 'applyvet-current-step' : ''}>Practice Details</span>
          <span className={formStep === 4 ? 'applyvet-current-step' : ''}>Final Details</span>
        </div>
      </div>
      </>
    );
  };

  // Render form based on current step
  const renderFormStep = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="applyvet-form-step">
            <h3>Personal Information</h3>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="firstName">First Name*</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? 'applyvet-input-error' : ''}
                />
                {errors.firstName && <span className="applyvet-error">{errors.firstName}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="lastName">Last Name*</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? 'applyvet-input-error' : ''}
                />
                {errors.lastName && <span className="applyvet-error">{errors.lastName}</span>}
              </div>
            </div>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="email">Email Address*</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'applyvet-input-error' : ''}
                />
                {errors.email && <span className="applyvet-error">{errors.email}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="phone">Phone Number*</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(XXX) XXX-XXXX"
                  className={errors.phone ? 'applyvet-input-error' : ''}
                />
                {errors.phone && <span className="applyvet-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="applyvet-form-actions">
              <button 
                type="button" 
                className="applyvet-btn applyvet-btn-next" 
                onClick={goToNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="applyvet-form-step">
            <h3>Professional Credentials</h3>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="licenseNumber">Veterinary License Number*</label>
                <input
                  type="text"
                  id="licenseNumber"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  className={errors.licenseNumber ? 'applyvet-input-error' : ''}
                />
                {errors.licenseNumber && <span className="applyvet-error">{errors.licenseNumber}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="licenseIssuingAuthority">Licensing Authority*</label>
                <input
                  type="text"
                  id="licenseIssuingAuthority"
                  name="licenseIssuingAuthority"
                  value={formData.licenseIssuingAuthority}
                  onChange={handleChange}
                  placeholder="State Veterinary Board"
                  className={errors.licenseIssuingAuthority ? 'applyvet-input-error' : ''}
                />
                {errors.licenseIssuingAuthority && <span className="applyvet-error">{errors.licenseIssuingAuthority}</span>}
              </div>
            </div>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="licenseExpiryDate">License Expiry Date*</label>
                <input
                  type="date"
                  id="licenseExpiryDate"
                  name="licenseExpiryDate"
                  value={formData.licenseExpiryDate}
                  onChange={handleChange}
                  className={errors.licenseExpiryDate ? 'applyvet-input-error' : ''}
                />
                {errors.licenseExpiryDate && <span className="applyvet-error">{errors.licenseExpiryDate}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="licenseCopy">Upload License Copy (PDF/JPG)*</label>
                <input
                  type="file"
                  id="licenseCopy"
                  name="licenseCopy"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleChange}
                  className={errors.licenseCopy ? 'applyvet-input-error' : ''}
                />
                {errors.licenseCopy && <span className="applyvet-error">{errors.licenseCopy}</span>}
              </div>
            </div>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="specialization">Specialization*</label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={errors.specialization ? 'applyvet-input-error' : ''}
                >
                  <option value="">Select Specialization</option>
                  {specializations.map((spec, index) => (
                    <option key={index} value={spec}>{spec}</option>
                  ))}
                </select>
                {errors.specialization && <span className="applyvet-error">{errors.specialization}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="yearsOfExperience">Years of Experience*</label>
                <input
                  type="number"
                  id="yearsOfExperience"
                  name="yearsOfExperience"
                  min="0"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  className={errors.yearsOfExperience ? 'applyvet-input-error' : ''}
                />
                {errors.yearsOfExperience && <span className="applyvet-error">{errors.yearsOfExperience}</span>}
              </div>
            </div>
            
            <h4>Education</h4>
            {formData.education.map((edu, index) => (
              <div key={index} className="applyvet-education-entry">
                <div className="applyvet-form-row">
                  <div className="applyvet-form-group">
                    <label htmlFor={`education.${index}.institution`}>Institution*</label>
                    <input
                        type="text"
                        id={`education.${index}.institution`}
                        name={`education.${index}.institution`}
                        value={edu.institution}
                        onChange={(e) => handleEducationChange(index, e)}
                        className={errors[`education.${index}.institution`] ? 'applyvet-input-error' : ''}
                        />
                    {errors[`education.${index}.institution`] && 
                      <span className="applyvet-error">{errors[`education.${index}.institution`]}</span>}
                  </div>
                  <div className="applyvet-form-group">
                    <label htmlFor={`education.${index}.degree`}>Degree*</label>
                    <input
                      type="text"
                      id={`education.${index}.degree`}
                      name={`education.${index}.degree`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="DVM, BVSc, etc."
                      className={errors[`education.${index}.degree`] ? 'applyvet-input-error' : ''}
                    />
                    {errors[`education.${index}.degree`] && 
                      <span className="applyvet-error">{errors[`education.${index}.institution`]}</span>}
                  </div>
                  <div className="applyvet-form-group">
                    <label htmlFor={`education.${index}.degree`}>Degree*</label>
                    <input
                      type="text"
                      id={`education.${index}.degree`}
                      name={`education.${index}.degree`}
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="DVM, BVSc, etc."
                      className={errors[`education.${index}.degree`] ? 'applyvet-input-error' : ''}
                    />
                    {errors[`education.${index}.degree`] && 
                      <span className="applyvet-error">{errors[`education.${index}.degree`]}</span>}
                  </div>
                  <div className="applyvet-form-group">
                    <label htmlFor={`education.${index}.yearCompleted`}>Year Completed*</label>
                    <input
                      type="text"
                      id={`education.${index}.yearCompleted`}
                      name={`education.${index}.yearCompleted`}
                      value={edu.yearCompleted}
                      onChange={(e) => handleEducationChange(index, e)}
                      placeholder="YYYY"
                      className={errors[`education.${index}.yearCompleted`] ? 'applyvet-input-error' : ''}
                    />
                    {errors[`education.${index}.yearCompleted`] && 
                      <span className="applyvet-error">{errors[`education.${index}.yearCompleted`]}</span>}
                  </div>
                  {formData.education.length > 1 && (
                    <button 
                      type="button" 
                      className="applyvet-btn applyvet-btn-remove" 
                      onClick={() => removeEducationField(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button type="button" className="applyvet-btn applyvet-btn-add" onClick={addEducationField}>
              Add Education
            </button>
            
            <h4>Additional Certifications (Optional)</h4>
            {formData.additionalCertifications.map((cert, index) => (
              <div key={index} className="applyvet-certification-entry">
                <div className="applyvet-form-row">
                  <div className="applyvet-form-group">
                    <label htmlFor={`certification.${index}.name`}>Certification Name</label>
                    <input
                      type="text"
                      id={`certification.${index}.name`}
                      name={`certification.${index}.name`}
                      value={cert.name}
                      onChange={(e) => handleCertificationChange(index, e)}
                    />
                  </div>
                  <div className="applyvet-form-group">
                    <label htmlFor={`certification.${index}.issuingBody`}>Issuing Organization</label>
                    <input
                      type="text"
                      id={`certification.${index}.issuingBody`}
                      name={`certification.${index}.issuingBody`}
                      value={cert.issuingBody}
                      onChange={(e) => handleCertificationChange(index, e)}
                    />
                  </div>
                  <div className="applyvet-form-group">
                    <label htmlFor={`certification.${index}.year`}>Year</label>
                    <input
                      type="text"
                      id={`certification.${index}.year`}
                      name={`certification.${index}.year`}
                      value={cert.year}
                      onChange={(e) => handleCertificationChange(index, e)}
                      placeholder="YYYY"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="applyvet-btn applyvet-btn-remove" 
                    onClick={() => removeCertification(index)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button type="button" className="applyvet-btn applyvet-btn-add" onClick={addCertification}>
              Add Certification
            </button>
            
            <div className="applyvet-form-actions">
              <button 
                type="button" 
                className="applyvet-btn applyvet-btn-prev" 
                onClick={goToPrevStep}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="applyvet-btn applyvet-btn-next" 
                onClick={goToNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="applyvet-form-step">
            <h3>Practice Details</h3>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="clinicName">Clinic/Hospital Name*</label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleChange}
                  className={errors.clinicName ? 'applyvet-input-error' : ''}
                />
                {errors.clinicName && <span className="applyvet-error">{errors.clinicName}</span>}
              </div>
            </div>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group applyvet-full-width">
                <label htmlFor="clinicAddress">Street Address*</label>
                <input
                  type="text"
                  id="clinicAddress"
                  name="clinicAddress"
                  value={formData.clinicAddress}
                  onChange={handleChange}
                  className={errors.clinicAddress ? 'applyvet-input-error' : ''}
                />
                {errors.clinicAddress && <span className="applyvet-error">{errors.clinicAddress}</span>}
              </div>
            </div>
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="city">City*</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'applyvet-input-error' : ''}
                />
                {errors.city && <span className="applyvet-error">{errors.city}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="state">State*</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'applyvet-input-error' : ''}
                />
                {errors.state && <span className="applyvet-error">{errors.state}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="zipCode">ZIP Code*</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className={errors.zipCode ? 'applyvet-input-error' : ''}
                />
                {errors.zipCode && <span className="applyvet-error">{errors.zipCode}</span>}
              </div>
            </div>
            
            <h4>Availability</h4>
            <div className="applyvet-form-group">
              <label>Available Days*</label>
              <div className="applyvet-checkbox-group">
                {daysOfWeek.map((day, index) => (
                  <div key={index} className="applyvet-checkbox">
                    <input
                      type="checkbox" id={`day-${day}`}
                      name="availableDays"
                      value={day}
                      checked={formData.availableDays.includes(day)}
                      onChange={handleChange}
                    />
                    <label htmlFor={`day-${day}`}>{day}</label>
                  </div>
                ))}
              </div>
              {errors.availableDays && <span className="applyvet-error">{errors.availableDays}</span>}
            </div>
            
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <label htmlFor="availableTimeStart">Available From*</label>
                <input
                  type="time"
                  id="availableTimeStart"
                  name="availableTimeStart"
                  value={formData.availableTimeStart}
                  onChange={handleChange}
                  className={errors.availableTimeStart ? 'applyvet-input-error' : ''}
                />
                {errors.availableTimeStart && <span className="applyvet-error">{errors.availableTimeStart}</span>}
              </div>
              <div className="applyvet-form-group">
                <label htmlFor="availableTimeEnd">Available To*</label>
                <input
                  type="time"
                  id="availableTimeEnd"
                  name="availableTimeEnd"
                  value={formData.availableTimeEnd}
                  onChange={handleChange}
                  className={errors.availableTimeEnd ? 'applyvet-input-error' : ''}
                />
                {errors.availableTimeEnd && <span className="applyvet-error">{errors.availableTimeEnd}</span>}
              </div>
            </div>
            
            <div className="applyvet-form-row">
              <div className="applyvet-form-group">
                <div className="applyvet-checkbox">
                  <input
                    type="checkbox"
                    id="emergencyServices"
                    name="emergencyServices"
                    checked={formData.emergencyServices}
                    onChange={handleChange}
                  />
                  <label htmlFor="emergencyServices">Available for Emergency Services</label>
                </div>
              </div>
              <div className="applyvet-form-group">
                <div className="applyvet-checkbox">
                  <input
                    type="checkbox"
                    id="homeVisits"
                    name="homeVisits"
                    checked={formData.homeVisits}
                    onChange={handleChange}
                  />
                  <label htmlFor="homeVisits">Available for Home Visits</label>
                </div>
              </div>
            </div>
            
            <div className="applyvet-form-actions">
              <button 
                type="button" 
                className="applyvet-btn applyvet-btn-prev" 
                onClick={goToPrevStep}
              >
                Previous
              </button>
              <button 
                type="button" 
                className="applyvet-btn applyvet-btn-next" 
                onClick={goToNextStep}
              >
                Next Step
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="applyvet-form-step">
            <h3>Final Details</h3>
            <div className="applyvet-form-group">
              <label htmlFor="bio">Professional Bio (min 100 characters)*</label>
              <textarea
                id="bio"
                name="bio"
                rows="5"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about your professional background, experience, and approach to veterinary care..."
                className={errors.bio ? 'applyvet-input-error' : ''}
              ></textarea>
              <div className="applyvet-character-count">
                {formData.bio.length} / 100 characters minimum
              </div>
              {errors.bio && <span className="applyvet-error">{errors.bio}</span>}
            </div>
            
            <div className="applyvet-form-group">
              <label htmlFor="profileImage">Profile Image*</label>
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleChange}
                className={errors.profileImage ? 'applyvet-input-error' : ''}
              />
              <div className="applyvet-hint">Please upload a professional headshot (JPG, PNG)</div>
              {errors.profileImage && <span className="applyvet-error">{errors.profileImage}</span>}
              {formData.profileImage && (
                <div className="applyvet-image-preview">
                  <img 
                    src={URL.createObjectURL(formData.profileImage)} 
                    alt="Profile Preview" 
                  />
                </div>
              )}
            </div>
            
            <div className="applyvet-form-group">
              <div className="applyvet-checkbox">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={errors.agreeToTerms ? 'applyvet-input-error' : ''}
                />
                <label htmlFor="agreeToTerms">
                  I agree to the <a href="/terms" target="_blank">Terms and Conditions</a> and 
                  <a href="/privacy" target="_blank"> Privacy Policy</a>*
                </label>
              </div>
              {errors.agreeToTerms && <span className="applyvet-error">{errors.agreeToTerms}</span>}
            </div>
            
            <div className="applyvet-form-actions">
              <button 
                type="button" 
                className="applyvet-btn applyvet-btn-prev" 
                onClick={goToPrevStep}
              >
                Previous
              </button>
              <button 
                type="submit" 
                className="applyvet-btn applyvet-btn-submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="applyvet-container">
      <ToastContainer position="top-right" autoClose={5000} />
      <div className="applyvet-header">
        <h2>Apply to Join Our Veterinarian Network</h2>
        <p>Complete the application form below to become a verified veterinarian on our platform.</p>
      </div>
      
      {renderProgressBar()}
      
      <form onSubmit={handleSubmit} className="applyvet-form">
        {renderFormStep()}
      </form>
      
      <div className="applyvet-info-box">
        <h4>What happens next?</h4>
        <ol>
          <li>Our team will review your application (typically within 3-5 business days)</li>
          <li>We may contact you for additional information or verification</li>
          <li>Once approved, you'll receive access to our veterinarian portal</li>
          <li>You can start accepting appointments and helping pet owners!</li>
        </ol>
      </div>
    </div>
    
  );
};

export default ApplyVet;