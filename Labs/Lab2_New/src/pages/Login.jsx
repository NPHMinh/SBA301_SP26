import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import CarouselComponent from '../components/CarouselComponent';
import { useLoginForm } from '../hooks/useLoginForm';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

export default function Login() {
  const { isLoggedIn, login } = useAuth();
  const { authenticateUser } = useUser();
  const {
    state,
    setUsername,
    setPassword,
    clearFieldError,
    setLoginError,
    resetForm,
    validateForm
  } = useLoginForm();

  if (isLoggedIn) {
    return <Navigate to="/orchids" replace />;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Authenticate with UserContext
    const user = authenticateUser(state.username, state.password);
    
    if (user) {
      login(user); // Pass full user object to login
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    clearFieldError('username');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    clearFieldError('password');
  };

  return (
    <>
      <CarouselComponent />
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className="shadow">
              <Card.Body>
                <h3 className="text-center mb-4">🌸 Login</h3>
                
                {state.loginError && (
                  <Alert variant="danger" dismissible onClose={() => setLoginError('')}>
                    {state.loginError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={state.username}
                      onChange={handleUsernameChange}
                      isInvalid={!!state.errors.username}
                    />
                    <Form.Control.Feedback type="invalid">
                      {state.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={state.password}
                      onChange={handlePasswordChange}
                      isInvalid={!!state.errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {state.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                      Login
                    </Button>
                    <Button variant="secondary" type="button" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </div>
                </Form>

                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted d-block mb-2"><strong>Demo Accounts:</strong></small>
                  <small className="d-block">👑 Admin: admin / 123456</small>
                  <small className="d-block">👤 User: user1 / 123456</small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}