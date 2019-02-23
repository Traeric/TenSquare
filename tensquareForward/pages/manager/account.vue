<template>
    <div class="home-content">

        <div class="activities account-type">
            <h4 class="tit"><span>账户设置</span></h4>
            <div class="account-main">


                <div class="account-person">
                    <h3>个人账号</h3>
                    <ul class="account-info">
                        <li><span class="gray index">名字</span> <span class="info">小白</span>
                            <form action="" class="sui-form form-inline">
                                <input type="text" placeholder="输入姓名"/>
                                <button class="sui-btn btn-danger save-btn">保存</button>
                            </form>
                            <span class="gray edit"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑</span></li>
                        <li><span class="gray index">个性网址</span> <span class="info">coder.org/u/bipeng0405</span>
                            <form action="" class="sui-form form-inline">
                                <input type="text" placeholder="输入网址"/>
                                <button class="sui-btn btn-danger save-btn">保存</button>
                            </form>
                            <span class="gray edit"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑</span></li>
                        <li><span class="gray index">Email </span> <span class="info">bi****g@163.com</span>
                            <form action="" class="sui-form form-inline">
                                <input type="email" placeholder="输入邮箱"/>
                                <button class="sui-btn btn-danger save-btn">保存</button>
                            </form>
                            <span class="gray edit"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑</span></li>
                        <li><span class="gray index">手机号码 </span> <span class="info">136****9875</span>
                            <form action="" class="sui-form form-inline">
                                <input type="phone" placeholder="输入手机号码"/>
                                <button class="sui-btn btn-danger save-btn">保存</button>
                            </form>
                            <span class="gray edit"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑</span></li>
                        <li><span class="gray index">密码 </span> <span class="info">点击修改密码</span>
                            <form action="" class="sui-form form-inline">
                                <input type="password" placeholder="输入新的密码"/>
                                <button class="sui-btn btn-danger save-btn">保存</button>
                            </form>
                            <span class="gray edit"><i class="fa fa-pencil" aria-hidden="true"></i> 编辑</span></li>
                    </ul>
                </div>
                <div class="account-other">
                    <h3>第三方账号</h3>
                    <ul class="account-info">
                        <li><span class="gray index"><img src="~/assets/img/widget-weixin.png" width="20"/> 微信</span> <span
                            class="name">已绑定，解绑</span> <span class="gray check"><i class="fa fa-square-o"
                                                                                   aria-hidden="true"></i> 公开显示</span>
                        </li>
                        <li><span class="gray index"><img src="~/assets/img/widget-QQ.png" width="20"/> QQ</span> <span
                            class="name bind">绑定账号</span> <span class="gray check"><i class="fa fa-square-o"
                                                                                      aria-hidden="true"></i> 公开显示</span>
                        </li>
                        <li><span class="gray index"><img src="~/assets/img/widget-weibo.png" width="20"/> 新浪微博 </span> <span
                            class="name">已绑定，解绑</span> <span class="gray check"><i class="fa fa-square-o"
                                                                                   aria-hidden="true"></i> 公开显示</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-person-account.css";

    export default {}
</script>

<style scoped>

</style>
