import { Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import orchidList from './listOfOrchid.js';

function Orchid() {
    const { id } = useParams();
    const orchid = orchidList.find((o) => o.id === id);

    if (!orchid) {
        return (
            <div style={{ padding: '2rem' }}>
                <h3>Không tìm thấy hoa lan</h3>
                <Button as={Link} to="/orchid" variant="primary">Quay lại</Button>
            </div>
        );
    }

    return (
        <div className="orchid-page" style={{ padding: '2rem' }}>
            <Card className="orchid-card" style={{ maxWidth: 900, margin: '0 auto' }}>
                <Card.Img 
                            variant="top" 
                            src={orchid.image} 
                            alt={orchid.orchidName}
                        />
                <Card.Body>
                    <Card.Title>{orchid.orchidName}</Card.Title>
                    <Card.Text>{orchid.description}</Card.Text>
                    <div className="orchid-info">
                        <p><strong>Danh mục:</strong> {orchid.category}</p>
                        <p><strong>Giá:</strong> {orchid.price}</p>
                    </div>
                    {orchid.isSpecial && <span className="special-badge">Đặc biệt</span>}
                    <div style={{ marginTop: '1rem' }}>
                        <Button as={Link} to="/orchid" variant="outline-primary">Quay lại bộ sưu tập</Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
}

export default Orchid;
