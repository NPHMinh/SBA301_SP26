import React from 'react';
import { Carousel } from 'react-bootstrap';
import { banners } from '../shared/BannerData';

export default function CarouselComponent() {
  return (
    <Carousel fade interval={3000} className="mb-4">
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <img
            className="d-block w-100"
            src={banner.image}
            alt={banner.title}
            style={{ objectFit: 'cover', height: '450px', maxHeight: '450px' }}
          />
          <Carousel.Caption style={{ 
            background: 'rgba(0,0,0,0.6)', 
            borderRadius: '10px', 
            padding: '20px',
            left: '10%',
            right: '10%'
          }}>
            <h3>{banner.title}</h3>
            <p>{banner.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}