package com.coverstar.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "ward")
@Getter
@Setter
public class Ward {

    @Id
    @Column(name = "wards_id", nullable = false)
    private Integer wardId;

    @Column(name = "district_id",nullable = false)
    private Integer districtId;

    @Column(name = "name", nullable = false, columnDefinition = "nvarchar(64)")
    private String name;
}
