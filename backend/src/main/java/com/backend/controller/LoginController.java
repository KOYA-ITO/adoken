package com.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.backend.dto.ViewUser;
import com.backend.entity.LoginUser;

@RestController
@RequestMapping("/api/auth")
public class LoginController {
	
	@GetMapping("/check")
	public ResponseEntity<ViewUser> check(@AuthenticationPrincipal LoginUser user){
		System.out.println(user);
		if (user == null) return ResponseEntity.status(401).body(null);
		System.out.println(ResponseEntity.ok(new ViewUser(user.getUsername(),user.getEmail())));
		return ResponseEntity.ok(new ViewUser(user.getUsername(),user.getEmail()));
	}
}
