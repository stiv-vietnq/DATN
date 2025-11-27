package com.coverstar.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Entity
@Table(name = "PRODUCTS")
@Getter
@Setter
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Product {
    @Id
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "product_name", nullable = false, columnDefinition = "nvarchar(255)")
    private String productName;

    @ManyToOne
    @JoinColumn(name = "productType_id", nullable = false)
    private ProductType productType;

    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "created_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "updated_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    @Column(name = "evaluate")
    private Float evaluate;

    @Column(name = "number_of_visits")
    private Long numberOfVisits;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "description", columnDefinition = "nvarchar(510)")
    private String description;

    @Column(name = "quantity_sold")
    private Long quantitySold;

    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Image> images;

    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Comment> comments;

    @OneToMany(mappedBy = "productId", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<ProductDetail> productDetails;

    @Column(name = "discount_product_id")
    private Long discountProductId;
}
