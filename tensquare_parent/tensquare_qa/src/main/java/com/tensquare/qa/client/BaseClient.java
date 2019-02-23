package com.tensquare.qa.client;

import com.tensquare.qa.client.impl.BaseClientImpl;
import entity.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(value = "tensquare-base", fallback = BaseClientImpl.class)
public interface BaseClient {

    @GetMapping("/label/{labelId}")
    Result findById(@PathVariable("labelId") String id);
}
