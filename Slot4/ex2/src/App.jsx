import './App.css'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'
import Contact from './components/Contact.jsx'
import About from './components/About.jsx'
import Layout from './components/Layout.jsx'
import ListOfOrchid from './components/ListOfOrchid.jsx'
import OrchidDetail from './components/OrchidDetail.jsx'

function App() {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <Router>
            <Layout onSearch={setSearchTerm} footerProps={{ avatar: '/images/DocterMinh.jpg', authorName: 'MinhNPH', authorEmail: 'minhnphde180174@fpt.edu.vn' }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route
                        path="/orchid"
                        element={
                            <ListOfOrchid
                                searchTerm={searchTerm}
                            />
                        }
                    />
                    <Route path="/orchid/:id" element={<OrchidDetail />} />
                </Routes>
            </Layout>
        </Router>
    );
}


export default App
