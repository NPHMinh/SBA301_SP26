import React from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import CarouselComponent from '../components/CarouselComponent';
import { useLoginForm } from '../hooks/useLoginForm'; // Quản lý trạng thái nhập liệu (Input)
import { useAuth } from '../contexts/AuthContext';   // Quản lý trạng thái đăng nhập (Token/Session)
import { useUser } from '../contexts/UserContext';   // Gọi API để xác thực người dùng

export default function Login() {
  // 1. Lấy hàm login và trạng thái đăng nhập từ AuthContext
  const { isLoggedIn, login } = useAuth();
  
  // 2. Lấy hàm authenticateUser (gọi API) từ UserContext
  const { authenticateUser, loading } = useUser();
  
  // 3. Sử dụng Custom Hook để quản lý các biến nhập vào form (username, password, lỗi validation)
  const {
    state,
    setUsername,
    setPassword,
    clearFieldError,
    setLoginError,
    resetForm,
    validateForm
  } = useLoginForm();

  // 4. Nếu đã đăng nhập rồi thì tự động chuyển hướng sang trang danh sách hoa lan
  if (isLoggedIn) {
    return <Navigate to="/orchids" replace />;
  }

  // 5. Hàm xử lý khi nhấn nút Login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Chặn hành động load lại trang của Form
    
    if (!validateForm()) return; // Kiểm tra xem người dùng đã nhập đủ user/pass chưa

    try {
      // Gọi API xác thực thông qua UserContext
      const user = await authenticateUser(state.username, state.password);
      if (user) {
        login(user); // Nếu đúng user/pass, cập nhật trạng thái "Đã đăng nhập" vào AuthContext
      } else {
        setLoginError('Invalid username or password'); // Báo lỗi nếu sai thông tin
      }
    } catch (error) {
      setLoginError('Server error. Please try again.'); // Báo lỗi nếu server không phản hồi
    }
  };

  return (
    <>
      <CarouselComponent /> {/* Hiển thị banner chạy slide ở đầu trang */}
      <Container>
        <Row className="justify-content-center mt-5">
          <Col xs={12} sm={10} md={8} lg={6} xl={4}>
            <Card className="shadow">
              <Card.Body>
                <h3 className="text-center mb-4">🌸 Login</h3>
                
                {/* Hiển thị thông báo lỗi màu đỏ nếu đăng nhập thất bại */}
                {state.loginError && (
                  <Alert variant="danger" dismissible onClose={() => setLoginError('')}>
                    {state.loginError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Ô nhập Username */}
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter username"
                      value={state.username}
                      onChange={(e) => {
                        setUsername(e.target.value);
                        clearFieldError('username'); // Xóa thông báo lỗi khi người dùng bắt đầu gõ lại
                      }}
                      isInvalid={!!state.errors.username} // Hiện viền đỏ nếu có lỗi validation
                      disabled={loading} // Vô hiệu hóa khi đang chờ server phản hồi
                    />
                    <Form.Control.Feedback type="invalid">
                      {state.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Ô nhập Password */}
                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={state.password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        clearFieldError('password');
                      }}
                      isInvalid={!!state.errors.password}
                      disabled={loading}
                    />
                    <Form.Control.Feedback type="invalid">
                      {state.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Nút bấm Đăng nhập & Hủy */}
                  <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner size="sm" className="me-2" />
                          Logging in...
                        </>
                      ) : (
                        'Login'
                      )}
                    </Button>
                    <Button 
                      variant="secondary" 
                      type="button" 
                      onClick={resetForm} // Xóa sạch dữ liệu đã nhập trong form
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </Form>

                {/* Phần gợi ý tài khoản mẫu để chấm bài/test nhanh */}
                <div className="mt-4 p-3 bg-light rounded">
                  <small className="text-muted d-block mb-2">
                    <strong>Demo Accounts:</strong>
                  </small>
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