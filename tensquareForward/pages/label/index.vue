<template>
    <div class="wrapper all-tags">
        <div class="tags-head">
            <h2 class="tag-title">标签</h2>
            <p class="tag-second">标签是最有效的内容组织形式，正确的使用标签能更快的发现和解决你的问题。</p>
        </div>
        <div class="alltags-card">
            <ul class="yui3-g tags-list" style="display:block;">
                <li class="tag-item yui3-u-1-4" v-for="(item, index) in items" :key="index">
                    <div class="inner">
                        <h5 class="title">
                            <nuxt-link :to="'/label/item/' + item.id">{{ item.labelname }}</nuxt-link>
                        </h5>
                        <div class="guanzhu">
                            <a class="sui-btn btn-guanzhu color">加关注</a>
                            <span class="guannum"><i class="num">{{ item.count }}</i>人关注</span>
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 分页 -->
            <div class="pagnation">
                <div class="pagnation-inner">
                    <el-pagination background
                                   layout="prev, pager, next"
                                   @current-change="currentPageEvent"
                                   :page-size="pageSize"
                                   :total="totalPage">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-qa-allTag.css";
    import labelApi from "@/api/label";

    export default {
        asyncData() {
            return labelApi.getLabelByPage(1, 16).then(response => {
                return {
                    items: response.data.data.rows,
                    totalPage: response.data.data.total,
                };
            });
        },
        data() {
            return {
                currentPage: 1,     // 当前页
                pageSize: 16,       // 每页数量
            };
        },
        methods: {
            currentPageEvent(currentPage) {
                // 请求当前页的数据
                labelApi.getLabelByPage(currentPage, this.pageSize).then(response => {
                    this.items = response.data.data.rows;
                });
            },
        },
    }
</script>

<style scoped lang="stylus">
    .pagnation
        margin 30px calc(50% - 205px)
        .pagnation-inner
            display: inline-block
</style>
