package vn.edu.fu.newsmanagement.pojos;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore; // <--- Import cái này
import java.util.List;

@Entity
@Table(name = "Tag")
@Data
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TagID")
    private Integer tagId;

    @Column(name = "TagName", columnDefinition = "nvarchar(100)")
    private String tagName;

    @Column(name = "Note", columnDefinition = "nvarchar(255)")
    private String note;

    @ManyToMany(mappedBy = "tags")
    @JsonIgnore // <--- THÊM DÒNG NÀY ĐỂ CẮT VÒNG LẶP
    private List<NewsArticle> newsArticles;
}