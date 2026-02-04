package vn.edu.fu.newsmanagement.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.edu.fu.newsmanagement.pojos.*;
import vn.edu.fu.newsmanagement.repositories.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DatabaseSeeder {

    @Bean
    CommandLineRunner initDatabase(
            SystemAccountRepository accountRepo,
            CategoryRepository categoryRepo,
            TagRepository tagRepo,
            NewsArticleRepository newsRepo) {
        return args -> {
            // Chỉ tạo dữ liệu nếu bảng Account chưa có gì
            if (accountRepo.count() == 0) {

                // 1. Tạo Accounts
                SystemAccount admin = new SystemAccount();
                admin.setAccountName("Administrator");
                admin.setAccountEmail("admin@news.com");
                admin.setAccountPassword("123");
                admin.setAccountRole(1); // 1: Admin

                SystemAccount staff = new SystemAccount();
                staff.setAccountName("Staff User");
                staff.setAccountEmail("staff@news.com");
                staff.setAccountPassword("123");
                staff.setAccountRole(2); // 2: Staff

                accountRepo.saveAll(Arrays.asList(admin, staff));

                // 2. Tạo Categories
                Category catTech = new Category();
                catTech.setCategoryName("Công nghệ");
                catTech.setIsActive(true);
                Category savedTech = categoryRepo.save(catTech); // Lưu để lấy ID làm cha

                Category catMobile = new Category();
                catMobile.setCategoryName("Điện thoại");
                catMobile.setParentCategory(savedTech); // Set cha
                catMobile.setIsActive(true);

                categoryRepo.save(catMobile);

                // 3. Tạo Tags
                Tag tagHot = new Tag();
                tagHot.setTagName("Hot News");
                Tag tagReview = new Tag();
                tagReview.setTagName("Review");

                List<Tag> savedTags = tagRepo.saveAll(Arrays.asList(tagHot, tagReview));

                // 4. Tạo News Article
                NewsArticle news = new NewsArticle();
                news.setNewsTitle("Review Samsung S24 Ultra");
                news.setHeadline("Siêu phẩm AI");
                news.setNewsContent("Nội dung chi tiết bài viết...");
                news.setNewsSource("Samsung");
                news.setNewsStatus(true);
                news.setCreatedDate(LocalDateTime.now());
                news.setModifiedDate(LocalDateTime.now());

                news.setCategory(catMobile); // Gắn Category
                news.setCreatedBy(staff);    // Gắn người tạo
                news.setUpdatedBy(admin);    // Gắn người sửa
                news.setTags(savedTags);     // Gắn Tags (Many-to-Many)

                newsRepo.save(news);

                System.out.println(">>> Đã khởi tạo dữ liệu mẫu thành công!");
            }
        };
    }
}