package nguyenphamhoangminh.Lab4_New.controllers;

import nguyenphamhoangminh.Lab4_New.pojos.Orchid;
import nguyenphamhoangminh.Lab4_New.services.IOrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orchids")
public class OrchidController {
    
    @Autowired
    private IOrchidService orchidService;
    
    // GET all orchids
    // GET http://localhost:8080/orchids/
    @GetMapping("/")
    public ResponseEntity<List<Orchid>> getAllOrchids() {
        List<Orchid> orchids = orchidService.getAllOrchids();
        return new ResponseEntity<>(orchids, HttpStatus.OK);
    }
    
    // GET orchid by ID
    // GET http://localhost:8080/orchids/{id}
    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Long id) {
        Optional<Orchid> orchid = orchidService.getOrchidById(id);
        
        if (orchid.isPresent()) {
            return new ResponseEntity<>(orchid.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // POST - Create new orchid
    // POST http://localhost:8080/orchids/
    @PostMapping("/")
    public ResponseEntity<Orchid> createOrchid(@RequestBody Orchid orchid) {
        try {
            Orchid newOrchid = orchidService.createOrchid(orchid);
            return new ResponseEntity<>(newOrchid, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
    // PUT - Update existing orchid
    // PUT http://localhost:8080/orchids/{id}
    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(@PathVariable Long id, @RequestBody Orchid orchid) {
        try {
            Orchid updatedOrchid = orchidService.updateOrchid(id, orchid);
            return new ResponseEntity<>(updatedOrchid, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    
    // DELETE - Delete orchid
    // DELETE http://localhost:8080/orchids/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<HttpStatus> deleteOrchid(@PathVariable Long id) {
        try {
            orchidService.deleteOrchid(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
