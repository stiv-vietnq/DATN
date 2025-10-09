package com.coverstar.utils;

import org.springframework.web.multipart.MultipartFile;
import java.util.List;

public class FileUtils {
    public static boolean isValidFileList(List<MultipartFile> imageFiles) {
        return imageFiles != null
                && !imageFiles.isEmpty()
                && imageFiles.stream().allMatch(file -> file != null && !file.isEmpty());
    }
}

