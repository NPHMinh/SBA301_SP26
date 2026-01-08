import { Card, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import orchidList from './listOfOrchid.js';

function Orchid() {
    const { id } = useParams();
    const orchid = orchidList.find((o) => o.id === id);
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
                </Card.Body>
            </Card>
        </div>
    );
}

export default Orchid;
