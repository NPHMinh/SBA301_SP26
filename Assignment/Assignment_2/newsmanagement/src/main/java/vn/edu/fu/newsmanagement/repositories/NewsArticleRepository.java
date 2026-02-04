package vn.edu.fu.newsmanagement.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.edu.fu.newsmanagement.pojos.NewsArticle;
import java.util.List;

@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, Integer> {
    // Tìm bài viết theo ID người tạo
    List<NewsArticle> findByCreatedBy_AccountId(Integer accountId);

    // Tìm bài viết theo Category (nếu cần)
    List<NewsArticle> findByCategory_CategoryId(Integer categoryId);
}