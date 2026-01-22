import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Badge, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import CarouselComponent from '../components/CarouselComponent';
import { useOrchid } from '../contexts/OrchidContext';

export default function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrchidById } = useOrchid();
  
  const [orchid, setOrchid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrchidDetail();
  }, [id]);

  const fetchOrchidDetail = async () => {
    try {
      setLoading(true);
      const data = await getOrchidById(id);
      setOrchid(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching orchid:', err);
      setError('Failed to load orchid details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <CarouselComponent />
        <Container className="mt-5">
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading orchid details...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error || !orchid) {
    return (
      <>
        <CarouselComponent />
        <Container className="mt-5">
          <Alert variant="danger" className="text-center">
            <h4>Orchid Not Found</h4>
            <p>The orchid with ID "{id}" doesn't exist or failed to load.</p>
            <Button variant="primary" onClick={() => navigate('/orchids')}>
              ← Back to List
            </Button>
          </Alert>
        </Container>
      </>
    );
  }

  return (
    <>
      <CarouselComponent />
      <Container className="mt-4">
        <Button variant="secondary" className="mb-3" onClick={() => navigate('/orchids')}>
          ← Back to List
        </Button>
        
        <Row>
          <Col md={6} className="mb-4">
            <img 
              src={orchid.image} 
              alt={orchid.orchidName}
              className="img-fluid rounded shadow"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500?text=No+Image';
              }}
            />
          </Col>
          <Col md={6}>
            <h1 className="mb-3">{orchid.orchidName}</h1>
            <h5 className="text-muted mb-3">
              <strong>Category:</strong> {orchid.category}
              {orchid.isSpecial && (
                <Badge bg="warning" text="dark" className="ms-2">⭐ Special Orchid</Badge>
              )}
            </h5>
            <hr />
            <h5 className="mt-4">🌸 Description</h5>
            <p className="text-justify">{orchid.description}</p>
            <hr />
            <div className="mt-4">
              <p><strong>🆔 ID:</strong> {orchid.id}</p>
              <p><strong>📊 Status:</strong> {orchid.isSpecial ? 'Special Collection' : 'Regular Collection'}</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}