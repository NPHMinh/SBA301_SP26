package vn.edu.fu.newsmanagement.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.edu.fu.newsmanagement.pojos.NewsArticle;
import vn.edu.fu.newsmanagement.repositories.NewsArticleRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NewsArticleService {

    @Autowired
    private NewsArticleRepository newsArticleRepository;

    public List<NewsArticle> getAllNews() {
        return newsArticleRepository.findAll();
    }

    public NewsArticle getNewsById(Integer id) {
        return newsArticleRepository.findById(id).orElse(null);
    }

    public List<NewsArticle> getNewsByAccountId(Integer accountId) {
        return newsArticleRepository.findByCreatedBy_AccountId(accountId);
    }

    public NewsArticle createNews(NewsArticle newsArticle) {
        newsArticle.setNewsArticleId(null); // Đảm bảo tạo mới
        newsArticle.setCreatedDate(LocalDateTime.now());
        newsArticle.setModifiedDate(LocalDateTime.now());
        newsArticle.setCreatedBy(newsArticle.getCreatedBy());


        if (newsArticle.getNewsStatus() == null) {
            newsArticle.setNewsStatus(true);
        }
        return newsArticleRepository.save(newsArticle);
    }

    public NewsArticle updateNews(Integer id, NewsArticle newsDetails) {
        NewsArticle existingNews = newsArticleRepository.findById(id).orElse(null);
        if (existingNews == null) return null;

        existingNews.setNewsTitle(newsDetails.getNewsTitle());
        existingNews.setHeadline(newsDetails.getHeadline());
        existingNews.setNewsContent(newsDetails.getNewsContent());
        existingNews.setNewsSource(newsDetails.getNewsSource());
        existingNews.setNewsStatus(newsDetails.getNewsStatus());
        existingNews.setCategory(newsDetails.getCategory());
        existingNews.setModifiedDate(LocalDateTime.now());
        existingNews.setUpdatedBy(newsDetails.getUpdatedBy());

        // Lưu ý: Tags xử lý riêng nếu có quan hệ ManyToMany
        return newsArticleRepository.save(existingNews);
    }

    public void deleteNews(Integer id) {
        if (newsArticleRepository.existsById(id)) {
            newsArticleRepository.deleteById(id);
        }
    }
}