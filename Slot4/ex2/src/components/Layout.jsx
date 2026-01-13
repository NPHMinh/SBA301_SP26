import { Container } from "react-bootstrap";
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function Layout({ children, onSearch, footerProps = {} }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Header onSearch={onSearch} />

      <main className="flex-fill">
        <Container className="py-3">
          {children}
        </Container>
      </main>

      <Footer {...footerProps} />
    </div>
  );
}

export default Layout;
