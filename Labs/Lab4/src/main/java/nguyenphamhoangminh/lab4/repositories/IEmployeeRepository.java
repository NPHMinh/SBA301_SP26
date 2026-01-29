package nguyenphamhoangminh.lab4.repositories;

import nguyenphamhoangminh.lab4.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * IEmployeeRepository interface
 * Extends PagingAndSortingRepository for pagination and sorting support
 */
public interface IEmployeeRepository extends PagingAndSortingRepository<Employee, String> {

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
     * Delete employee by ID
     * @param id Employee ID (as integer index)
     * @return Deleted employee or null if not found
     */
    Employee delete(int id);

    /**
     * Create new employee
     * @param employee Employee object to create
     * @return Created employee
     */
    Employee create(Employee employee);

    /**
     * Find all employees with sorting
     * @param sort Sort criteria
     * @return Sorted list of employees
     */
    List<Employee> findAll(Sort sort);

    /**
     * Find all employees with pagination
     * @param pageable Pagination information
     * @return Page of employees
     */
    Page<Employee> findAll(Pageable pageable);
}