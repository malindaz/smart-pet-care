import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/pharmacyAdmin.css";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pharmacy");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Search Filter
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorization Using an Object
  const categories = {
    "Prescription Medications": [],
    "OTC Medications & Supplements": [],
    "Grooming & Hygiene": [],
    "Pet Food & Specialized Diets": [],
    "First Aid & Wound Care": [],
  };

  filteredProducts.forEach((product) => {
    if (categories[product.category]) {
      categories[product.category].push(product);
    }
  });

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
      console.log("Attempting to delete product with ID:", productId);
      await axios.delete(`http://localhost:5000/api/pharmacy/${productId}`);
      setProducts((prevProducts) => prevProducts.filter(product => product._id !== productId));
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
        <Button variant="success" className="pharmacy-Add-btn" onClick={handleAddNew}>
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
        Object.entries(categories).map(([category, items]) =>
          items.length > 0 && (
            <div key={category}>
              <h2 className="pharmacy-Medications-title">{category}</h2>
              <Row className="pharmacy-Row">
                {items.map((product) => (
                  <ProductCard key={product._id} product={product} handleEdit={handleEdit} handleDelete={handleDelete} />
                ))}
              </Row>
              <hr className="pharmacy-hr" />
            </div>
          )
        )
      )}
    </Container>
  );
};

// Separate ProductCard Component
const ProductCard = ({ product, handleEdit, handleDelete }) => {

  // Image handling
  const getImageSrc = (image) => {
    if (!image) return "/placeholder-image.png"; // Fallback image
    if (image.startsWith("http") || image.startsWith("data:image")) return image;
    return `http://localhost:5000${image}`; // Ensure proper URL
  };



  return (
    <Col xs={12} sm={6} md={4} lg={3} className="pharmacy d-flex align-items-stretch">
      <Card className="pharmacy-Card">
        <div className="pharmacy-Card-img-container">
          <Card.Img
            variant="top"
            src={getImageSrc(product.image)}
            className="pharmacy-Card-img-scale"
            alt={product.name}
          />
        </div>
        <Card.Body className="pharmacy-Card-body">
          <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
          <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
          <Card.Text className="pharmacy-Price-text">Price: Rs.{product.price}</Card.Text>
          <div className="pharmacy-Btn-group">
            <Button variant="warning" className="pharmacy-Btn-edit" onClick={() => handleEdit(product)}>
              Edit
            </Button>
            <Button variant="danger" className="pharmacy-Btn-delete" onClick={() => handleDelete(product._id)}>
              Delete
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default ProductList;
