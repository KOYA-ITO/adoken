package com.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.backend.dao.UserDao;
import com.backend.entity.DemoUser;

@Service
public class UserService {

    @Autowired
    private UserDao userDao;

    public List<DemoUser> getUserById() {
    	
    	List<DemoUser> users = userDao.selectAll();
        System.out.println("Users from DB: " + users);
    	
        return userDao.selectAll();  // IDでユーザーを取得
    }

}
