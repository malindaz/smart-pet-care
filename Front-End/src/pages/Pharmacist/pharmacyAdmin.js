import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/Pharmacy/pharmacyAdmin.css";
import Footer from "../../components/Footer";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PmcyAdminNavBar from "../../components/pharmacy-admin-navbar";

const ProductList = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const MySwal = withReactContent(Swal);

  
  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, []);

  // Scroll to top when this component loads
  useEffect(() => {
    window.scrollTo(0, 0);
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
    MySwal.fire({
      className: "pharmacy-admin-alart",
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:5000/api/pharmacy/${productId}`, {
            method: "DELETE",
          });
  
          if (response.ok) {
            // Update local state to reflect the deletion
            setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
  
            // Show success message
            toast.success("Product deleted successfully!", {
              className: "pharmacyAdmin-tosat",
              position: "top-right",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "colored",
            });
  
            // Optionally, refresh the products list
            // fetchProducts();  // Uncomment this if you prefer to refresh the entire list from the backend
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      }
    });
  };
  
  


  return (
    <>
      <PmcyAdminNavBar />
      <Container className="pharmacy-Container">
        <h1 className="pharmacy-h1">Pharmacy Admin Panel</h1>

        {/* Search and Add New */}
        <div className="pharmacy-Header-controls">
          <div className="pharmacy-Search-bar">
            <input
              type="text"
              placeholder="Search"
              className="pharmacy-Form-control"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <Container className="pharmacy-content">
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
      </Container>
      <Footer />
    </>
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
          <Card.Text className="pharmacy-Price-text">Rs. {product.price}</Card.Text>
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
