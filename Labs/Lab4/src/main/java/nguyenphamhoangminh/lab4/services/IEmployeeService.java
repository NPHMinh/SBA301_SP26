package nguyenphamhoangminh.lab4.services;

import nguyenphamhoangminh.lab4.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

/**
 * IEmployeeService interface
 * Defines business logic operations for Employee management
 */
public interface IEmployeeService {

    /**
     * Get all employees
     * @return List of all employees
     */
    List<Employee> getAllEmployees();

    /**
     * Get employee by ID
     * @param empId Employee ID
     * @return Employee object or null if not found
     */
    Employee getEmployeeById(String empId);

    /**
     * Create new employee
     * @param employee Employee object to create
     * @return Created employee
     */
    Employee createEmployee(Employee employee);

    /**
     * Update existing employee
     * @param empId Employee ID to update
     * @param employee Updated employee data
     * @return Updated employee or null if not found
     */
    Employee updateEmployee(String empId, Employee employee);

    /**
     * Delete employee by ID
     * @param empId Employee ID to delete
     * @return true if deleted, false if not found
     */
    boolean deleteEmployee(String empId);

    /**
     * Get all employees with sorting
     * @param sort Sort criteria
     * @return Sorted list of employees
     */
    List<Employee> getAllEmployees(Sort sort);

    /**
     * Get all employees with pagination
     * @param pageable Pagination information
     * @return Page of employees
     */
    Page<Employee> getAllEmployees(Pageable pageable);
}
