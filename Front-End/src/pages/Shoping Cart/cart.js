import React, { useEffect } from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Shoping Cart/cartContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import '../../css/Shoping Cart/cart.css';

const Cart = () => {
  const navigate = useNavigate(); // Hook to programmatically navigate between routes
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart(); // Extracting cart-related functions from context

  // Scroll to the top when this component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Function to handle checkout process
  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.'); // Alert if cart is empty
      return;
    }
    navigate('/checkout', { state: { cart, cartTotal } }); // Navigate to checkout page with cart details
  };

  // Function to get product image source
  const getImageSrc = (image) => {
    if (!image) return "/placeholder-image.png"; // Default placeholder image
    if (image.startsWith("http") || image.startsWith("data:image")) return image; // If image URL is absolute
    return `http://localhost:5000${image}`; // Otherwise, prepend server URL
  };

  return (
    <>
      <NavBar />
      <Container className="cart-page-wrapper">
        <h1 className="cart-h1">Your Shopping Cart</h1>
        <Container className="cart-container">
          {/* Display message if cart is empty */}
          {cart.length === 0 ? (
            <div className="cart-empty">
              <h3 className="cart-empty-text">Your cart is empty</h3>
              <Button className="cart-btn-primary" onClick={() => navigate('/pharmacy')}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <div className="cart-content">
              <div className="cart-items">
                <Table responsive className="cart-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item) => (
                      <tr key={item._id}>
                        <td>
                          <img src={getImageSrc(item.image)} alt={item.name} className="cart-img" />
                        </td>
                        <td>{item.name}</td>
                        <td>Rs. {item.price.toFixed(2)}</td>
                        <td>
                          <div className="cart-quantity">
                            <Button className="cart-btn-secondary" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                              <FaMinus />
                            </Button>
                            <span className="cart-quantity-text">{item.quantity}</span>
                            <Button className="cart-btn-secondary" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                              <FaPlus />
                            </Button>
                          </div>
                        </td>
                        <td>Rs. {(item.price * item.quantity).toFixed(2)}</td>
                        <td>
                          <Button className="cart-btn-remove" onClick={() => removeFromCart(item._id)}>
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <div className="cart-actions">
                  <Button className="cart-btn-danger" onClick={clearCart}>
                    Clear Cart
                  </Button>
                  <Button className="cart-btn-primary" onClick={() => navigate('/pharmacy')}>
                    Continue Shopping
                  </Button>
                </div>
              </div>

              {/* Order summary section */}
              <div className="cart-summary">
                <Card>
                  <Card.Body>
                    <Card.Title className="cart-summary-title">Order Summary</Card.Title>
                    <div className="cart-summary-details">
                      <div>
                        <span>Items ({cart.reduce((sum, item) => sum + item.quantity, 0)}):</span>
                        <span>Rs. {cartTotal.toFixed(2)}</span>
                      </div>
                      <div>
                        <span>Discount:</span>
                        <span>Rs. 0.00</span>
                      </div>
                      <hr />
                      <div className="cart-summary-total">
                        <strong>Total:</strong>
                        <strong>Rs. {cartTotal.toFixed(2)}</strong>
                      </div>
                    </div>

                    <Button className="cart-btn-success" onClick={handleCheckout}>
                      Proceed to Checkout
                    </Button>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Container>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
