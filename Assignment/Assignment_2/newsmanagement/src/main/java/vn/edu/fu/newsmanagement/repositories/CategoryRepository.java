package vn.edu.fu.newsmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fu.newsmanagement.pojos.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    // Các hàm tìm kiếm mặc định đã đủ dùng
}