<template xmlns:v-quill="http://www.w3.org/1999/xhtml">
    <div class="wrapper tc-detail">
        <div class="fl left-list">
            <div class="tc-detail">
                <!-- 标题区 -->
                <div class="detail-tit">
                    <div class="detail-author">
                        <a href="javascript:void(0);">{{ pojo.nickname }}</a> 发布
                    </div>
                    <div class="detail-content">
                        <p v-html="pojo.content"></p>
                    </div>
                    <div class="detail-tool">
                        <ul>
                            <li>
                                <span class="star">
                                    <i class="fa fa-thumbs-o-up" aria-hidden="true"></i>
                                    {{ pojo.thumbup }}
                                </span>
                            </li>
                            <li>
                                <a href="#" data-toggle="modal" data-target="#shareModal">
                                    <i class="fa fa-share-alt" aria-hidden="true"></i>
                                    {{ pojo.share }}
                                </a>
                            </li>
                            <li>
                                <a @click="dialogVisible=true; content=''" data-toggle="modal" data-target="#remarkModal">
                                    <i class="fa fa-commenting" aria-hidden="true"></i>
                                    {{ pojo.comment }}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
                <!-- 评论区 -->
                <div class="comment-area">
                    <div class="comment-tit">
                        <span>评论</span>
                    </div>
                    <ul class="comment-list">
                        <li v-for="(comment, index) in commentList" :key="index">
                            <div class="item-photo">
                                <img src="~/assets/img/widget-widget-photo.png" alt=""/>
                            </div>
                            <div class="item-content">
                                <p class="author"><a href="javascript:void(0);">{{ comment.nickname }}</a> 发布</p>
                                <p class="content">{{ comment.content }}</p>
                            </div>
                            <div class="item-thumb">
                                <div>
                                    <i class="fa fa-thumbs-o-up" aria-hidden="true"></i> {{ comment.thumbup }}
                                </div>
                            </div>
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
        <!-- 评论弹框 -->
        <el-dialog title="评论吐槽" :visible.sync="dialogVisible" width="30%">
            <div class="quill-editor" :content="content" v-quill:myQuillEditor="editorOption">
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save">提交</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import "~/assets/css/page-sj-spit-detail.css";
    import spitApi from "@/api/spit";
    import axios from "axios";

    export default {
        asyncData(params) {
            return axios.all([spitApi.getById(params.id), spitApi.commentList(params.id)]).then(
                axios.spread(function (pojo, commentList) {
                    return {
                        pojo: pojo.data.data,
                        commentList: commentList.data.data,
                    };
                })
            );
        },
        data() {
            return {
                dialogVisible: false,       // 弹框
                content: '',
                editorOption: {
                    // some quill options
                    modules: {
                        toolbar: [
                            ['bold', 'italic', 'underline', 'strike'],
                            ['blockquote', 'code-block']
                        ]
                    }
                },
            };
        },
        methods: {
            save() {
                spitApi.save({
                    content: this.content,
                    parentid: this.pojo.id,
                }).then((response) => {
                    this.$message({
                        showClose: true,
                        message: response.data.message,
                        type: (response.data.flag ? 'success' : 'error'),
                    });
                    if (response.data.flag) {
                        // 提交成功，关闭窗口
                        this.dialogVisible = false;
                        // 刷新数据
                        spitApi.commentList(this.pojo.id).then(response => {
                            this.commentList = response.data.data;
                        });
                    }
                });
            },
        },
    }
</script>

<style scoped lang="stylus">
    .quill-editor
        min-height 200px
        max-height 400px
        overflow-y auto
</style>
