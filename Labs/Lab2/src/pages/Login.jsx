import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import CarouselComponent from '../components/CarouselComponent';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (username === 'admin' && password === '123456') {
      onLogin();
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. Try admin/123456');
    }
  };

  const handleCancel = () => {
    setUsername('');
    setPassword('');
    setErrors({});
    setLoginError('');
  };

  return (
    <>
      <CarouselComponent />
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card>
              <Card.Body>
                <h3 className="text-center mb-4">Login</h3>
                {loginError && <Alert variant="danger">{loginError}</Alert>}
                <div>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        setErrors({ ...errors, username: '' });
                      }}
                      isInvalid={!!errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors({ ...errors, password: '' });
                      }}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={handleSubmit}>
                      Login
                    </Button>
                    <Button variant="secondary" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </div>
                <div className="text-center mt-3 text-muted small">
                  Hint: admin / 123456
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}