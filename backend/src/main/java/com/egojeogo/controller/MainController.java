package com.egojeogo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api")
public class MainController {

    @GetMapping("")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Backend 연결 성공!");
    }
} 