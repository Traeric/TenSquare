package com.tensquare.user.controller;

import com.tensquare.user.pojo.Admin;
import com.tensquare.user.service.AdminService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.domain.Page;
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
@RequestMapping("/admin")
public class AdminController {

	@Autowired
	private AdminService adminService;

	@Resource
	private JwtUtil jwtUtil;

	@PostMapping("/login")
	public Result login(@RequestBody Admin admin) {
		Admin adminLogined = adminService.login(admin);
		if (adminLogined == null) {
			return new Result(false, StatusCode.LOGINERROR.getCode(), "登录失败");
		}
		// 做一系列使得前后端可以通话的操作，采用jwt实现
		// 生成令牌
		String token = jwtUtil.createJWT(adminLogined.getId(), adminLogined.getLoginname(), "admin");
		Map<String, Object> map = new HashMap<>();
		map.put("token", token);
		map.put("role", "admin");
		return new Result(true, StatusCode.OK.getCode(), "登录成功", map);
	}
	
	
	/**
	 * 查询全部数据
	 * @return
	 */
	@RequestMapping(method= RequestMethod.GET)
	public Result findAll(){
		return new Result(true, StatusCode.OK.getCode(), "查询成功", adminService.findAll());
	}
	
	/**
	 * 根据ID查询
	 * @param id ID
	 * @return
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.GET)
	public Result findById(@PathVariable String id){
		return new Result(true, StatusCode.OK.getCode(), "查询成功", adminService.findById(id));
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
		Page<Admin> pageList = adminService.findSearch(searchMap,  page,  size);
		return  new Result(true, StatusCode.OK.getCode(), "查询成功",   new PageResult<Admin>(pageList.getTotalElements(),  pageList.getContent()) );
	}

	/**
     * 根据条件查询
     * @param searchMap
     * @return
     */
    @RequestMapping(value="/search", method = RequestMethod.POST)
    public Result findSearch( @RequestBody Map searchMap){
        return new Result(true, StatusCode.OK.getCode(), "查询成功", adminService.findSearch(searchMap));
    }
	
	/**
	 * 增加
	 * @param admin
	 */
	@RequestMapping(method=RequestMethod.POST)
	public Result add(@RequestBody Admin admin){
		adminService.add(admin);
		return new Result(true, StatusCode.OK.getCode(), "增加成功");
	}
	
	/**
	 * 修改
	 * @param admin
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.PUT)
	public Result update(@RequestBody Admin admin,  @PathVariable String id ){
		admin.setId(id);
		adminService.update(admin);		
		return new Result(true, StatusCode.OK.getCode(), "修改成功");
	}
	
	/**
	 * 删除
	 * @param id
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.DELETE)
	public Result delete(@PathVariable String id ){
		adminService.deleteById(id);
		return new Result(true, StatusCode.OK.getCode(), "删除成功");
	}
	
}
