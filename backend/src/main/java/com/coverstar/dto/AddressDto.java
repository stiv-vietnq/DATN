package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressDto implements Serializable {
    private Long id;

    private String fullName;

    private String phoneNumber;

    private String address;

    private Integer defaultValue;

    private Integer provinceId;

    private Integer districtId;

    private Integer wardId;

    private Long userId;

    private int type;

}
