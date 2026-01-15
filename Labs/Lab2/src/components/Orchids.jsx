import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import { Search } from 'lucide-react';
import { OrchidsData } from '../shared/ListOfOrchids';
import { useNavigate } from 'react-router-dom';

export default function Orchids() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['All', ...new Set(OrchidsData.map(o => o.category))];

  const filteredAndSortedOrchids = useMemo(() => {
    let result = [...OrchidsData];

    if (searchTerm) {
      result = result.filter(orchid =>
        orchid.orchidName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        orchid.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== 'All') {
      result = result.filter(orchid => orchid.category === filterCategory);
    }

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.orchidName.localeCompare(b.orchidName);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      }
      return 0;
    });

    return result;
  }, [searchTerm, filterCategory, sortBy]);

  return (
    <Container>
      {/* Search, Filter, Sort Controls */}
      <Row className="mb-4 mt-3">
        <Col xs={12} md={5} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>
              <Search size={18} />
            </InputGroup.Text>
            <Form.Control
              placeholder="Search orchids..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col xs={12} sm={6} md={3} className="mb-3 mb-md-0">
          <InputGroup>
            <InputGroup.Text>Filter</InputGroup.Text>
            <Form.Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <InputGroup>
            <InputGroup.Text>Sort</InputGroup.Text>
            <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Name</option>
              <option value="category">Sort by Category</option>
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Results count */}
      <div className="mb-3 text-muted">
        Found {filteredAndSortedOrchids.length} orchid(s)
      </div>

      {/* Orchids Grid */}
      {filteredAndSortedOrchids.length > 0 ? (
        <Row>
          {filteredAndSortedOrchids.map((orchid) => (
            <Col xs={12} sm={6} md={4} lg={3} key={orchid.id} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Img 
                  variant="top" 
                  src={orchid.image} 
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-truncate">{orchid.orchidName}</Card.Title>
                  <Card.Text className="text-muted small">
                    {orchid.category}
                    {orchid.isSpecial && <span className="ms-2 badge bg-warning text-dark">Special</span>}
                  </Card.Text>
                  <Button 
                    variant="primary" 
                    size="sm"
                    onClick={() => navigate(`/orchid/${orchid.id}`)}
                    className="mt-auto"
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          <h5>No orchids found</h5>
          <p>Try adjusting your search or filter criteria</p>
        </Alert>
      )}
    </Container>
  );
}