package com.fu.A3nguyenphamhoangminh_se18D04.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "AccountMember")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AccountMember {
    @Id
    @Column(name = "MemberID", length = 20)
    private String memberID;

    @Column(name = "MemberPassword", length = 80)
    private String memberPassword;

    @Column(name = "EmailAddress", length = 100)
    private String emailAddress;

    @Column(name = "MemberRole")
    private int memberRole; // 1=Admin, 2=Staff, 3=Member
}
