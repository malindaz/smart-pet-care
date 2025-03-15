import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CgSpinner } from "react-icons/cg";
import axios from 'axios';


const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            const response = await axios.post('http://localhost:5000/api/users/login', formData);
            
            if (response.data.success) {
                // Save token and user data
                localStorage.setItem('userToken', response.data.token);
                localStorage.setItem('userData', JSON.stringify(response.data.user));
                
                toast.success('Login successful!');
                
                // Redirect based on user level
                const userLevel = response.data.user.userLevel;
                switch(userLevel) {
                    case 1:
                        navigate('/admin-dashboard');
                        break;
                    case 2:
                        navigate('/veterinarian-dashboard');
                        break;
                    case 3:
                        navigate('/pharmacist-dashboard');
                        break;
                    default:
                        navigate('/dashboard');
                        break;
                }
            }
        } catch (error) {
            console.error('Login Error:', error);
            toast.error(error.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login_container">
            <div className="login_form_container">
                <h2>Welcome Back</h2>
                <form className="login_form" onSubmit={handleSubmit}>
                    <div className="login_form_group">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="login_form_group">
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="login_forgot_password">
                        <Link to="/forgot-password">Forgot password?</Link>
                    </div>

                    <button type="submit" className="login_submit_button" disabled={loading}>
                        {loading ? <CgSpinner className="login_spinner" /> : 'Login'}
                    </button>
                    
                    <div className="login_register_link">
                        Don't have an account? <Link to="/register">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;