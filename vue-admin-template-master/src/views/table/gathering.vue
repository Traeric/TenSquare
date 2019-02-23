<template>
    <div id="wrap">
        <el-form :inline="true">
            <el-form-item label="活动名称">
                <el-input v-model="searchMap.name" placeholder="活动名称"></el-input>
            </el-form-item>
            <el-form-item label="活动日期">
                <el-date-picker
                    v-model="searchMap.starttime_1"
                    type="date"
                    placeholder="选择开始日期">
                </el-date-picker>
                <el-date-picker
                    v-model="searchMap.starttime_2"
                    type="date"
                    placeholder="选择结束日期">
                </el-date-picker>
            </el-form-item>
            <el-button type="primary" @click="fetchData">查询</el-button>
            <el-button type="success" @click="editHandler('')">新增</el-button>
        </el-form>
        <el-table :data="list" border style="width: 100%">
            <el-table-column prop="id" label="活动ID"></el-table-column>
            <el-table-column prop="name" label="活动名称"></el-table-column>
            <el-table-column prop="sponsor" label="主办方"></el-table-column>
            <el-table-column prop="address" label="活动地址"></el-table-column>
            <el-table-column prop="starttime" label="开始日期"></el-table-column>
            <el-table-column prop="endtime" label="结束日期"></el-table-column>
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
                <el-form-item label="活动名称">
                    <el-input v-model="pojo.name" placeholder="活动名称"></el-input>
                </el-form-item>
                <el-form-item label="活动地址">
                    <el-input v-model="pojo.address" placeholder="活动地址"></el-input>
                </el-form-item>
                <el-form-item label="开始日期">
                    <el-date-picker
                        v-model="pojo.starttime"
                        type="date"
                        placeholder="选择开始日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期">
                    <el-date-picker
                        v-model="pojo.endtime"
                        type="date"
                        placeholder="选择结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="报名截止日期">
                    <el-date-picker
                        v-model="pojo.enrolltime"
                        type="date"
                        placeholder="选择报名截止日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="活动详情">
                    <el-input type="textarea" :rows="2" v-model="pojo.detail" placeholder="活动详情"></el-input>
                </el-form-item>
                <el-form-item label="活动城市">
                    <el-select v-model="pojo.city" placeholder="请选择">
                        <el-option
                            v-for="(item, index) in cityList"
                            :key="index"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可见">
                    <el-switch
                        v-model="pojo.state"
                        active-value="1"
                        inactive-value="0">
                    </el-switch>
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
    import gatheringApi from '@/api/gathering'
    import cityApi from '@/api/city'

    export default {
        data() {
            return {
                list: [],
                currentPage: 1,        // 当前页
                pageSize: 10,       // 每天显示的数据条数
                searchMap: {},      // 查询条件
                total: 0,           // 总页数
                dialogFormVisible: false,    // 编辑窗口是否可见
                pojo: {},               // 活动管理实体
                cityList: [],
                id: "",             // 当前用户修改的id
            };
        },
        created() {
            // 初始化获取数据
            this.fetchData();
            cityApi.getList().then((response) => {
                this.cityList = response.data;
            });
        },
        methods: {
            fetchData() {
                // 获取返回的数据
                gatheringApi.getListByPagination(this.currentPage, this.pageSize, this.searchMap).then((response) => {
                    this.list = response.data.rows;
                    this.total = response.data.total;
                });
            },
            saveHandler() {
                gatheringApi.updateById(this.id, this.pojo).then(response => {
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
            editHandler(id) {
                this.id = id;
                // 打开弹窗
                this.dialogFormVisible = true;
                if (id !== '') {
                    gatheringApi.findById(id).then(response => {
                        if (response.flag) {
                            this.pojo = response.data;
                        }
                    });
                } else {
                    this.pojo = {};
                }
            },
            deleteHandler(id) {
                this.confirmBox("是否删除此记录？", () => {
                    gatheringApi.deleteById(id).then(response => {
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
            }
        },
    }
</script>

<style scoped lang="stylus">
    #wrap
        margin 20px 30px
</style>
