import React from 'react';
import { Container, Table, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../Shoping Cart/cartContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import '../../css/Shoping Cart/cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }
    navigate('/checkout', { state: { cart, cartTotal } });
  };

  const getImageSrc = (image) => {
    if (!image) return "/placeholder-image.png";
    if (image.startsWith("http") || image.startsWith("data:image")) return image;
    return `http://localhost:5000${image}`;
  };

  return (
    <>
      <NavBar />
      <Container className="cart-container">
        <h1 className="cart-h1">Your Shopping Cart</h1>

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
                        <Button className="cart-btn-danger" onClick={() => removeFromCart(item._id)}>
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
      <Footer />
    </>
  );
};

export default Cart;
