package nguyenphamhoangminh.Lab4_New.services;

import nguyenphamhoangminh.Lab4_New.pojos.Orchid;
import nguyenphamhoangminh.Lab4_New.repositories.IOrchidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrchidService implements IOrchidService {
    
    @Autowired
    private IOrchidRepository orchidRepository;
    
    @Override
    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }
    
    @Override
    public Optional<Orchid> getOrchidById(Long id) {
        return orchidRepository.findById(id);
    }
    
    @Override
    public Orchid createOrchid(Orchid orchid) {
        return orchidRepository.save(orchid);
    }
    
    @Override
    public Orchid updateOrchid(Long id, Orchid orchidDetails) {
        Optional<Orchid> orchidOptional = orchidRepository.findById(id);
        
        if (orchidOptional.isPresent()) {
            Orchid orchid = orchidOptional.get();
            orchid.setOrchidName(orchidDetails.getOrchidName());
            orchid.setIsNatural(orchidDetails.getIsNatural());
            orchid.setOrchidDescription(orchidDetails.getOrchidDescription());
            orchid.setOrchidCategory(orchidDetails.getOrchidCategory());
            orchid.setIsAttractive(orchidDetails.getIsAttractive());
            orchid.setOrchidURL(orchidDetails.getOrchidURL());
            
            return orchidRepository.save(orchid);
        } else {
            throw new RuntimeException("Orchid not found with id: " + id);
        }
    }
    
    @Override
    public void deleteOrchid(Long id) {
        if (orchidRepository.existsById(id)) {
            orchidRepository.deleteById(id);
        } else {
            throw new RuntimeException("Orchid not found with id: " + id);
        }
    }
    
    @Override
    public boolean existsById(Long id) {
        return orchidRepository.existsById(id);
    }
}
