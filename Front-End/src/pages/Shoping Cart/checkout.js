import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../Shoping Cart/cartContext';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import { FaCreditCard, FaUser, FaMapMarkerAlt } from 'react-icons/fa';
import '../../css/Shoping Cart/checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, cartTotal, clearCart } = useCart();

  // If coming from Buy Now, use that product, otherwise use cart
  const products = location.state?.product ? [{ ...location.state.product, quantity: 1 }] : cart;
  const total = location.state?.product ? location.state.product.price : cartTotal;

  const [shippingDetails, setShippingDetails] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const handleShippingChange = (e) => {
    setShippingDetails({
      ...shippingDetails,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate form data
    if (!validateForm()) {
      return;
    }

    // Process payment
    alert('Payment processed successfully! Your order is confirmed.');
    clearCart();
    navigate('/pharmacy');
  };

  const validateForm = () => {
    // Basic validation
    if (!shippingDetails.fullName || !shippingDetails.address || !shippingDetails.city ||
      !shippingDetails.state || !shippingDetails.zipCode || !shippingDetails.phone) {
      alert('Please fill in all shipping details');
      return false;
    }

    if (!paymentDetails.cardholderName || !paymentDetails.cardNumber ||
      !paymentDetails.expiryMonth || !paymentDetails.expiryYear || !paymentDetails.cvv) {
      alert('Please fill in all payment details');
      return false;
    }

    // Card number validation (16 digits)
    if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
      alert('Please enter a valid 16-digit card number');
      return false;
    }

    // CVV validation (3 digits)
    if (!/^\d{3}$/.test(paymentDetails.cvv)) {
      alert('Please enter a valid 3-digit CVV');
      return false;
    }

    return true;
  };

  const formatCardNumber = (input) => {
    // Format card number as groups of 4 digits
    const value = input.replace(/\s/g, '').replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    return formattedValue;
  };

  return (
    <>
      <NavBar />
      <Container className="checkout-container">
        <Form onSubmit={handleSubmit}>
          <Row className="checkout-content">
            {/* Left side - Shipping Details */}
            <Col md={6} className="checkout-shipping">
              <h2 className="checkout-h2">Shipping details</h2>
              <div className="checkout-form-group">
                <Form.Label className="checkout-label">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  className="checkout-input"
                  placeholder="Enter your full name"
                  value={shippingDetails.fullName}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <div className="checkout-form-group">
                <Form.Label className="checkout-label">Address</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  className="checkout-input"
                  placeholder="Enter your address"
                  value={shippingDetails.address}
                  onChange={handleShippingChange}
                  required
                />
              </div>

              <Row>
                <Col md={6}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">City</Form.Label>
                    <Form.Control
                      type="text"
                      name="city"
                      className="checkout-input"
                      placeholder="City"
                      value={shippingDetails.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">State</Form.Label>
                    <Form.Control
                      type="text"
                      name="state"
                      className="checkout-input"
                      placeholder="State"
                      value={shippingDetails.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">Zip Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="zipCode"
                      className="checkout-input"
                      placeholder="Zip Code"
                      value={shippingDetails.zipCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      className="checkout-input"
                      placeholder="Phone number"
                      value={shippingDetails.phone}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </Col>
              </Row>
            </Col>

            {/* Right side - Payment Details */}
            <Col md={6} className="checkout-payment">
              <h2 className="checkout-h2">Payment details</h2>

              <div className="checkout-form-group">
                <Form.Label className="checkout-label">Cardholder Name</Form.Label>
                <div className="checkout-input-icon">
                  <FaUser className="checkout-icon" />
                  <Form.Control
                    type="text"
                    name="cardholderName"
                    className="checkout-input"
                    placeholder="Name on card"
                    value={paymentDetails.cardholderName}
                    onChange={handlePaymentChange}
                    required
                  />
                </div>
              </div>

              <div className="checkout-form-group">
                <Form.Label className="checkout-label">Card Number</Form.Label>
                <div className="checkout-input-icon">
                  <FaCreditCard className="checkout-icon" />
                  <Form.Control
                    type="text"
                    name="cardNumber"
                    className="checkout-input"
                    placeholder="1234 5678 9012 3456"
                    value={paymentDetails.cardNumber}
                    onChange={(e) => {
                      const formattedValue = formatCardNumber(e.target.value);
                      setPaymentDetails({
                        ...paymentDetails,
                        cardNumber: formattedValue
                      });
                    }}
                    maxLength="19"
                    required
                  />
                </div>
              </div>

              <Row>
                <Col md={4}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">Expiry Month</Form.Label>
                    <Form.Control
                      type="text"
                      name="expiryMonth"
                      className="checkout-input"
                      placeholder="MM"
                      value={paymentDetails.expiryMonth}
                      onChange={handlePaymentChange}
                      maxLength="2"
                      required
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">Expiry Year</Form.Label>
                    <Form.Control
                      type="text"
                      name="expiryYear"
                      className="checkout-input"
                      placeholder="YY"
                      value={paymentDetails.expiryYear}
                      onChange={handlePaymentChange}
                      maxLength="4"
                      required
                    />
                  </div>
                </Col>
                <Col md={4}>
                  <div className="checkout-form-group">
                    <Form.Label className="checkout-label">CVV</Form.Label>
                    <Form.Control
                      type="password"
                      name="cvv"
                      className="checkout-input"
                      placeholder="123"
                      value={paymentDetails.cvv}
                      onChange={handlePaymentChange}
                      maxLength="3"
                      required
                    />
                  </div>
                </Col>
              </Row>

              <div className="checkout-total">
                <div className="checkout-amount">
                  <span>Payment amount:</span>
                  <span className="checkout-price">Rs. {total.toFixed(2)}</span>
                </div>
              </div>

              <Button type="submit" className="checkout-pay-button">
                PAY
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
      <Footer />
    </>
  );
};

export default Checkout;