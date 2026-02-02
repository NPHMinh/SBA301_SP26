package nguyenphamhoangminh.lab5.repositories;

import nguyenphamhoangminh.lab5.pojos.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrchidRepository extends JpaRepository<Orchid, Long> {

    // Tìm tất cả orchids theo category
    List<Orchid> findByCategoryId(Long categoryId);

    // Tìm orchids theo tên (case insensitive)
    List<Orchid> findByOrchidNameContainingIgnoreCase(String name);
}
