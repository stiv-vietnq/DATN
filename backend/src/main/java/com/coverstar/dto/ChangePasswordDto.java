package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangePasswordDto implements Serializable {
    private static final long serialVersionUID = -1587209760601921034L;
    private String usernameOrEmail;
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;

    public boolean isPasswordsMatch() {
        return newPassword != null && newPassword.equals(confirmPassword);
    }
}
