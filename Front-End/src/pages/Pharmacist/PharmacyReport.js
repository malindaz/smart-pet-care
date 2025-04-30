import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Form, Button, Card } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFilter, faChartBar, faExclamationTriangle, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PmcyAdminNavBar from "../../components/pharmacy-admin-navbar";
import Footer from '../../components/Footer';
import "../../css/Pharmacy/PharmacyReport.css";


// Define styles for PDF document
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#555',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 10,
    color: '#888',
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  statBox: {
    width: '23%',
    border: '1px solid #ddd',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  statTitle: {
    fontSize: 10,
    color: '#555',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterInfo: {
    fontSize: 10,
    marginBottom: 15,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableRowHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#f2f2f2',
  },
  tableColHeader: {
    width: '16.6%',
    padding: 5,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableCol: {
    width: '16.6%',
    padding: 5,
    fontSize: 8,
  },
  stockHighlight: {
    padding: 2,
    borderRadius: 2,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lowStock: {
    backgroundColor: '#f0ad4e',
  },
  outOfStock: {
    backgroundColor: '#d9534f',
  },
  inStock: {
    backgroundColor: '#5cb85c',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 20,
    right: 30,
    fontSize: 8,
    color: '#666',
  },
});

// Create PDF Document Component
const InventoryPdfDocument = ({ products, stats, filterInfo }) => {
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  
  return (
    <Document>
      <Page size="A4" style={pdfStyles.page} wrap>
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>Pharmacy Inventory Report</Text>
          <Text style={pdfStyles.subtitle}>Complete inventory analysis and product listing</Text>
          <Text style={pdfStyles.dateTime}>Generated on: {currentDate} at {currentTime}</Text>
        </View>
        
        {/* Stats Summary */}
        <View style={pdfStyles.statsContainer}>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statTitle}>Total Products</Text>
            <Text style={pdfStyles.statValue}>{stats.totalProducts}</Text>
          </View>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statTitle}>Total Value</Text>
            <Text style={pdfStyles.statValue}>Rs. {stats.totalValue}</Text>
          </View>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statTitle}>Low Stock Items</Text>
            <Text style={pdfStyles.statValue}>{stats.lowStockItems}</Text>
          </View>
          <View style={pdfStyles.statBox}>
            <Text style={pdfStyles.statTitle}>Average Price</Text>
            <Text style={pdfStyles.statValue}>Rs. {stats.averagePrice}</Text>
          </View>
        </View>
        
        {/* Filter Information */}
        <View style={pdfStyles.filterInfo}>
          <Text>Filters Applied: {filterInfo}</Text>
        </View>
        
        {/* Products Table */}
        <View style={pdfStyles.table}>
          {/* Table Header */}
          <View style={pdfStyles.tableRowHeader}>
            <Text style={pdfStyles.tableColHeader}>Product Name</Text>
            <Text style={pdfStyles.tableColHeader}>Category</Text>
            <Text style={pdfStyles.tableColHeader}>Price</Text>
            <Text style={pdfStyles.tableColHeader}>Stock</Text>
            <Text style={pdfStyles.tableColHeader}>Value</Text>
            <Text style={pdfStyles.tableColHeader}>Description</Text>
          </View>
          
          {/* Table Body */}
          {products.map((product, index) => (
            <View style={pdfStyles.tableRow} key={index}>
              <Text style={pdfStyles.tableCol}>{product.name}</Text>
              <Text style={pdfStyles.tableCol}>{product.category}</Text>
              <Text style={pdfStyles.tableCol}>Rs. {product.price}</Text>
              <Text style={[
                pdfStyles.tableCol, 
                pdfStyles.stockHighlight,
                product.stock === 0 ? pdfStyles.outOfStock : 
                product.stock < 10 ? pdfStyles.lowStock : pdfStyles.inStock
              ]}>
                {product.stock}
              </Text>
              <Text style={pdfStyles.tableCol}>Rs. {(product.price * product.stock).toFixed(2)}</Text>
              <Text style={pdfStyles.tableCol}>{product.description.substring(0, 30)}...</Text>
            </View>
          ))}
        </View>
        
        <Text style={pdfStyles.footer}>
          This is an automatically generated report from the Pharmacy Management System.
          For questions or support, please contact the system administrator.
        </Text>
        
        <Text style={pdfStyles.pageNumber} render={({ pageNumber, totalPages }) => (
          `Page ${pageNumber} of ${totalPages}`
        )} fixed />
      </Page>
    </Document>
  );
};

const InventoryAnalytics = () => {
    // State to store product data
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter states
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [priceRange, setPriceRange] = useState({ min: '', max: '' });
    const [stockFilter, setStockFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    
    // Summary stats
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalValue: 0,
        lowStockItems: 0,
        averagePrice: 0
    });
    
    // Get all available categories from products
    const categories = ['All', ...new Set(products.map(product => product.category))];
    
    // Fetch products when component mounts
    useEffect(() => {
        fetchProducts();
    }, []);
    
    // Calculate stats when products change
    useEffect(() => {
        if (products.length > 0) {
            calculateStats(products);
            setFilteredProducts(products);
        }
    }, [products]);
    
    // Update filtered products when filters change
    useEffect(() => {
        applyFilters();
    }, [categoryFilter, priceRange, stockFilter, searchTerm]);

    // Function to fetch product data
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:5000/api/pharmacy");
            // Add stock quantity for demo purposes
            const productsWithStock = response.data.map(product => ({
                ...product,
                stock: Math.floor(Math.random() * 100) // Random stock for demo
            }));
            setProducts(productsWithStock);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
            setLoading(false);
        }
    };
    
    // Calculate summary statistics
    const calculateStats = (productsList) => {
        const totalProducts = productsList.length;
        const totalValue = productsList.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const lowStockItems = productsList.filter(product => product.stock < 10).length;
        const averagePrice = totalProducts > 0 ? productsList.reduce((sum, product) => sum + product.price, 0) / totalProducts : 0;
        
        setStats({
            totalProducts,
            totalValue: totalValue.toFixed(2),
            lowStockItems,
            averagePrice: averagePrice.toFixed(2)
        });
    };
    
    // Apply all filters to the product list
    const applyFilters = () => {
        let filtered = [...products];
        
        // Apply category filter
        if (categoryFilter !== 'All') {
            filtered = filtered.filter(product => product.category === categoryFilter);
        }
        
        // Apply price range filter
        if (priceRange.min !== '') {
            filtered = filtered.filter(product => product.price >= parseInt(priceRange.min));
        }
        if (priceRange.max !== '') {
            filtered = filtered.filter(product => product.price <= parseInt(priceRange.max));
        }
        
        // Apply stock filter
        if (stockFilter === 'Low Stock') {
            filtered = filtered.filter(product => product.stock < 10);
        } else if (stockFilter === 'Out of Stock') {
            filtered = filtered.filter(product => product.stock === 0);
        }
        
        // Apply search term
        if (searchTerm) {
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        setFilteredProducts(filtered);
        calculateStats(filtered);
    };
    
    // Handle export to CSV
    const exportToCSV = () => {
        // Create CSV content
        const headers = ['ID', 'Name', 'Category', 'Price', 'Stock', 'Description'];
        const csvContent = [
            headers.join(','),
            ...filteredProducts.map(product => [
                product._id,
                `"${product.name.replace(/"/g, '""')}"`,
                `"${product.category}"`,
                product.price,
                product.stock,
                `"${product.description.replace(/"/g, '""')}"`
            ].join(','))
        ].join('\n');
        
        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'inventory_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Reset all filters
    const resetFilters = () => {
        setCategoryFilter('All');
        setPriceRange({ min: '', max: '' });
        setStockFilter('All');
        setSearchTerm('');
    };

    // Create a string describing applied filters for PDF export
    const getFilterDescription = () => {
        const filterParts = [];
        
        if (categoryFilter && categoryFilter !== 'All') {
            filterParts.push(`Category: ${categoryFilter}`);
        }
        
        if (priceRange.min || priceRange.max) {
            const priceFilter = `Price Range: ${priceRange.min || '0'} - ${priceRange.max || 'Any'}`;
            filterParts.push(priceFilter);
        }
        
        if (stockFilter && stockFilter !== 'All') {
            filterParts.push(`Stock Status: ${stockFilter}`);
        }
        
        if (searchTerm) {
            filterParts.push(`Search: "${searchTerm}"`);
        }
        
        return filterParts.length > 0 ? filterParts.join(' | ') : 'No filters applied';
    };

    return (
        <div className="pharm-main-container">
            <PmcyAdminNavBar />
            
            <div className="pharm-content-wrapper">
                {/* Header Section */}
                <div className="pharm-header-section">
                    <div className="pharm-header-info">
                        <h1 className="pharm-page-title">Inventory Analytics</h1>
                        <p className="pharm-subtitle">Generate reports and analyze your pharmacy inventory</p>
                    </div>
                    <div className="pharm-action-buttons">
                        <button onClick={exportToCSV} className="pharm-add-btn me-2">
                            <FontAwesomeIcon icon={faDownload} className="pharm-btn-icon" />
                            Export CSV
                        </button>
                        
                        {/* PDF Generator Button */}
                        <PDFDownloadLink
                            document={
                                <InventoryPdfDocument 
                                    products={filteredProducts} 
                                    stats={stats} 
                                    filterInfo={getFilterDescription()}
                                />
                            }
                            fileName="pharmacy_inventory_report.pdf"
                            className="pharm-add-btn"
                        >
                            {({ blob, url, loading, error }) => (
                                <>
                                    <FontAwesomeIcon icon={faFilePdf} className="pharm-btn-icon" />
                                    {loading ? 'Generating PDF...' : 'Download PDF Report'}
                                </>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
                
                {/* Stats Cards */}
                <div className="pharm-stats-grid">
                    <div className="pharm-stat-card">
                        <h3 className="pharm-stat-title">Total Products</h3>
                        <div className="pharm-stat-values">
                            <span className="pharm-stat-number">{stats.totalProducts}</span>
                        </div>
                    </div>
                    
                    <div className="pharm-stat-card">
                        <h3 className="pharm-stat-title">Total Inventory Value</h3>
                        <div className="pharm-stat-values">
                            <span className="pharm-stat-number">Rs. {stats.totalValue}</span>
                        </div>
                    </div>
                    
                    <div className="pharm-stat-card">
                        <h3 className="pharm-stat-title">Low Stock Items</h3>
                        <div className="pharm-stat-values">
                            <span className="pharm-stat-number">{stats.lowStockItems}</span>
                            {stats.lowStockItems > 0 && 
                                <span className="pharm-stat-trend pharm-trend-negative">
                                    <FontAwesomeIcon icon={faExclamationTriangle} />
                                </span>
                            }
                        </div>
                    </div>
                    
                    <div className="pharm-stat-card">
                        <h3 className="pharm-stat-title">Average Price</h3>
                        <div className="pharm-stat-values">
                            <span className="pharm-stat-number">Rs. {stats.averagePrice}</span>
                        </div>
                    </div>
                </div>
                
                {/* Filter Section */}
                <Card className="inventory-filter-card">
                    <Card.Header className="inventory-filter-header">
                        <FontAwesomeIcon icon={faFilter} className="inventory-filter-icon" />
                        <span>Filter Products</span>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col md={3}>
                                <Form.Group className="inventory-lable mb-3">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Select 
                                        value={categoryFilter} 
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {categories.map((category, index) => (
                                            <option key={index} value={category}>{category}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            
                            <Col md={4}>
                                <Form.Group className="inventory-lable mb-3">
                                    <Form.Label>Price Range</Form.Label>
                                    <div className="d-flex">
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Min" 
                                            value={priceRange.min} 
                                            onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                                            className="me-2"
                                        />
                                        <Form.Control 
                                            type="number" 
                                            placeholder="Max" 
                                            value={priceRange.max} 
                                            onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                                        />
                                    </div>
                                </Form.Group>
                            </Col>
                            
                            <Col md={2}>
                                <Form.Group className="inventory-lable mb-3">
                                    <Form.Label>Stock Status</Form.Label>
                                    <Form.Select 
                                        value={stockFilter} 
                                        onChange={(e) => setStockFilter(e.target.value)}
                                    >
                                        <option value="All">All</option>
                                        <option value="Low Stock">Low Stock</option>
                                        <option value="Out of Stock">Out of Stock</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            
                            <Col md={3}>
                                <Form.Group className="inventory-lable mb-3">
                                    <Form.Label>Search</Form.Label>
                                    <Form.Control 
                                        type="text" 
                                        placeholder="Search products..." 
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <div className="d-flex justify-content-end">
                            <Button variant="secondary" onClick={resetFilters} className="me-2">
                                Reset Filters
                            </Button>
                        </div>
                    </Card.Body>
                </Card>
                
                {/* Products Table */}
                <Card className="inventory-table-card mt-4">
                    <Card.Header className="inventory-table-header">
                        <FontAwesomeIcon icon={faChartBar} className="inventory-table-icon" />
                        <span>Inventory Report</span>
                        <div className="inventory-item-count">
                            {filteredProducts.length} items
                        </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-4">Loading inventory data...</div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="text-center py-4">No products match your filter criteria.</div>
                        ) : (
                            <div className="table-responsive">
                                <Table striped hover className="inventory-table mb-0">
                                    <thead>
                                        <tr>
                                            <th>Product Name</th>
                                            <th>Category</th>
                                            <th>Price</th>
                                            <th>Stock</th>
                                            <th>Value</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(product => (
                                            <tr key={product._id}>
                                                <td>{product.name}</td>
                                                <td>{product.category}</td>
                                                <td>Rs. {product.price}</td>
                                                <td>
                                                    <span className={`inventory-stock-badge ${
                                                        product.stock === 0 ? 'inventory-out-of-stock' : 
                                                        product.stock < 10 ? 'inventory-low-stock' : 
                                                        'inventory-in-stock'
                                                    }`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td>Rs. {(product.price * product.stock).toFixed(2)}</td>
                                                <td className="inventory-description">{product.description}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
            
            <Footer />
        </div>
    );
};

export default InventoryAnalytics;