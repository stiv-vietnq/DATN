package com.coverstar.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "ADDRESS")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Address implements Serializable {

    private static final long serialVersionUID = 7505750119637433191L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = false, columnDefinition = "nvarchar(100)")
    private String fullName;

    @Column(name = "phone_number", nullable = false, columnDefinition = "nvarchar(15)")
    private String phoneNumber;

    @Column(name = "address", nullable = false, columnDefinition = "nvarchar(255)")
    private String address;

    @Column(name = "default_value", nullable = false)
    private Integer defaultValue;

    @Column(name = "provinceId", nullable = false)
    private Integer provinceId;

    @Column(name = "districtId", nullable = false)
    private Integer districtId;

    @Column(name = "wardId", nullable = false)
    private Integer wardId;

    @Column(name = "userId", nullable = false)
    private Long userId;

    @Column(name = "type")
    private Integer type;

    @Column(name = "created_date")
    private Date createdDate;

    @Column(name = "updated_date")
    private Date updatedDate;
}
