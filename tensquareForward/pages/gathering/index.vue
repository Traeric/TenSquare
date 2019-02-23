<template>
    <div class="wrapper activities">
        <div class="activity-card-list">
            <div class="top-title">
                <h4 class="latest">最新活动</h4>
                <div class="clearfix"></div>
            </div>
            <div class="activity-list" v-infinite-scroll="loadMore">
                <ul class="activity">
                    <li class="activity-item" v-for="(item, index) in items" :key="index">
                        <div class="activity-inner">
                            <a href="http://"></a>
                            <div class="img">
                                <a :href="'/gathering/item/' + item.id" target="_blank">
                                    <img :src="item.image" alt="NO IMG"/>
                                </a>
                            </div>
                            <div class="text">
                                <p class="title">{{ item.name }}</p>
                                <div class="fl goin">
                                    <p>时间：{{ item.starttime }}</p>
                                    <p>城市：{{ item.city }}</p>
                                </div>
                                <div class="fr btn">
                                    <span class="sui-btn btn-bao">立即报名</span>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    // 导入样式
    import "~/assets/css/page-sj-activity-index.css"
    import gatheringApi from "@/api/gathering"

    export default {
        data() {
            return {
                currentPage: 1,
                pageSize: 12,
            };
        },
        asyncData() {
            // 加载第一页
            return gatheringApi.getListByPagination(1, 12, {state: '1'}).then(response => {
                return {
                    items: response.data.data.rows,
                };
            });
        },
        methods: {
            loadMore() {
                // 获取新的数据
                gatheringApi.getListByPagination(++this.currentPage, this.pageSize, { state: '1' }).then(response => {
                    this.items = [...this.items, ...response.data.data.rows];
                });
            },
        },
    }
</script>

<style scoped>

</style>
