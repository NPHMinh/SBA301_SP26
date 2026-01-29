package nguyenphamhoangminh.Lab4_New.repositories;

import nguyenphamhoangminh.Lab4_New.pojos.Orchid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IOrchidRepository extends JpaRepository<Orchid, Long> {
    // JpaRepository provides all CRUD operations
    // Additional custom query methods can be defined here if needed
}
