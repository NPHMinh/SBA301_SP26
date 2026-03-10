package sum25.de180174.lab8springboostwithmongodemo.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import sum25.de180174.lab8springboostwithmongodemo.model.Student;

import java.util.List;

@Repository
public interface IStudentRepository extends MongoRepository<Student, String> {
    
    // Custom query methods
    List<Student> findByFirstName(String firstName);
    
    List<Student> findByLastName(String lastName);
    
    List<Student> findByFirstNameAndLastName(String firstName, String lastName);
    
    List<Student> findByMarksGreaterThan(Double marks);
    
    List<Student> findByMarksLessThan(Double marks);
}
