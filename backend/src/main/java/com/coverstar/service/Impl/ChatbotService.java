package com.coverstar.service.Impl;

import com.coverstar.entity.Category;
import com.coverstar.entity.ChatbotKeyword;
import com.coverstar.entity.Product;
import com.coverstar.entity.ProductType;
import com.coverstar.repository.CategoryRepository;
import com.coverstar.repository.ChatbotKeywordRepository;
import com.coverstar.repository.ProductRepository;
import com.coverstar.repository.ProductTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatbotService {
    @Autowired
    private ProductTypeRepository productTypeRepo;

    @Autowired
    private CategoryRepository categoryRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private ChatbotKeywordRepository chatbotKeywordRepo;

    public String getResponse(String message, String type) {
        message = message.toLowerCase();

        List<ProductType> types = productTypeRepo.findByNameContainingIgnoreCase(message);
        if (!types.isEmpty()) {
            return "Các nhãn hàng tìm thấy: " +
                    types.stream().map(ProductType::getName).collect(Collectors.toList());
        }

        List<Category> categories = categoryRepo.findByNameContainingIgnoreCase(message);
        if (!categories.isEmpty()) {
            return "Các loại sản phẩm: " +
                    categories.stream().map(Category::getName).collect(Collectors.toList());
        }

        List<Product> products = productRepo.findByProductNameContainingIgnoreCase(message);
        if (!products.isEmpty()) {
            return "Sản phẩm tìm thấy: " +
                    products.stream()
                            .map(p -> p.getProductName() + " (" + p.getPrice() + " VND)").collect(Collectors.toList());
        }

        if (message.matches(".*\\d+.*\\d+.*")) {
            String[] nums = message.replaceAll("[^0-9 ]", "").trim().split("\\s+");
            if (nums.length >= 2) {
                try {
                    BigDecimal min = new BigDecimal(nums[0]);
                    BigDecimal max = new BigDecimal(nums[1]);
                    List<Product> productsByPrice = productRepo.findByPriceBetween(min, max);
                    if (!productsByPrice.isEmpty()) {
                        return "Sản phẩm trong khoảng giá: " +
                                productsByPrice.stream()
                                        .map(p -> p.getProductName() + " (" + p.getPrice() + " VND)").collect(Collectors.toList());
                    }
                } catch (Exception e) { }
            }
        }

        List<ChatbotKeyword> keywords = chatbotKeywordRepo.findByKeywordContainingIgnoreCase(message);
        if (!keywords.isEmpty()) {
            return keywords.stream()
                    .map(ChatbotKeyword::getResponse)
                    .collect(Collectors.joining("\n"));
        }

        return "Xin lỗi, tôi chưa tìm thấy sản phẩm phù hợp.";
    }
}
