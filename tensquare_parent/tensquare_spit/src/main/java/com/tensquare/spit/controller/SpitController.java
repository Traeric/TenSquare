package com.tensquare.spit.controller;

import com.tensquare.spit.pojo.Spit;
import com.tensquare.spit.service.SpitService;
import entity.Result;
import entity.StatusCode;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;

@RestController
@CrossOrigin
@RequestMapping("/spit")
public class SpitController {
    @Resource(name = "spitService")
    private SpitService service;
    @Resource
    private RedisTemplate redisTemplate;

    @GetMapping("")
    public Result findAll() {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", service.findAll());
    }

    @GetMapping("/{spitId}")
    public Result findById(@PathVariable String spitId) {
        return new Result(true, StatusCode.OK.getCode(), "查询成功", service.findById(spitId));
    }

    @PostMapping("")
    public Result save(@RequestBody Spit spit) {
        service.save(spit);
        return new Result(true, StatusCode.OK.getCode(), "保存成功");
    }

    @PutMapping("/{spitId}")
    public Result update(@RequestBody Spit spit, @PathVariable String spitId) {
        spit.set_id(spitId);
        service.update(spit);
        return new Result(true, StatusCode.OK.getCode(), "修改成功");
    }

    @DeleteMapping("/{spitId}")
    public Result delete(@PathVariable String spitId) {
        service.deleteById(spitId);
        return new Result(true, StatusCode.OK.getCode(), "删除成功");
    }

    @PutMapping("/thumbup/{spitId}")
    public Result thumbup(@PathVariable String spitId) {
        // 判断当前用户是否已经点赞，但是现在没有做验证，暂时先把userid写死
        String userid = "111111";
        // 判断当前用户是否已经点赞
        if (redisTemplate.opsForValue().get("thumbup_spit_" + userid) != null) {
            // 已经点赞了
            return new Result(false, StatusCode.REPERROR.getCode(), "不能重复点赞");
        }
        service.thumbup(spitId);
        redisTemplate.opsForValue().set("thumbup_spit_" + userid, 1);
        return new Result(true, StatusCode.OK.getCode(), "点赞成功");
    }
}
