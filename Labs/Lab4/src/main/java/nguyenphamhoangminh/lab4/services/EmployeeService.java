package nguyenphamhoangminh.lab4.services;

import nguyenphamhoangminh.lab4.pojos.Employee;
import nguyenphamhoangminh.lab4.repositories.IEmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * EmployeeService implementation
 * Implements business logic for Employee management
 */
@Service
public class EmployeeService implements IEmployeeService {

    @Autowired
    private IEmployeeRepository employeeRepository;

    /**
     * Get all employees
     * @return List of all employees
     */
    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.getAllEmployees();
    }

    /**
     * Get employee by ID
     * @param empId Employee ID
     * @return Employee object or null if not found
     */
    @Override
    public Employee getEmployeeById(String empId) {
        return employeeRepository.getEmployeeById(empId);
    }

    /**
     * Create new employee
     * @param employee Employee object to create
     * @return Created employee
     */
    @Override
    public Employee createEmployee(Employee employee) {
        // Business logic: Validate employee data
        if (employee.getEmpId() == null || employee.getEmpId().isEmpty()) {
            throw new IllegalArgumentException("Employee ID cannot be null or empty");
        }

        if (employee.getName() == null || employee.getName().isEmpty()) {
            throw new IllegalArgumentException("Employee name cannot be null or empty");
        }

        // Check if employee already exists
        Employee existingEmployee = employeeRepository.getEmployeeById(employee.getEmpId());
        if (existingEmployee != null) {
            throw new IllegalArgumentException("Employee with ID " + employee.getEmpId() + " already exists");
        }

        return employeeRepository.create(employee);
    }

    /**
     * Update existing employee
     * @param empId Employee ID to update
     * @param employee Updated employee data
     * @return Updated employee or null if not found
     */
    @Override
    public Employee updateEmployee(String empId, Employee employee) {
        Employee existingEmployee = employeeRepository.getEmployeeById(empId);

        if (existingEmployee == null) {
            return null;
        }

        // Update employee data
        if (employee.getName() != null) {
            existingEmployee.setName(employee.getName());
        }
        if (employee.getDesignation() != null) {
            existingEmployee.setDesignation(employee.getDesignation());
        }
        if (employee.getSalary() > 0) {
            existingEmployee.setSalary(employee.getSalary());
        }

        return existingEmployee;
    }

    /**
     * Delete employee by ID
     * @param empId Employee ID to delete
     * @return true if deleted, false if not found
     */
    @Override
    public boolean deleteEmployee(String empId) {
        List<Employee> employees = employeeRepository.getAllEmployees();

        for (int i = 0; i < employees.size(); i++) {
            if (employees.get(i).getEmpId().equals(empId)) {
                Employee deleted = employeeRepository.delete(i);
                return deleted != null;
            }
        }

        return false;
    }

    /**
     * Get all employees with sorting
     * @param sort Sort criteria
     * @return Sorted list of employees
     */
    @Override
    public List<Employee> getAllEmployees(Sort sort) {
        return employeeRepository.findAll(sort);
    }

    /**
     * Get all employees with pagination
     * @param pageable Pagination information
     * @return Page of employees
     */
    @Override
    public Page<Employee> getAllEmployees(Pageable pageable) {
        return employeeRepository.findAll(pageable);
    }
}
