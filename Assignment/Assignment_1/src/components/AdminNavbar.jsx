import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

const AdminNavbar = () => {
    const navigate = useNavigate();
    // Lấy thông tin user đang đăng nhập từ localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user'); // Xóa session
        navigate('/login'); // Quay về login
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Container>
                <Navbar.Brand as={Link} to="/admin/dashboard">FUNews Admin</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/admin/dashboard">Accounts</Nav.Link>
                        <Nav.Link as={Link} to="/admin/categories">Categories</Nav.Link>
                        <Nav.Link as={Link} to="/admin/news">News</Nav.Link>
                    </Nav>
                    <Navbar.Text className="me-3">
                        Welcome, {user?.accountName || 'Admin'}
                    </Navbar.Text>
                    <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AdminNavbar;