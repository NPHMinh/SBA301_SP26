package sum25.de180174.lab8springboostwithmongodemo.service;

import sum25.de180174.lab8springboostwithmongodemo.model.Student;

import java.util.List;
import java.util.Optional;

public interface IStudentService {
    
    // Create
    Student saveStudent(Student student);
    
    // Read
    List<Student> getAllStudents();
    
    Optional<Student> getStudentById(String id);
    
    List<Student> getStudentsByFirstName(String firstName);
    
    List<Student> getStudentsByLastName(String lastName);
    
    // Update
    Student updateStudent(String id, Student student);
    
    // Delete
    void deleteStudent(String id);
    
    void deleteAllStudents();
    
    // Additional methods
    boolean existsById(String id);
    
    long countStudents();
}
