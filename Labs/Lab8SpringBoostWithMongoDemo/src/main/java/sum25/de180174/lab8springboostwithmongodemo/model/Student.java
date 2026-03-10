package sum25.de180174.lab8springboostwithmongodemo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "STUDENTS")
public class Student {
    
    @Id
    private String id;
    private String firstName;
    private String lastName;
    private Double marks;
    
    @DBRef
    private List<Book> borrowedBooks;
    
    // Constructors
    public Student() {
        this.borrowedBooks = new ArrayList<>();
    }
    
    public Student(String firstName, String lastName, Double marks) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.marks = marks;
        this.borrowedBooks = new ArrayList<>();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public Double getMarks() {
        return marks;
    }
    
    public void setMarks(Double marks) {
        this.marks = marks;
    }
    
    public List<Book> getBorrowedBooks() {
        return borrowedBooks;
    }
    
    public void setBorrowedBooks(List<Book> borrowedBooks) {
        this.borrowedBooks = borrowedBooks;
    }
    
    public void addBook(Book book) {
        this.borrowedBooks.add(book);
    }
    
    public void removeBook(Book book) {
        this.borrowedBooks.remove(book);
    }
    
    @Override
    public String toString() {
        return "Student{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", marks=" + marks +
                ", borrowedBooks=" + borrowedBooks +
                '}';
    }
}
