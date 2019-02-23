package com.tensquare.article.controller;

import com.tensquare.article.pojo.Article;
import com.tensquare.article.service.ArticleService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
/**
 * 控制器层
 * @author Administrator
 *
 */
@RestController
@CrossOrigin
@RequestMapping("/article")
public class ArticleController {

	@Autowired
	private ArticleService articleService;

	/**
	 * 文章审核
	 * @param articleId
	 * @return
	 */
	@PutMapping("/examine/{articleId}")
	public Result examine(@PathVariable String articleId) {
		articleService.updateState(articleId);
		return new Result(true,  StatusCode.OK.getCode(),  "审核成功");
	}

	/**
	 * 文章点赞
	 * @param articleId
	 * @return
	 */
	@PutMapping("/thumbup/{articleId}")
	public Result thumbup(@PathVariable String articleId) {
		articleService.addThumbup(articleId);
		return new Result(true,  StatusCode.OK.getCode(),  "点赞成功");
	}

	@GetMapping("/{articleId}")
	public Result findById(@PathVariable String articleId) {
		return new Result(true,  StatusCode.OK.getCode(),  "查询成功",  articleService.findById(articleId));
	}
	
	/**
	 * 查询全部数据
	 * @return
	 */
	@RequestMapping(method= RequestMethod.GET)
	public Result findAll(){
		return new Result(true, StatusCode.OK.getCode(), "查询成功", articleService.findAll());
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
		Page<Article> pageList = articleService.findSearch(searchMap,  page,  size);
		return  new Result(true, StatusCode.OK.getCode(), "查询成功",   new PageResult<Article>(pageList.getTotalElements(),  pageList.getContent()) );
	}

	/**
     * 根据条件查询
     * @param searchMap
     * @return
     */
    @RequestMapping(value="/search", method = RequestMethod.POST)
    public Result findSearch( @RequestBody Map searchMap){
        return new Result(true, StatusCode.OK.getCode(), "查询成功", articleService.findSearch(searchMap));
    }
	
	/**
	 * 增加
	 * @param article
	 */
	@RequestMapping(method=RequestMethod.POST)
	public Result add(@RequestBody Article article  ){
		articleService.add(article);
		return new Result(true, StatusCode.OK.getCode(), "增加成功");
	}
	
	/**
	 * 修改
	 * @param article
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.PUT)
	public Result update(@RequestBody Article article,  @PathVariable String id ){
		article.setId(id);
		articleService.update(article);		
		return new Result(true, StatusCode.OK.getCode(), "修改成功");
	}
	
	/**
	 * 删除
	 * @param id
	 */
	@RequestMapping(value="/{id}", method= RequestMethod.DELETE)
	public Result delete(@PathVariable String id ){
		articleService.deleteById(id);
		return new Result(true, StatusCode.OK.getCode(), "删除成功");
	}
	
}
