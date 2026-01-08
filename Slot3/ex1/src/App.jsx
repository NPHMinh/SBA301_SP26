import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import About from './components/About.jsx'
import Contact from './components/Contact.jsx'

function App() {
  return (
        <Router>
            <div className="app-container">
                <Header/>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/orchid" element={<Orchid />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>

                <Footer avatar="/images/DocterMinh.jpg" authorName="MinhNPH" authorEmail="minhnphde180174@fpt.edu.vn"/>
            </div>
        </Router>
    );
}

export default App
