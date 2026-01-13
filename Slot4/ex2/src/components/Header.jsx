import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

function Header({ onSearch }) {
    return (
        <Navbar bg="light" expand="lg" className="border-bottom">
            <Container className="px-3" fluid="lg">
                <Navbar.Brand as={Link} to="/">Navbar</Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar" />
                <Navbar.Collapse id="main-navbar">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about">About</Nav.Link>
                        <Nav.Link as={Link} to="/contact">Contact</Nav.Link>
                        <Nav.Link as={Link} to="/orchid">Orchid</Nav.Link>
                    </Nav>

                    {/* SEARCH TRONG HEADER */}
                    <SearchBar onSearch={onSearch} />
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;
