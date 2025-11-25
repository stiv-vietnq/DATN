package com.coverstar.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "PRODUCT_DETAILS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetail implements Serializable {

    private static final long serialVersionUID = 8816128461791776941L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_id", nullable = false)
    private String productId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "quantity", nullable = false)
    private Long quantity;

    @Column(name = "quantity_sold")
    private Long quantitySold;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "created_date", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @Column(name = "updated_date")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updatedDate;

    @Column(name = "directory_path")
    private String directoryPath;

    @Column(name = "type")
    private Integer type;

    @Column(name = "description")
    private String description;
}
