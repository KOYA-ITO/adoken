package com.backend.entity;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

/**
 * ユーザーの認証情報を表すUserDetails実装クラス
 */
public class LoginUser extends User {
	
	private String email;
	
    public LoginUser(
    		String username, 
    		String password, 
    		Collection<? extends GrantedAuthority> authorities,
    		String email) {
        super(username, password, authorities);
        this.email = email;
    }
    
    public String getEmail() {
    	return email;
    }
}
