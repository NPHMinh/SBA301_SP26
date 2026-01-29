package nguyenphamhoangminh.lab4.repositories;

import nguyenphamhoangminh.lab4.pojos.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * EmployeeRepository implementation
 * In-memory storage for employee data
 */
@Repository
public class EmployeeRepository implements IEmployeeRepository {

    private List<Employee> employees;

    /**
     * Constructor - Initialize with sample data
     */
    public EmployeeRepository() {
        this.employees = createList();
    }

    /**
     * Create initial list of employees
     * @return List of sample employees
     */
    private List<Employee> createList() {
        List<Employee> empList = new ArrayList<>();
        empList.add(new Employee("E001", "John Smith", "Software Engineer", 75000));
        empList.add(new Employee("E002", "Jane Doe", "Senior Developer", 95000));
        empList.add(new Employee("E003", "Bob Johnson", "Project Manager", 85000));
        empList.add(new Employee("E004", "Alice Williams", "QA Engineer", 65000));
        empList.add(new Employee("E005", "Charlie Brown", "DevOps Engineer", 80000));
        return empList;
    }

    /**
     * Get all employees
     * @return List of all employees
     */
    @Override
    public List<Employee> getAllEmployees() {
        return new ArrayList<>(employees);
    }

    /**
     * Get employee by ID
     * @param empId Employee ID
     * @return Employee object or null if not found
     */
    @Override
    public Employee getEmployeeById(String empId) {
        return employees.stream()
                .filter(emp -> emp.getEmpId().equals(empId))
                .findFirst()
                .orElse(null);
    }

    /**
     * Delete employee by index
     * @param id Employee index in the list
     * @return Deleted employee or null if index is invalid
     */
    @Override
    public Employee delete(int id) {
        if (id >= 0 && id < employees.size()) {
            return employees.remove(id);
        }
        return null;
    }

    /**
     * Create new employee
     * @param employee Employee object to create
     * @return Created employee
     */
    @Override
    public Employee create(Employee employee) {
        employees.add(employee);
        return employee;
    }

    /**
     * Find all employees with sorting
     * @param sort Sort criteria
     * @return Sorted list of employees
     */
    @Override
    public List<Employee> findAll(Sort sort) {
        List<Employee> sortedList = new ArrayList<>(employees);

        if (sort != null && sort.isSorted()) {
            for (Sort.Order order : sort) {
                Comparator<Employee> comparator = getComparator(order.getProperty());

                if (comparator != null) {
                    if (order.isDescending()) {
                        comparator = comparator.reversed();
                    }
                    sortedList.sort(comparator);
                }
            }
        }

        return sortedList;
    }

    /**
     * Find all employees with pagination
     * @param pageable Pagination information
     * @return Page of employees
     */
    @Override
    public Page<Employee> findAll(Pageable pageable) {
        List<Employee> allEmployees = employees;

        // Apply sorting if provided
        if (pageable.getSort().isSorted()) {
            allEmployees = findAll(pageable.getSort());
        }

        // Calculate pagination
        int pageSize = pageable.getPageSize();
        int currentPage = pageable.getPageNumber();
        int startItem = currentPage * pageSize;

        List<Employee> pageList;

        if (startItem >= allEmployees.size()) {
            pageList = new ArrayList<>();
        } else {
            int toIndex = Math.min(startItem + pageSize, allEmployees.size());
            pageList = allEmployees.subList(startItem, toIndex);
        }

        return new PageImpl<>(pageList, pageable, allEmployees.size());
    }

    /**
     * Get comparator for sorting by property
     * @param property Property name to sort by
     * @return Comparator for the property
     */
    private Comparator<Employee> getComparator(String property) {
        switch (property.toLowerCase()) {
            case "empid":
                return Comparator.comparing(Employee::getEmpId);
            case "name":
                return Comparator.comparing(Employee::getName);
            case "designation":
                return Comparator.comparing(Employee::getDesignation);
            case "salary":
                return Comparator.comparing(Employee::getSalary);
            default:
                return null;
        }
    }
}