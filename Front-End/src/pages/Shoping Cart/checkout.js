import React, { useState, useEffect } from 'react';
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

  // Scroll to top when this component loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  // Add validation states
  const [errors, setErrors] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    cardholderName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  });

  const [formTouched, setFormTouched] = useState({
    fullName: false,
    address: false,
    city: false,
    state: false,
    zipCode: false,
    phone: false,
    cardholderName: false,
    cardNumber: false,
    expiryMonth: false,
    expiryYear: false,
    cvv: false
  });

  const validateField = (name, value) => {
    let errorMessage = '';

    switch (name) {
      case 'fullName':
        if (!value.trim()) {
          errorMessage = 'Full name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMessage = 'Name should only contain letters';
        } else if (value.trim().length <= 5) {
          errorMessage = 'Name should be more than 5 letters';
        }
        break;

      case 'address':
        if (!value.trim()) {
          errorMessage = 'Address is required';
        } else if (value.length < 5) {
          errorMessage = 'Please enter a valid address';
        } else if (!/^[a-zA-Z0-9\s/,.-]+$/.test(value)) {
          errorMessage = 'Please enter a valid address';
        }
        break;

      case 'city':
        if (!value.trim()) {
          errorMessage = 'City is required';
        } else if (!/^[a-zA-Z\s,/-]+$/.test(value)) {
          errorMessage = 'Please enter a valid city name';
        }
        break;

      case 'state':
        if (!value.trim()) {
          errorMessage = 'State is required';
        } else if (!/^[a-zA-Z\s,/-]+$/.test(value)) {
          errorMessage = 'Please enter a valid state name';
        }
        break;

      case 'zipCode':
        if (!value.trim()) {
          errorMessage = 'Zip code is required';
        } else if (!/^\d{5,6}$/.test(value)) {
          errorMessage = 'Please enter a valid zip code';
        }
        break;

      case 'phone':
        if (!value.trim()) {
          errorMessage = 'Phone number is required';
        } else if (!/^0/.test(value)) {
          errorMessage = 'Phone number must start with 0';
        } else if (/[^\d]/.test(value)) {
          errorMessage = 'Invalid phone number';
        } else if (value.length !== 10) {
          errorMessage = 'Phone number must be exactly 10 digits long';
        }
        break;

      case 'cardholderName':
        if (!value.trim()) {
          errorMessage = 'Cardholder name is required';
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          errorMessage = 'Name should only contain letters';
        }
        break;

      case 'cardNumber':
        if (!value.trim()) {
          errorMessage = 'Card number is required';
        } else if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) {
          errorMessage = 'Please enter a valid 16-digit card number';
        }
        break;

      case 'expiryMonth':
        if (!value.trim()) {
          errorMessage = 'Month is required';
        } else if (/[^\d]/.test(value)) {
          errorMessage = 'Month cannot contain symbols or letters';
        } else {
          const month = parseInt(value, 10);
          if (isNaN(month) || month < 1 || month > 12) {
            errorMessage = 'Enter a valid month (1-12)';
          }
        }
        break;

      case 'expiryYear':
        if (!value.trim()) {
          errorMessage = 'Year is required';
        } else if (/[^\d]/.test(value)) {
          errorMessage = 'Month cannot contain symbols or letters';
        } else {
          const year = parseInt(value, 10);
          const currentYear = new Date().getFullYear();
          if (value.length === 2) {
            // For 2-digit year format
            const century = Math.floor(currentYear / 100) * 100;
            const fullYear = century + year;
            if (fullYear < currentYear) {
              errorMessage = 'Card has expired';
            }
          } else if (value.length === 4) {
            // For 4-digit year format
            if (year < currentYear) {
              errorMessage = 'Card has expired';
            }
          } else {
            errorMessage = 'Enter a valid year (YY or YYYY)';
          }
        }
        break;

      case 'cvv':
        if (!value.trim()) {
          errorMessage = 'CVV is required';
        } else if (/[^\d]/.test(value)) {
          errorMessage = 'Month cannot contain symbols or letters';
        } else if (!/^\d{3}$/.test(value)) {
          errorMessage = 'Enter a valid 3-digit CVV';
        }
        break;

      default:
        break;
    }

    return errorMessage;
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value
    });

    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });

    // Validate on change
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    // Special handling for card number formatting
    if (name === 'cardNumber') {
      const formattedValue = formatCardNumber(value);
      setPaymentDetails({
        ...paymentDetails,
        [name]: formattedValue
      });

      // Validate the unformatted value
      setErrors({
        ...errors,
        [name]: validateField(name, formattedValue)
      });
    } else if (name === 'phone') {
      // Format phone number
      const formattedValue = formatPhoneNumber(value);
      setPaymentDetails({
        ...paymentDetails,
        [name]: formattedValue
      });

      setErrors({
        ...errors,
        [name]: validateField(name, formattedValue)
      });
    } else {
      setPaymentDetails({
        ...paymentDetails,
        [name]: value
      });

      setErrors({
        ...errors,
        [name]: validateField(name, value)
      });
    }

    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setFormTouched({
      ...formTouched,
      [name]: true
    });

    // Validate on blur
    setErrors({
      ...errors,
      [name]: validateField(name, value)
    });
  };

  const formatCardNumber = (input) => {
    // Format card number as groups of 4 digits
    const value = input.replace(/\s/g, '').replace(/\D/g, '');
    const formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    return formattedValue;
  };

  const formatPhoneNumber = (input) => {
    // Format phone number as (XXX) XXX-XXXX
    const value = input.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length > 6) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3, 6)}-${value.slice(6, 10)}`;
    } else if (value.length > 3) {
      formattedValue = `${value.slice(0, 3)}-${value.slice(3)}`;
    }
    return formattedValue;
  };

  const validateForm = () => {
    // Validate all fields
    const newErrors = {};
    let isValid = true;

    // Validate shipping details
    Object.keys(shippingDetails).forEach(field => {
      const error = validateField(field, shippingDetails[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    // Validate payment details
    Object.keys(paymentDetails).forEach(field => {
      const error = validateField(field, paymentDetails[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    // Validate card expiry date
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

    let expiryYear = parseInt(paymentDetails.expiryYear, 10);
    if (paymentDetails.expiryYear.length === 2) {
      expiryYear = 2000 + expiryYear;
    }

    if (expiryYear === currentYear && parseInt(paymentDetails.expiryMonth, 10) < currentMonth) {
      newErrors.expiryMonth = 'Card has expired';
      isValid = false;
    }

    // Update all errors
    setErrors(newErrors);

    // Mark all fields as touched
    const allTouched = {};
    Object.keys(formTouched).forEach(field => {
      allTouched[field] = true;
    });
    setFormTouched(allTouched);

    return isValid;
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

  return (
    <>
      <NavBar />
      <div className="checkout-page-wrapper">
        <h1 className="checkout-title">Checkout</h1>
        <Container className="checkout-container">
          <Form onSubmit={handleSubmit} noValidate>

            <Row className="checkout-content">
              {/* Left side - Shipping Details */}
              <Col md={6} className="checkout-shipping">
                <h2 className="checkout-h2">Shipping details</h2>
                {/* Full Name */}
                <div className="checkout-form-group">
                  <Form.Label className="checkout-label">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    className={`checkout-input checkout-name ${formTouched.fullName && errors.fullName ? 'is-invalid' : ''}`}
                    placeholder="Enter your full name"
                    value={shippingDetails.fullName}
                    onChange={handleShippingChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formTouched.fullName && errors.fullName &&
                    <div className="invalid-feedback">{errors.fullName}</div>
                  }
                </div>

                <div className="checkout-form-group">
                  <Form.Label className="checkout-label">Address</Form.Label>
                  <Form.Control
                    type="textarea"
                    name="address"
                    className={`checkout-input checkout-address ${formTouched.address && errors.address ? 'is-invalid' : ''}`}
                    placeholder="Enter your address"
                    value={shippingDetails.address}
                    onChange={handleShippingChange}
                    onBlur={handleBlur}
                    required
                  />
                  {formTouched.address && errors.address &&
                    <div className="invalid-feedback">{errors.address}</div>
                  }
                </div>

                <Row>
                  <Col md={6}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">City</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        className={`checkout-input checkout-city ${formTouched.city && errors.city ? 'is-invalid' : ''}`}
                        placeholder="City"
                        value={shippingDetails.city}
                        onChange={handleShippingChange}
                        onBlur={handleBlur}
                        required
                      />
                      {formTouched.city && errors.city &&
                        <div className="invalid-feedback">{errors.city}</div>
                      }
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">State</Form.Label>
                      <Form.Control
                        type="text"
                        name="state"
                        className={`checkout-input checkout-state ${formTouched.state && errors.state ? 'is-invalid' : ''}`}
                        placeholder="State"
                        value={shippingDetails.state}
                        onChange={handleShippingChange}
                        onBlur={handleBlur}
                        required
                      />
                      {formTouched.state && errors.state &&
                        <div className="invalid-feedback">{errors.state}</div>
                      }
                    </div>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">Zip Code</Form.Label>
                      <Form.Control
                        type="number"
                        name="zipCode"
                        className={`checkout-input checkout-zip-code ${formTouched.zipCode && errors.zipCode ? 'is-invalid' : ''}`}
                        placeholder="Zip Code"
                        value={shippingDetails.zipCode}
                        onChange={handleShippingChange}
                        onBlur={handleBlur}
                        required
                      />
                      {formTouched.zipCode && errors.zipCode &&
                        <div className="invalid-feedback">{errors.zipCode}</div>
                      }
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">Phone</Form.Label>
                      <Form.Control
                        type="number"
                        name="phone"
                        className={`checkout-input checkout-phone-number ${formTouched.phone && errors.phone ? 'is-invalid' : ''}`}
                        placeholder="Phone number"
                        value={shippingDetails.phone}
                        onChange={handleShippingChange}
                        onBlur={handleBlur}
                        required
                      />
                      {formTouched.phone && errors.phone &&
                        <div className="invalid-feedback">{errors.phone}</div>
                      }
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
                    <Form.Control
                      type="text"
                      name="cardholderName"
                      className={`checkout-input checkout-cardholder ${formTouched.cardholderName && errors.cardholderName ? 'is-invalid' : ''}`}
                      placeholder="Name on card"
                      value={paymentDetails.cardholderName}
                      onChange={handlePaymentChange}
                      onBlur={handleBlur}
                      required
                    />
                    {formTouched.cardholderName && errors.cardholderName &&
                      <div className="invalid-feedback">{errors.cardholderName}</div>
                    }
                  </div>
                </div>

                <div className="checkout-form-group">
                  <Form.Label className="checkout-label">Card Number</Form.Label>
                  <div className="checkout-input-icon">
                    <Form.Control
                      type="text"
                      name="cardNumber"
                      className={`checkout-input checkout-cardnumber ${formTouched.cardNumber && errors.cardNumber ? 'is-invalid' : ''}`}
                      placeholder="1234 5678 9012 3456"
                      value={paymentDetails.cardNumber}
                      onChange={handlePaymentChange}
                      onBlur={handleBlur}
                      maxLength="19"
                      required
                    />
                    {formTouched.cardNumber && errors.cardNumber &&
                      <div className="invalid-feedback">{errors.cardNumber}</div>
                    }
                  </div>
                </div>

                <Row className="align-items-center">
                  <Col md={6} xs={12}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">Expiry Month</Form.Label>
                      <Form.Control
                        type="number"
                        name="expiryMonth"
                        className={`checkout-input checkout-month ${formTouched.expiryMonth && errors.expiryMonth ? 'is-invalid' : ''}`}
                        placeholder="MM"
                        value={paymentDetails.expiryMonth}
                        onChange={handlePaymentChange}
                        onBlur={handleBlur}
                        maxLength="2"
                        required
                      />
                      {formTouched.expiryMonth && errors.expiryMonth && (
                        <div className="invalid-feedback">{errors.expiryMonth}</div>
                      )}
                    </div>
                  </Col>

                  <Col md={6} xs={12}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">Expiry Year</Form.Label>
                      <Form.Control
                        type="number"
                        name="expiryYear"
                        className={`checkout-input checkout-year ${formTouched.expiryYear && errors.expiryYear ? 'is-invalid' : ''}`}
                        placeholder="YY"
                        value={paymentDetails.expiryYear}
                        onChange={handlePaymentChange}
                        onBlur={handleBlur}
                        maxLength="4"
                        required
                      />
                      {formTouched.expiryYear && errors.expiryYear && (
                        <div className="invalid-feedback">{errors.expiryYear}</div>
                      )}
                    </div>
                  </Col>
                </Row>

                <Row className="align-items-center">
                  <Col md={12} xs={12}>
                    <div className="checkout-form-group">
                      <Form.Label className="checkout-label">CVV</Form.Label>
                      <Form.Control
                        type="number"
                        name="cvv"
                        className={`checkout-input checkout-cvv ${formTouched.cvv && errors.cvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        value={paymentDetails.cvv}
                        onChange={handlePaymentChange}
                        onBlur={handleBlur}
                        maxLength="3"
                        required
                      />
                      {formTouched.cvv && errors.cvv && (
                        <div className="invalid-feedback">{errors.cvv}</div>
                      )}
                    </div>
                  </Col>
                </Row>
                <div className="checkout-total">
                  <div className="checkout-amount">
                    <span>Payment amount:</span>
                    <span className="checkout-price">Rs. {total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="checkout-button-container">
                  <Button type="submit" className="checkout-pay-button">
                    PAY
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;