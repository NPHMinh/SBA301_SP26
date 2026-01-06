import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./components/Home.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";

function App() {
    return (
        <BrowserRouter>
            <div className="app-container">
                <Header/>

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>

                <Footer/>
            </div>
        </BrowserRouter>
    );
}

export default App;
