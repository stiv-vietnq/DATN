//package com.coverstar.entity;
//
//import com.fasterxml.jackson.annotation.JsonBackReference;
//import com.fasterxml.jackson.annotation.JsonIdentityInfo;
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import com.fasterxml.jackson.annotation.ObjectIdGenerators;
//import lombok.Getter;
//import lombok.Setter;
//
//import javax.persistence.*;
//import java.math.BigDecimal;
//import java.util.Date;
//import java.util.HashSet;
//import java.util.Set;
//
//@Entity
//@Table(name = "SHIPPING_METHODS")
//@Getter
//@Setter
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
//public class ShippingMethod {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(name = "name", nullable = false)
//    private String name;
//
//    @Column(name = "type", nullable = false)
//    private Integer type;
//
//    @Column(name = "price", nullable = false)
//    private BigDecimal price;
//
//    @Column(name = "created_date", nullable = false)
//    private Date createdDate;
//
//    @Column(name = "updated_date")
//    private Date updatedDate;
//
//    @ManyToMany(mappedBy = "shippingMethods", cascade = CascadeType.ALL)
//    @JsonBackReference
//    private Set<Product> products = new HashSet<>();
//}