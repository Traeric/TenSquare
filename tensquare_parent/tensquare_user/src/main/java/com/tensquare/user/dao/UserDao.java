package com.tensquare.user.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.tensquare.user.pojo.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/**
 * 数据访问接口
 * @author Administrator
 *
 */
public interface UserDao extends JpaRepository<User,String>,JpaSpecificationExecutor<User>{
    User findByMobile(String mobile);

    @Modifying
    @Query(value = "UPDATE tb_user SET fanscount = fanscount + ? WHERE id = ?", nativeQuery = true)
    void updateFansNum(int num, String friendId);

    @Modifying
    @Query(value = "UPDATE tb_user SET followcount = followcount + ? WHERE id = ?", nativeQuery = true)
    void updateFollowNum(int num, String userId);
}
