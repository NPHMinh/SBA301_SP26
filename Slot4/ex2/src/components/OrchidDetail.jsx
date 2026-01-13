import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import orchidList from './listOfOrchid.js';

function OrchidDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const orchid = orchidList.find(o => o.id === id);

    if (!orchid) {
        return <h2>Không tìm thấy hoa lan</h2>;
    }

    return (
        <div className="container mt-4">
            <Button onClick={() => navigate('/orchid')}>← Back to List</Button>


            <Card className="mt-3">
                <Card.Img variant="top" src={orchid.image} />
                <Card.Body>
                    <Card.Title>{orchid.orchidName}</Card.Title>
                    <Card.Text>{orchid.description}</Card.Text>

                    <p><strong>Danh mục:</strong> {orchid.category}</p>
                    <p><strong>Giá:</strong> {orchid.price}</p>

                    {orchid.isSpecial && (
                        <span className="special-badge">Đặc biệt</span>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}

export default OrchidDetail;
