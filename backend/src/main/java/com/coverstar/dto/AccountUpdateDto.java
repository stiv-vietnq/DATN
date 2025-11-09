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

    private Long id;

    private String firstName;

    private String lastName;

    private String dateOfBirth;

    private Integer sex;

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
