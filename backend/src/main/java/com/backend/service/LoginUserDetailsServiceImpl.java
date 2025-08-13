package com.backend.service;


import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.backend.dao.UserDao;
import com.backend.entity.LoginUser;
import com.backend.entity.DemoUser;


@Service
public class LoginUserDetailsServiceImpl implements UserDetailsService{
    
    private final UserDao userDao;
    
    private static final Logger logger = LoggerFactory.getLogger(LoginUserDetailsServiceImpl.class);
    
    @Autowired
    public LoginUserDetailsServiceImpl(UserDao userDao) {
        this.userDao = userDao;
    }
    
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException{
        //ユーザー名が入力されると、UserDetailの実装クラスを返す
        //ここあとあとたぶんいじるよな(DBとの接続に変更するはず)
        logger.info("認証リクエスト: {}", username);
        DemoUser user = userDao.selectById(username);
        
        System.out.println("I'mhere");
        
        //対象データがあれば、UserDetailsの実装クラスを返す
        if(user != null) {
            System.out.println("DBユーザー取得: " + user.getUsername());
            // パスワードのハッシュ値も出力
            System.out.println("DBパスワード: " + user.getPassword());
            
            return new LoginUser(
                    user.getUsername(),
                    user.getPassword(),
                    Collections.emptyList(),
                    user.getEmail()
                    );
                    
        }
        else {
            //対象データがない場合
            System.out.println("ユーザーが見つかりません: " + username);
            throw new UsernameNotFoundException(username + " => 指定しているユーザー名は存在しません");
        }
    }
}
