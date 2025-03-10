import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import '../../css/pharmacyCRUD.css';
import dogfood from '../../assets/images/dogfood.png';

// Checkout Modal Component
const CheckoutModal = ({ show, onHide, product }) => {
  if (!product) return null;
  
  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      className="checkout-modal"
    >
      <div className="checkout-modal-container">
        <div className="checkout-modal-header">
          <button 
            className="checkout-close-btn" 
            type="button" 
            aria-label="Close"
            onClick={onHide}
          >
            <span>&times;</span>
          </button>
        </div>
        
        <div className="checkout-modal-main">
          <div className="checkout-content">
            <div className="checkout-product-container">
              <div className="checkout-product-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div className="checkout-product-title">
                <span>{product.name}</span>
              </div>
            </div>
            
            <div className="checkout-buttons">
              <div className="checkout-signin-btn">
                <a 
                  className="btn btn-primary btn-lg btn-block"
                  href="#signin"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Sign in functionality would go here');
                    onHide();
                  }}
                >
                  <span>Sign in to check out</span>
                </a>
              </div>
              
              <div className="checkout-guest-btn">
                <a 
                  className="btn btn-outline-secondary btn-lg btn-block"
                  href="#guest"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Guest checkout functionality would go here');
                    onHide();
                  }}
                >
                  <span>Check out as guest</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

const ProductList = () => {
  const [products, setProducts] = useState([
    // Medications Category
    {
      id: 1,
      category: 'Medications',
      name: 'Pain Reliever',
      price: 15.99,
      description: 'Fast-acting pain relief.',
      image: dogfood
    },
    {
      id: 2,
      category: 'Medications',
      name: 'Vitamin C',
      price: 9.99,
      description: 'Immune system support',
      image: dogfood
    },
    {
      id: 3,
      category: 'Medications',
      name: 'Allergy Relief',
      price: 12.99,
      description: '24-hour allergy protection',
      image: dogfood
    },
    {
      id: 4,
      category: 'Medications',
      name: 'Cough Syrup',
      price: 8.99,
      description: 'Relieves cough and sore throat',
      image: dogfood
    },

    // Medicines Category
    {
      id: 5,
      category: 'Medicines',
      name: 'Antibiotic Capsules',
      price: 25.99,
      description: 'Effective for bacterial infections',
      image: dogfood
    },
    {
      id: 6,
      category: 'Medicines',
      name: 'Blood Pressure Pills',
      price: 30.99,
      description: 'Helps maintain healthy blood pressure',
      image: dogfood
    },
    {
      id: 7,
      category: 'Medicines',
      name: 'Diabetes Control Tablets',
      price: 22.99,
      description: 'Regulates blood sugar levels',
      image: dogfood
    },
    {
      id: 8,
      category: 'Medicines',
      name: 'Cholesterol Reducer',
      price: 27.99,
      description: 'Lowers cholesterol levels',
      image: dogfood
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'Medications',
  });
  
  // State for checkout modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(null);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMedications = filteredProducts.filter(
    (product) => product.category === 'Medications'
  );

  const filteredMedicines = filteredProducts.filter(
    (product) => product.category === 'Medicines'
  );

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' ? parseFloat(value) || '' : value
    });
  };

  // Open form modal for creating new product
  const handleAddNew = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Medications',
    });
    setEditMode(false);
    setShowForm(true);
  };

  // Open form modal for editing existing product
  const handleEdit = (product) => {
    setFormData({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description,
      category: product.category,
    });
    setCurrentProduct(product);
    setEditMode(true);
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Update existing product
      const updatedProducts = products.map(product => 
        product.id === formData.id ? {...formData, image: dogfood} : product
      );
      setProducts(updatedProducts);
    } else {
      // Create new product
      const newProduct = {
        ...formData,
        id: Date.now(), // Simple unique ID generation
        image: dogfood // Using default image
      };
      setProducts([...products, newProduct]);
    }
    
    // Reset and close form
    setShowForm(false);
    setFormData({
      name: '',
      price: '',
      description: '',
      category: 'Medications',
    });
  };

  // Handle product deletion
  const handleDelete = (id) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
  };

  // Handle showing checkout modal
  const handleCheckout = (product) => {
    setCheckoutProduct(product);
    setShowCheckout(true);
  };

  return (
    <Container className="pmcyContainer">
      <h1 className="pmcyh1">Pharmacy Products</h1>

      {/* Search and Add New */}
      <div className="pmcyHeader-controls">
        <Button 
          variant="success" 
          className="pmcyAdd-btn"
          onClick={handleAddNew}
        >
          Add New Product
        </Button>
        <div className="pmcySearch-bar">
          <input
            type="text"
            placeholder="Search"
            className="pmcyForm-control"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Check if no items are found */}
      {filteredProducts.length === 0 ? (
        <div className="pmcy-no-items-found">
          <h3>No Items Found</h3>
        </div>
      ) : (
        <>
          {/* Medications Section */}
          {filteredMedications.length > 0 && (
            <>
              <h2 className="pmcyMedications-title">Medications</h2>
              <Row className="pmcyRow">
                {filteredMedications.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pmcyCard">
                      <div className="pmcyCard-img-container">
                        <Card.Img variant="top" src={product.image} className="pmcyCard-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pmcyCard-body">
                        <Card.Title className="pmcyCard-title">{product.name}</Card.Title>
                        <Card.Text className="pmcyCard-text">{product.description}</Card.Text>
                        <Card.Text className="pmcyPrice-text">Price: ${product.price}</Card.Text>
                        <div className="pmcyBtn-group">
                          <Button 
                            variant="primary" 
                            className="pmcyBtn-primary"
                            onClick={() => handleCheckout(product)}
                          >
                            Add to Cart
                          </Button>
                          <Button 
                            variant="warning" 
                            className="pmcyBtn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            className="pmcyBtn-delete"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <hr className='pmcyhr' />
            </>
          )}

          {/* Medicines Section */}
          {filteredMedicines.length > 0 && (
            <>
              <h2 className="pmcyMedications-title">Medicines</h2>
              <Row className="pmcyRow">
                {filteredMedicines.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pmcyCard">
                      <div className="pmcyCard-img-container">
                        <Card.Img variant="top" src={product.image} className="pmcyCard-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pmcyCard-body">
                        <Card.Title className="pmcyCard-title">{product.name}</Card.Title>
                        <Card.Text className="pmcyCard-text">{product.description}</Card.Text>
                        <Card.Text className="pmcyPrice-text">Price: ${product.price}</Card.Text>
                        <div className="pmcyBtn-group">
                          <Button 
                            variant="primary" 
                            className="pmcyBtn-primary"
                            onClick={() => handleCheckout(product)}
                          >
                            Add to Cart
                          </Button>
                          <Button 
                            variant="warning" 
                            className="pmcyBtn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="danger" 
                            className="pmcyBtn-delete"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <hr className='pmcyhr' />
            </>
          )}
        </>
      )}

      {/* Add/Edit Product Modal */}
      <Modal 
        show={showForm} 
        onHide={() => setShowForm(false)}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Product' : 'Add New Product'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="Medications">Medications</option>
                <option value="Medicines">Medicines</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <div className="text-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {editMode ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Checkout Modal */}
      <CheckoutModal 
        show={showCheckout}
        onHide={() => setShowCheckout(false)}
        product={checkoutProduct}
      />
    </Container>
  );
};

export default ProductList;
