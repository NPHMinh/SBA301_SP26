package vn.edu.fu.newsmanagement.pojos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore; // <--- Import

@Entity
@Table(name = "SystemAccount")
@Data
public class SystemAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AccountID")
    private Integer accountId;

    @Column(name = "AccountName", columnDefinition = "nvarchar(100)")
    private String accountName;

    @Column(name = "AccountEmail", length = 100, unique = true)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole;

    @Column(name = "AccountPassword", columnDefinition = "varchar(255)")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String accountPassword;
}