import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import ListOfOrchid from './components/ListOfOrchid.jsx'
import TestCount from './components/TestCount.jsx'

function App() {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <Router>
            <div className="app-container">
                <Header onSearch={setSearchTerm} />
                <ListOfOrchid searchTerm={searchTerm} onSearch={setSearchTerm} />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/orchid" element={<ListOfOrchid searchTerm={searchTerm} onSearch={setSearchTerm} />} />
                </Routes>
                <TestCount />
                <Footer avatar="/images/DocterMinh.jpg" authorName="MinhNPH" authorEmail="minhnphde180174@fpt.edu.vn" />
            </div>
        </Router>
    );
}

export default App
