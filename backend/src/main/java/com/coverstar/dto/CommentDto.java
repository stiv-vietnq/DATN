package com.coverstar.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.io.Serializable;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CommentDto implements Serializable {
    private String productId;
    private String username;
    private String fullName;
    private String email;
    private String phoneNumber;
    private String description;
    private String evaluate;
    private List<MultipartFile> imageFiles;
}
