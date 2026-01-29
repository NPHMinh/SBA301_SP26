package nguyenphamhoangminh.lab4;

import nguyenphamhoangminh.lab4.pojos.Employee;
import nguyenphamhoangminh.lab4.repositories.IEmployeeRepository;
import nguyenphamhoangminh.lab4.services.EmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * EmployeeServiceTest
 * Unit tests for EmployeeService
 */
@ExtendWith(MockitoExtension.class)
class EmployeeServiceTest {

    @Mock
    private IEmployeeRepository employeeRepository;

    @InjectMocks
    private EmployeeService employeeService;

    private Employee testEmployee;
    private List<Employee> employeeList;

    @BeforeEach
    void setUp() {
        testEmployee = new Employee("E001", "John Smith", "Software Engineer", 75000);

        Employee emp2 = new Employee("E002", "Jane Doe", "Senior Developer", 95000);
        Employee emp3 = new Employee("E003", "Bob Johnson", "Project Manager", 85000);

        employeeList = Arrays.asList(testEmployee, emp2, emp3);
    }

    @Test
    void testGetAllEmployees() {
        // Arrange
        when(employeeRepository.getAllEmployees()).thenReturn(employeeList);

        // Act
        List<Employee> result = employeeService.getAllEmployees();

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals("E001", result.get(0).getEmpId());
        verify(employeeRepository, times(1)).getAllEmployees();
    }

    @Test
    void testGetEmployeeById_Found() {
        // Arrange
        when(employeeRepository.getEmployeeById("E001")).thenReturn(testEmployee);

        // Act
        Employee result = employeeService.getEmployeeById("E001");

        // Assert
        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        assertEquals("John Smith", result.getName());
        verify(employeeRepository, times(1)).getEmployeeById("E001");
    }

    @Test
    void testGetEmployeeById_NotFound() {
        // Arrange
        when(employeeRepository.getEmployeeById("E999")).thenReturn(null);

        // Act
        Employee result = employeeService.getEmployeeById("E999");

        // Assert
        assertNull(result);
        verify(employeeRepository, times(1)).getEmployeeById("E999");
    }

    @Test
    void testCreateEmployee_Success() {
        // Arrange
        when(employeeRepository.getEmployeeById("E001")).thenReturn(null);
        when(employeeRepository.create(testEmployee)).thenReturn(testEmployee);

        // Act
        Employee result = employeeService.createEmployee(testEmployee);

        // Assert
        assertNotNull(result);
        assertEquals("E001", result.getEmpId());
        verify(employeeRepository, times(1)).create(testEmployee);
    }

    @Test
    void testCreateEmployee_NullId() {
        // Arrange
        Employee invalidEmployee = new Employee(null, "John", "Engineer", 75000);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.createEmployee(invalidEmployee);
        });
        verify(employeeRepository, never()).create(any());
    }

    @Test
    void testCreateEmployee_EmptyId() {
        // Arrange
        Employee invalidEmployee = new Employee("", "John", "Engineer", 75000);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.createEmployee(invalidEmployee);
        });
        verify(employeeRepository, never()).create(any());
    }

    @Test
    void testCreateEmployee_NullName() {
        // Arrange
        Employee invalidEmployee = new Employee("E001", null, "Engineer", 75000);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.createEmployee(invalidEmployee);
        });
        verify(employeeRepository, never()).create(any());
    }

    @Test
    void testCreateEmployee_AlreadyExists() {
        // Arrange
        when(employeeRepository.getEmployeeById("E001")).thenReturn(testEmployee);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            employeeService.createEmployee(testEmployee);
        });
        verify(employeeRepository, never()).create(any());
    }

    @Test
    void testUpdateEmployee_Success() {
        // Arrange
        Employee updatedData = new Employee("E001", "John Smith Updated", "Senior Engineer", 85000);
        when(employeeRepository.getEmployeeById("E001")).thenReturn(testEmployee);

        // Act
        Employee result = employeeService.updateEmployee("E001", updatedData);

        // Assert
        assertNotNull(result);
        assertEquals("John Smith Updated", result.getName());
        assertEquals("Senior Engineer", result.getDesignation());
        assertEquals(85000, result.getSalary());
    }

    @Test
    void testUpdateEmployee_NotFound() {
        // Arrange
        when(employeeRepository.getEmployeeById("E999")).thenReturn(null);

        // Act
        Employee result = employeeService.updateEmployee("E999", testEmployee);

        // Assert
        assertNull(result);
    }

    @Test
    void testDeleteEmployee_Success() {
        // Arrange
        when(employeeRepository.getAllEmployees()).thenReturn(employeeList);
        when(employeeRepository.delete(0)).thenReturn(testEmployee);

        // Act
        boolean result = employeeService.deleteEmployee("E001");

        // Assert
        assertTrue(result);
        verify(employeeRepository, times(1)).delete(0);
    }

    @Test
    void testDeleteEmployee_NotFound() {
        // Arrange
        when(employeeRepository.getAllEmployees()).thenReturn(employeeList);

        // Act
        boolean result = employeeService.deleteEmployee("E999");

        // Assert
        assertFalse(result);
        verify(employeeRepository, never()).delete(anyInt());
    }

    @Test
    void testGetAllEmployeesWithSort() {
        // Arrange
        Sort sort = Sort.by(Sort.Direction.ASC, "name");
        when(employeeRepository.findAll(any(Sort.class))).thenReturn(employeeList);

        // Act
        List<Employee> result = employeeService.getAllEmployees(sort);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.size());
        verify(employeeRepository, times(1)).findAll(any(Sort.class));
    }

    @Test
    void testGetAllEmployeesWithPagination() {
        // Arrange
        PageRequest pageRequest = PageRequest.of(0, 5);
        Page<Employee> employeePage = new PageImpl<>(employeeList, pageRequest, employeeList.size());
        when(employeeRepository.findAll(any(Pageable.class))).thenReturn(employeePage);

        // Act
        Page<Employee> result = employeeService.getAllEmployees(pageRequest);

        // Assert
        assertNotNull(result);
        assertEquals(3, result.getTotalElements());
        assertEquals(3, result.getContent().size());
        verify(employeeRepository, times(1)).findAll(any(Pageable.class));
    }
}