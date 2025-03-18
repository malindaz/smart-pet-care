import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      navigate('/pharmacyAdmin', { replace: true });
    } catch (error) {
      console.error('Error submitting form:', error.message);
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

        <Card className="pharmacy-Edit-Form-Form-Card">
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              {/* Category Selection */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Category:</Form.Label>
                <Form.Select
                  className="pharmacy-Edit-Form-select"
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
              </Form.Group>

              {/* Product Name */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Product Name:</Form.Label>
                <Form.Control
                  className="pharmacy-Edit-Form-control"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  required
                />
              </Form.Group>

              {/* Price */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Price (Rs):</Form.Label>
                <Form.Control
                  className="pharmacy-Edit-Form-control"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Enter price"
                  step="0.01"
                  min="0"
                  required
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Description:</Form.Label>
                <Form.Control
                  className="pharmacy-Edit-Form-control"
                  as="textarea"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  rows={3}
                  required
                />
              </Form.Group>

              {/* Image Upload */}
              <Form.Group className="pharmacy-Edit-Form">
                <Form.Label className="pharmacy-Edit-Form-label">Product Image:</Form.Label>
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
      <Footer/>
    </>
  );
};

export default PharmacyEdit;
