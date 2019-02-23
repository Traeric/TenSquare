package com.tensquare.search.controller;

import com.tensquare.search.pojo.Article;
import com.tensquare.search.service.ArticleService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@RequestMapping("/article")
@CrossOrigin
public class ArticleController {
    @Resource(name = "articleService")
    private ArticleService service;

    @PostMapping("")
    public Result save(@RequestBody Article article) {
        service.save(article);
        return new Result(true, StatusCode.OK.getCode(), "添加成功");
    }

    @GetMapping("/{keyWord}/{currentPage}/{pageSize}")
    public Result findByKeyWord(@PathVariable String keyWord,
                                @PathVariable int currentPage, @PathVariable int pageSize) {
        Page<Article> pageData = service.findByKeyWord(keyWord, currentPage, pageSize);
        return new Result(true, StatusCode.OK.getCode(), "查询成功",
                new PageResult<Article>(pageData.getTotalElements(), pageData.getContent()));
    }
}
