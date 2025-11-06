package com.coverstar.service.Impl;

import com.coverstar.dto.CommentDto;
import com.coverstar.entity.Comment;
import com.coverstar.entity.Image;
import com.coverstar.entity.Product;
import com.coverstar.repository.CommentRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.service.CommentService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Service
public class CommentServiceImpl implements CommentService {

    @Autowired
    private ProductRepository productRepository;


    @Autowired
    private CommentRepository commentRepository;

    @Value("${image.directory}")
    private String imageDirectory;

    @Override
    public Comment createComment(CommentDto commentDto) throws Exception {
        try {
            Product product = productRepository.getProductById(commentDto.getProductId());
            Comment comment = new Comment();
            comment.setProductId(commentDto.getProductId());
            comment.setFullName(commentDto.getFullName());
            comment.setUsername(commentDto.getUsername());
            comment.setEmail(commentDto.getEmail());
            comment.setPhoneNumber(commentDto.getPhoneNumber());
            comment.setDescription(commentDto.getDescription());
            comment.setCreatedDate(new Date());
            int evaluateProduct = 0;
            if (StringUtils.isNotEmpty(commentDto.getEvaluate())) {
                evaluateProduct = Integer.parseInt(commentDto.getEvaluate());
            }
            comment.setEvaluate(evaluateProduct);
            comment = commentRepository.save(comment);

            if (commentDto.getImageFiles() != null && !commentDto.getImageFiles().isEmpty()) {
                Set<Image> images = new HashSet<>();
                for (MultipartFile file : commentDto.getImageFiles()) {
                    String filePath = imageDirectory + "products" + "/" + product.getId() +
                            "/" + "comments" + "/" + comment.getId();
                    File directory = new File(filePath);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    String fullPath = filePath + "/" + file.getOriginalFilename();
                    file.transferTo(new File(fullPath));

                    Image image = new Image();
                    image.setProductId(commentDto.getProductId());
                    image.setDirectoryPath(fullPath);
                    image.setType(2);
                    image.setCommentId(comment.getId());
                    images.add(image);
                }
                comment.setImages(images);
            }
            commentRepository.save(comment);
            return comment;
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }

    @Override
    public void deleteProduct(Long id) {
        try {
            Comment comment = commentRepository.getCommentById(id);

            Set<Image> images = comment.getImages();
            if (images != null && !images.isEmpty()) {
                for (Image image : images) {
                    File file = new File(image.getDirectoryPath());
                    if (file.exists()) {
                        file.delete();
                    }
                }
            }
            productRepository.deleteById(id);
        } catch (Exception e) {
            e.fillInStackTrace();
            throw e;
        }
    }
}