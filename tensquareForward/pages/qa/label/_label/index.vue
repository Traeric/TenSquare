<template>
    <div class="wrapper qa-content">
        <div class="fl left-list">
            <div class="tab-content">
                <div id="index" class="tab-pane active">
                    <div class="tab-bottom-line">
                        <ul class="sui-nav nav-tabs">
                            <li :class="type === 'new' ? 'active' : ''"><a @click="type='new'" data-toggle="tab">最新回答</a></li>
                            <li :class="type === 'hot' ? 'active' : ''"><a @click="type='hot'" data-toggle="tab">热门回答</a></li>
                            <li :class="type === 'wait' ? 'active' : ''"><a @click="type='wait'" data-toggle="tab">等待回答</a></li>
                        </ul>
                        <div class="qa-list" v-infinite-scroll="loadMore">
                            <div class="tab-content">
                                <div id="new" :class="'tab-pane' + (type === 'new' ? ' active' : '')">
                                    <ul class="detail-list">
                                        <li class="qa-item" v-for="(item, index) in newlist" :key="index">
                                            <div class="fl record">
                                                <div class="number">
                                                    <div class="border useful">
                                                        <p class="usenum">{{ item.thumbup }}</p>
                                                        <p>有用</p>
                                                    </div>
                                                    <div class="border answer">
                                                        <p class="ansnum">{{ item.reply }}</p>
                                                        <p>回答</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fl info">
                                                <div class="question">
                                                    <p class="author"><span
                                                        class="name">{{ item.replyname }}</span><span>{{ item.replytime }}</span>回答</p>
                                                    <p class="title">
                                                        <nuxt-link :to="'/qa/label/' + label + '/problem/' + item.id">{{ item.title }}</nuxt-link>
                                                    </p>
                                                </div>
                                                <div class="other">
                                                    <!--<ul class="fl sui-tag">-->
                                                        <!--<li>Php</li>-->
                                                        <!--<li>Javascript</li>-->
                                                    <!--</ul>-->
                                                    <div class="fr brower">
                                                        <p>浏览量 {{ item.visits }} | {{ item.createtime }} 来自 <a href="#">{{ item.nickname }} </a></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </li>
                                    </ul>
                                </div>
                                <div id="hot" :class="'tab-pane' + (type === 'hot' ? ' active' : '')">
                                    <ul class="detail-list">
                                        <li class="qa-item" v-for="(item, index) in hotlist" :key="index">
                                            <div class="fl record">
                                                <div class="number">
                                                    <div class="border useful">
                                                        <p class="usenum">{{ item.thumbup }}</p>
                                                        <p>有用</p>
                                                    </div>
                                                    <div class="border answer">
                                                        <p class="ansnum">{{ item.reply }}</p>
                                                        <p>回答</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fl info">
                                                <div class="question">
                                                    <p class="author"><span
                                                        class="name">{{ item.replyname }}</span><span>{{ item.replytime }}</span>回答</p>
                                                    <p class="title"><a href="./qa-detail.html" target="_blank">{{ item.title }}</a>
                                                    </p>
                                                </div>
                                                <div class="other">
                                                    <!--<ul class="fl sui-tag">-->
                                                    <!--<li>Php</li>-->
                                                    <!--<li>Javascript</li>-->
                                                    <!--</ul>-->
                                                    <div class="fr brower">
                                                        <p>浏览量 {{ item.visits }} | {{ item.createtime }} 来自 <a href="#">{{ item.nickname }} </a></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </li>
                                    </ul>
                                </div>
                                <div id="wait" :class="'tab-pane' + (type === 'wait' ? ' active' : '')">
                                    <ul class="detail-list">
                                        <li class="qa-item" v-for="(item, index) in waitlist" :key="index">
                                            <div class="fl record">
                                                <div class="number">
                                                    <div class="border useful">
                                                        <p class="usenum">{{ item.thumbup }}</p>
                                                        <p>有用</p>
                                                    </div>
                                                    <div class="border answer">
                                                        <p class="ansnum">{{ item.reply }}</p>
                                                        <p>回答</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fl info">
                                                <div class="question">
                                                    <p class="author"><span
                                                        class="name">{{ item.replyname }}</span><span>{{ item.replytime }}</span>回答</p>
                                                    <p class="title"><a href="./qa-detail.html" target="_blank">{{ item.title }}</a>
                                                    </p>
                                                </div>
                                                <div class="other">
                                                    <!--<ul class="fl sui-tag">-->
                                                    <!--<li>Php</li>-->
                                                    <!--<li>Javascript</li>-->
                                                    <!--</ul>-->
                                                    <div class="fr brower">
                                                        <p>浏览量 {{ item.visits }} | {{ item.createtime }} 来自 <a href="#">{{ item.nickname }} </a></p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="php" class="tab-pane">
                    php
                </div>
                <div id="js" class="tab-pane">
                    Javascript
                </div>
                <div id="python" class="tab-pane">
                    python
                </div>
                <div id="java" class="tab-pane">
                    java
                </div>
            </div>
        </div>
        <div class="fl right-tag">
            <div class="block-btn">
                <p>今天，有什么好东西要和大家分享么?</p>
                <nuxt-link class="sui-btn btn-block btn-share" :to="'/qa/label/' + label + '/submit'">发布问题</nuxt-link>
            </div>
            <div class="hot-tags">
                <div class="head">
                    <h3 class="title">热门标签</h3>
                </div>
                <div class="tags">
                    <ul class="sui-tag">
                        <li>Php</li>
                        <li>Javascript</li>
                        <li>Gif</li>
                        <li>Java</li>
                        <li>C#</li>
                        <li>iOS</li>
                        <li>C++</li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import problemApi from "@/api/problem";
    import axios from "axios";

    export default {
        asyncData({params}) {
            // 查出最新问答，热门问答，等待问答
            return axios.all([problemApi.list("newlist", params.label, 1, 10),
                problemApi.list("hotlist", params.label, 1, 10),
                problemApi.list("waitlist", params.label, 1, 10)]).then(
                axios.spread(function (newlist, hotlist, waitlist) {
                    return {
                        newlist: newlist.data.data.rows,
                        hotlist: hotlist.data.data.rows,
                        waitlist: waitlist.data.data.rows,
                        label: params.label,
                    };
                })
            );
        },
        data() {
            return {
                type: "new",       // 列表切换
                pageNew: 1,
                pageHot: 1,
                pageWait: 1,
            };
        },
        methods: {
            loadMore() {
                // 判断当前的选项卡
                if (this.type === 'new') {
                    problemApi.list('newlist', this.label, ++this.pageNew, 10).then(response => {
                        this.newlist = [...this.newlist, ...response.data.data.rows];
                    });
                }
                if (this.type === 'hot') {
                    problemApi.list('hotlist', this.label, ++this.pageNew, 10).then(response => {
                        this.hotlist = [...this.hotlist, ...response.data.data.rows];
                    });
                }
                if (this.type === 'wait') {
                    problemApi.list('waitlist', this.label, ++this.pageNew, 10).then(response => {
                        this.waitlist = [...this.waitlist, ...response.data.data.rows];
                    });
                }
            },
        },
    }
</script>

<style scoped>

</style>
