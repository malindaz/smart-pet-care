import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/pharmacyEdit.css';

const PharmacyEdit = () => {
  // Get route parameters from React Router
  const location = useLocation();
  const navigate = useNavigate();

  // Extract edit mode status and product data from location state
  const { editMode = false, product = null } = location.state || {};

  // State for form data (used for adding or editing a product)
  const [formData, setFormData] = useState({
    id: '',
    category: '',
    name: '',
    price: '',
    description: '',
    image: null
  });

  // State for image preview (shows selected or existing product image)
  const [imagePreview, setImagePreview] = useState(null);

  // Populate form fields if in edit mode
  useEffect(() => {
    if (editMode && product) {
      setFormData({
        id: product._id,  // Set product ID for updating
        category: product.category,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image || null
      });

      // Handle product image preview (either from URL or local upload)
      setImagePreview(
        product.image
          ? product.image.startsWith("data:image") || product.image.startsWith("http")
            ? product.image
            : `/uploads/${product.image}` // Adjust this path based on your backend storage
          : null
      );
    }
  }, [editMode, product]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value  // Ensure price is a number
    });
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result); // Update preview image
        setFormData({
          ...formData,
          image: e.target.result  // Store image as Base64
        });
      };
      reader.readAsDataURL(file); // Convert image to Base64 format
    }
  };

  // Handle form submission (Add or Update product)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        // Determine API endpoint and HTTP method based on edit mode
        const url = editMode
            ? `http://localhost:5000/api/pharmacy/${formData.id}`  // Edit an existing product
            : 'http://localhost:5000/api/pharmacy'; // Add a new product

        const method = editMode ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await response.json();
        console.log('Response:', data);

        // Navigate back to the admin page after successful operation
        navigate('/pharmacyAdmin', { replace: true });
    } catch (error) {
        console.error('Error submitting form:', error);
    }
};


  // Handle cancel button (navigate back to admin page)
  const handleCancel = () => {
    navigate('/pharmacyAdmin');
  };

  return (
    <Container className="pharmacy-Edit-Form-Container">
      <h1 className="pharmacy-Edit-Form-Form-h1">
        {editMode ? 'Edit Product' : 'Add New Product'}
      </h1>

      <Card className="pharmacy-Edit-Form-Form-Card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {/* Category Selection */}
            <Form.Group className="pharmacy-Edit-Form">
              <Form.Label className="pharmacy-Edit-Form-label">Category :</Form.Label>
              <Form.Select
                className="pharmacy-Edit-Form-select"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="" disabled hidden>Choose Category</option>
                <option value="Prescription Medications">Prescription Medications</option>
                <option value="OTC Medications & Supplements">OTC Medications & Supplements</option>
                <option value="Grooming & Hygiene">Grooming & Hygiene</option>
                <option value="Pet Food & Specialized Diets">Pet Food & Specialized Diets</option>
                <option value="First Aid & Wound Care">First Aid & Wound Care</option>
              </Form.Select>
            </Form.Group>

            {/* Product Name Input */}
            <Form.Group className="pharmacy-Edit-Form">
              <Form.Label className="pharmacy-Edit-Form-label">Product Name :</Form.Label>
              <Form.Control
                className="pharmacy-Edit-Form-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </Form.Group>

            {/* Price Input */}
            <Form.Group className="pharmacy-Edit-Form">
              <Form.Label className="pharmacy-Edit-Form-label">Price($) :</Form.Label>
              <Form.Control
                className="pharmacy-Edit-Form-control"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                step="0.01"
                min="0"
              />
            </Form.Group>

            {/* Description Input */}
            <Form.Group className="pharmacy-Edit-Form">
              <Form.Label className="pharmacy-Edit-Form-label">Description :</Form.Label>
              <Form.Control
                className="pharmacy-Edit-Form-control"
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={3}
              />
            </Form.Group>

            {/* Image Upload */}
            <Form.Group className="pharmacy-Edit-Form">
              <Form.Label className="pharmacy-Edit-Form-label">Product Image :</Form.Label>
              <Form.Control
                className="pharmacy-Edit-Form-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="pharmacy-Edit-Form">
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </Form.Group>

            {/* Submit and Cancel Buttons */}
            <div className="pharmacy-Edit-Form-Btn-container">
              <Button
                variant="secondary"
                onClick={handleCancel}
                className="pharmacy-Edit-Form-Btn-cancel"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="pharmacy-Edit-Form-Btn-save"
              >
                {editMode ? 'Update Product' : 'Add Product'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PharmacyEdit;
