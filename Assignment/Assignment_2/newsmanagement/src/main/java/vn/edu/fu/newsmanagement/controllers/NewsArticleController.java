package vn.edu.fu.newsmanagement.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.edu.fu.newsmanagement.pojos.NewsArticle;
import vn.edu.fu.newsmanagement.services.NewsArticleService;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsArticleController {

    @Autowired
    private NewsArticleService newsArticleService;

    @GetMapping
    public List<NewsArticle> getAllNews() {
        return newsArticleService.getAllNews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<NewsArticle> getNewsById(@PathVariable Integer id) {
        NewsArticle news = newsArticleService.getNewsById(id);
        return news != null ? ResponseEntity.ok(news) : ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<NewsArticle> createNews(@RequestBody NewsArticle newsArticle) {
        return ResponseEntity.ok(newsArticleService.createNews(newsArticle));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NewsArticle> updateNews(@PathVariable Integer id, @RequestBody NewsArticle newsDetails) {
        NewsArticle updated = newsArticleService.updateNews(id, newsDetails);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNews(@PathVariable Integer id) {
        newsArticleService.deleteNews(id);
        return ResponseEntity.noContent().build();
    }
}