package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BrandOrCategoryDto implements Serializable {
    private Long id;

    @NotBlank(message = "ProductTypeId is required")
    @Min(value = 1, message = "ProductTypeId must be a positive number")
    private Long productTypeId;

    @NotBlank(message = "Name is required")
    @Length(min = 3, max = 100, message = "First name must be between 3 and 100 characters")
    private String name;

    private Boolean status;

    @Length(min = 3, max = 512, message = "First name must be between 3 and 512 characters")
    private String description;

    private String directoryPath;

}
