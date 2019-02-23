package com.tensquare.friend.dao;

import com.tensquare.friend.pojo.Friend;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface FriendDao extends JpaRepository<Friend, String> {
    Friend findByUserIdAndFriendId(String userId, String friendId);

    @Modifying
    @Query(value = "UPDATE tb_friend SET islike = ? WHERE userid = ? AND friendid = ?", nativeQuery = true)
    void updateIsLike(String isLike, String userId, String friendId);

    @Modifying
    @Query(value = "DELETE FROM tb_friend WHERE userid = ? AND friendid = ?", nativeQuery = true)
    void deleteFriend(String userId, String friendId);
}
