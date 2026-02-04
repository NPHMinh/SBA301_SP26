package vn.edu.fu.newsmanagement.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.fu.newsmanagement.pojos.SystemAccount;
import vn.edu.fu.newsmanagement.repositories.SystemAccountRepository;

import java.util.List;

@Service
public class SystemAccountService {
    @Autowired
    private SystemAccountRepository accountRepository;

    public List<SystemAccount> getAllAccounts() {
        return accountRepository.findAll();
    }

    public SystemAccount createAccount(SystemAccount account) {
        account.setAccountId(null);
        return accountRepository.save(account);
    }

    // Hàm Login
    public SystemAccount authenticate(String email, String password) {
        SystemAccount account = accountRepository.findByAccountEmail(email).orElse(null);
        if (account != null && account.getAccountPassword().equals(password)) {
            return account;
        }
        return null;
    }

    // --- THÊM HÀM NÀY ĐỂ SỬA LỖI 404 ---
    public SystemAccount getAccountById(Integer id) {
        return accountRepository.findById(id).orElse(null);
    }

    // Thêm hàm update profile luôn (cho UserProfile.jsx dùng)
    public SystemAccount updateAccount(Integer id, SystemAccount details) {
        SystemAccount acc = accountRepository.findById(id).orElse(null);
        if (acc != null) {
            acc.setAccountName(details.getAccountName());
            acc.setAccountPassword(details.getAccountPassword());
            // Không cho phép user tự đổi Role hoặc Email nếu không cần thiết
            return accountRepository.save(acc);
        }
        return null;
    }
}