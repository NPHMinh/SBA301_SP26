import React from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { OrchidsData } from '../shared/ListOfOrchids';
import CarouselComponent from '../components/CarouselComponent';

export default function OrchidDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const orchid = OrchidsData.find(o => o.id === id);

  if (!orchid) {
    return (
      <>
        <CarouselComponent />
        <Container className="mt-5">
          <div className="text-center">
            <h2>Orchid Not Found</h2>
            <p className="text-muted">The orchid you're looking for doesn't exist.</p>
            <Button variant="primary" onClick={() => navigate('/orchids')}>
              Back to List
            </Button>
          </div>
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
          <Col md={6}>
            <img 
              src={orchid.image} 
              alt={orchid.orchidName}
              className="img-fluid rounded shadow"
              style={{ width: '100%', maxHeight: '500px', objectFit: 'cover' }}
            />
          </Col>
          <Col md={6}>
            <h1>{orchid.orchidName}</h1>
            <h5 className="text-muted mb-3">
              Category: {orchid.category}
              {orchid.isSpecial && (
                <Badge bg="warning" text="dark" className="ms-2">Special Orchid</Badge>
              )}
            </h5>
            <hr />
            <h5>Description</h5>
            <p>{orchid.description}</p>
            <hr />
            <div className="mt-4">
              <strong>ID:</strong> {orchid.id}<br />
              <strong>Status:</strong> {orchid.isSpecial ? 'Special Collection' : 'Regular Collection'}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}