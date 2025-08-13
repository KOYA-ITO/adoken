package com.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Hello World";
    }

    @GetMapping("/henka")
    public String hello_henka() {
        return "Hello henka";
    }
}
