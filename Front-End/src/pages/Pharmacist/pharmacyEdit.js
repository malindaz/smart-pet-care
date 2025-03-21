import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../css/Pharmacy/PharmacyEdit.css";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

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
        } else if (value.trim().length < 3) {
          errorMessage = 'Product name must be at least 3 characters';
        } else if (value.trim().length > 100) {
          errorMessage = 'Product name cannot exceed 100 characters';
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
          errorMessage = 'Description must be at least 10 characters';
        } else if (value.trim().length > 100) {
          errorMessage = 'Description cannot exceed 100 characters';
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
        formDataToSend.append('image', product.image); // Retain old image path
      }

      const url = editMode
        ? `http://localhost:5000/api/pharmacy/${formData.id}`
        : 'http://localhost:5000/api/pharmacy';
      const method = editMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error: ${response.status} ${response.statusText}`);
      }

      setMessage({
        text: editMode ? 'Product updated successfully!' : 'Product added successfully!',
        type: 'success'
      });

      // Redirect after a short delay to show success message
      setTimeout(() => {
        navigate('/pharmacyAdmin', { replace: true });
      }, 1500);
    } catch (error) {
      console.error('Error submitting form:', error.message);
      setMessage({ text: error.message || 'An error occurred while saving the product', type: 'danger' });
      // Scroll to top to show error message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => navigate('/pharmacyAdmin');

  return (
    <>
      <NavBar />
      <h1 className="pharmacy-Edit-Form-h1">
          {editMode ? 'Edit Product' : 'Add New Product'}
        </h1>
      <Container className="pharmacy-Edit-Form-Container">     

        {message.text && (
          <Alert variant={message.type} className="my-3">
            {message.text}
          </Alert>
        )}

        <Card className="pharmacy-Edit-Form-Form-Card">
          <Card.Body>
            <Form onSubmit={handleSubmit} noValidate>
              {/* Category Selection */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Category:</Form.Label>
                <Form.Select
                  className={`pharmacy-Edit-Form-select pharmacy-Edit-Form-category ${formTouched.category && errors.category ? 'is-invalid' : ''}`}
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
              </Form.Group>

              {/* Product Name */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Product Name:</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control pharmacy-Edit-Form-name ${formTouched.name && errors.name ? 'is-invalid' : ''}`}
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
              </Form.Group>

              {/* Price */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Price (Rs):</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control pharmacy-Edit-Form-price ${formTouched.price && errors.price ? 'is-invalid' : ''}`}
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
              </Form.Group>

              {/* Description */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Description:</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control pharmacy-Edit-Form-description ${formTouched.description && errors.description ? 'is-invalid' : ''}`}
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
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Product Image:</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control pharmacy-Edit-Form-image ${formTouched.image && errors.image ? 'is-invalid' : ''}`}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {formTouched.image && errors.image && (
                  <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>
                )}
                {imagePreview && (
                  <div className="pharmacy-Edit-Form">
                    <img
                      src={imagePreview}
                      alt="Product Preview"
                      className="pharmacy-Edit-Form img-thumbnail"
                      style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }}
                    />
                  </div>
                )}
                <Form.Text className="text-muted">
                  Accepted formats: JPEG, PNG, GIF, WEBP. Maximum size: 5MB.
                </Form.Text>
              </Form.Group>

              {/* Buttons */}
              <div className="pharmacy-Edit-Form-Btn-container">
                <Button
                  variant="secondary"
                  onClick={handleCancel}
                  className="pharmacy-Edit-Form-Btn-cancel"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="pharmacy-Edit-Form-Btn-save"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : editMode ? 'Update Product' : 'Add Product'}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default PharmacyEdit;