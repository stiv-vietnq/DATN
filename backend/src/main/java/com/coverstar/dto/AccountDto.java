package com.coverstar.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AccountDto {

	private Long id;
	private String username;
	private String email;
	private String firstName;
	private String lastName;
	private String dateOfBirth;
	private Integer sex;
	private String phoneNumber;
	private String directoryPath;
}
