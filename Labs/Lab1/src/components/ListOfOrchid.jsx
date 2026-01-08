import { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import orchidList from './listOfOrchid.js';
import ConfirmModal from './ComfirmModal.jsx';

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
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <ConfirmModal
                show={show}
                handleClose={handleClose}
                handleConfirm={handleClose}
                title={selected ? selected.orchidName : ''}
                body={selected ? (
                    <div>
                        <img className="modal-image" src={selected.image} alt={selected.orchidName} />
                        <div className="modal-desc">
                            <p>{selected.description}</p>
                            <p><strong>Danh mục:</strong> {selected.category}</p>
                            <p><strong>Giá:</strong> {selected.price}</p>
                        </div>
                    </div>
                ) : null}
            />
        </div>
    );
}

export default ListOfOrchid;
