function Contact() {
    return (
        <main className="content">
            <section className="hero">
                <h1>Liên hệ với tôi 📧</h1>
                <p>
                    Nếu bạn muốn kết nối hoặc có bất kỳ câu hỏi nào, vui lòng liên hệ với tôi qua các cách dưới đây.
                </p>
            </section>

            <section className="features">
                <h2>Thông tin liên hệ</h2>
                <ul>
                    <li>📧 Email: <a href="mailto:minhnphde180174@fpt.edu.vn">minhnphde180174@fpt.edu.vn</a></li>
                    <li>🐙 GitHub: <a href="https://github.com/NPHMinh/SBA301_SP26" target="_blank" rel="noopener noreferrer">github.com/NPHMinh/SBA301_SP26</a></li>
                    <li>📱 Phone: +84 123 456 789</li>
                </ul>
            </section>

            <section className="features">
                <h2>Gửi tin nhắn</h2>
                <form>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="name">Tên của bạn:</label><br />
                        <input type="text" id="name" name="name" placeholder="Nhập tên" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="email">Email:</label><br />
                        <input type="email" id="email" name="email" placeholder="Nhập email" style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="message">Tin nhắn:</label><br />
                        <textarea id="message" name="message" placeholder="Nhập tin nhắn của bạn" rows="5" style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
                    </div>
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#0d6efd', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                        Gửi
                    </button>
                </form>
            </section>
        </main>
    );
}

export default Contact;
