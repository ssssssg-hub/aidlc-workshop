package com.tableorder.controller;

import com.tableorder.dto.image.ImageResponse;
import com.tableorder.service.ImageService;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;

@RestController
@RequestMapping("/api")
public class ImageController {

    private final ImageService imageService;

    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/admin/images")
    public ResponseEntity<ImageResponse> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        String imageUrl = imageService.uploadImage(file);
        return ResponseEntity.ok(new ImageResponse(imageUrl));
    }

    @GetMapping("/images/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws MalformedURLException {
        Resource resource = imageService.loadImage(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .contentType(MediaType.IMAGE_JPEG)
                .body(resource);
    }
}
