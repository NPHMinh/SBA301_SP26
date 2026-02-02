package nguyenphamhoangminh.lab5.pojos;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonProperty;

@Entity
@Table(name = "orchids")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orchidId;

    @Column(nullable = false, length = 200)
    private String orchidName;

    @Column(nullable = false)
    private Double price;

    @Column(length = 500)
    private String description;

    @Column(length = 500)
    private String image;

    // Quan hệ Many-to-One với Category
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    @JsonProperty("category")
    private Category category;
}