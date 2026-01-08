import { useState } from 'react';
import { Card, Modal, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import orchidList from './listOfOrchid.js';

function ListOfOrchid() {
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(null);

    function openModal(orchid) {
        setSelected(orchid);
        setShow(true);
    }

    function handleClose() {
        setShow(false);
        setSelected(null);
    }

    return (
        <div className="orchid-page">
            <h1 className="orchid-title">Bộ Sưu Tập Hoa Lan</h1>
            <div className="orchid-container">
                {orchidList.map((orchid) => (
                    <Card key={orchid.id} className="orchid-card" style={{ textDecoration: 'none' }}>
                        <Card.Img 
                            variant="top" 
                            src={orchid.image} 
                            alt={orchid.orchidName}
                        />
                        <Card.Body>
                            <Card.Title>{orchid.orchidName}</Card.Title>
                            <Card.Text className="description">{orchid.description}</Card.Text>
                            {orchid.isSpecial && <span className="special-badge">Đặc biệt</span>}
                            <div style={{ marginTop: '0.8rem' }}>
                                <Button variant="primary" size="sm" onClick={() => openModal(orchid)}>Detail</Button>
                                {/* <Button as={Link} to={`/orchid/${orchid.id}`} variant="outline-secondary" size="sm" style={{ marginLeft: '0.6rem' }}>Page</Button> */}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selected?.orchidName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selected && (
                        <div>
                            <img className="modal-image" src={selected.image} alt={selected.orchidName} />
                            <div className="modal-desc">
                                <p>{selected.description}</p>
                                <p><strong>Danh mục:</strong> {selected.category}</p>
                                <p><strong>Giá:</strong> {selected.price}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListOfOrchid;
