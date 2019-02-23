<template>
    <div id="wrap">
        <el-form :inline="true">
            <el-form-item label="标题">
                <el-input v-model="searchMap.title" placeholder="标题"></el-input>
            </el-form-item>
            <el-form-item label="所属频道">
                <el-input v-model="searchMap.channelid" placeholder="所属频道"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-input v-model="searchMap.type" placeholder="类型"></el-input>
            </el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
        </el-form>
        <el-table :data="articleList" border>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="columnid" label="专栏ID"></el-table-column>
            <el-table-column prop="userid" label="用户ID"></el-table-column>
            <el-table-column prop="title" label="标题"></el-table-column>
            <el-table-column prop="image" label="文章封面"></el-table-column>
            <el-table-column prop="createtime" label="发表日期"></el-table-column>
            <el-table-column prop="updatetime" label="修改日期"></el-table-column>
            <el-table-column prop="ispublic" label="是否公开"></el-table-column>
            <el-table-column prop="istop" label="是否置顶"></el-table-column>
            <el-table-column prop="state" label="审核状态"></el-table-column>
            <el-table-column prop="channelid" label="所属频道"></el-table-column>
            <el-table-column prop="type" label="类型"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="editHandler(scope.row.id)" type="text" size="small">审核文章</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            @size-change="fetchData"
            @current-change="fetchData"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
        </el-pagination>
        <!-- 弹出窗口 -->
        <el-dialog title="文章详情" :visible.sync="dialogFormVisible" width="30%">
            {{pojo.title}}
            <hr>
            <div class="article-content" v-html="pojo.content"></div>
            <el-button plain @click="dialogFormVisible=false">关闭</el-button>
            <el-button type="danger" @click="deleteHandler">删除文章</el-button>
            <el-button type="primary" @click="examineHandler">通过审核</el-button>
        </el-dialog>
    </div>
</template>

<script>
    import articleApi from "@/api/article"

    export default {
        data() {
            return {
                articleList: [],     // 企业数据
                currentPage: 1,         // 当前页
                pageSize: 10,              // 每页显示的数据条数
                searchMap: {state: '0'},          // 搜索条件
                total: 0,               // 总页数
                pojo: {},               // 企业信息
                dialogFormVisible: false,       // 弹窗是否可见
                id: "",                 // 当前修改的id
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                articleApi.getListByPagination(this.currentPage, this.pageSize, this.searchMap).then((response) => {
                    this.articleList = response.data.rows;
                    this.total = response.data.total;
                });
            },
            editHandler(id) {
                this.id = id;
                this.dialogFormVisible = true;
                if (id === "") {
                    this.pojo = {};
                } else {
                    articleApi.getById(id).then((response) => {
                        if (response.flag) {
                            this.pojo = response.data;
                        }
                    });
                }
            },
            saveHandler() {
                articleApi.updateById(this.id, this.pojo).then(response => {
                    this.$message({
                        showClose: true,
                        message: response.message,
                        type: response.flag ? 'success' : "error",
                    });
                    if (response.flag) {
                        this.fetchData();       // 刷新页面
                    }
                });
                this.dialogFormVisible = false;     // 关闭窗口
            },
            deleteHandler() {
                this.confirmBox("是否删除此记录？", () => {
                    articleApi.deleteById(this.id).then(response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: response.flag ? 'success' : "error",
                        });
                        if (response.flag) {
                            this.fetchData();    // 刷新数据
                        }
                        this.dialogFormVisible = false;
                    });
                }, () => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            confirmBox(msg, confirmCallBack, cancleCallBack) {
                this.$confirm(msg, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    confirmCallBack();
                }).catch(() => {
                    cancleCallBack();
                });
            },
            examineHandler() {
                this.confirmBox("确定要审核此记录吗？", () => {
                    articleApi.examine(this.id).then(response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: response.flag ? 'success' : "error",
                        });
                        if (response.flag) {
                            this.fetchData();    // 刷新数据
                        }
                        this.dialogFormVisible = false;
                    });
                }, () => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
        },
    }
</script>

<style scoped lang="stylus">
    #wrap
        margin 20px 30px
        .article-content
            margin-bottom 30px
            margin-top 20px
</style>
