<template>
    <div>
        <div class="wrapper tag-item">
            <div class="fl left-list">
                <div class="tc-data-list">
                    <div class="tc-list" v-infinite-scroll="loadMore">
                        <ul class="detail-list">
                            <li class="qa-item" v-for="(item, index) in items" :key="index">
                                <div class="fl record">
                                    <div class="number">
                                        <div class="border useful">
                                            <p class="usenum" @click="thumbup(item.id, item)">
                                                <a class="zan">
                                                    <i :class="'fa fa-thumbs-up ' + item.zan" aria-hidden="true"></i>
                                                </a>
                                            </p>
                                            <p class="zannum"> {{ item.thumbup }} </p>
                                        </div>
                                        <div class="border answer">
                                            <a href="#" class="star"><i class="fa fa-star-o" aria-hidden="true"></i></a>
                                        </div>
                                    </div>
                                </div>
                                <div class="info">
                                    <p class="text">
                                        <nuxt-link :to="'/spit/item/' + item.id">
                                            {{ item.content }}
                                        </nuxt-link>
                                    </p>
                                    <div class="other">
                                        <div class="fl date">
                                            <span>{{ item.publishtime }}</span>
                                        </div>
                                        <div class="fr remark">
                                            <a href="#" data-toggle="modal" data-target="#shareModal" class="share">
                                                <i class="fa fa-share-alt" aria-hidden="true"></i> 分享
                                            </a>
                                            <a href="#" data-toggle="modal" data-target="#remarkModal"
                                               class="comment"><i class="fa fa-commenting" aria-hidden="true"></i>
                                                回复</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="fl right-tag">
                <div class="block-btn">
                    <p>来个匿名吐槽，发泄一下你心中的怒火吧！</p>
                    <nuxt-link class="sui-btn btn-block btn-share" to="/spit/submit">发吐槽</nuxt-link>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-spit-index.css"
    import spitApi from "@/api/spit";
    import {getUser} from "@/utils/auth";

    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 10,
                searchMap: {state: '1'},
            };
        },
        asyncData() {
            return spitApi.getListByPagination(1, 10, {state: '1'}).then((response) => {
                let tmp = response.data.data.rows.map(item => {
                    return {...item, zan: ""};
                });
                return {
                    items: tmp,
                };
            });
        },
        methods: {
            loadMore() {
                spitApi.getListByPagination(++this.currentPage, this.pageSize, this.searchMap).then((response) => {
                    let tmp = response.data.data.rows.map(item => {
                        return {...item, zan: ""};
                    });
                    this.items = [...this.items, ...tmp];
                })
            },
            thumbup(id, item) {
                // 登录才可以点赞
                if (getUser().name === undefined) {
                    this.$message({
                        showClose: true,
                        message: '必须登录才可以点赞哦～～',
                        type: 'warning'
                    });
                    return;
                }
                // 不能重复点赞
                if (item.zan === "color") {
                    this.$message({
                        showClose: true,
                        message: '不可以重复点赞哦～～',
                        type: 'warning'
                    });
                    return;
                }
                spitApi.thumbup(id).then((response) => {
                    if (response.data.flag) {
                        // 点赞成功
                        item.zan = "color";
                        item.thumbup++;
                    }
                });
            },
        },
    }
</script>

<style scoped>

</style>
