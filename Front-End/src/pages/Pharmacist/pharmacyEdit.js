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
    category: 'Medications',
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

      if (product.image) {
        setImagePreview(
          product.image.startsWith("data:image") || product.image.startsWith("http")
            ? product.image
            : `/uploads/${product.image}`
        );
      }
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
  
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/pharmacyAdmin');
  };
  
  const handleCancel = () => {
    navigate('/pharmacyAdmin');
  };
  
  return (
    <Container className="pmcyEditFormContainer">
      <h1 className="pmcyEditFormh1">{editMode ? 'Edit Product' : 'Add New Product'}</h1>
      
      <Card className="pmcyEditFormCard">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="pmcyEditForm-label">Category :</Form.Label>
              <Form.Select 
                className="pmcyEditForm-select"
                name="category"
                value={formData.category}
                onChange={handleCategoryChange}
              >
                <option value="Medications">Medications</option>
                <option value="Medicines">Medicines</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="pmcyEditForm-label">Product Name :</Form.Label>
              <Form.Control
                className="pmcyEditForm-control"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="pmcyEditForm-label">Price($) :</Form.Label>
              <Form.Control
                className="pmcyEditForm-control"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                step="0.01"
                min="0"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label className="pmcyEditForm-label">Description :</Form.Label>
              <Form.Control
                className="pmcyEditForm-control"
                as="textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                rows={3}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label className="pmcyEditForm-label">Product Image :</Form.Label>
              <Form.Control
                className="pmcyEditForm-control"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Product"
                    className="img-thumbnail"
                    style={{ maxWidth: '200px', maxHeight: '200px' }}
                  />
                </div>
              )}
            </Form.Group>
            
            <div className="d-flex justify-content-between mt-4">
              <Button 
                variant="secondary" 
                onClick={handleCancel}
                className="pmcyEditFormBtn-cancel"
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                className="pmcyEditFormBtn-save"
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
