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
      category: 'Prescription Medications',
      name: 'Pain Reliever',
      price: 15.99,
      description: 'Fast-acting pain relief.',
      image: dogfood
    },
    {
      id: 2,
      category: 'OTC Medications & Supplements',
      name: 'Vitamin C',
      price: 9.99,
      description: 'Immune system support',
      image: dogfood
    },

    // Medicines Category
    {
      id: 3,
      category: 'Grooming & Hygiene',
      name: 'Antibiotic Capsules',
      price: 25.99,
      description: 'Effective for bacterial infections',
      image: dogfood
    },
    {
      id: 4,
      category: 'Pet Food & Specialized Diets',
      name: 'Blood Pressure Pills',
      price: 30.99,
      description: 'Helps maintain healthy blood pressure',
      image: dogfood
    },
    {
      id: 4,
      category: 'First Aid & Wound Care',
      name: 'Blood Pressure Pills',
      price: 30.99,
      description: 'Helps maintain healthy blood pressure',
      image: dogfood
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrescriptionMedications = filteredProducts.filter(
    (product) => product.category === 'Prescription Medications'
  );

  const filteredMedicationsSupplements = filteredProducts.filter(
    (product) => product.category === 'OTC Medications & Supplements'
  );

  const filteredGroomingHygiene = filteredProducts.filter(
    (product) => product.category === 'Grooming & Hygiene'
  );

  const filteredPetFood = filteredProducts.filter(
    (product) => product.category === 'Pet Food & Specialized Diets'
  );

  const filteredFirstAid = filteredProducts.filter(
    (product) => product.category === 'First Aid & Wound Care'
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

  return (
    <Container className="pharmacy-Container">
      <h1 className="pharmacy-h1">Pharmacy Admin Pannel</h1>

      {/* Search and Add New */}
      <div className="pharmacy-Header-controls">
        <Button
          variant="success"
          className="pharmacy-Add-btn"
          onClick={handleAddNew}
        >
          Add New Product
        </Button>
        <div className="pharmacy-Search-bar">
          <input
            type="text"
            placeholder="Search"
            className="pharmacy-Form-control"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Check if no items are found */}
      {filteredProducts.length === 0 ? (
        <div className="pharmacy-no-items-found">
          <h3>No Items Found</h3>
        </div>
      ) : (
        <>
          {/* Medications Section */}
          {filteredPrescriptionMedications.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">Prescription Medications</h2>
              <Row className="pharmacy-Row">
                {filteredPrescriptionMedications.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pharmacy-Card">
                      <div className="pharmacy-Card-img-container">
                        <Card.Img variant="top" src={product.image} className="pharmacy-Card-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pharmacy-Card-body">
                        <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
                        <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
                        <Card.Text className="pharmacy-Price-text">Price: ${product.price}</Card.Text>
                        <div className="pharmacy-Btn-group">
                          <Button
                            variant="warning"
                            className="pharmacy-Btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            className="pharmacy-Btn-delete"
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
              <hr className='pharmacy-hr' />
            </>
          )}

          {/* Medicines Section */}
          {filteredMedicationsSupplements.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">OTC Medications & Supplements</h2>
              <Row className="pharmacy-Row">
                {filteredMedicationsSupplements.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pharmacy-Card">
                      <div className="pharmacy-Card-img-container">
                        <Card.Img variant="top" src={product.image} className="pharmacy-Card-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pharmacy-Card-body">
                        <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
                        <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
                        <Card.Text className="pharmacy-Price-text">Price: ${product.price}</Card.Text>
                        <div className="pharmacy-Btn-group">
                          <Button
                            variant="warning"
                            className="pharmacy-Btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            className="pharmacy-Btn-delete"
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
              <hr className='pharmacy-hr' />
            </>
          )}

          {/* Medications Section */}
          {filteredGroomingHygiene.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">Grooming & Hygiene</h2>
              <Row className="pharmacy-Row">
                {filteredGroomingHygiene.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pharmacy-Card">
                      <div className="pharmacy-Card-img-container">
                        <Card.Img variant="top" src={product.image} className="pharmacy-Card-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pharmacy-Card-body">
                        <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
                        <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
                        <Card.Text className="pharmacy-Price-text">Price: ${product.price}</Card.Text>
                        <div className="pharmacy-Btn-group">
                          <Button
                            variant="warning"
                            className="pharmacy-Btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            className="pharmacy-Btn-delete"
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
              <hr className='pharmacy-hr' />
            </>
          )}

          {/* Medicines Section */}
          {filteredPetFood.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">Grooming & Hygiene</h2>
              <Row className="pharmacy-Row">
                {filteredPetFood.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pharmacy-Card">
                      <div className="pharmacy-Card-img-container">
                        <Card.Img variant="top" src={product.image} className="pharmacy-Card-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pharmacy-Card-body">
                        <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
                        <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
                        <Card.Text className="pharmacy-Price-text">Price: ${product.price}</Card.Text>
                        <div className="pharmacy-Btn-group">
                          <Button
                            variant="warning"
                            className="pharmacy-Btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            className="pharmacy-Btn-delete"
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
              <hr className='pharmacy-hr' />
            </>
          )}

          {/* Medicines Section */}
          {filteredFirstAid.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">First Aid & Wound Care</h2>
              <Row className="pharmacy-Row">
                {filteredFirstAid.map((product) => (
                  <Col key={product.id} xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
                    <Card className="pharmacy-Card">
                      <div className="pharmacy-Card-img-container">
                        <Card.Img variant="top" src={product.image} className="pharmacy-Card-img-scale" alt={product.name} />
                      </div>
                      <Card.Body className="pharmacy-Card-body">
                        <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
                        <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
                        <Card.Text className="pharmacy-Price-text">Price: ${product.price}</Card.Text>
                        <div className="pharmacy-Btn-group">
                          <Button
                            variant="warning"
                            className="pharmacy-Btn-edit"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            className="pharmacy-Btn-delete"
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
              <hr className='pharmacy-hr' />
            </>
          )}

        </>
      )}

    </Container>
  );
};

export default ProductList;