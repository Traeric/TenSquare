<template xmlns:v-quill="http://www.w3.org/1999/xhtml">
    <div class="wrapper release-tc">
        <div class="release-box">
            <h3>发布吐槽</h3>
            <div class="editor">
                <div class="quill-editor" @change="onEditorChange($event)" :content="content" v-quill:myQuillEditor="editorOption">
                </div>
                <div class="btns">
                    <button class="sui-btn btn-danger btn-release" @click="save">发布</button>
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import "~/assets/css/page-sj-spit-submit.css";
    import spitApi from "@/api/spit";

    export default {
        data() {
            return {
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
            }
        },
        methods: {
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            save() {
                spitApi.save({content: this.content}).then((response) => {
                    this.$message({
                        showClose: true,
                        message: response.data.message,
                        type: (response.data.flag ? 'success' : 'error'),
                    });
                    if (response.data.flag) {
                        // 提交成功，跳转到吐槽首页
                        this.$router.push("/spit");
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
