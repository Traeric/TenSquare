<template>
    <div>
        <div class="tab-nav ">
            <div class="wrapper">
                <ul class="fl sui-nav nav-tabs navbar-dark">
                    <nuxt-link active-class="active" excat to="/qa/label/0" tag="li"><a>首页</a></nuxt-link>
                    <nuxt-link active-class="active" v-for="(label, index) in labelList" :key="index" :to="'/qa/label/' + label.id" tag="li">
                        <a>{{ label.labelname }}</a>
                    </nuxt-link>
                </ul>
                <span class="fr more">
                    <nuxt-link to="/label">更多</nuxt-link>
                </span>
                <div class="clearfix"></div>
            </div>
        </div>
        <!--两列布局-->
        <nuxt-child/>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-qa-logined.css";
    import labelApi from "@/api/label";

    export default {
        asyncData() {
            return labelApi.hotLabel().then(response => {
                return {
                    labelList: response.data.data,
                };
            });
        },
    }
</script>

<style scoped>

</style>
