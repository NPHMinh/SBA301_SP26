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

    function closeModal() {
        setShow(false);
        setSelected(null);
    }

    return (
        <div className="orchid-page">
            <h1 className="orchid-title">Bộ Sưu Tập Hoa Lan</h1>
            <div className="orchid-container">
                {orchidList.map((orchid) => (
                    <Card key={orchid.id} className="orchid-card" style={{ cursor: 'pointer', textDecoration: 'none' }} onClick={() => openModal(orchid)}>
                        <Card.Img 
                            variant="top" 
                            src={orchid.image} 
                            alt={orchid.orchidName}
                        />
                        <Card.Body>
                            <Card.Title>{orchid.orchidName}</Card.Title>
                            <Card.Text className="description">{orchid.description}</Card.Text>
                            <div className="orchid-info">
                                <p><strong>Danh mục:</strong> {orchid.category}</p>
                                <p><strong>Giá:</strong> {orchid.price}</p>
                            </div>
                            <div>
                                <Button as={Link} to={`/orchid/${orchid.id}`} variant="primary" size="sm">Detail page</Button>
                                {orchid.isSpecial && <span style={{ marginLeft: '0.6rem' }} className="special-badge">Đặc biệt</span>}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <Modal show={show} onHide={closeModal} size="lg" centered>
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
                                <p><strong>Chăm sóc:</strong> {selected.care}</p>
                                <p><strong>Nhiệt độ:</strong> {selected.temperature}</p>
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ListOfOrchid;
