package nguyenphamhoangminh.lab5.repositories;


import nguyenphamhoangminh.lab5.pojos.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    // Tìm category theo tên
    Optional<Category> findByName(String name);

    // Kiểm tra category có tồn tại không
    boolean existsByName(String name);
}
