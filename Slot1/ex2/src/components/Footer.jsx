import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import authorImg from '../../public/images/DocterMinh.jpg';

function Footer() {
    return (
        <Card style={{width: '25rem'}} className="text-center">
            <Card.Img
                variant="top"
                src={authorImg}
                style={{
                    width: '240px',
                    height: '240px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    margin: '1rem auto'
                }}
            />

            <Card.Body>
                <Card.Title>Tác giả</Card.Title>
                <Card.Text>
                    Nguyễn Phạm Hoàng Minh
                </Card.Text>
            </Card.Body>

            <ListGroup className="list-group-flush">
                <ListGroup.Item>
                    📧 Email:
                    <br/>
                    <a href="mailto:minhnphde180174@fpt.edu.vn">
                        minhnphde180174@fpt.edu.vn
                    </a>
                </ListGroup.Item>
            </ListGroup>
        </Card>
    );
}

export default Footer;
