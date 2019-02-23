<template>
    <div></div>
</template>

<script>
    import wechatApi from "@/api/wechat";
    import {getUrlParam} from "@/utils/params";
    import {setUser} from "@/utils/auth";

    export default {
        mounted() {
            // 1. 获取参数的code
            let code = getUrlParam('code');
            // 2. 调用api获取access_token
            wechatApi.getAccessToken(code).then((response) => {
                let access_token = response.data.access_token;
                let openid = response.data.openid;
                wechatApi.getUserInfo(access_token, openid).then((response2) => {
                    // 获取用户信息
                    let nickname = response2.data.nickname;
                    let headimgUrl = response2.data.headimgurl;
                    setUser(12, access_token, nickname, headimgUrl);
                    // 跳转到用户中心
                    location.href = '/manager';
                });
            });
        },
    }
</script>

<style scoped>

</style>
