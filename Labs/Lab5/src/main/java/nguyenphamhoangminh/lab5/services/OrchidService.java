package nguyenphamhoangminh.lab5.services;

import lombok.RequiredArgsConstructor;
import nguyenphamhoangminh.lab5.exception.BadRequestException;
import nguyenphamhoangminh.lab5.exception.ResourceNotFoundException;
import nguyenphamhoangminh.lab5.pojos.Category;
import nguyenphamhoangminh.lab5.pojos.Orchid;
import nguyenphamhoangminh.lab5.repositories.CategoryRepository;
import nguyenphamhoangminh.lab5.repositories.OrchidRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrchidService {

    private final OrchidRepository orchidRepository;
    private final CategoryRepository categoryRepository;

    // Lấy tất cả orchids
    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }

    // Lấy orchid theo ID
    public Orchid getOrchidById(Long id) {
        return orchidRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orchid", "id", id));
    }

    // Lấy orchids theo category
    public List<Orchid> getOrchidsByCategory(Long categoryId) {
        // Kiểm tra category có tồn tại không
        if (!categoryRepository.existsById(categoryId)) {
            throw new ResourceNotFoundException("Category", "id", categoryId);
        }
        return orchidRepository.findByCategoryId(categoryId);
    }

    // Tìm kiếm orchids theo tên
    public List<Orchid> searchOrchidsByName(String name) {
        return orchidRepository.findByOrchidNameContainingIgnoreCase(name);
    }

    // Tạo mới orchid
    public Orchid createOrchid(Orchid orchid) {
        // Validate
        validateOrchid(orchid);

        // Kiểm tra category có tồn tại không
        Category category = categoryRepository.findById(orchid.getCategory().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", orchid.getCategory().getId()));

        orchid.setCategory(category);
        return orchidRepository.save(orchid);
    }

    // Cập nhật orchid
    public Orchid updateOrchid(Long id, Orchid orchidDetails) {
        Orchid orchid = getOrchidById(id);

        // Validate
        validateOrchid(orchidDetails);

        // Kiểm tra category có tồn tại không
        Category category = categoryRepository.findById(orchidDetails.getCategory().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", orchidDetails.getCategory().getId()));

        orchid.setOrchidName(orchidDetails.getOrchidName());
        orchid.setPrice(orchidDetails.getPrice());
        orchid.setDescription(orchidDetails.getDescription());
        orchid.setImage(orchidDetails.getImage());
        orchid.setCategory(category);

        return orchidRepository.save(orchid);
    }

    // Xóa orchid
    public void deleteOrchid(Long id) {
        Orchid orchid = getOrchidById(id);
        orchidRepository.delete(orchid);
    }

    // Validate orchid data
    private void validateOrchid(Orchid orchid) {
        if (orchid.getOrchidName() == null || orchid.getOrchidName().trim().isEmpty()) {
            throw new BadRequestException("Orchid name cannot be empty");
        }

        if (orchid.getPrice() == null || orchid.getPrice() <= 0) {
            throw new BadRequestException("Price must be greater than 0");
        }

        if (orchid.getCategory() == null || orchid.getCategory().getId() == null) {
            throw new BadRequestException("Category is required");
        }
    }
}