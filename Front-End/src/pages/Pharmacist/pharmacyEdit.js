import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../css/Pharmacy/PharmacyEdit.css";
import Footer from "../../components/Footer";
import NavBar from "../../components/NavBar";

const PharmacyEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'price' ? parseFloat(value) || '' : value,
    }));
    
    // Clear error when field is changed
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
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
      
      // Clear image error if it exists
      if (errors.image) {
        setErrors({
          ...errors,
          image: ''
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Category validation
    if (!formData.category) {
      newErrors.category = 'Please select a product category';
    }
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Product name must be at least 3 characters';
    }
    
    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      newErrors.price = 'Please enter a valid price greater than 0';
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    // Image validation - only required for new products
    if (!editMode && !formData.image) {
      newErrors.image = 'Please upload a product image';
    } else if (formData.image && !(formData.image instanceof File)) {
      if (!imagePreview) {
        newErrors.image = 'Please upload a valid image file';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setMessage({ text: 'Please fix the errors in the form', type: 'danger' });
      // Scroll to top to show error message
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
      <Container className="pharmacy-Edit-Form-Container">
        <h1 className="pharmacy-Edit-Form-Form-h1">
          {editMode ? 'Edit Product' : 'Add New Product'}
        </h1>

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
                  className={`pharmacy-Edit-Form-select ${errors.category ? 'is-invalid' : ''}`}
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
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
                {errors.category && <Form.Control.Feedback type="invalid">{errors.category}</Form.Control.Feedback>}
              </Form.Group>

              {/* Product Name */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Product Name:</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control ${errors.name ? 'is-invalid' : ''}`}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
                {errors.name && <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>}
              </Form.Group>

              {/* Price */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Price (Rs):</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control ${errors.price ? 'is-invalid' : ''}`}
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                  required
                />
                {errors.price && <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>}
              </Form.Group>

              {/* Description */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Description:</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control ${errors.description ? 'is-invalid' : ''}`}
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
                {errors.description && <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>}
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Product Image:</Form.Label>
                <Form.Control
                  className={`pharmacy-Edit-Form-control ${errors.image ? 'is-invalid' : ''}`}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {errors.image && <Form.Control.Feedback type="invalid">{errors.image}</Form.Control.Feedback>}
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
      <Footer/>
    </>
  );
};

export default PharmacyEdit;