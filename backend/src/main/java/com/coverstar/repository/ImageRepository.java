package com.coverstar.repository;

import com.coverstar.entity.Image;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ImageRepository extends JpaRepository<Image, Long> {

    @Query("SELECT i FROM Image i WHERE i.id = :imageId AND i.type = 1")
    Image findImageById(Long imageId);
}
