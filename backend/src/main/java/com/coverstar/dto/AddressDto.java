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

    @NotBlank(message = "First name is required")
    @Length(min = 3, max = 100, message = "First name must be between 3 and 100 characters")
    private String fullName;

    @Pattern(regexp = "^[0-9]{9,14}$", message = "Phone number must be numeric and between 9 to 14 digits")
    private String phoneNumber;

    @Length(min = 3, max = 512, message = "First name must be between 3 and 512 characters")
    private String address;

    @NotBlank(message = "Default value is required")
    private Integer defaultValue;

    @NotBlank(message = "ProvinceId is required")
    @Min(value = 1, message = "ProvinceId must be a positive number")
    private Integer provinceId;

    @NotBlank(message = "DistrictId is required")
    @Min(value = 1, message = "DistrictId must be a positive number")
    private Integer districtId;

    @NotBlank(message = "WardId is required")
    @Min(value = 1, message = "WardId must be a positive number")
    private Integer wardId;

    @NotBlank(message = "UserId is required")
    @Min(value = 1, message = "UserId must be a positive number")
    private Long userId;

    @NotBlank(message = "Type is required")
    @Min(value = 1, message = "Type must be a positive number")
    private int type;

    private String map;
}
