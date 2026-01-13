import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function SearchBar({ onSearch }) {
    const handleChange = (e) => {
        onSearch(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col xs="auto">
                    <InputGroup>
                        <Form.Control
                            type="text"
                            placeholder="Search orchid..."
                            onChange={handleChange}
                        />
                    </InputGroup>
                </Col>
                <Col xs="auto">
                    <Button type="submit">Search</Button>
                </Col>
            </Row>
        </Form>
    );
}

export default SearchBar;
