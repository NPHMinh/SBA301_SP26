package nguyenphamhoangminh.lab4;

import nguyenphamhoangminh.lab4.pojos.Employee;
import nguyenphamhoangminh.lab4.repositories.EmployeeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * EmployeeRepositoryTest
 * Unit tests for EmployeeRepository
 */
class EmployeeRepositoryTest {

    private EmployeeRepository employeeRepository;

    @BeforeEach
    void setUp() {
        employeeRepository = new EmployeeRepository();
    }

    @Test
    void testGetAllEmployees() {
        // Act
        List<Employee> employees = employeeRepository.getAllEmployees();

        // Assert
        assertNotNull(employees);
        assertEquals(5, employees.size());
        assertEquals("E001", employees.get(0).getEmpId());
    }

    @Test
    void testGetEmployeeById_Found() {
        // Act
        Employee employee = employeeRepository.getEmployeeById("E001");

        // Assert
        assertNotNull(employee);
        assertEquals("E001", employee.getEmpId());
        assertEquals("John Smith", employee.getName());
        assertEquals("Software Engineer", employee.getDesignation());
        assertEquals(75000, employee.getSalary());
    }

    @Test
    void testGetEmployeeById_NotFound() {
        // Act
        Employee employee = employeeRepository.getEmployeeById("E999");

        // Assert
        assertNull(employee);
    }

    @Test
    void testCreate() {
        // Arrange
        Employee newEmployee = new Employee("E006", "Test User", "Test Role", 60000);

        // Act
        Employee created = employeeRepository.create(newEmployee);
        List<Employee> allEmployees = employeeRepository.getAllEmployees();

        // Assert
        assertNotNull(created);
        assertEquals("E006", created.getEmpId());
        assertEquals(6, allEmployees.size());
    }

    @Test
    void testDelete_Success() {
        // Act
        Employee deleted = employeeRepository.delete(0);
        List<Employee> remaining = employeeRepository.getAllEmployees();

        // Assert
        assertNotNull(deleted);
        assertEquals("E001", deleted.getEmpId());
        assertEquals(4, remaining.size());
    }

    @Test
    void testDelete_InvalidIndex() {
        // Act
        Employee deleted = employeeRepository.delete(999);

        // Assert
        assertNull(deleted);
    }

    @Test
    void testFindAllWithSort_Ascending() {
        // Arrange
        Sort sort = Sort.by(Sort.Direction.ASC, "name");

        // Act
        List<Employee> employees = employeeRepository.findAll(sort);

        // Assert
        assertNotNull(employees);
        assertEquals(5, employees.size());
        // Alice Williams should be first alphabetically
        assertEquals("Alice Williams", employees.get(0).getName());
    }

    @Test
    void testFindAllWithSort_Descending() {
        // Arrange
        Sort sort = Sort.by(Sort.Direction.DESC, "salary");

        // Act
        List<Employee> employees = employeeRepository.findAll(sort);

        // Assert
        assertNotNull(employees);
        assertEquals(5, employees.size());
        // Jane Doe has highest salary (95000)
        assertEquals(95000, employees.get(0).getSalary());
    }

    @Test
    void testFindAllWithPagination_FirstPage() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 2);

        // Act
        Page<Employee> page = employeeRepository.findAll(pageRequest);

        // Assert
        assertNotNull(page);
        assertEquals(2, page.getContent().size());
        assertEquals(5, page.getTotalElements());
        assertEquals(3, page.getTotalPages());
        assertEquals(0, page.getNumber());
        assertTrue(page.hasNext());
        assertFalse(page.hasPrevious());
    }

    @Test
    void testFindAllWithPagination_SecondPage() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(1, 2);

        // Act
        Page<Employee> page = employeeRepository.findAll(pageRequest);

        // Assert
        assertNotNull(page);
        assertEquals(2, page.getContent().size());
        assertEquals(5, page.getTotalElements());
        assertEquals(1, page.getNumber());
        assertTrue(page.hasNext());
        assertTrue(page.hasPrevious());
    }

    @Test
    void testFindAllWithPagination_LastPage() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(2, 2);

        // Act
        Page<Employee> page = employeeRepository.findAll(pageRequest);

        // Assert
        assertNotNull(page);
        assertEquals(1, page.getContent().size()); // Only 1 item on last page
        assertEquals(5, page.getTotalElements());
        assertEquals(2, page.getNumber());
        assertFalse(page.hasNext());
        assertTrue(page.hasPrevious());
    }

    @Test
    void testFindAllWithPaginationAndSort() {
        // Arrange
        Sort sort = Sort.by(Sort.Direction.DESC, "salary");
        PageRequest pageRequest = PageRequest.of(0, 3, sort);

        // Act
        Page<Employee> page = employeeRepository.findAll(pageRequest);

        // Assert
        assertNotNull(page);
        assertEquals(3, page.getContent().size());
        // Verify sorted by salary descending
        assertTrue(page.getContent().get(0).getSalary() >= page.getContent().get(1).getSalary());
        assertTrue(page.getContent().get(1).getSalary() >= page.getContent().get(2).getSalary());
    }

    @Test
    void testFindAllWithPagination_EmptyPage() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(10, 2); // Page beyond available data

        // Act
        Page<Employee> page = employeeRepository.findAll(pageRequest);

        // Assert
        assertNotNull(page);
        assertEquals(0, page.getContent().size());
        assertEquals(5, page.getTotalElements());
        assertFalse(page.hasNext());
    }

    @Test
    void testFindAllWithSort_MultipleFields() {
        // Arrange
        Sort sort = Sort.by(Sort.Order.asc("designation"), Sort.Order.desc("salary"));

        // Act
        List<Employee> employees = employeeRepository.findAll(sort);

        // Assert
        assertNotNull(employees);
        assertEquals(5, employees.size());
    }
}
