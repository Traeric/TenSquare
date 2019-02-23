<template>
    <div class="wrapper tag-item">
        <div class="job-intro">
            <div class="left-img">
                <img :src="enterpriseItem.logo" alt="NO IMG"/>
            </div>
            <div class="middle-intro">
                <div class="name">
                    {{ item.jobname }} &middot; {{ enterpriseItem.name }}
                </div>
                <div class="intro">
                    {{ item.salary }} / {{ item.condition }} / {{ item.education }} / {{ item.type === 0 ? '兼职' : '全职'
                    }}
                </div>
                <div class="tag">
                    <ul>
                        <li v-for="(label, index) in item.labels.split(',')" :key="index">{{ label }}</li>
                    </ul>
                </div>
            </div>
            <div class="right-tool">
                <p class="throw">
                    <button class="sui-btn btn-throw">投简历</button>
                </p>
                <button class="sui-btn btn-collect">收藏</button>
                <span>100收藏</span>
                <span>291浏览</span>
            </div>
            <div style="clear:both"></div>
        </div>
        <div class="fl left-list ">
            <div class="tit">
                <span>职位描述</span>
            </div>
            <div class="content">
                <p>{{ item.content1 }}</p>
            </div>
            <div class="tit">
                <span>职位要求</span>
            </div>
            <div class="content">
                <p>{{ item.content2 }}</p>
            </div>
            <div class="time">
                发布于1小时前
            </div>
        </div>
        <div class="fl right-tag">
            <div class="company-job">
                <div class="intro">
                    <img :src="enterpriseItem.logo" alt="NO IMG"/>
                    <div class="title">
                        {{ enterpriseItem.name }}App
                    </div>
                    <div class="content">
                        {{ enterpriseItem.summary }}
                    </div>
                </div>
                <div class="tag">
                    <ul>
                        <li v-for="(label, index) in enterpriseItem.labels.split(',')" :key="index">{{ label }}</li>
                    </ul>
                </div>
                <div class="btns">
                    <a class="sui-btn btn-home" :href="enterpriseItem.url" target="_blank">企业主页</a>
                    <a class="sui-btn btn-position" href="~/assets/recruit-job.html" target="_blank">{{
                        enterpriseItem.jobcount }}个职位</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-recruit-detail.css";
    import recruitApi from "@/api/recruit";
    import enterpriseApi from "@/api/enterprise";

    export default {
        asyncData({params}) {
            return recruitApi.getById(params.id).then((response) => {
                const data = response.data.data;
                // 获取企业id并查询企业信息
                return enterpriseApi.getById(data.eid).then((response2) => {
                    return {
                        enterpriseItem: response2.data.data,
                        item: data,
                    };
                });
            });
        },
    }
</script>

<style scoped>

</style>
