import React from 'react';
import { Container } from 'react-bootstrap';
import CarouselComponent from '../components/CarouselComponent';

export default function Home() {
  return (
    <>
      <CarouselComponent />
      <Container>
        <div className="text-center py-5">
          <h2>Welcome to Orchid Gallery</h2>
          <p className="lead">Discover the beauty of exotic orchids</p>
          <p className="text-muted">Please login to view our complete collection</p>
        </div>
      </Container>
    </>
  );
}