package com.coverstar.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "district")
@Getter
@Setter
public class District {
    @Id
    @Column(name = "district_id")
    private Integer districtId;

    @Column(name = "province_id", nullable = false)
    private Integer provinceId;

    @Column(name = "name", nullable = false, length = 64)
    private String name;
}
