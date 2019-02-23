<template>
    <div id="wrap">
        <el-form :inline="true">
            <el-form-item label="企业名称">
                <el-input v-model="searchMap.name" placeholder="企业名称"></el-input>
            </el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="warning" plain @click="editHandler('')">新增</el-button>
        </el-form>
        <el-table :data="enterpriseList" border>
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column prop="name" label="企业名称"></el-table-column>
            <el-table-column prop="summary" label="企业简介"></el-table-column>
            <el-table-column prop="address" label="企业地址"></el-table-column>
            <el-table-column prop="labels" label="标签列表"></el-table-column>
            <el-table-column prop="ishot" label="是否热门"></el-table-column>
            <el-table-column prop="logo" label="LOGO"></el-table-column>
            <el-table-column prop="jobcount" label="职位数"></el-table-column>
            <el-table-column prop="url" label="URL"></el-table-column>
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
                <el-form-item label="企业名称">
                    <el-input v-model="pojo.name" placeholder="企业名称"></el-input>
                </el-form-item>
                <el-form-item label="企业简介">
                    <el-input type="textarea" :rows="3" v-model="pojo.summary" placeholder="企业简介"></el-input>
                </el-form-item>
                <el-form-item label="企业地址">
                    <el-input v-model="pojo.address" placeholder="企业地址"></el-input>
                </el-form-item>
                <el-form-item label="标签列表">
                    <el-input v-model="pojo.labels" placeholder="标签列表"></el-input>
                </el-form-item>
                <el-form-item label="是否热门">
                    <el-switch
                        v-model="pojo.state"
                        active-value="1"
                        inactive-value="0">
                    </el-switch>
                </el-form-item>
                <el-form-item label="LOGO">
                    <el-upload
                        class="avatar-uploader"
                        action="https://jsonplaceholder.typicode.com/posts/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <div class="el-img-wrap">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="职位数">
                    <el-input v-model="pojo.jobcount" placeholder="职位数"></el-input>
                </el-form-item>
                <el-form-item label="URL">
                    <el-input v-model="pojo.url" placeholder="URL">
                        <template slot="prepend">Http://</template>
                    </el-input>
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
    import enterpriseApi from "@/api/enterprise"

    export default {
        data() {
            return {
                enterpriseList: [],     // 企业数据
                currentPage: 1,         // 当前页
                pageSize: 10,              // 每页显示的数据条数
                searchMap: {},          // 搜索条件
                total: 0,               // 总页数
                pojo: {},               // 企业信息
                dialogFormVisible: false,       // 弹窗是否可见
                id: "",                 // 当前修改的id
                imageUrl: '',           // 上传logo的url
            };
        },
        created() {
            this.fetchData();
        },
        methods: {
            fetchData() {
                enterpriseApi.getListByPagination(this.currentPage, this.pageSize, this.searchMap).then((response) => {
                    this.enterpriseList = response.data.rows;
                    this.total = response.data.total;
                });
            },
            editHandler(id) {
                this.id = id;
                this.dialogFormVisible = true;
                if (id === "") {
                    this.pojo = {};
                } else {
                    enterpriseApi.getById(id).then((response) => {
                        if (response.flag) {
                            this.pojo = response.data;
                        }
                    });
                }
            },
            saveHandler() {
                enterpriseApi.updateById(this.id, this.pojo).then(response => {
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
                    enterpriseApi.deleteById(id).then(response => {
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
            handleAvatarSuccess(res, file) {
                this.imageUrl = URL.createObjectURL(file.raw);
                this.pojo.logo = this.imageUrl;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG 格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },
        },
    }
</script>

<style scoped lang="stylus">
    #wrap
        margin 20px 30px

    .avatar
        width 100px
        height 50px
        display block

    .avatar-uploader
        .el-img-wrap
            border 1px dashed #d9d9d9
            border-radius 6px
            cursor pointer
            position relative
            overflow hidden
            &:hover
                border-color #409EFF
            .avatar-uploader-icon
                font-size 28px
                color #8c939d
                width 100px
                height 50px
                line-height 50px
                text-align center
</style>
