package sum25.de180174.lab8springboostwithmongodemo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import sum25.de180174.lab8springboostwithmongodemo.model.Book;

import java.util.List;
import java.util.Optional;

@Repository
public interface IBookRepository extends MongoRepository<Book, String> {
    
    // Custom query methods
    Optional<Book> findByIsbn(String isbn);
    
    List<Book> findByTitle(String title);
    
    List<Book> findByAuthor(String author);
    
    List<Book> findByTitleContainingIgnoreCase(String title);
}
