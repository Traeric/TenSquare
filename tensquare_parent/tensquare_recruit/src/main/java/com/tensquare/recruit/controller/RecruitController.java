package com.tensquare.recruit.controller;

import com.tensquare.recruit.pojo.Recruit;
import com.tensquare.recruit.service.RecruitService;
import entity.PageResult;
import entity.Result;
import entity.StatusCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 控制器层
 *
 * @author Administrator
 */
@RestController
@CrossOrigin
@RequestMapping("/recruit")
public class RecruitController {

    @Autowired
    private RecruitService recruitService;

    /**
     * 推荐职位
     *
     * @return
     */
    @GetMapping("/search/recommand")
    public Result recommend() {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", recruitService.recommend());
    }

    /**
     * 最新职位
     *
     * @return
     */
    @GetMapping("/search/newlist")
    public Result newList() {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", recruitService.newList());
    }

    @GetMapping
    public Result findAll() {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", recruitService.findAll());
    }

    @GetMapping("/{recruitId}")
    public Result findById(@PathVariable("recruitId") String id) {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", recruitService.findById(id));
    }

    @PostMapping
    public Result save(@RequestBody Recruit recruit) {
        recruitService.save(recruit);
        return new Result(true, StatusCode.OK.getCode(), "添加成功");
    }

    @PutMapping("/{recruitId}")
    public Result update(@PathVariable("recruitId") String id, @RequestBody Recruit recruit) {
        recruit.setId(id);
        recruitService.update(recruit);
        return new Result(true, StatusCode.OK.getCode(), "修改成功");
    }

    @DeleteMapping("/{recruitId}")
    public Result deleteById(@PathVariable("recruitId") String id) {
        recruitService.deleteById(id);
        return new Result(true, StatusCode.OK.getCode(), "删除成功");
    }

    /**
     * 分页+多条件查询
     *
     * @param searchMap 查询条件封装
     * @param page      页码
     * @param size      页大小
     * @return 分页结果
     */
    @RequestMapping(value = "/search/{page}/{size}", method = RequestMethod.POST)
    public Result findSearch(@RequestBody Map searchMap, @PathVariable int page, @PathVariable int size) {
        Page<Recruit> pageList = recruitService.findSearch(searchMap, page, size);
        return new Result(true, StatusCode.OK.getCode(), "查询成功", new PageResult<>(pageList.getTotalElements(), pageList.getContent()));
    }

    /**
     * 根据条件查询
     *
     * @param searchMap
     * @return
     */
    @RequestMapping(value = "/search", method = RequestMethod.POST)
    public Result findSearch(@RequestBody Map searchMap) {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", recruitService.findSearch(searchMap));
    }

    /**
     * 修改
     *
     * @param recruit
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.PUT)
    public Result update(@RequestBody Recruit recruit, @PathVariable String id) {
        recruit.setId(id);
        recruitService.update(recruit);
        return new Result(true, StatusCode.OK.getCode(), "修改成功");
    }

    /**
     * 删除
     *
     * @param id
     */
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public Result delete(@PathVariable String id) {
        recruitService.deleteById(id);
        return new Result(true, StatusCode.OK.getCode(), "删除成功");
    }
}
