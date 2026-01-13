import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import SearchBar from './SearchBar.jsx';

function Header({ onSearch }) {
    return (
        <>
            <Navbar bg="light" data-bs-theme="light">
                <Container>
                    <Navbar.Brand as={Link} to="/">Navbar</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        <Nav.Link as={Link} to="/orchid">Orchid</Nav.Link>

                    </Nav>
                     {/* SEARCH TRONG HEADER */}
                    <SearchBar onSearch={onSearch} />
                </Container>
            </Navbar>
        </>

    );

}

export default Header;