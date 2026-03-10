package sum25.de180174.lab8springboostwithmongodemo.controller;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import sum25.de180174.lab8springboostwithmongodemo.model.Student;
import sum25.de180174.lab8springboostwithmongodemo.service.IStudentService;

import java.util.Optional;

@Controller
@RequestMapping("/students")
public class StudentController {
    
    private final IStudentService studentService;
    
    @Autowired
    public StudentController(IStudentService studentService) {
        this.studentService = studentService;
    }
    
    // Check if user is logged in
    private boolean isLoggedIn(HttpSession session) {
        return session.getAttribute("loggedIn") != null && 
               (Boolean) session.getAttribute("loggedIn");
    }
    
    // List all students
    @GetMapping
    public String listStudents(HttpSession session, Model model) {
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        model.addAttribute("students", studentService.getAllStudents());
        model.addAttribute("username", session.getAttribute("username"));
        return "students/list";
    }
    
    // Show form to create new student
    @GetMapping("/new")
    public String showCreateForm(HttpSession session, Model model) {
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        model.addAttribute("student", new Student());
        model.addAttribute("username", session.getAttribute("username"));
        return "students/form";
    }
    
    // Create new student
    @PostMapping
    public String createStudent(
            @ModelAttribute Student student,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        try {
            studentService.saveStudent(student);
            return "redirect:/students?success=created";
        } catch (Exception e) {
            model.addAttribute("error", "Error creating student: " + e.getMessage());
            model.addAttribute("student", student);
            return "students/form";
        }
    }
    
    // Show form to edit student
    @GetMapping("/edit/{id}")
    public String showEditForm(
            @PathVariable String id,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        Optional<Student> student = studentService.getStudentById(id);
        if (student.isPresent()) {
            model.addAttribute("student", student.get());
            model.addAttribute("username", session.getAttribute("username"));
            return "students/form";
        } else {
            return "redirect:/students?error=notfound";
        }
    }
    
    // Update student
    @PostMapping("/update/{id}")
    public String updateStudent(
            @PathVariable String id,
            @ModelAttribute Student student,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        try {
            studentService.updateStudent(id, student);
            return "redirect:/students?success=updated";
        } catch (Exception e) {
            model.addAttribute("error", "Error updating student: " + e.getMessage());
            model.addAttribute("student", student);
            return "students/form";
        }
    }
    
    // Delete student
    @GetMapping("/delete/{id}")
    public String deleteStudent(
            @PathVariable String id,
            HttpSession session) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        try {
            studentService.deleteStudent(id);
            return "redirect:/students?success=deleted";
        } catch (Exception e) {
            return "redirect:/students?error=deletefailed";
        }
    }
    
    // View student details
    @GetMapping("/view/{id}")
    public String viewStudent(
            @PathVariable String id,
            HttpSession session,
            Model model) {
        
        if (!isLoggedIn(session)) {
            return "redirect:/login";
        }
        
        Optional<Student> student = studentService.getStudentById(id);
        if (student.isPresent()) {
            model.addAttribute("student", student.get());
            model.addAttribute("username", session.getAttribute("username"));
            return "students/view";
        } else {
            return "redirect:/students?error=notfound";
        }
    }
}
