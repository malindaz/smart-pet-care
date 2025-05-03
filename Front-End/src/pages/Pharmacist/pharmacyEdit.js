import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../css/Pharmacy/PharmacyEdit.css";
import Footer from "../../components/Footer";
import PmcyAdminNavBar from "../../components/pharmacy-admin-navbar";
import { toast, ToastContainer } from "react-toastify";


const PharmacyEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll to top when this component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { editMode = false, product = null } = location.state || {};

  const [formData, setFormData] = useState({
    id: '',
    category: '',
    name: '',
    price: '',
    description: '',
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState({
    category: false,
    name: false,
    price: false,
    description: false,
    image: false
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editMode && product) {
      setFormData({
        id: product._id || '',
        category: product.category || '',
        name: product.name || '',
        price: product.price || '',
        description: product.description || '',
        image: null, // Reset image field for new uploads
      });

      // Correctly handle stored image paths
      if (product.image) {
        if (product.image.startsWith('http') || product.image.startsWith('data:image')) {
          setImagePreview(product.image);
        } else {
          setImagePreview(`http://localhost:5000${product.image}`);
        }
      } else {
        setImagePreview(null);
      }
    }
  }, [editMode, product]);

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'category':
        if (!value) {
          errorMessage = 'Please select a product category';
        }
        break;

      case 'name':
        if (!value.trim()) {
          errorMessage = 'Product name is required';
        } else if (value.length < 5 || value.length > 50) {
          errorMessage = 'Product name should be between 5 and 50 characters';
        } else if (!/^[a-zA-Z0-9\s\-&(),.+]+$/.test(value)) {
          errorMessage = 'Product name contains invalid characters';
        }
        break;

      case 'price':
        if (!value) {
          errorMessage = 'Price is required';
        } else if (isNaN(value) || parseFloat(value) <= 0) {
          errorMessage = 'Please enter a valid price greater than 0';
        } else if (parseFloat(value) > 100000) {
          errorMessage = 'Price cannot exceed 100,000';
        } else if (!/^\d+(\.\d{1,2})?$/.test(value.toString())) {
          errorMessage = 'Price should have at most 2 decimal places';
        }
        break;

      case 'description':
        if (!value.trim()) {
          errorMessage = 'Product description is required';
        } else if (value.trim().length < 10) {
          errorMessage = 'Description must be 10 to 100 characters';
        } else if (value.trim().length > 100) {
          errorMessage = 'Description must be 10 to 100 characters';
        }
        break;

      case 'image':
        if (!editMode && !value) {
          errorMessage = 'Please upload a product image';
        } else if (value && value instanceof File) {
          // Check file type
          const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
          if (!allowedTypes.includes(value.type)) {
            errorMessage = 'Please upload a valid image file (JPEG, PNG, GIF, WEBP)';
          }
          // Check file size (max 5MB)
          else if (value.size > 5 * 1024 * 1024) {
            errorMessage = 'Image size should not exceed 5MB';
          }
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Special handling for price to ensure proper format
    if (name === 'price') {
      // Allow only valid decimal numbers
      const priceRegex = /^\d*\.?\d{0,2}$/;
      if (value === '' || priceRegex.test(value)) {
        processedValue = value;
      } else {
        return; // Reject invalid input
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: processedValue,
    }));

    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });

    // Validate on change
    setErrors({
      ...errors,
      [name]: validateField(name, processedValue)
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));

      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(file);

      // Mark field as touched
      setFormTouched({
        ...formTouched,
        image: true
      });

      // Validate on change
      setErrors({
        ...errors,
        image: validateField('image', file)
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });

    // Validate on blur
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const validateForm = () => {
    // Validate all fields
    const newErrors = {};
    let isValid = true;

    // Validate each field
    Object.keys(formData).forEach(field => {
      if (field !== 'id') { // Skip ID validation
        const error = validateField(field, formData[field]);
        newErrors[field] = error;
        if (error) isValid = false;
      }
    });

    // Update all errors
    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formTouched).forEach(field => {
      allTouched[field] = true;
    });
    setFormTouched(allTouched);

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('description', formData.description);

      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      } else if (editMode && product.image) {
        formDataToSend.append('image', product.image);
      }

      const url = editMode
        ? `http://localhost:5000/api/pharmacy/${formData.id}`
        : 'http://localhost:5000/api/pharmacy';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        //Show success toast notification
        toast.success(editMode ? "Product updated successfully!" : "New product added successfully!", {
          className: "pharmacy-edit-toast",
          position: "top-right",
          autoClose: 1400,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/pharmacyAdmin', { replace: true });
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error.message);
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => navigate('/pharmacyAdmin');

  return (
    <>
      <PmcyAdminNavBar />
      <div className="pharmacy-edit-page-wrapper">
        <h1 className="pharmacy-edit-form-title">
          {editMode ? 'Edit Product' : 'Add New Product'}
        </h1>
        <Container className="pharmacy-edit-form-container">

          {message.text && (
            <Alert variant={message.type} className="pharmacy-edit-alert">
              {message.text}
            </Alert>
          )}

          <Card className="pharmacy-edit-form-card">
            <Card.Body>
              <Form onSubmit={handleSubmit} noValidate>
                {/* Category Selection */}
                <Form.Group className="pharmacy-edit-form-group">
                  <Form.Label>Category</Form.Label>
                  <div className="pharmacy-edit-form-input-wrapper">
                    <Form.Select
                      className={formTouched.category && errors.category ? 'is-invalid' : ''}
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      required
                    >
                      <option value="" disabled hidden>
                        Choose Category
                      </option>
                      <option value="Prescription Medications">Prescription Medications</option>
                      <option value="OTC Medications & Supplements">OTC Medications & Supplements</option>
                      <option value="Grooming & Hygiene">Grooming & Hygiene</option>
                      <option value="Pet Food & Specialized Diets">Pet Food & Specialized Diets</option>
                      <option value="First Aid & Wound Care">First Aid & Wound Care</option>
                    </Form.Select>
                    {formTouched.category && errors.category && (
                      <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>
                    )}
                  </div>
                </Form.Group>

                {/* Product Name */}
                <Form.Group className="pharmacy-edit-form-group">
                  <Form.Label>Product Name</Form.Label>
                  <div className="pharmacy-edit-form-input-wrapper">
                    <Form.Control
                      className={formTouched.name && errors.name ? 'is-invalid' : ''}
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter product name"
                      required
                    />
                    {formTouched.name && errors.name && (
                      <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                    )}
                  </div>
                </Form.Group>

                {/* Price */}
                <Form.Group className="pharmacy-edit-form-group">
                  <Form.Label>Price (Rs)</Form.Label>
                  <div className="pharmacy-edit-form-input-wrapper">
                    <Form.Control
                      className={formTouched.price && errors.price ? 'is-invalid' : ''}
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter price"
                      required
                    />
                    {formTouched.price && errors.price && (
                      <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                    )}
                  </div>
                </Form.Group>

                {/* Description */}
                <Form.Group className="pharmacy-edit-form-group">
                  <Form.Label>Description</Form.Label>
                  <div className="pharmacy-edit-form-input-wrapper">
                    <Form.Control
                      className={formTouched.description && errors.description ? 'is-invalid' : ''}
                      as="textarea"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter product description"
                      rows={3}
                      required
                    />
                    {formTouched.description && errors.description && (
                      <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                    )}
                  </div>
                </Form.Group>

                {/* Image Upload */}
                <Form.Group className="pharmacy-edit-form-group">
                  <Form.Label>Product Image</Form.Label>
                  <div className="pharmacy-edit-form-input-wrapper">
                    <Form.Control
                      className={formTouched.image && errors.image ? 'is-invalid' : ''}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {formTouched.image && errors.image && (
                      <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                    )}
                  </div>
                  {imagePreview && (
                    <div className="pharmacy-edit-image-preview">
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        className="pharmacy-edit-preview-img"
                      />
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    Accepted formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB.
                  </Form.Text>
                </Form.Group>

                {/* Buttons */}
                <div className="pharmacy-edit-form-actions">
                  <Button
                    variant="secondary"
                    onClick={handleCancel}
                    className="pharmacy-edit-btn-cancel"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="pharmacy-edit-btn-save"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="pharmacy-edit-spinner"></span>
                        Processing...
                      </>
                    ) : (
                      editMode ? 'Update Product' : 'Add Product'
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          <ToastContainer />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default PharmacyEdit;