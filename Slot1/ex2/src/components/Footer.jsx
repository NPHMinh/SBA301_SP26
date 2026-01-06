import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
function Footer() {
    return (
        <footer className="bg-light text-center py-4 mt-auto">
            <Container fluid>
                <Row className="align-items-center">
                    <Col xs={2}>
                        <Image 
                            src="/images/DocterMinh.jpg" 
                            alt="Author Avatar" 
                            className="rounded-circle" 
                            style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                            onError={(e) => e.target.src = '/images/default-avatar.jpg'}
                        />
                    </Col>
                    <Col xs={8}>
                        <h5>Tác giả: &copy; MinhNPH</h5>
                        <small>All rights reserved.</small>
                    </Col>
                    <Col xs={2}>
                        <a href="mailto:minhnphde180174@fpt.edu.vn">minhnphde180174@fpt.edu.vn</a>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}
export default Footer;