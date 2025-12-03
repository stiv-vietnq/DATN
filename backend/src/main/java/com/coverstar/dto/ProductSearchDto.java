package com.coverstar.dto;

import com.coverstar.entity.Comment;
import com.coverstar.entity.Image;
import com.coverstar.entity.ProductDetail;
import com.coverstar.entity.ProductType;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSearchDto implements Serializable {
    private static final long serialVersionUID = -9154325564210018558L;

    private String id;

    private String productName;

    private ProductType productType;

    private Long categoryId;

    private BigDecimal price;

    private Date createdDate;

    private Date updatedDate;

    private Float evaluate;

    private Long numberOfVisits;

    private Boolean status;

    private String size;

    private String description;

    private Long quantitySold;

    private Set<Image> images;

    private Set<Comment> comments;

    private Set<ProductDetail> productDetails;

    private Long discountProductId;

    private BigDecimal discountedPrice;
}
