package com.coverstar.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "USER_VISITS")
@Getter
@Setter
@NoArgsConstructor
public class UserVisits implements Serializable {

    private static final long serialVersionUID = 8851049962714608168L;

    @Column(name = "visit_date")
    private Date visitDate;

    @Column(name = "visit_count")
    private Long visitCount;

    @Id
    @Column(name = "type")
    private Integer type;
}
