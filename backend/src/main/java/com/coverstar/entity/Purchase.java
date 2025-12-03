package com.coverstar.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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

    @Column(name = "discount_id")
    private Long discountId;

    @Column(name = "status", nullable = false)
    private Integer status;

    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Column(name = "first_wave")
    private Integer firstWave;

    @OneToMany(mappedBy = "purchase", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<PurchaseItem> purchaseItems = new ArrayList<>();

    @Column(name = "cancellation_reason", columnDefinition = "nvarchar(255)")
    private String cancellationReason;

    @Column(name = "cancelled_by_admin")
    private Boolean cancelledByAdmin;
}
