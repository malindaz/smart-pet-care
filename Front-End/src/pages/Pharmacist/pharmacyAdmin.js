import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../../css/pharmacyAdmin.css';
import dogfood from '../../assets/images/dogfood.png';


const ProductList = () => {
  const navigate = useNavigate();
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

  // Open form page for creating new product
  const handleAddNew = () => {
    navigate('/pharmacy-edit', { state: { editMode: false } });
  };

  // Open form page for editing existing product
  const handleEdit = (product) => {
    navigate('/pharmacy-edit', {
      state: {
        editMode: true,
        product
      }
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
      <h1 className="pmcyh1">Pharmacy Admin Pannel</h1>

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

    </Container>
  );
};

export default ProductList;