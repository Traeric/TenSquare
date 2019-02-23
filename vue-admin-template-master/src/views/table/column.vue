<template>
    <div id="wrap">
        <el-form :inline="true">
            <el-form-item label="企业名称">
                <el-input v-model="searchMap.name" placeholder="企业名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="warning" plain @click="editHandler('')">新增</el-button>
        </el-form>
        <el-table :data="columnList" border>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="专栏名称"></el-table-column>
            <el-table-column prop="summary" label="专栏简介"></el-table-column>
            <el-table-column prop="userid" label="用户ID"></el-table-column>
            <el-table-column prop="createtime" label="申请日期"></el-table-column>
            <el-table-column prop="checktime" label="审核日期"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="examineHandler(scope.row.id)" type="text" size="small">审核通过</el-button>
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
        <el-dialog title="提示" :visible.sync="dialogFormVisible" width="30%">
            <el-form label-width="100px">
                <el-form-item label="专栏名称">
                    <el-input v-model="pojo.name" placeholder="专栏名称"></el-input>
                </el-form-item>
                <el-form-item label="专栏简介">
                    <el-input type="textarea" :rows="3" v-model="pojo.summary" placeholder="专栏简介"></el-input>
                </el-form-item>
                <el-form-item label="用户ID">
                    <el-input v-model="pojo.userid" placeholder="用户ID"></el-input>
                </el-form-item>
                <el-form-item label="申请日期">
                    <el-input v-model="pojo.createtime" placeholder="申请日期"></el-input>
                </el-form-item>
                <el-form-item label="审核日期">
                    <el-input v-model="pojo.checktime" placeholder="审核日期"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="pojo.state" placeholder="状态"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button plain @click="dialogFormVisible=false">关闭</el-button>
                    <el-button type="primary" @click="saveHandler">提交</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import columnApi from "@/api/column"

    export default {
        data() {
            return {
                columnList: [],     // 企业数据
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
                columnApi.getListByPagination(this.currentPage, this.pageSize, this.searchMap).then((response) => {
                    this.columnList = response.data.rows;
                    this.total = response.data.total;
                });
            },
            editHandler(id) {
                this.id = id;
                this.dialogFormVisible = true;
                if (id === "") {
                    this.pojo = {};
                } else {
                    columnApi.getById(id).then((response) => {
                        if (response.flag) {
                            this.pojo = response.data;
                        }
                    });
                }
            },
            saveHandler() {
                columnApi.updateById(this.id, this.pojo).then(response => {
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
            deleteHandler(id) {
                this.confirmBox("是否删除此记录？", () => {
                    columnApi.deleteById(id).then(response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: response.flag ? 'success' : "error",
                        });
                        if (response.flag) {
                            this.fetchData();    // 刷新数据
                        }
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
            examineHandler(id) {
                this.confirmBox("确定要审核此记录吗？", () => {
                    columnApi.examine(id).then(response => {
                        this.$message({
                            showClose: true,
                            message: response.message,
                            type: response.flag ? 'success' : "error",
                        });
                        if (response.flag) {
                            this.fetchData();    // 刷新数据
                        }
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
</style>
