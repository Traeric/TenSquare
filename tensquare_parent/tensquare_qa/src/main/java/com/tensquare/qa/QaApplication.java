package com.tensquare.qa;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import utils.IdWorker;
import utils.JwtUtil;

@SpringBootApplication
@EnableEurekaClient
@EnableDiscoveryClient      // 发现服务
@EnableFeignClients         // 使用Feign客户端的方式发现服务
public class QaApplication {
    public static void main(String[] args) {
        SpringApplication.run(QaApplication.class, args);
    }

    /**
     * 将id生成器放到容器中
     * @return
     */
    @Bean
    public IdWorker idWorker() {
        return new IdWorker();
    }

    @Bean
    public JwtUtil jwtUtil() {
        return new JwtUtil();
    }
}
