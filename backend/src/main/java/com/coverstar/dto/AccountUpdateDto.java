package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.*;
import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AccountUpdateDto {

    private static final long MAX_FILE_SIZE = 1 * 1024 * 1024;

    @NotNull(message = "Username is required")
    private Long id;

    @NotBlank(message = "First name is required")
    @Length(min = 3, max = 100, message = "First name must be between 3 and 255 characters")
    private String firstName;

    @NotBlank(message = "lastName name is required")
    @Length(min = 3, max = 100, message = "lastName name must be between 3 and 255 characters")
    private String lastName;

    @PastOrPresent(message = "Date of birth cannot be in the future")
    private Date dateOfBirth;

    private Integer sex;

    @Pattern(regexp = "^[0-9]{9,14}$", message = "Phone number must be numeric and between 9 to 14 digits")
    private String phoneNumber;

    private MultipartFile imageFiles;


    public boolean isValidFile() {
        if (imageFiles != null) {
            if (imageFiles.getSize() > MAX_FILE_SIZE) {
                return false;
            }
        }
        String contentType = imageFiles.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return false;
        }
        return true;
    }
}
