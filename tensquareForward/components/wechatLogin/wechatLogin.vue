<template>
    <div id="wechat"></div>
</template>

<script>
    export default {
        mounted() {
            // 渲染微信的二维码
            let obj = new WxLogin({
                id: 'wechat',
                appid: "wx3bdb1192c22883f3",
                scope: 'snsapi_login',
                redirect_uri: 'http://note.java.itcast.cn/wechatLogin',
            });
        },
    }
</script>

<style scoped lang="stylus">
    #wechat
        padding-left 115px
</style>
