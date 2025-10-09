package com.coverstar.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "province")
@Getter
@Setter
public class Province {

    @Id
    @Column(name = "province_id", nullable = false)
    private Integer provinceId;

    @Column(name = "name", nullable = false, length = 64)
    private String name;
}
