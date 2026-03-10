package sum25.de180174.lab8springboostwithmongodemo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import sum25.de180174.lab8springboostwithmongodemo.model.Student;
import sum25.de180174.lab8springboostwithmongodemo.repository.IStudentRepository;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService implements IStudentService {
    
    private final IStudentRepository studentRepository;
    
    @Autowired
    public StudentService(IStudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }
    
    @Override
    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }
    
    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }
    
    @Override
    public Optional<Student> getStudentById(String id) {
        return studentRepository.findById(id);
    }
    
    @Override
    public List<Student> getStudentsByFirstName(String firstName) {
        return studentRepository.findByFirstName(firstName);
    }
    
    @Override
    public List<Student> getStudentsByLastName(String lastName) {
        return studentRepository.findByLastName(lastName);
    }
    
    @Override
    public Student updateStudent(String id, Student student) {
        if (studentRepository.existsById(id)) {
            student.setId(id);
            return studentRepository.save(student);
        }
        throw new RuntimeException("Student not found with id: " + id);
    }
    
    @Override
    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }
    
    @Override
    public void deleteAllStudents() {
        studentRepository.deleteAll();
    }
    
    @Override
    public boolean existsById(String id) {
        return studentRepository.existsById(id);
    }
    
    @Override
    public long countStudents() {
        return studentRepository.count();
    }
}
