package vn.edu.fu.newsmanagement.pojos;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "Category")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Integer categoryId;

    @Column(name = "CategoryName", columnDefinition = "nvarchar(100)")
    private String categoryName;

    @Column(name = "CategoryDescription", columnDefinition = "nvarchar(255)")
    private String categoryDescription;

    // QUAN HỆ ĐỆ QUY (Parent Category)
    @ManyToOne
    @JoinColumn(name = "ParentCategoryID") // Tên cột trong DB
    private Category parentCategory;

    @OneToMany(mappedBy = "parentCategory")
    @JsonIgnore // Tránh lỗi lặp vô tận khi chuyển thành JSON
    private List<Category> subCategories;

    @Column(name = "IsActive")
    private Boolean isActive;
}