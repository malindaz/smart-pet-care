import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faPen,
    faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import PmcyAdminNavBar from "../../components/pharmacy-admin-navbar";
import Footer from '../../components/Footer';
import "../../css/Pharmacy/pharmacistDashboard.css";

const AdminDashboard = () => {
    // Sample data for quick stats
    const stats = [
        { title: "Total Products", value: "384", trend: "+12" },
        { title: "Low Stock Items", value: "24", trend: "-3" },
        { title: "Orders Today", value: "47", trend: "+5" }
    ];

    return (
        <div className="pharm-main-container">
            <PmcyAdminNavBar />

            <div className="pharm-content-wrapper">
                {/* Header Section */}
                <div className="pharm-header-section">
                    <div className="pharm-header-info">
                        <h1 className="pharm-page-title">Pharmacist Dashboard</h1>
                        <p className="pharm-subtitle">Manage your inventory and products</p>
                    </div>
                    <div className="pharm-action-buttons">
                        <Link to="/pharmacy-edit" className="pharm-card-link">
                            <button className="pharm-add-btn">
                                <FontAwesomeIcon icon={faPlus} className="pharm-btn-icon" />
                                Quick Add Product
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="pharm-stats-grid">
                    {stats.map((stat, index) => (
                        <div key={index} className="pharm-stat-card">
                            <h3 className="pharm-stat-title">{stat.title}</h3>
                            <div className="pharm-stat-values">
                                <span className="pharm-stat-number">{stat.value}</span>
                                <span className={`pharm-stat-trend ${stat.trend.startsWith('+') ? 'pharm-trend-positive' : 'pharm-trend-negative'}`}>
                                    {stat.trend}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Actions Grid */}
                <div className="pharm-actions-grid">
                    {/* Card 1 - Add Products */}
                    <Link to="/pharmacy-edit" className="pharm-card-link">
                        <div className="pharm-action-card pharm-add-card">
                            <div className="pharm-card-accent pharm-accent-blue"></div>
                            <div className="pharm-card-content">
                                <div className="pharm-card-header">
                                    <div className="pharm-icon-container pharm-icon-blue">
                                        <FontAwesomeIcon icon={faPlus} className="pharm-card-icon" />
                                    </div>
                                    <div className="pharm-arrow-indicator">
                                        <svg className="pharm-arrow-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="pharm-card-title">Add Products</h2>
                                <p className="pharm-card-description">Add new medications and healthcare products to your inventory</p>
                                <div className="pharm-card-footer pharm-footer-blue">
                                    <span className="pharm-card-action">Get started</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 2 - Modify Products */}
                    <Link to="/pharmacyAdmin" className="pharm-card-link">
                        <div className="pharm-action-card pharm-modify-card">
                            <div className="pharm-card-accent pharm-accent-purple"></div>
                            <div className="pharm-card-content">
                                <div className="pharm-card-header">
                                    <div className="pharm-icon-container pharm-icon-purple">
                                        <FontAwesomeIcon icon={faPen} className="pharm-card-icon" />
                                    </div>
                                    <div className="pharm-arrow-indicator">
                                        <svg className="pharm-arrow-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="pharm-card-title">Modify Products</h2>
                                <p className="pharm-card-description">Update prices, descriptions, or remove existing products</p>
                                <div className="pharm-card-footer pharm-footer-purple">
                                    <span className="pharm-card-action">Manage inventory</span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Card 3 - Inventory Analytics */}
                    <Link to="/inventory-analytics" className="pharm-card-link">
                        <div className="pharm-action-card pharm-analytics-card">
                            <div className="pharm-card-accent pharm-accent-green"></div>
                            <div className="pharm-card-content">
                                <div className="pharm-card-header">
                                    <div className="pharm-icon-container pharm-icon-green">
                                        <FontAwesomeIcon icon={faChartLine} className="pharm-card-icon" />
                                    </div>
                                    <div className="pharm-arrow-indicator">
                                        <svg className="pharm-arrow-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <h2 className="pharm-card-title">Inventory Analytics</h2>
                                <p className="pharm-card-description">View detailed reports and insights about your pharmacy inventory</p>
                                <div className="pharm-card-footer pharm-footer-green">
                                    <span className="pharm-card-action">View reports</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default AdminDashboard;