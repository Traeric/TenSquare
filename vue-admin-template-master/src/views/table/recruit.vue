<template>
    <div id="wrap">
        <el-form :inline="true">
            <el-form-item label="企业名称">
                <el-input v-model="searchMap.name" placeholder="企业名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="success" plain @click="editHandler('')">新增</el-button>
        </el-form>
        <el-table :data="recruitList" border>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="jobname" label="职位名称"></el-table-column>
            <el-table-column prop="salary" label="资薪范围"></el-table-column>
            <el-table-column prop="condition" label="经验要求"></el-table-column>
            <el-table-column prop="education" label="学历要求"></el-table-column>
            <el-table-column prop="type" label="任职方式"></el-table-column>
            <el-table-column prop="address" label="办公地址"></el-table-column>
            <el-table-column prop="eid" label="企业ID"></el-table-column>
            <el-table-column prop="createtime" label="创建日期"></el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="url" label="网址"></el-table-column>
            <el-table-column prop="label" label="标签"></el-table-column>
            <el-table-column prop="content1" label="职位描述"></el-table-column>
            <el-table-column prop="content2" label="职位要求"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="editHandler(scope.row.id)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteHandler(scope.row.id)" type="text" size="small">删除</el-button>
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
                <el-form-item label="职位名称">
                    <el-input v-model="pojo.jobname" placeholder="职位名称"></el-input>
                </el-form-item>
                <el-form-item label="资薪范围">
                    <el-input v-model="pojo.salary" placeholder="资薪范围"></el-input>
                </el-form-item>
                <el-form-item label="经验要求">
                    <el-input v-model="pojo.condition" placeholder="经验要求"></el-input>
                </el-form-item>
                <el-form-item label="学历要求">
                    <el-input v-model="pojo.education" placeholder="学历要求"></el-input>
                </el-form-item>
                <el-form-item label="任职方式">
                    <template>
                        <el-radio v-model="pojo.type" label="1">全职</el-radio>
                        <el-radio v-model="pojo.type" label="2">兼职</el-radio>
                    </template>
                </el-form-item>
                <el-form-item label="办公地址">
                    <el-input v-model="pojo.address" placeholder="办公地址"></el-input>
                </el-form-item>
                <el-form-item label="企业">
                    <el-select v-model="pojo.eid" filterable placeholder="企业">
                        <el-option
                            v-for="(item, index) in enterpriseList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态">
                    <el-switch v-model="pojo.state" active-color="#13ce66" inactive-color="#ff4949"
                    active-value="1" inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="网址">
                    <el-input v-model="pojo.url" placeholder="网址">
                        <template slot="prepend">Http://</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <el-input v-model="pojo.label" placeholder="标签"></el-input>
                </el-form-item>
                <el-form-item label="职位描述">
                    <el-input type="textarea" :rows="2" v-model="pojo.content1" placeholder="职位描述"></el-input>
                </el-form-item>
                <el-form-item label="职位要求">
                    <el-input type="textarea" :rows="2" v-model="pojo.content2" placeholder="职位要求"></el-input>
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
    import recruitApi from "@/api/recruit"
    import enterpriseApi from "@/api/enterprise"

    export default {
        data() {
            return {
                recruitList: [],            // 招聘数据
                currentPage: 1,             // 当前页面
                pageSize: 10,               // 每页显示数据条数
                searchMap: {},              // 筛选条件
                total: 0,                   // 总页数
                dialogFormVisible: false,       // 弹窗是否可见
                pojo: {},                   // 招聘实体
                id: '',                     // 当前修改的id
                enterpriseList: [],         // 企业列表
            };
        },
        created() {
            this.fetchData();
            // 加载企业信息
            enterpriseApi.getList().then(response => {
                if (response.flag) {
                    this.enterpriseList = response.data;
                }
            });
        },
        methods: {
            fetchData() {
                recruitApi.getListByPagination(this.currentPage, this.pageSize, this.searchMap).then(response => {
                    this.total = response.data.total;
                    this.recruitList = response.data.rows;
                });
            },
            editHandler(id) {
                this.id = id;
                this.dialogFormVisible = true;
                if (id === "") {
                    this.pojo = {};
                } else {
                    recruitApi.getById(id).then((response) => {
                        if (response.flag) {
                            this.pojo = response.data;
                        }
                    });
                }
            },
            saveHandler() {
                recruitApi.updateById(this.id, this.pojo).then(response => {
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
                    recruitApi.deleteById(id).then(response => {
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
        },
    }
</script>

<style scoped lang="stylus">
    #wrap
        margin 20px 30px
</style>
