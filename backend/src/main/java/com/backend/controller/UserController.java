package com.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.entity.DemoUser;
import com.backend.service.UserService;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/user")
    public List<DemoUser> getUser(){//(@RequestParam Long id) {
        return userService.getUserById();  // IDでユーザーを取得
    }

}
