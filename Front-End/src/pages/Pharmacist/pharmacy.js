import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Shoping Cart/cartContext";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import "../../css/Pharmacy/pharmacy.css";

const ProductList = () => {
  // State to store fetched product data
  const [products, setProducts] = useState([]);
  
  // State to handle search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Hook for navigation
  const navigate = useNavigate();

  // Access cart context for adding items to the cart
  const { addToCart } = useCart();

  // Fetch products when the component mounts
  useEffect(() => {
    fetchProducts();
  }, []);

  
  // Function to fetch pharmacy product data from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/pharmacy");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Function to get the appropriate image source for each product
  const getImageSrc = (image) => {
    if (!image) return "/placeholder-image.png"; // Fallback image
    if (image.startsWith("http") || image.startsWith("data:image")) return image; // Absolute URL
    return `http://localhost:5000${image}`; // Relative path from the backend
  };

  // Filtering products based on user search input
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Categorizing products into predefined pharmacy categories
  const categories = {
    "Prescription Medications": [],
    "OTC Medications & Supplements": [],
    "Grooming & Hygiene": [],
    "Pet Food & Specialized Diets": [],
    "First Aid & Wound Care": [],
  };

  // Assigning products to their respective categories
  filteredProducts.forEach((product) => {
    if (categories[product.category]) {
      categories[product.category].push(product);
    }
  });

  // Function to handle "Buy Now" button click, navigating to checkout
  const handleBuyNow = (product) => {
    navigate("/checkout", { state: { product } });
  };

  return (
    <>
      <NavBar />
      <Container className="pharmacy-Container">
        <h1 className="pharmacy-h1">Pharmacy Products</h1>
        
        {/* Search Bar */}
        <div className="pharmacy-Search-bar">
          <input
            type="text"
            placeholder="Search"
            className="pharmacy-Form-control"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Display message if no products match the search criteria */}
        {filteredProducts.length === 0 ? (
          <div className="pharmacy-no-items-found">
            <h3>No Items Found</h3>
          </div>
        ) : (
          /* Rendering products categorized into sections */
          Object.entries(categories).map(([category, items]) =>
            items.length > 0 && (
              <div key={category}>
                <h2 className="pharmacy-Medications-title">{category}</h2>
                <Row className="pharmacy-Row">
                  {items.map((product) => (
                    <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="pharmacy-align-items-stretch">
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
                          <Card.Text className="pharmacy-Price-text">Rs. {product.price}</Card.Text>
                          
                          {/* Add to Cart Button */}
                          <Button 
                            variant="primary" 
                            className="pharmacy-Btn-primary" 
                            onClick={() => addToCart(product)}
                          >
                            Add to Cart
                          </Button>

                          {/* Buy Now Button */}
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
      <Footer/>
    </>
  );
};

export default ProductList;
