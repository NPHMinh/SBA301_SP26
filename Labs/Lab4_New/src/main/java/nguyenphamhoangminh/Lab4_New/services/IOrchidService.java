package nguyenphamhoangminh.Lab4_New.services;

import nguyenphamhoangminh.Lab4_New.pojos.Orchid;
import java.util.List;
import java.util.Optional;

public interface IOrchidService {
    
    // Get all orchids
    List<Orchid> getAllOrchids();
    
    // Get orchid by ID
    Optional<Orchid> getOrchidById(Long id);
    
    // Create new orchid
    Orchid createOrchid(Orchid orchid);
    
    // Update existing orchid
    Orchid updateOrchid(Long id, Orchid orchid);
    
    // Delete orchid
    void deleteOrchid(Long id);
    
    // Check if orchid exists
    boolean existsById(Long id);
}
