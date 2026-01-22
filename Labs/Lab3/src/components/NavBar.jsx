import React from 'react';
import { Navbar, Nav, Container, Badge, Image, NavDropdown } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout, isAdmin } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          🌸 Orchid Gallery
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link 
              onClick={() => navigate('/')}
              active={location.pathname === '/'}
            >
              Home
            </Nav.Link>
            
            {isLoggedIn ? (
              <>
                <Nav.Link 
                  onClick={() => navigate('/orchids')}
                  active={location.pathname === '/orchids'}
                >
                  Orchids
                </Nav.Link>
                
                {/* Menu quản lý cho Admin */}
                {isAdmin() && (
                  <NavDropdown title="⚙️ Management" id="admin-dropdown">
                    <NavDropdown.Item onClick={() => navigate('/users')}>
                      👥 Users
                    </NavDropdown.Item>
                    <NavDropdown.Item onClick={() => navigate('/manage-orchids')}>
                      🌸 Orchids
                    </NavDropdown.Item>
                  </NavDropdown>
                )}
                
                <Nav.Link className="d-flex align-items-center">
                  {user?.avatar && (
                    <Image 
                      src={user.avatar} 
                      roundedCircle 
                      style={{ width: '30px', height: '30px', marginRight: '8px' }}
                    />
                  )}
                  <span>{user?.fullName || user?.username}</span>
                  {user?.role === 'admin' && (
                    <Badge bg="danger" className="ms-2">Admin</Badge>
                  )}
                </Nav.Link>
                
                <Nav.Link onClick={logout}>Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link 
                onClick={() => navigate('/login')}
                active={location.pathname === '/login'}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}