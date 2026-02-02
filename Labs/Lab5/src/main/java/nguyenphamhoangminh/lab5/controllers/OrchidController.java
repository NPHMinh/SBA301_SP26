package nguyenphamhoangminh.lab5.controllers;

import nguyenphamhoangminh.lab5.pojos.Orchid;
import lombok.RequiredArgsConstructor;
import nguyenphamhoangminh.lab5.services.OrchidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orchids")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class OrchidController {

    private final OrchidService orchidService;

    // GET /api/orchids - Lấy tất cả orchids
    @GetMapping
    public ResponseEntity<List<Orchid>> getAllOrchids() {
        List<Orchid> orchids = orchidService.getAllOrchids();
        return ResponseEntity.ok(orchids);
    }

    // GET /api/orchids/{id} - Lấy orchid theo ID
    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Long id) {
        Orchid orchid = orchidService.getOrchidById(id);
        return ResponseEntity.ok(orchid);
    }

    // GET /api/orchids/category/{categoryId} - Lấy orchids theo category
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<Orchid>> getOrchidsByCategory(@PathVariable Long categoryId) {
        List<Orchid> orchids = orchidService.getOrchidsByCategory(categoryId);
        return ResponseEntity.ok(orchids);
    }

    // GET /api/orchids/search?name={name} - Tìm kiếm orchids
    @GetMapping("/search")
    public ResponseEntity<List<Orchid>> searchOrchids(@RequestParam String name) {
        List<Orchid> orchids = orchidService.searchOrchidsByName(name);
        return ResponseEntity.ok(orchids);
    }

    // POST /api/orchids - Tạo mới orchid
    @PostMapping
    public ResponseEntity<Orchid> createOrchid(@RequestBody Orchid orchid) {
        Orchid createdOrchid = orchidService.createOrchid(orchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdOrchid);
    }

    // PUT /api/orchids/{id} - Cập nhật orchid
    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(
            @PathVariable Long id,
            @RequestBody Orchid orchidDetails) {
        Orchid updatedOrchid = orchidService.updateOrchid(id, orchidDetails);
        return ResponseEntity.ok(updatedOrchid);
    }

    // DELETE /api/orchids/{id} - Xóa orchid
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Long id) {
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }
}