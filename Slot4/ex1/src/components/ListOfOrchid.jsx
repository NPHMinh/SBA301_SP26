import { useState, useMemo } from 'react';
import { Card, Button } from 'react-bootstrap';
import orchidList from './listOfOrchid.js';
import ConfirmModal from './ComfirmModal.jsx';
import FilterSort from './FilterSort.jsx';
import SearchBar from './SearchBar.jsx';


function ListOfOrchid({ searchTerm, onSearch }) {
    const [show, setShow] = useState(false);
    const [selected, setSelected] = useState(null);

    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortOption, setSortOption] = useState('');

    function openModal(orchid) {
        setSelected(orchid);
        setShow(true);
    }

    function handleClose() {
        setShow(false);
        setSelected(null);
    }

    // Lấy danh sách category duy nhất
    const categories = [...new Set(orchidList.map(o => o.category))];

    // Ép giá về number
    const parsePrice = (price) =>
        Number(price.toString().replace(/[^\d]/g, ''));

    // SEARCH + FILTER + SORT
    const filteredOrchids = useMemo(() => {
        let result = [...orchidList];

        // 🔍 SEARCH
        if (searchTerm) {
            result = result.filter(o =>
                o.orchidName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
        }

        // 📂 FILTER
        if (selectedCategory) {
            result = result.filter(o => o.category === selectedCategory);
        }

        // ↕ SORT
        switch (sortOption) {
            case 'price-asc':
                result.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
                break;
            case 'price-desc':
                result.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
                break;
            case 'name-asc':
                result.sort((a, b) => a.orchidName.localeCompare(b.orchidName));
                break;
            case 'name-desc':
                result.sort((a, b) => b.orchidName.localeCompare(a.orchidName));
                break;
            default:
                break;
        }

        return result;
    }, [searchTerm, selectedCategory, sortOption]);

    return (
        <div className="orchid-page">
            <h1 className="orchid-title">Bộ Sưu Tập Hoa Lan</h1>

            {/* SEARCH */}
            {/* <SearchBar onSearch={onSearch} /> */}

            {/* FILTER + SORT */}
            <FilterSort
                categories={categories}
                onFilterChange={setSelectedCategory}
                onSortChange={setSortOption}
            />

            <div className="orchid-container">
                {filteredOrchids.map((orchid) => (
                    <Card key={orchid.id} className="orchid-card">
                        <Card.Img
                            variant="top"
                            src={orchid.image}
                            alt={orchid.orchidName}
                        />
                        <Card.Body>
                            <Card.Title>{orchid.orchidName}</Card.Title>
                            <Card.Text className="description">
                                {orchid.description}
                            </Card.Text>

                            {orchid.isSpecial && (
                                <span className="special-badge">Đặc biệt</span>
                            )}

                            <div style={{ marginTop: '0.8rem' }}>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => openModal(orchid)}
                                >
                                    Detail
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>

            <ConfirmModal
                show={show}
                handleClose={handleClose}
                handleConfirm={handleClose}
                title={selected ? selected.orchidName : ''}
                body={
                    selected ? (
                        <div>
                            <img
                                className="modal-image"
                                src={selected.image}
                                alt={selected.orchidName}
                            />
                            <div className="modal-desc">
                                <p>{selected.description}</p>
                                <p><strong>Danh mục:</strong> {selected.category}</p>
                                <p><strong>Giá:</strong> {parsePrice(selected.price).toLocaleString()} VND</p>
                            </div>
                        </div>
                    ) : null
                }
            />
        </div>
    );
}

export default ListOfOrchid;
