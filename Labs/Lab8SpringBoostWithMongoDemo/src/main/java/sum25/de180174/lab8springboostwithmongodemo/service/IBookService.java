package sum25.de180174.lab8springboostwithmongodemo.service;

import sum25.de180174.lab8springboostwithmongodemo.model.Book;

import java.util.List;
import java.util.Optional;

public interface IBookService {
    
    // Create
    Book saveBook(Book book);
    
    // Read
    List<Book> getAllBooks();
    
    Optional<Book> getBookById(String id);
    
    Optional<Book> getBookByIsbn(String isbn);
    
    List<Book> getBooksByTitle(String title);
    
    List<Book> getBooksByAuthor(String author);
    
    // Update
    Book updateBook(String id, Book book);
    
    // Delete
    void deleteBook(String id);
    
    void deleteAllBooks();
    
    // Additional methods
    boolean existsById(String id);
    
    long countBooks();
}
