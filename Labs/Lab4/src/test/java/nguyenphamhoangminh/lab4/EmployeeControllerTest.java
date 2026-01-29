package nguyenphamhoangminh.lab4;

import nguyenphamhoangminh.lab4.controllers.EmployeeController;
import nguyenphamhoangminh.lab4.pojos.Employee;
import com.fasterxml.jackson.databind.ObjectMapper;
import nguyenphamhoangminh.lab4.services.IEmployeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * EmployeeControllerTest
 * Unit tests for EmployeeController using MockMvc
 */
@WebMvcTest(EmployeeController.class)
class EmployeeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IEmployeeService employeeService;

    @Autowired
    private ObjectMapper objectMapper;

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
    void testGetAllEmployees() throws Exception {
        // Arrange
        when(employeeService.getAllEmployees()).thenReturn(employeeList);

        // Act & Assert
        mockMvc.perform(get("/api/employees"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].empId").value("E001"))
                .andExpect(jsonPath("$[0].name").value("John Smith"))
                .andExpect(jsonPath("$.length()").value(3));
    }

    @Test
    void testGetAllEmployeesWithPagination() throws Exception {
        // Arrange
        Page<Employee> employeePage = new PageImpl<>(employeeList, PageRequest.of(0, 5), employeeList.size());
        when(employeeService.getAllEmployees(any(Pageable.class))).thenReturn(employeePage);

        // Act & Assert
        mockMvc.perform(get("/api/employees/page")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sortBy", "empId")
                        .param("direction", "asc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].empId").value("E001"))
                .andExpect(jsonPath("$.totalElements").value(3));
    }

    @Test
    void testGetEmployeeById_Found() throws Exception {
        // Arrange
        when(employeeService.getEmployeeById("E001")).thenReturn(testEmployee);

        // Act & Assert
        mockMvc.perform(get("/api/employees/E001"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.empId").value("E001"))
                .andExpect(jsonPath("$.name").value("John Smith"))
                .andExpect(jsonPath("$.designation").value("Software Engineer"))
                .andExpect(jsonPath("$.salary").value(75000));
    }

    @Test
    void testGetEmployeeById_NotFound() throws Exception {
        // Arrange
        when(employeeService.getEmployeeById("E999")).thenReturn(null);

        // Act & Assert
        mockMvc.perform(get("/api/employees/E999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void testCreateEmployee_Success() throws Exception {
        // Arrange
        when(employeeService.createEmployee(any(Employee.class))).thenReturn(testEmployee);

        // Act & Assert
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEmployee)))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.empId").value("E001"))
                .andExpect(jsonPath("$.name").value("John Smith"));
    }

    @Test
    void testCreateEmployee_BadRequest() throws Exception {
        // Arrange
        when(employeeService.createEmployee(any(Employee.class)))
                .thenThrow(new IllegalArgumentException("Invalid employee data"));

        // Act & Assert
        mockMvc.perform(post("/api/employees")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEmployee)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testUpdateEmployee_Success() throws Exception {
        // Arrange
        Employee updatedEmployee = new Employee("E001", "John Smith Updated", "Senior Engineer", 85000);
        when(employeeService.updateEmployee(eq("E001"), any(Employee.class))).thenReturn(updatedEmployee);

        // Act & Assert
        mockMvc.perform(put("/api/employees/E001")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedEmployee)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("John Smith Updated"))
                .andExpect(jsonPath("$.designation").value("Senior Engineer"));
    }

    @Test
    void testUpdateEmployee_NotFound() throws Exception {
        // Arrange
        when(employeeService.updateEmployee(eq("E999"), any(Employee.class))).thenReturn(null);

        // Act & Assert
        mockMvc.perform(put("/api/employees/E999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testEmployee)))
                .andExpect(status().isNotFound());
    }

    @Test
    void testDeleteEmployee_Success() throws Exception {
        // Arrange
        when(employeeService.deleteEmployee("E001")).thenReturn(true);

        // Act & Assert
        mockMvc.perform(delete("/api/employees/E001"))
                .andExpect(status().isNoContent());
    }

    @Test
    void testDeleteEmployee_NotFound() throws Exception {
        // Arrange
        when(employeeService.deleteEmployee("E999")).thenReturn(false);

        // Act & Assert
        mockMvc.perform(delete("/api/employees/E999"))
                .andExpect(status().isNotFound());
    }
}