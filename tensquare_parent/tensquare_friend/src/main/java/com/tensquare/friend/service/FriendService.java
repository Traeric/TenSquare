package com.tensquare.friend.service;

import com.tensquare.friend.dao.FriendDao;
import com.tensquare.friend.dao.NoFriendDao;
import com.tensquare.friend.pojo.Friend;
import com.tensquare.friend.pojo.NoFriend;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;

@Service
@Transactional
public class FriendService {

    @Resource(name = "friendDao")
    private FriendDao dao;

    @Resource
    private NoFriendDao noFriendDao;

    /**
     * 添加好友
     * @param userId
     * @param friendId
     * @return
     */
    public int addFriend(String userId, String friendId) {
        // 先判断userId到friendId是否有数据，有就是重复添加好友了，返回0
        Friend friend = dao.findByUserIdAndFriendId(userId, friendId);
        if (friend != null) {
            return 0;
        }
        // 直接添加好友， 让好友表中userId到friendId方向的type为0
        friend = new Friend();
        friend.setUserId(userId);
        friend.setFriendId(friendId);
        friend.setIslike("0");
        dao.save(friend);
        // 判断从friendId到userId是否有数据，如果有，把双方的状态都改为1
        Friend friendLikeMe = dao.findByUserIdAndFriendId(friendId, userId);
        if (friendLikeMe != null) {
            // 把双方的isLike都改为1
            dao.updateIsLike("1", userId, friendId);
            dao.updateIsLike("1", friendId, userId);
        }
        return 1;
    }

    /**
     * 添加非好友
     * @param userId
     * @param friendId
     * @return
     */
    public int addNoFriend(String userId, String friendId) {
        // 先判断是否已经是非好友
        NoFriend noFriend = noFriendDao.findByUserIdAndFriendId(userId, friendId);
        if (noFriend != null) {
            return 0;
        }
        noFriend = new NoFriend();
        noFriend.setUserId(userId);
        noFriend.setFriendId(friendId);
        noFriendDao.save(noFriend);
        return 1;
    }

    /**
     * 删除好友
     * @param userId
     * @param friendId
     */
    public void deleteFriend(String userId, String friendId) {
        // 删除表中userId到friendId这条数据
        dao.deleteFriend(userId, friendId);
        // 更新friendId到userId的islike为0
        dao.updateIsLike("0", friendId, userId);
        // 非好友表中添加数据
        NoFriend noFriend = new NoFriend();
        noFriend.setUserId(userId);
        noFriend.setFriendId(friendId);
        noFriendDao.save(noFriend);
    }
}
