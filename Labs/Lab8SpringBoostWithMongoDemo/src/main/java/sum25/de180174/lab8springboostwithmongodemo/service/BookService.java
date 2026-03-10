package sum25.de180174.lab8springboostwithmongodemo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sum25.de180174.lab8springboostwithmongodemo.model.Book;
import sum25.de180174.lab8springboostwithmongodemo.repository.IBookRepository;

import java.util.List;
import java.util.Optional;

@Service
public class BookService implements IBookService {
    
    private final IBookRepository bookRepository;
    
    @Autowired
    public BookService(IBookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }
    
    @Override
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }
    
    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }
    
    @Override
    public Optional<Book> getBookById(String id) {
        return bookRepository.findById(id);
    }
    
    @Override
    public Optional<Book> getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn);
    }
    
    @Override
    public List<Book> getBooksByTitle(String title) {
        return bookRepository.findByTitle(title);
    }
    
    @Override
    public List<Book> getBooksByAuthor(String author) {
        return bookRepository.findByAuthor(author);
    }
    
    @Override
    public Book updateBook(String id, Book book) {
        if (bookRepository.existsById(id)) {
            book.setId(id);
            return bookRepository.save(book);
        }
        throw new RuntimeException("Book not found with id: " + id);
    }
    
    @Override
    public void deleteBook(String id) {
        bookRepository.deleteById(id);
    }
    
    @Override
    public void deleteAllBooks() {
        bookRepository.deleteAll();
    }
    
    @Override
    public boolean existsById(String id) {
        return bookRepository.existsById(id);
    }
    
    @Override
    public long countBooks() {
        return bookRepository.count();
    }
}
