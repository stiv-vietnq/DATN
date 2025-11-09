package com.coverstar.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "PURCHASES")
@Getter
@Setter
public class Purchase implements Serializable {

    private static final long serialVersionUID = 8191231350723276215L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_id", referencedColumnName = "id")
    private Product product;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "product_detail_id", referencedColumnName = "id")
    private ProductDetail productDetail;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "address_id", referencedColumnName = "id")
    private Address address;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "created_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "updated_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    @Column(name = "description", nullable = false, columnDefinition = "nvarchar(510)")
    private String description;

    @Column(name = "quantity", nullable = false)
    private Long quantity;

    @Column(name = "color", nullable = false)
    private String color;

    @Column(name = "size", nullable = false)
    private Integer size;

    @Column(name = "total", nullable = false)
    private BigDecimal total;

    @Column(name = "total_after_discount", nullable = false)
    private BigDecimal totalAfterDiscount;

    @Column(name = "discount_id")
    private Long discountId;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "first_wave")
    private Integer firstWave;
}
