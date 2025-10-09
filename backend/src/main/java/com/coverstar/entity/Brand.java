package com.coverstar.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "BRANDS")
@Getter
@Setter
public class Brand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "productType_id", nullable = false)
    private ProductType productType;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "created_date", nullable = false)
    private Date createdDate;

    @Column(name = "updated_date")
    private Date updatedDate;

    @Column(name = "description")
    private String description;
}