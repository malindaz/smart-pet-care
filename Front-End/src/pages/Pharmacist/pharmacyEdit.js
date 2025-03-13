import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import '../../css/pharmacyEdit.css';

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
    image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editMode && product) {
      setFormData({
        id: product.id,
        category: product.category,
        name: product.name,
        price: product.price,
        description: product.description,
        image: product.image || null
      });

      setImagePreview(
        product.image
          ? product.image.startsWith("data:image") || product.image.startsWith("http")
            ? product.image
            : `/uploads/${product.image}` // Adjust this path based on your backend
          : null
      );
    }
  }, [editMode, product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  const handleCategoryChange = (e) => {
    setFormData({
      ...formData,
      category: e.target.value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData({
          ...formData,
          image: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/pharmacy', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Response:', data);
      navigate('/pharmacyAdmin', { replace: true });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleCancel = () => {
    navigate('/pharmacyAdmin');
  };

  return (
    <Container className="pharmacy-Edit-Form-Container">
      <h1 className="pharmacy-Edit-Form-Form-h1">{editMode ? 'Edit Product' : 'Add New Product'}</h1>

      <Card className="pharmacy-Edit-Form-Form-Card">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
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
