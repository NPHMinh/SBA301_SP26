package com.fu.a3nguyenphamhoangminh_se18d04.repository;

import com.fu.a3nguyenphamhoangminh_se18d04.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    // Spring Data JPA đã tự động cung cấp sẵn các hàm như findAll(), findById(), save(), deleteById()...
    // Có thể tự định nghĩa thêm hàm tìm kiếm theo Email (rất cần cho phần Login bằng JWT)
    Customer findByEmailAddress(String emailAddress);
}