import { Card } from 'react-bootstrap';

function Orchid() {
    const orchidList = [
        {
            id: "1",
            orchidName: "Phalaenopsis Amabilis",
            description: "Hoa lan Phalaenopsis trắng tinh khôi, thơm nhẹ, bền lâu. Thích hợp trồng trong nhà.",
            category: "Hoa Lan Cánh Bướm",
            isSpecial: true,
            image: "images/Orchid.jpg",
            price: "150,000 đ",
            care: "Sáng gián tiếp, tưới 1-2 lần/tuần",
            temperature: "15-25°C"
        },
        {
            id: "2",
            orchidName: "Dendrobium Nobile",
            description: "Hoa lớn, màu sắc đa dạng từ trắng, hồng đến tím. Thích hợp trồng ở nơi sáng.",
            category: "Lan Dendrobium",
            isSpecial: true,
            image: "images/2.jpg",
            price: "180,000 đ",
            care: "Sáng trực tiếp 3-4 giờ/ngày, tưới 2-3 lần/tuần",
            temperature: "10-28°C"
        },
        {
            id: "3",
            orchidName: "Cattleya",
            description: "Nữ hoàng của các loài lan. Hoa to, thơm nức, màu sắc rực rỡ.",
            category: "Lan Cattleya",
            isSpecial: false,
            image: "images/3.jpg",
            price: "250,000 đ",
            care: "Sáng trực tiếp 4-5 giờ/ngày, tưới 2 lần/tuần",
            temperature: "18-28°C"
        },
        {
            id: "4",
            orchidName: "Oncidium",
            description: "Hoa nhỏ, màu vàng hoặc nâu. Còn được gọi là 'Hoa bướm'. Dễ chăm sóc.",
            category: "Lan Oncidium",
            isSpecial: false,
            image: "images/4.jpg",
            price: "120,000 đ",
            care: "Sáng gián tiếp, tưới 2-3 lần/tuần",
            temperature: "12-25°C"
        },
        {
            id: "5",
            orchidName: "Paphiopedilum",
            description: "Lan dép nữ có hoa độc đáo. Thích hợp trồng ở nơi bóng mát.",
            category: "Lan Dép Nữ",
            isSpecial: true,
            image: "images/5.jpg",
            price: "200,000 đ",
            care: "Bóng mát, độ ẩm cao, tưới 2-3 lần/tuần",
            temperature: "10-20°C"
        },
        {
            id: "6",
            orchidName: "Vanda",
            description: "Hoa lớn, thơm thúi, màu sắc đa dạng. Loài lan sang trọng ưa chuộng.",
            category: "Lan Vanda",
            isSpecial: true,
            image: "images/6.jpg",
            price: "300,000 đ",
            care: "Sáng trực tiếp 4-6 giờ/ngày, tưới hàng ngày",
            temperature: "20-30°C"
        }
    ];

    return (
        <div className="orchid-page">
            <h1 className="orchid-title">Bộ Sưu Tập Hoa Lan</h1>
            <div className="orchid-container">
                {orchidList.map((orchid) => (
                    <Card key={orchid.id} className="orchid-card">
                        <Card.Img 
                            variant="top" 
                            src={orchid.image} 
                            alt={orchid.orchidName}
                        />
                        <Card.Body>
                            <Card.Title>{orchid.orchidName}</Card.Title>
                            <Card.Text className="description">{orchid.description}</Card.Text>
                            <div className="orchid-info">
                                <p><strong>Danh mục:</strong> {orchid.category}</p>
                                <p><strong>Giá:</strong> {orchid.price}</p>
                                <p><strong>Chăm sóc:</strong> {orchid.care}</p>
                                <p><strong>Nhiệt độ:</strong> {orchid.temperature}</p>
                            </div>
                            {orchid.isSpecial && <span className="special-badge">Đặc biệt</span>}
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default Orchid;
