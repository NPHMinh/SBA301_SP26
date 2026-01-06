function About() {
    return (
        <main className="content">
            <section className="hero">
                <h1>Về tôi 📖</h1>
                <p>
                    Xin chào! Tôi là một lập trình viên có đam mê với React và công nghệ web.
                </p>
            </section>

            <section className="features">
                <h2>Kỹ năng chính</h2>
                <ul>
                    <li>⚛️ React & React Hooks</li>
                    <li>🎨 Bootstrap & CSS</li>
                    <li>💻 JavaScript & Modern Web Development</li>
                    <li>🔧 Vite & Module Bundling</li>
                </ul>
            </section>

            <section className="features">
                <h2>Kinh nghiệm</h2>
                <p>
                    Với hơn mấy năm kinh nghiệm trong lĩnh vực phát triển web, tôi đã làm việc trên 
                    nhiều dự án từ nhỏ đến lớn, sử dụng các công nghệ hiện đại và thực hành tốt nhất.
                </p>
            </section>
        </main>
    );
}

export default About;
