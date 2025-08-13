package com.backend.dao;

import java.util.List;

import org.seasar.doma.Dao;
import org.seasar.doma.Select;
import org.seasar.doma.boot.ConfigAutowireable;

import com.backend.entity.DemoUser;

@Dao
@ConfigAutowireable
public interface UserDao {

    @Select
    List<DemoUser> selectAll();  // IDでユーザーを取
    
    @Select
    DemoUser selectById(String username);
}
