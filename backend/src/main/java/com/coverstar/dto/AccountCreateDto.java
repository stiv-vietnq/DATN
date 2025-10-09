package com.coverstar.dto;

import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

@Getter
@Setter
public class AccountCreateDto {

    private Long id;

    @NotBlank(message = "Username is required")
    @Length(min = 3, max = 100, message = "Username must be between 3 and 100 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email is invalid")
    @Length(min = 3, max = 100, message = "Email must be between 3 and 100 characters")
    private String email;

    @NotBlank(message = "First name is required")
    @Length(min = 3, max = 100, message = "First name must be between 3 and 255 characters")
    private String firstName;

    @NotBlank(message = "lastName name is required")
    @Length(min = 3, max = 100, message = "lastName name must be between 3 and 255 characters")
    private String lastName;

    @NotBlank(message = "password is required")
    @Length(min = 8, max = 255, message = "lastName name must be between 8-255 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).+$",
            message = "Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
    private String password;

    @NotBlank(message = "Repeat password is required")
    @Length(min = 8, max = 255, message = "lastName name must be between 8-255 characters")
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).+$",
            message = "Repeat password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character")
    private String repeatPassword;

    @Override
    public String toString() {
        return "AccountCreateDto [id=" + id + ", username=" + username + ", email=" + email + ", password=" + password
                + ", repeatPassword=" + repeatPassword + "]";
    }

}
