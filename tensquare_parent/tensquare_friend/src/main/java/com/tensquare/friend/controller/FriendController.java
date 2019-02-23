package com.tensquare.friend.controller;

import com.tensquare.friend.client.UserClient;
import com.tensquare.friend.service.FriendService;
import entity.Result;
import entity.StatusCode;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/friend")
public class FriendController {

    @Autowired
    private HttpServletRequest request;

    @Resource(name = "friendService")
    private FriendService service;

    @Resource
    private UserClient userClient;

    /**
     * 添加好友或者添加不喜欢的人
     * @return
     */
    @PutMapping("/like/{friendId}/{type}")
    public Result operateFriend(@PathVariable String friendId, @PathVariable String type) {
        // 验证是否登录，并且拿到当前登录用户的id
        Claims claims_user = (Claims) request.getAttribute("claims_user");
        if (null == claims_user) {
            // 说明当前用户没有user角色
            return new Result(false, StatusCode.LOGINERROR.getCode(), "权限不足");
        }
        // 判断是添加好友还是添加不喜欢的人
        if (type != null) {
            // 得到当前登录的用户id
            String userId = claims_user.getId();
            int flag;
            String message;
            if ("1".equals(type)) {
                // 添加好友
                flag = service.addFriend(userId, friendId);
                message = "不能重复添加好友";
                if (flag == 1) {
                    // 更新用户的关注数跟好友的被关注数
                    userClient.updateFansAndFollower(userId, friendId, 1);
                }
            } else if("2".equals(type)) {
                // 添加不喜欢的人
                flag = service.addNoFriend(userId, friendId);
                message = "不能重复添加非好友";
            } else {
                return new Result(false, StatusCode.ERROR.getCode(), "参数异常");
            }
            // 对flag进行判断
            if (flag == 0) {
                return new Result(false, StatusCode.ERROR.getCode(), message);
            } else if (flag == 1) {
                return new Result(true, StatusCode.OK.getCode(), "添加成功");
            }
        } else {
            return new Result(false, StatusCode.ERROR.getCode(), "参数异常");
        }
        return null;
    }

    /**
     * 删除好友
     * @param friendId
     * @return
     */
    @DeleteMapping("/{friendId}")
    public Result deleteFriend(@PathVariable String friendId) {
        // 验证是否登录，并且拿到当前登录用户的id
        Claims claims_user = (Claims) request.getAttribute("claims_user");
        if (null == claims_user) {
            // 说明当前用户没有user角色
            return new Result(false, StatusCode.LOGINERROR.getCode(), "权限不足");
        }
        // 得到当前登录的用户id
        String userId = claims_user.getId();
        service.deleteFriend(userId, friendId);
        // 更新粉丝数跟关注数
        userClient.updateFansAndFollower(userId, friendId, -1);
        return new Result(true, StatusCode.OK.getCode(), "删除成功");
    }
}
