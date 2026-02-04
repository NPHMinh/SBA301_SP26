package vn.edu.fu.newsmanagement.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.fu.newsmanagement.pojos.Category;
import vn.edu.fu.newsmanagement.repositories.CategoryRepository;

import java.util.List;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElse(null);
    }

    public Category createCategory(Category category) {
        category.setCategoryId(null);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Integer id, Category details) {
        Category cat = categoryRepository.findById(id).orElse(null);
        if (cat == null) return null;
        cat.setCategoryName(details.getCategoryName());
        cat.setCategoryDescription(details.getCategoryDescription());
        return categoryRepository.save(cat);
    }

    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
}