import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Table, Modal, Form, Badge, Alert, Spinner } from 'react-bootstrap';
import { useOrchid } from '../contexts/OrchidContext';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

export default function OrchidManagement() {
  const { orchids, loading, error, addOrchid, updateOrchid, deleteOrchid } = useOrchid();
  const { isAdmin } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingOrchid, setEditingOrchid] = useState(null);
  const [formData, setFormData] = useState({
    orchidName: '',
    description: '',
    category: 'Dendrobium',
    isSpecial: false,
    image: ''
  });

  // Chỉ admin mới truy cập được
  if (!isAdmin()) {
    return <Navigate to="/orchids" replace />;
  }

  const handleClose = () => {
    setShowModal(false);
    setEditingOrchid(null);
    setFormData({
      orchidName: '',
      description: '',
      category: 'Dendrobium',
      isSpecial: false,
      image: ''
    });
  };

  const handleShow = (orchid = null) => {
    if (orchid) {
      setEditingOrchid(orchid);
      setFormData({
        orchidName: orchid.orchidName,
        description: orchid.description,
        category: orchid.category,
        isSpecial: orchid.isSpecial,
        image: orchid.image
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingOrchid) {
        await updateOrchid(editingOrchid.id, formData);
      } else {
        await addOrchid(formData);
      }
      handleClose();
    } catch (err) {
      console.error('Error saving orchid:', err);
      alert('Error saving orchid. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this orchid?')) {
      try {
        await deleteOrchid(id);
      } catch (err) {
        console.error('Error deleting orchid:', err);
        alert('Error deleting orchid. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h2>🌸 Orchid Management</h2>
          <p className="text-muted">Manage all orchids in the system</p>
        </Col>
        <Col className="text-end">
          <Button variant="success" onClick={() => handleShow()}>
            ➕ Add New Orchid
          </Button>
        </Col>
      </Row>

      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <Card className="shadow-sm">
          <Card.Body>
            <Table responsive hover>
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Special</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orchids.map((orchid) => (
                  <tr key={orchid.id}>
                    <td>{orchid.id}</td>
                    <td>
                      <img 
                        src={orchid.image} 
                        alt={orchid.orchidName}
                        style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    </td>
                    <td><strong>{orchid.orchidName}</strong></td>
                    <td>
                      <Badge bg="info">{orchid.category}</Badge>
                    </td>
                    <td>
                      {orchid.isSpecial ? (
                        <Badge bg="warning" text="dark">⭐ Special</Badge>
                      ) : (
                        <Badge bg="secondary">Regular</Badge>
                      )}
                    </td>
                    <td>
                      <small className="text-muted">
                        {orchid.description.substring(0, 50)}...
                      </small>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleShow(orchid)}
                      >
                        ✏️ Edit
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(orchid.id)}
                      >
                        🗑️ Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Add/Edit Orchid Modal */}
      <Modal show={showModal} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingOrchid ? '✏️ Edit Orchid' : '➕ Add New Orchid'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Orchid Name *</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.orchidName}
                    onChange={(e) => setFormData({...formData, orchidName: e.target.value})}
                    required
                    placeholder="Enter orchid name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category *</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="Dendrobium">Dendrobium</option>
                    <option value="Oncidium">Oncidium</option>
                    <option value="Phalaenopsis">Phalaenopsis</option>
                    <option value="Cattleya">Cattleya</option>
                    <option value="Cymbidium">Cymbidium</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Image URL *</Form.Label>
              <Form.Control
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
                placeholder="/images/orchid.jpg or https://..."
              />
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/100?text=No+Image';
                    }}
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
                placeholder="Enter orchid description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Mark as Special Orchid ⭐"
                checked={formData.isSpecial}
                onChange={(e) => setFormData({...formData, isSpecial: e.target.checked})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              {editingOrchid ? 'Update Orchid' : 'Create Orchid'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}