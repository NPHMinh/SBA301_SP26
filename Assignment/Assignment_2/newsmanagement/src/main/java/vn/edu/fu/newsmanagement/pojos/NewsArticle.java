package vn.edu.fu.newsmanagement.pojos;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "NewsArticle")
@Data
public class NewsArticle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NewsArticleID")
    private Integer newsArticleId;

    @Column(name = "NewsTitle", columnDefinition = "nvarchar(255)")
    private String newsTitle;

    @Column(name = "Headline", columnDefinition = "nvarchar(255)")
    private String headline;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", columnDefinition = "NVARCHAR(MAX)")
    private String newsContent;

    @Column(name = "NewsSource", columnDefinition = "nvarchar(255)")
    private String newsSource;

    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    // KHÓA NGOẠI: CATEGORY
    @ManyToOne
    @JoinColumn(name = "CategoryID")
    private Category category;

    // KHÓA NGOẠI: SYSTEM ACCOUNT (CreatedBy)
    @ManyToOne
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    // KHÓA NGOẠI: SYSTEM ACCOUNT (UpdatedBy)
    @ManyToOne
    @JoinColumn(name = "UpdatedByID")
    private SystemAccount updatedBy;

    // QUAN HỆ NHIỀU - NHIỀU (Tạo bảng NewsTag)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "NewsTag", // Tên bảng trung gian
            joinColumns = @JoinColumn(name = "NewsArticleID"), // Khóa chính 1
            inverseJoinColumns = @JoinColumn(name = "TagID")   // Khóa chính 2
    )
    private List<Tag> tags;
}