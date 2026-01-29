package nguyenphamhoangminh.Lab4_New.pojos;

import jakarta.persistence.*;

@Entity
@Table(name = "Orchids")
public class Orchid {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    private Long orchidId;
    
    @Column(name = "OrchidName", nullable = false, length = 100)
    private String orchidName;
    
    @Column(name = "IsNatural")
    private Boolean isNatural;
    
    @Column(name = "OrchidDescription", columnDefinition = "TEXT")
    private String orchidDescription;
    
    @Column(name = "OrchidCategory", length = 50)
    private String orchidCategory;
    
    @Column(name = "IsAttractive")
    private Boolean isAttractive;
    
    @Column(name = "OrchidURL", length = 500)
    private String orchidURL;
    
    // Constructors
    public Orchid() {
    }
    
    public Orchid(String orchidName, Boolean isNatural, String orchidDescription, 
                  String orchidCategory, Boolean isAttractive, String orchidURL) {
        this.orchidName = orchidName;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidCategory = orchidCategory;
        this.isAttractive = isAttractive;
        this.orchidURL = orchidURL;
    }
    
    // Getters and Setters
    public Long getOrchidId() {
        return orchidId;
    }
    
    public void setOrchidId(Long orchidId) {
        this.orchidId = orchidId;
    }
    
    public String getOrchidName() {
        return orchidName;
    }
    
    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }
    
    public Boolean getIsNatural() {
        return isNatural;
    }
    
    public void setIsNatural(Boolean isNatural) {
        this.isNatural = isNatural;
    }
    
    public String getOrchidDescription() {
        return orchidDescription;
    }
    
    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }
    
    public String getOrchidCategory() {
        return orchidCategory;
    }
    
    public void setOrchidCategory(String orchidCategory) {
        this.orchidCategory = orchidCategory;
    }
    
    public Boolean getIsAttractive() {
        return isAttractive;
    }
    
    public void setIsAttractive(Boolean isAttractive) {
        this.isAttractive = isAttractive;
    }
    
    public String getOrchidURL() {
        return orchidURL;
    }
    
    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }
    
    @Override
    public String toString() {
        return "Orchid{" +
                "orchidId=" + orchidId +
                ", orchidName='" + orchidName + '\'' +
                ", isNatural=" + isNatural +
                ", orchidDescription='" + orchidDescription + '\'' +
                ", orchidCategory='" + orchidCategory + '\'' +
                ", isAttractive=" + isAttractive +
                ", orchidURL='" + orchidURL + '\'' +
                '}';
    }
}
