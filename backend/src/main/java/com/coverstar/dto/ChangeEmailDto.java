package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChangeEmailDto implements Serializable {
    private static final long serialVersionUID = -5813177595224455130L;

    @NotBlank(message = "Id is required")
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    @Length(min = 10, max = 100, message = "Email must be between 10 and 100 characters")
    private String email;
}
