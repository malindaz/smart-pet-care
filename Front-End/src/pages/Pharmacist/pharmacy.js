import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import NavBar from "../../components/NavBar";
import "../../css/Pharmacy/pharmacy.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); // Hook for navigation

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

  const getImageSrc = (image) => {
    if (!image) return "/placeholder-image.png"; // Fallback image
    if (image.startsWith("http") || image.startsWith("data:image")) return image;
    return `http://localhost:5000${image}`; // Ensure proper URL
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } });
  };

  return (
    <>
      <NavBar />
      <Container className="pharmacy-Container">
        <h1 className="pharmacy-h1">Pharmacy Products</h1>
        
        <div className="pharmacy-Search-bar">
          <input
            type="text"
            placeholder="Search"
            className="pharmacy-Form-control"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
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
                    <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="pharmacy-align-items-stretch">
                      <Card className="pharmacy-Card">
                        <div className="pharmacy-Card-img-container">
                          <Card.Img variant="top" src={getImageSrc(product.image)} className="pharmacy-Card-img-scale" alt={product.name} />
                        </div>
                        <Card.Body className="pharmacy-Card-body">
                          <Card.Title className="pharmacy-Card-title">{product.name}</Card.Title>
                          <Card.Text className="pharmacy-Card-text">{product.description}</Card.Text>
                          <Card.Text className="pharmacy-Price-text">Rs. {product.price}</Card.Text>
                          <Button variant="primary" className="pharmacy-Btn-primary">Add to Cart</Button>
                          <Button 
                            variant="success" 
                            className="pharmacy-Btn-buy-now mt-2" 
                            onClick={() => handleBuyNow(product)}
                          >
                            Buy Now
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <hr className='pharmacy-hr' />
              </div>
            )
          )
        )}
      </Container>
    </>
  );
};

export default ProductList;
