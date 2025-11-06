package com.coverstar.controller;

import com.coverstar.constant.Constants;
import com.coverstar.dto.CommentDto;
import com.coverstar.entity.Comment;
import com.coverstar.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/comments")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @PostMapping("/createComment")
    public ResponseEntity<?> createComment(@RequestParam("productId") String productId,
                                           @RequestParam("fullName") String fullName,
                                           @RequestParam("username") String username,
                                           @RequestParam("email") String email,
                                           @RequestParam("phoneNumber") String phoneNumber,
                                           @RequestParam(name = "description", required = false) String description,
                                           @RequestParam("evaluate") String evaluate,
                                           @RequestParam(name = "files", required = false) List<MultipartFile> imageFiles) {
//        if (Objects.isNull(productId) || Objects.isNull(fullName) || Objects.isNull(email) || Objects.isNull(phoneNumber) ||
//                Objects.isNull(evaluate)) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("One or more required fields are null");
//        }
        try {
            CommentDto commentDto = new CommentDto(productId, username, fullName, email, phoneNumber, description, evaluate, imageFiles);
            Comment comment = commentService.createComment(commentDto);
            return ResponseEntity.ok(comment);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }

    @PostMapping("/deleteProduct/{id}")
    public ResponseEntity<?> deleteComment(@PathVariable Long id) {
        try {
            commentService.deleteProduct(id);
            return ResponseEntity.ok(HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Constants.ERROR);
        }
    }
}