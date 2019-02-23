package com.tensquare.recruit.controller;

import com.tensquare.recruit.pojo.Label;
import com.tensquare.recruit.service.LabelService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

@RestController
@CrossOrigin            // 跨域
@RefreshScope
@RequestMapping("/label")
public class LabelController {
    @Resource(name = "labelService")
    private LabelService service;

    @GetMapping
    public Result findAll() {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", service.findAll());
    }

    @GetMapping("/{labelId}")
    public Result findById(@PathVariable("labelId") String id) {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", service.findById(id));
    }

    @PostMapping
    public Result save(@RequestBody Label label) {
        service.save(label);
        return new Result(true, StatusCode.OK.getCode(), "添加成功");
    }

    @PutMapping("/{labelId}")
    public Result update(@PathVariable("labelId") String id, @RequestBody Label label) {
        label.setId(id);
        service.update(label);
        return new Result(true, StatusCode.OK.getCode(), "修改成功");
    }

    @DeleteMapping("/{labelId}")
    public Result deleteById(@PathVariable("labelId") String id) {
        service.deleteById(id);
        return new Result(true, StatusCode.OK.getCode(), "删除成功");
    }

    @PostMapping("/search")
    public Result findSearch(@RequestBody Label label) {
        List<Label> list = service.findSearch(label);
        return new Result(true, StatusCode.OK.getCode(), "查询成功", list);
    }

    @PostMapping("/search/{page}/{size}")
    public Result pageQuery(@RequestBody Label label, @PathVariable("page") int currentPage, @PathVariable("size") int pageSize) {
        Page<Label> pageData = service.pageQuery(label, currentPage, pageSize);
        return new Result(true, StatusCode.OK.getCode(), "查询成功",
                new PageResult<>(pageData.getTotalElements(), pageData.getContent()));
    }
}
