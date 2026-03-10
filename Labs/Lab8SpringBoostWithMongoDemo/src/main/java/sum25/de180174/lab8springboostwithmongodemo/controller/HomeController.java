package sum25.de180174.lab8springboostwithmongodemo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import sum25.de180174.lab8springboostwithmongodemo.service.IBookService;
import sum25.de180174.lab8springboostwithmongodemo.service.IStudentService;

@Controller
public class HomeController {
    
    private final IStudentService studentService;
    private final IBookService bookService;
    
    @Autowired
    public HomeController(IStudentService studentService, IBookService bookService) {
        this.studentService = studentService;
        this.bookService = bookService;
    }
    
    @GetMapping("/home")
    public String showHomePage(HttpSession session, Model model) {
        // Check if user is logged in
        if (session.getAttribute("loggedIn") == null || 
            !(Boolean) session.getAttribute("loggedIn")) {
            return "redirect:/login";
        }
        
        // Add statistics to the model
        model.addAttribute("username", session.getAttribute("username"));
        model.addAttribute("totalStudents", studentService.countStudents());
        model.addAttribute("totalBooks", bookService.countBooks());
        
        return "home";
    }
}
