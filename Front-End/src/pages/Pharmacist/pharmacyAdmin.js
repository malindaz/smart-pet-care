import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/pharmacyAdmin.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from the backend API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pharmacy"); // Adjust URL as needed
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Search Filter
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Explicit Categorization
  const filteredPrescriptionMedications = filteredProducts.filter(
    (product) => product.category === "Prescription Medications"
  );

  const filteredMedicationsSupplements = filteredProducts.filter(
    (product) => product.category === "OTC Medications & Supplements"
  );

  const filteredGroomingHygiene = filteredProducts.filter(
    (product) => product.category === "Grooming & Hygiene"
  );

  const filteredPetFood = filteredProducts.filter(
    (product) => product.category === "Pet Food & Specialized Diets"
  );

  const filteredFirstAid = filteredProducts.filter(
    (product) => product.category === "First Aid & Wound Care"
  );

  // Navigate to add new product form
  const handleAddNew = () => {
    navigate("/pharmacy-edit", { state: { editMode: false } });
  };  

  // Navigate to edit product form
  const handleEdit = (product) => {
    navigate("/pharmacy-edit", { state: { editMode: true, product } });
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    try {
        console.log("Attempting to delete product with ID:",); // Debugging

        const response = await fetch(`http://localhost:5000/api/pharmacy/${productId}`, {
            method: 'DELETE',
        });
        
        // Optionally, update the state to remove the deleted product from UI
        setProducts((prevProducts) => prevProducts.filter(product => product.id !== productId));
    } catch (error) {
        console.error('Error deleting product:', error.message);
        alert(`Error deleting product (ID: ${productId}): ${error.message}`);
    }
};




  return (
    <Container className="pharmacy-Container">
      <h1 className="pharmacy-h1">Pharmacy Admin Panel</h1>

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

      {/* No items found */}
      {filteredProducts.length === 0 ? (
        <div className="pharmacy-no-items-found">
          <h3>No Items Found</h3>
        </div>
      ) : (
        <>
          {/* Prescription Medications Section */}
          {filteredPrescriptionMedications.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">Prescription Medications</h2>
              <Row className="pharmacy-Row">
                {filteredPrescriptionMedications.map((product) => (
                  <ProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </Row>
              <hr className="pharmacy-hr" />
            </>
          )}

          {/* OTC Medications & Supplements Section */}
          {filteredMedicationsSupplements.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">OTC Medications & Supplements</h2>
              <Row className="pharmacy-Row">
                {filteredMedicationsSupplements.map((product) => (
                  <ProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </Row>
              <hr className="pharmacy-hr" />
            </>
          )}

          {/* Grooming & Hygiene Section */}
          {filteredGroomingHygiene.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">Grooming & Hygiene</h2>
              <Row className="pharmacy-Row">
                {filteredGroomingHygiene.map((product) => (
                  <ProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </Row>
              <hr className="pharmacy-hr" />
            </>
          )}

          {/* Pet Food & Specialized Diets Section */}
          {filteredPetFood.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">Pet Food & Specialized Diets</h2>
              <Row className="pharmacy-Row">
                {filteredPetFood.map((product) => (
                  <ProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </Row>
              <hr className="pharmacy-hr" />
            </>
          )}

          {/* First Aid & Wound Care Section */}
          {filteredFirstAid.length > 0 && (
            <>
              <h2 className="pharmacy-Medications-title">First Aid & Wound Care</h2>
              <Row className="pharmacy-Row">
                {filteredFirstAid.map((product) => (
                  <ProductCard key={product.id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </Row>
              <hr className="pharmacy-hr" />
            </>
          )}
        </>
      )}
    </Container>
  );
};

// Separate ProductCard Component for Cleaner Code
const ProductCard = ({ product, handleEdit, handleDelete }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="d-flex align-items-stretch">
      <Card className="pharmacy-Card">
        <div className="pharmacy-Card-img-container">
          <Card.Img
            variant="top"
            src={product.image}
            className="pharmacy-Card-img-scale"
            alt={product.name}
          />
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
              onClick={() => handleDelete(product._id)}
            >
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductList;
