package sum25.de180174.lab8springboostwithmongodemo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class LoginController {
    
    // Default admin credentials (in production, use database with encrypted passwords)
    private static final String DEFAULT_USERNAME = "admin";
    private static final String DEFAULT_PASSWORD = "admin123";
    
    @GetMapping("/")
    public String redirectToLogin() {
        return "redirect:/login";
    }
    
    @GetMapping("/login")
    public String showLoginPage(HttpSession session, Model model) {
        // If already logged in, redirect to home
        if (session.getAttribute("loggedIn") != null && 
            (Boolean) session.getAttribute("loggedIn")) {
            return "redirect:/home";
        }
        return "login";
    }
    
    @PostMapping("/login")
    public String processLogin(
            @RequestParam("username") String username,
            @RequestParam("password") String password,
            HttpSession session,
            Model model) {
        
        // Validate credentials
        if (DEFAULT_USERNAME.equals(username) && DEFAULT_PASSWORD.equals(password)) {
            // Set session attributes
            session.setAttribute("loggedIn", true);
            session.setAttribute("username", username);
            return "redirect:/home";
        } else {
            // Login failed
            model.addAttribute("error", "Invalid username or password");
            return "login";
        }
    }
    
    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/login";
    }
}
