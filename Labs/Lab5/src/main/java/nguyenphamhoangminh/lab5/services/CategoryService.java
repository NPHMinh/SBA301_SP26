package nguyenphamhoangminh.lab5.services;


import lombok.RequiredArgsConstructor;
import nguyenphamhoangminh.lab5.exception.BadRequestException;
import nguyenphamhoangminh.lab5.exception.ResourceNotFoundException;
import nguyenphamhoangminh.lab5.pojos.Category;
import nguyenphamhoangminh.lab5.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // Lấy tất cả categories
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Lấy category theo ID
    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    // Tạo mới category
    public Category createCategory(Category category) {
        // Kiểm tra tên category đã tồn tại chưa
        if (categoryRepository.existsByName(category.getName())) {
            throw new BadRequestException("Category with name '" + category.getName() + "' already exists");
        }

        // Validate
        if (category.getName() == null || category.getName().trim().isEmpty()) {
            throw new BadRequestException("Category name cannot be empty");
        }

        return categoryRepository.save(category);
    }

    // Cập nhật category
    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);

        // Kiểm tra tên mới có trùng với category khác không
        if (!category.getName().equals(categoryDetails.getName()) &&
                categoryRepository.existsByName(categoryDetails.getName())) {
            throw new BadRequestException("Category with name '" + categoryDetails.getName() + "' already exists");
        }

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());

        return categoryRepository.save(category);
    }

    // Xóa category
    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}
