package com.coverstar.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "CATEGORIES")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, columnDefinition = "nvarchar(255)")
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "productType_id", nullable = false)
    private ProductType productType;

    @Column(name = "status", nullable = false)
    private Boolean status;

    @Column(name = "directory_path")
    private String directoryPath;

    @Column(name = "created_date", nullable = false)
    private Date createdDate;

    @Column(name = "updated_date")
    private Date updatedDate;

    @Column(name = "description", columnDefinition = "nvarchar(500)")
    private String description;

    @Column(name = "number_of_visits")
    private Long numberOfVisits;

    @Column(name = "quantity_sold")
    private Long quantitySold;
}