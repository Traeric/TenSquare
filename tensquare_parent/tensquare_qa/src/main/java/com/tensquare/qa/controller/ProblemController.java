package com.tensquare.qa.controller;

import com.tensquare.qa.client.BaseClient;
import com.tensquare.qa.pojo.Problem;
import com.tensquare.qa.service.ProblemService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;
/**
 * 控制器层
 * @author Administrator
 *
 */
@RestController
@CrossOrigin
@RequestMapping("/problem")
public class ProblemController {

	@Autowired
	private ProblemService problemService;

	@Autowired
	private HttpServletRequest request;

	@Resource
	private BaseClient baseClient;

    @GetMapping("/label/{labelId}")
	public Result findByLabelId(@PathVariable String labelId) {
        return baseClient.findById(labelId);
    }


	/**
     * 最新问答
     * @param labelId
     * @param currentPage
     * @param pageSize
     * @return
     */
    @GetMapping("/newlist/{label}/{page}/{size}")
    public Result newList(@PathVariable("label") String labelId, @PathVariable("page") int currentPage,
                          @PathVariable("size") int pageSize) {
        Page<Problem> pageData = problemService.newList(labelId, currentPage, pageSize);
        return new Result(true, StatusCode.OK.getCode(), "查询成功",
                new PageResult<>(pageData.getTotalElements(), pageData.getContent()));
    }

    /**
     * 热门问答
     * @param labelId
     * @param currentPage
     * @param pageSize
     * @return
     */
    @GetMapping("/hotlist/{label}/{page}/{size}")
    public Result hotList(@PathVariable("label") String labelId, @PathVariable("page") int currentPage,
                          @PathVariable("size") int pageSize) {
        Page<Problem> pageData = problemService.hotList(labelId, currentPage, pageSize);
        return new Result(true, StatusCode.OK.getCode(), "查询成功",
                new PageResult<>(pageData.getTotalElements(), pageData.getContent()));
    }

    /**
     * 等待问答
     * @param labelId
     * @param currentPage
     * @param pageSize
     * @return
     */
    @GetMapping("/waitlist/{label}/{page}/{size}")
    public Result waitList(@PathVariable("label") String labelId, @PathVariable("page") int currentPage,
                          @PathVariable("size") int pageSize) {
        Page<Problem> pageData = problemService.waitList(labelId, currentPage, pageSize);
        return new Result(true, StatusCode.OK.getCode(), "查询成功",
                new PageResult<>(pageData.getTotalElements(), pageData.getContent()));
    }
	
	
	/**
	 * 查询全部数据
	 * @return
	 */
	@RequestMapping(method= RequestMethod.GET)
	public Result findAll(){
		return new Result(true,StatusCode.OK.getCode(),"查询成功",problemService.findAll());
	}
	
	/**
	 * 根据ID查询
	 * @param id ID
	 * @return
	 */
	@RequestMapping(value="/{id}",method= RequestMethod.GET)
	public Result findById(@PathVariable String id){
		return new Result(true,StatusCode.OK.getCode(),"查询成功",problemService.findById(id));
	}


	/**
	 * 分页+多条件查询
	 * @param searchMap 查询条件封装
	 * @param page 页码
	 * @param size 页大小
	 * @return 分页结果
	 */
	@RequestMapping(value="/search/{page}/{size}",method=RequestMethod.POST)
	public Result findSearch(@RequestBody Map searchMap , @PathVariable int page, @PathVariable int size){
		Page<Problem> pageList = problemService.findSearch(searchMap, page, size);
		return  new Result(true,StatusCode.OK.getCode(),"查询成功",  new PageResult<Problem>(pageList.getTotalElements(), pageList.getContent()) );
	}

	/**
     * 根据条件查询
     * @param searchMap
     * @return
     */
    @RequestMapping(value="/search",method = RequestMethod.POST)
    public Result findSearch( @RequestBody Map searchMap){
        return new Result(true,StatusCode.OK.getCode(),"查询成功",problemService.findSearch(searchMap));
    }
	
	/**
	 * 增加
	 * @param problem
	 */
	@RequestMapping(method=RequestMethod.POST)
	public Result add(@RequestBody Problem problem) {
		String token = (String) request.getAttribute("claims_user");
	    if (StringUtils.isEmpty(token)) {
            return new Result(false, StatusCode.ACCESSERROR.getCode(), "权限不足");
        }
		problemService.add(problem);
		return new Result(true,StatusCode.OK.getCode(),"增加成功");
	}
	
	/**
	 * 修改
	 * @param problem
	 */
	@RequestMapping(value="/{id}",method= RequestMethod.PUT)
	public Result update(@RequestBody Problem problem, @PathVariable String id ){
		problem.setId(id);
		problemService.update(problem);		
		return new Result(true,StatusCode.OK.getCode(),"修改成功");
	}
	
	/**
	 * 删除
	 * @param id
	 */
	@RequestMapping(value="/{id}",method= RequestMethod.DELETE)
	public Result delete(@PathVariable String id ){
		problemService.deleteById(id);
		return new Result(true,StatusCode.OK.getCode(),"删除成功");
	}
	
}
