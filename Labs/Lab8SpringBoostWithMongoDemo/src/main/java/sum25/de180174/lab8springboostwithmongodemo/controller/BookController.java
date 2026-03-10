package sum25.de180174.lab8springboostwithmongodemo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import sum25.de180174.lab8springboostwithmongodemo.model.Book;
import sum25.de180174.lab8springboostwithmongodemo.service.IBookService;

import java.util.Optional;

@Controller
@RequestMapping("/books")
public class BookController {
    
    private final IBookService bookService;
    
    @Autowired
    public BookController(IBookService bookService) {
        this.bookService = bookService;
    }
    
    // Check if user is logged in
    private boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("loggedIn") != null && 
               (Boolean) session.getAttribute("loggedIn");
    }
    
    // List all books
    @GetMapping
    public String listBooks(HttpSession session, Model model) {
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        model.addAttribute("books", bookService.getAllBooks());
        model.addAttribute("username", session.getAttribute("username"));
        return "books/list";
    }
    
    // Show form to create new book
    @GetMapping("/new")
    public String showCreateForm(HttpSession session, Model model) {
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        model.addAttribute("book", new Book());
        model.addAttribute("username", session.getAttribute("username"));
        return "books/form";
    }
    
    // Create new book
    @PostMapping
    public String createBook(
            @ModelAttribute Book book,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        try {
            bookService.saveBook(book);
            return "redirect:/books?success=created";
        } catch (Exception e) {
            model.addAttribute("error", "Error creating book: " + e.getMessage());
            model.addAttribute("book", book);
            return "books/form";
        }
    }
    
    // Show form to edit book
    @GetMapping("/edit/{id}")
    public String showEditForm(
            @PathVariable String id,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        Optional<Book> book = bookService.getBookById(id);
        if (book.isPresent()) {
            model.addAttribute("book", book.get());
            model.addAttribute("username", session.getAttribute("username"));
            return "books/form";
        } else {
            return "redirect:/books?error=notfound";
        }
    }
    
    // Update book
    @PostMapping("/update/{id}")
    public String updateBook(
            @PathVariable String id,
            @ModelAttribute Book book,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        try {
            bookService.updateBook(id, book);
            return "redirect:/books?success=updated";
        } catch (Exception e) {
            model.addAttribute("error", "Error updating book: " + e.getMessage());
            model.addAttribute("book", book);
            return "books/form";
        }
    }
    
    // Delete book
    @GetMapping("/delete/{id}")
    public String deleteBook(
            @PathVariable String id,
            HttpSession session) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        try {
            bookService.deleteBook(id);
            return "redirect:/books?success=deleted";
        } catch (Exception e) {
            return "redirect:/books?error=deletefailed";
        }
    }
    
    // View book details
    @GetMapping("/view/{id}")
    public String viewBook(
            @PathVariable String id,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        Optional<Book> book = bookService.getBookById(id);
        if (book.isPresent()) {
            model.addAttribute("book", book.get());
            model.addAttribute("username", session.getAttribute("username"));
            return "books/view";
        } else {
            return "redirect:/books?error=notfound";
        }
    }
}
