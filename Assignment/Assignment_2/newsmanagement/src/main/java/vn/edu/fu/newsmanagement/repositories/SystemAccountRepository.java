package vn.edu.fu.newsmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fu.newsmanagement.pojos.SystemAccount;
import java.util.Optional;

@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Integer> {
    // Tìm user để login
    Optional<SystemAccount> findByAccountEmail(String accountEmail);
}