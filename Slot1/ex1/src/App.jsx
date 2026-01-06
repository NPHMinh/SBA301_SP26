import './App.css'
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <div className="app-container">
            <Header/>

            <main className="content">
                <section className="hero">
                    <h1>Chào mừng đến với website của tôi 👋</h1>
                    <p>
                        Đây là trang web được xây dựng bằng React và React Bootstrap.
                        Mục tiêu của website là học tập, thực hành và chia sẻ kiến thức.
                    </p>
                </section>

                <section className="features">
                    <h2>Nội dung chính</h2>
                    <ul>
                        <li>⚛️ React cơ bản & nâng cao</li>
                        <li>🎨 Giao diện với Bootstrap</li>
                        <li>💻 Frontend cho Spring Boot</li>
                    </ul>
                </section>
            </main>

            <Footer/>
        </div>
    );
}

export default App;
