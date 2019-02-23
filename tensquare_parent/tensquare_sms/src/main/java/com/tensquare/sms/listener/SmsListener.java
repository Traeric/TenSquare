package com.tensquare.sms.listener;

import com.aliyuncs.exceptions.ClientException;
import com.tensquare.sms.utils.SmsUtil;
import org.springframework.amqp.rabbit.annotation.RabbitHandler;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.Map;

@Component
@RabbitListener(queues = "sms")
public class SmsListener {

    @Resource
    private SmsUtil smsUtil;

    @RabbitHandler
    public void executeSms(Map<String, String> map) {
        String mobile = map.get("mobile");
        String checkCode = map.get("check_code");
        System.out.println("手机号： " + mobile);
        System.out.println("验证码： " + checkCode);
        try {
            smsUtil.sendSms(mobile, "SMS_158440564", "金鑫自己测试学习用的签名", "{\"code\": \"" + checkCode + "\"}");
        } catch (ClientException e) {
            e.printStackTrace();
        }
    }
}
