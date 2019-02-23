package com.tensquare.user.controller;

import com.tensquare.user.pojo.User;
import com.tensquare.user.service.UserService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.domain.Page;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import utils.JwtUtil;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * 控制器层
 * @author Administrator
 *
 */
@RestController
@CrossOrigin
@RefreshScope
@RequestMapping("/user")
public class UserController {

	@Resource
	private UserService userService;

	@Resource
	private RedisTemplate redisTemplate;

	@Resource
	private JwtUtil jwtUtil;

    /**
     * 更新被关注好友粉丝数跟用户自己的关注数
     * @param userId
     * @param friendId
     */
    @PutMapping("/{userId}/{friendId}/{num}")
    public void updateFansAndFollower(@PathVariable String userId, @PathVariable String friendId, @PathVariable int num) {
        userService.updateFansAndFollower(num, userId, friendId);
    }

	/**
	 * 用户登录
	 * @param user
	 * @return
	 */
	@PostMapping("/login")
	public Result login(@RequestBody User user) {
		user = userService.login(user.getMobile(), user.getPassword());
		if (user == null) {
			return new Result(false, StatusCode.LOGINERROR.getCode(), "登录失败");
		}
		// 登录成功后的操作
		String token = jwtUtil.createJWT(user.getId(), user.getMobile(), "user");
		Map<String, Object> map = new HashMap<>();
		map.put("token", token);
		map.put("roles", "user");
		return new Result(true, StatusCode.OK.getCode(), "登录成功", map);
	}

    /**
     * 发送验证码
     * @param mobile
     * @return
     */
    @PostMapping("/sendsms/{mobile}")
    public Result sendSms(@PathVariable String mobile) {
        userService.sendSms(mobile);
        return new Result(true, StatusCode.OK.getCode(), "发送成功");
    }

    @PostMapping("/register/{code}")
    public Result register(@PathVariable String code, @RequestBody User user) {
        // 得到缓存中的验证码
        String checkCode = (String) redisTemplate.opsForValue().get("check_code_" + user.getMobile());
        if (StringUtils.isEmpty(checkCode)) {
            return new Result(false, StatusCode.ERROR.getCode(), "请先获取手机验证码");
        }
        if (!checkCode.equals(code)) {
            return new Result(false, StatusCode.ERROR.getCode(), "请输入正确的验证码");
        }
        userService.add(user);
        return new Result(true, StatusCode.OK.getCode(), "注册成功");
    }

	/**
	 * 查询全部数据
	 * @return
	 */
	@RequestMapping(method = RequestMethod.GET)
	public Result findAll(){
		return new Result(true, StatusCode.OK.getCode(), "查询成功", userService.findAll());
	}
	
	/**
	 * 根据ID查询
	 * @param id ID
	 * @return
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.GET)
	public Result findById(@PathVariable String id){
		return new Result(true, StatusCode.OK.getCode(), "查询成功", userService.findById(id));
	}


	/**
	 * 分页+多条件查询
	 * @param searchMap 查询条件封装
	 * @param page 页码
	 * @param size 页大小
	 * @return 分页结果
	 */
	@RequestMapping(value="/search/{page}/{size}", method=RequestMethod.POST)
	public Result findSearch(@RequestBody Map searchMap ,  @PathVariable int page,  @PathVariable int size){
		Page<User> pageList = userService.findSearch(searchMap,  page,  size);
		return  new Result(true, StatusCode.OK.getCode(), "查询成功",   new PageResult<User>(pageList.getTotalElements(),  pageList.getContent()) );
	}

	/**
     * 根据条件查询
     * @param searchMap
     * @return
     */
    @RequestMapping(value="/search", method = RequestMethod.POST)
    public Result findSearch( @RequestBody Map searchMap){
        return new Result(true, StatusCode.OK.getCode(), "查询成功", userService.findSearch(searchMap));
    }
	
	/**
	 * 增加
	 * @param user
	 */
	@RequestMapping(method=RequestMethod.POST)
	public Result add(@RequestBody User user  ){
		userService.add(user);
		return new Result(true, StatusCode.OK.getCode(), "增加成功");
	}
	
	/**
	 * 修改
	 * @param user
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.PUT)
	public Result update(@RequestBody User user,  @PathVariable String id ){
		user.setId(id);
		userService.update(user);		
		return new Result(true, StatusCode.OK.getCode(), "修改成功");
	}
	
	/**
	 * 删除
	 * @param id
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.DELETE)
	public Result delete(@PathVariable String id ){
		userService.deleteById(id);
		return new Result(true, StatusCode.OK.getCode(), "删除成功");
	}
	
}
