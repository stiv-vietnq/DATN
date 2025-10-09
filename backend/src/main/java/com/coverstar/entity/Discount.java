package com.coverstar.entity;

import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "DISCOUNTS")
@Getter
@Setter
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "status", nullable = false, columnDefinition = "BIT")
    private Boolean status;

    @Column(name = "code", nullable = false)
    private String code;

    @Column(name = "directory_path")
    private String directoryPath;

    @Column(name = "description")
    private String description;

    @Column(name = "discount_percent")
    private BigDecimal discountPercent;

    @Column(name = "created_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "updated_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    @Column(name = "expired_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiredDate;

    @Column(name = "discount_type")
    private Integer discountType;

    @Column(name = "level_applied")
    private BigDecimal levelApplied;

    @ManyToMany
    @JoinTable(
            name = "discount_account",
            joinColumns = @JoinColumn(name = "discount_id"),
            inverseJoinColumns = @JoinColumn(name = "account_id")
    )
    @JsonIgnore
    private Set<Account> accounts;
}