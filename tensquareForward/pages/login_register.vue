<template>
    <div class="wrapper loginsign">
        <div class="item signup">
            <div class="form">
                <h3 class="loginsign-title">注册新账号</h3>
                <form class="sui-form">
                    <div class="control-group">
                        <label for="name" class="control-label">名字</label>
                        <div class="controls">
                            <input type="text" v-model="pojo.nickname" id="name" placeholder="真实姓名或常用昵称"
                                   class="input-xlarge"/>
                        </div>
                    </div>
                    <div class="different">
                        <div class="radio-content">
                            <div id="a1" class="phone">
                                <div class="control-group number">
                                    <input type="text" v-model="pojo.mobile" placeholder="仅支持大陆手机号"
                                           class="input-xlarge"/>
                                </div>
                                <div class="control-group code">
                                    <div class="input-append">
                                        <input v-model="code" id="appendedInputButton" type="text" placeholder="短信验证"
                                               class="span2 input-large msg-input"/>
                                        <button type="button" @click="sendsms" class="sui-btn msg-btn">获取验证码</button>
                                    </div>
                                </div>
                                <div class="control-group">
                                    <label for="password" class="control-label">密码</label>
                                    <div class="controls">
                                        <input type="text" v-model="pojo.password" id="password"
                                               placeholder="请输入6-16位密码" class="input-xlarge"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="control-group btn-signup">
                        <label class="control-label"></label>
                        <div class="controls">
                            <label>
                                <el-checkbox v-model="checked">同意协议接受《服务条款》</el-checkbox>
                            </label>
                            <button @click="register" type="button" class="sui-btn btn-danger btn-yes">注 册</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="item">
            <div class="form">
                <h3 class="loginsign-title">用户登录</h3>
                <form class="sui-form login-form">
                    <div class="control-group">
                        <label for="inputname" class="control-label">手机号：</label>
                        <div class="controls">
                            <input v-model="mobile" type="text" id="inputname" placeholder="11位手机号" class="input-xlarge"
                                   data-rules="required"/>
                        </div>
                    </div>
                    <div class="control-group">
                        <label for="inputpassword" class="control-label">密码：</label>
                        <div class="controls">
                            <input v-model="password" type="text" id="inputpassword" placeholder="输入登录密码"
                                   class="input-xlarge"/>
                        </div>
                    </div>
                    <div class="controls">
                        <label>
                            <el-checkbox v-model="remenberMe">记住登录状态</el-checkbox>
                        </label>
                        <button @click="login" type="button" class="sui-btn btn-danger btn-yes">登 录</button>
                    </div>
                    <div class="other-login" @click="showWechatLogin">
                        <img src="~/assets/img/asset-weixin.png" alt="NO IMG">
                    </div>
                </form>
            </div>
        </div>
        <el-dialog title="微信登录" :visible.sync="dialogVisible" width="30%">
            <WechatLogin/>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-person-loginsign.css";
    import userApi from "@/api/user";
    import {setUser} from "@/utils/auth";
    import WechatLogin from "@/components/wechatLogin/wechatLogin";

    export default {
        data() {
            return {
                pojo: {},       // 整个表单的实体对象
                code: "",       // 验证码
                checked: false,     // 是否同意服务条款
                mobile: "",            // 手机号码
                password: "",          // 密码
                remenberMe: false,      // 记住我
                dialogVisible: false,       // 弹出框
            };
        },
        methods: {
            sendsms() {
                // 验证手机号
                if (!/^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\d{8}$/g.test(this.pojo.mobile)) {
                    this.$message({
                        message: "手机填写有误",
                        type: 'error',
                        showClose: true,
                    });
                    return;
                }
                userApi.sendsms(this.pojo.mobile).then((response) => {
                    this.$message({
                        message: response.data.message,
                        type: (response.data.flag ? 'success' : 'error'),
                        showClose: true,
                    });
                });
            },
            register() {
                // 数据校验
                let validateObj = this.dataValidate();
                if (!validateObj.flag) {
                    this.$message({
                        message: validateObj.errMsg,
                        type: 'error',
                        showClose: true,
                    });
                    return;
                }
                // 进行注册
                userApi.register(this.pojo, this.code).then((response) => {
                    this.$message({
                        message: response.data.message,
                        type: (response.data.flag ? 'success' : 'error'),
                        showClose: true,
                    });
                });
            },
            // 校验数据
            dataValidate() {
                let errMsg = "";
                // 判断昵称
                if (!this.pojo.nickname) {
                    errMsg = "昵称不能为空";
                    return {
                        flag: false,
                        errMsg,
                    };
                }
                // 判断密码
                if (!this.pojo.password || this.pojo.password.length <= 6 || this.pojo.password.length >= 16) {
                    errMsg = "密码长度必须在6-16之内";
                    return {
                        flag: false,
                        errMsg,
                    };
                }
                // 是否同意了服务条款
                if (!this.checked) {
                    errMsg = "必须先同意服务条款";
                    return {
                        flag: false,
                        errMsg,
                    };
                }
                return {
                    flag: true,
                    errMsg,
                };
            },
            login() {
                // 登录校验
                if (!/^((13[0-9])|(15[^4])|(18[0,2,3,5-9])|(17[0-8])|(147))\d{8}$/g.test(this.mobile)) {
                    this.$message({
                        message: "手机填写有误",
                        type: 'error',
                        showClose: true,
                    });
                    return;
                }
                if (!this.password) {
                    this.$message({
                        message: "密码不能为空",
                        type: 'error',
                        showClose: true,
                    });
                    return;
                }
                userApi.login(this.mobile, this.password).then((response) => {
                    if (response.data.flag) {
                        let data = response.data.data;
                        // 将返回的数据存入cookie
                        setUser(data.id, data.token, data.name, data.avatar);
                        location.href = "/manager";     // 登录成功，跳转到用户中心
                    } else {
                        this.$message({
                            message: response.data.message,
                            type: 'error',
                            showClose: true,
                        });
                    }
                });
            },
            showWechatLogin() {
                this.dialogVisible = true;
            },
        },
        head: {
            script: [
                // 导入生成微信二维码的js
                {src: 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'},
            ],
        },
        components: {
            WechatLogin,
        },
    }
</script>

<style scoped lang="stylus">
    .other-login
        margin-top 20px
        cursor pointer
    iframe
        margin 100px auto
</style>
