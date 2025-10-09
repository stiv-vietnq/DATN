package com.coverstar.service.Impl;

import com.coverstar.dto.CommentDto;
import com.coverstar.entity.Comment;
import com.coverstar.entity.Image;
import com.coverstar.entity.Product;
import com.coverstar.repository.CommentRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
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
    public Comment createComment(CommentDto commentDto, List<MultipartFile> imageFiles) throws Exception {
        try {
            Product product = productRepository.getProductById(commentDto.getProductId());
            Float evaluate = getEvaluate(commentDto, product);
            product.setEvaluate(evaluate);
            productRepository.save(product);

            Comment comment = new Comment();
            comment.setProductId(commentDto.getProductId());
            comment.setUserId(commentDto.getUserId());
            comment.setDescription(commentDto.getDescription());
            comment.setCreatedDate(new Date());
            comment.setEvaluate(commentDto.getEvaluate());
            comment = commentRepository.save(comment);

            if (imageFiles != null && !imageFiles.isEmpty()) {
                Set<Image> images = new HashSet<>();
                for (MultipartFile file : imageFiles) {
                    String filePath = imageDirectory + "products" + File.separator + product.getId() +
                            File.separator + "comments" + File.separator + comment.getId();
                    File directory = new File(filePath);
                    if (!directory.exists()) {
                        directory.mkdirs();
                    }
                    String fullPath = filePath + File.separator + file.getOriginalFilename();
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

    private static Float getEvaluate(CommentDto commentDto, Product product) {
        float productEvaluate = product.getEvaluate() != null ? product.getEvaluate() : 0f;
        int commentEvaluate = commentDto.getEvaluateProduct() != null ? commentDto.getEvaluateProduct() : 0;
        if (productEvaluate == 0f && commentEvaluate == 0) {
            return 0f;
        }
        if (commentEvaluate == 0) {
            return productEvaluate;
        }
        if (productEvaluate == 0f) {
            return (float) commentEvaluate;
        }
        return (productEvaluate + commentEvaluate) / 2;
    }
}