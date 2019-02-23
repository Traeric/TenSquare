package com.tensquare.qa.interceptor;

import io.jsonwebtoken.Claims;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import utils.JwtUtil;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Component
public class JwtInterceptor implements HandlerInterceptor {
    @Resource
    private JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 无论如何都放行，具体能不能操作还是在具体操作中去判断
        // 拦截器只负责把请求头中包含token的令牌进行解析
        String header = request.getHeader("Authorization");
        if (!StringUtils.isEmpty(header)) {
            // 如果有包含Authorization的头信息，就对其进行解析
            if (header.startsWith("Bearer ")) {
                // 得到token
                final String token = header.substring(7);
                // 对令牌进行验证
                try {
                    Claims claims = jwtUtil.parseJWT(token);
                    String roles = (String) claims.get("roles");
                    if ("admin".equals(roles)) {
                        request.setAttribute("claims_admin", token);
                    }
                    if ("user".equals(roles)) {
                        request.setAttribute("claims_user", token);
                    }
                } catch (Exception e) {
                    throw new RuntimeException("令牌有误!");
                }
            }
        }
        return true;
    }
}
