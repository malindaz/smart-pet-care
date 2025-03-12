import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../../css/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetData, setResetData] = useState({
    email: '',
    phoneNumber: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [resetStep, setResetStep] = useState(1);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleResetChange = (e) => {
    setResetData({
      ...resetData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        localStorage.setItem('token', data.token);
        toast.success('Login successful!');
        navigate('/');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email,
          phoneNumber: resetData.phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success('Verification code sent!');
        setResetStep(2);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to send verification code. Please try again.');
    }
  };

  const handleVerifyAndReset = async (e) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: resetData.email,
          verificationCode: resetData.verificationCode,
          newPassword: resetData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        toast.success('Password reset successful!');
        setShowForgotPassword(false);
        setResetStep(1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Password reset failed. Please try again.');
    }
  };

  return (
    <div className="login_container">
      {!showForgotPassword ? (
        <div className="login_form_container">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="login_form">
            <div className="login_form_group">
              <input
                type="text"
                name="identifier"
                value={formData.identifier}
                onChange={handleChange}
                placeholder="Username or Email"
                required
              />
            </div>
            <div className="login_form_group">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                required
              />
            </div>
            <button type="submit" className="login_submit_button">
              Login
            </button>
          </form>
          <div className="login_links">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="login_forgot_button"
            >
              Forgot Password?
            </button>
            <Link to="/register" className="login_register_link">
              Don't have an account? Sign up
            </Link>
          </div>
        </div>
      ) : (
        <div className="login_form_container">
          <h2>Reset Password</h2>
          <form
            onSubmit={resetStep === 1 ? handleForgotPassword : handleVerifyAndReset}
            className="login_form"
          >
            {resetStep === 1 ? (
              <>
                <div className="login_form_group">
                  <input
                    type="email"
                    name="email"
                    value={resetData.email}
                    onChange={handleResetChange}
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="login_form_group">
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={resetData.phoneNumber}
                    onChange={handleResetChange}
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="login_form_group">
                  <input
                    type="text"
                    name="verificationCode"
                    value={resetData.verificationCode}
                    onChange={handleResetChange}
                    placeholder="Verification Code"
                    required
                  />
                </div>
                <div className="login_form_group">
                  <input
                    type="password"
                    name="newPassword"
                    value={resetData.newPassword}
                    onChange={handleResetChange}
                    placeholder="New Password"
                    required
                  />
                </div>
                <div className="login_form_group">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={resetData.confirmPassword}
                    onChange={handleResetChange}
                    placeholder="Confirm New Password"
                    required
                  />
                </div>
              </>
            )}
            <button type="submit" className="login_submit_button">
              {resetStep === 1 ? 'Send Verification Code' : 'Reset Password'}
            </button>
          </form>
          <div className="login_links">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetStep(1);
              }}
              className="login_back_button"
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login; 