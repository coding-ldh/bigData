<template>
    <div class="user_container">
        <div class="list_container">
            <div class="container_title">系统管理-菜单管理{{ tip }}</div>
            <el-form v-if="admin">
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
            <div class="list_content">
                <el-table
                    stripe
                    style="width: 100%"
                    :data="renderList"
                    v-loading="loading"
                    :v-loading="loading"
                >
                    <!-- <el-table-column label="id" align="center" prop="id" width="60"></el-table-column> -->
                    <el-table-column label="序号" align="center" prop="index" width="120"></el-table-column>
                    <el-table-column label="菜单名称" align="center" prop="menuName"></el-table-column>
                    <el-table-column label="菜单级别" align="left" prop="menuLevel"></el-table-column>
                    <el-table-column label="上级菜单" align="left" prop="supMenu"></el-table-column>
                    <el-table-column label="icon" align="left" prop="icon" v-if="admin"></el-table-column>
                    <el-table-column label="path" align="left" prop="path" v-if="admin"></el-table-column>
                    <el-table-column label="component" align="left" prop="component" v-if="admin"></el-table-column>
                    <el-table-column label="状态" align="center" key="status" >
                        <template slot-scope="scope">
                            <el-switch
                                v-model="scope.row.status"
                                active-value="0"
                                inactive-value="1"
                                @change="handleStatusChange(scope)"
                            ></el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="权重" align="center" prop="orderNum"></el-table-column>
                    <el-table-column label="操作" align="center" fixed="right">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="handleEdit(scope)">编辑</el-button>
                            <template v-if="admin">
                                <el-popconfirm
                                    confirm-button-text="确定了"
                                    cancel-button-text="那算了"
                                    confirm-button-type="danger"
                                    cancel-button-type="Primary"
                                    icon="el-icon-info"
                                    icon-color="red"
                                    title="删除后，其子菜单也会删除，且对应角色权限也会受到影响，
                                    请谨慎操作！"
                                    @confirm="handleDelete(scope)"
                                >
                                    <el-button type="text" size="mini" slot="reference">删除</el-button>
                                </el-popconfirm>
                            </template>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    :total="pageInfor.total"
                    @pageChange="pageChange"
                    @sizeChange="sizeChange"
                    :layout="layout"
                    :currentPage="pageInfor.pageNo"
                ></pagination>
            </div>
        </div>
        <menu-dialog
            ref="form"
            :title="dialogTitle"
            :AllList="AllList"
            :AllShowId="AllShowId"
            :editObj="editObj"
            :AllFirstMenu="AllFirstMenu"
            @confirm-menu="init"
        ></menu-dialog>
    </div>
</template>

<script>
import pagination from "@/components/Pagination";
import menuDialog from "./components/menuDialog.vue";
import { deepClone } from "@/utils";
import { getMenuList, DeleteMenu, ChangeMenuList } from "@/api/menuCtrl";
// import {getters} from '@/store/getters.js'
export default {
    components: {
        pagination,
        menuDialog,
    },
    data() {
        return {
            layout: 'total, prev, pager, next, jumper',
            loading: false,
            admin: false,
            dialogTitle: '修改',
            pageInfor: {
                pageNo: 1,
                pageSize: 10,
                total: 0,
            },
            // status: '',
            AllList: [],       // 全部数据
            AllFirstMenu: [],  // 全部一级菜单名称
            AllShowId: [],     // 全部序号
            renderList: [],    // 渲染列表
            editObj: {},      // 用于修改的obj
            tip: ''
        };
    },
    created() {
        this.$nextTick(() => {
            this.init()
        })
        
        if (this.$store.getters.userInfo.roles == '开发者') {
            this.admin = true
            this.tip = '（欢迎，开发者）'
        } else { this.admin = false }
    },
    methods: {
        async init() {
            const data = await getMenuList({ pageNo: 1, pageSize: 80000 })
            this.AllList = data.data.records                            // 全部数据
            this.pageInfor.total = data.data.total                      // 总页码
            this.AllShowId = this.AllList.map(_ => { return Number(_.showId) })  // 全部showId
            const AllFirstMenu = this.AllList.filter(_ => { return _.parentId == 0 }) // 筛选二级菜单
            this.AllFirstMenu = AllFirstMenu.map(_ => { return _.menuName })// 全部二级菜单名称
            await this.MenuList()
        },
        async MenuList() {
            this.loading = true;
            const { pageNo, pageSize } = this.pageInfor;
            const { data } = await getMenuList({ pageNo, pageSize })
            // console.log(data.records, '==================')
            this.renderList = data.records.map(_ => {
                const supMenu = this.AllList.filter(__ => {   // 根据上级id搜索对应名字
                    return _.parentId == __.menuId
                })
                if (supMenu.length == 0) {
                    supMenu.push({ menuName: '无' })
                }
                return {
                    id: _.menuId,
                    index: _.showId,
                    menuName: _.menuName,
                    menuLevel: _.parentId == 0 ? '一级菜单' : '二级菜单',
                    supMenu: _.parentId == 0 ? '无' : supMenu[0].menuName,
                    status: String(_.visible),
                    icon: _.icon,
                    path: _.path,
                    component: _.component,
                    orderNum: _.orderNum,
                }
            })
            this.loading = false;
        },
        onOpenDialog(val) {
            this.$refs.form.$emit("openDialog", val);
        },
        handleEdit(scope) {
            this.dialogTitle = '修改'
            this.editObj = deepClone(scope.row)
            this.onOpenDialog(1);  // 1 编辑  
        },
        handleAdd() {
            this.dialogTitle = '新增'
            this.onOpenDialog(2);  // 2 新增
        },
        async handleDelete(scope) {
            if (scope.row.supMenu == '无') {
                const deleteId = scope.row.id
                const msg = await DeleteMenu(deleteId)
                if (msg.data == true) {
                    this.$message.success(`${scope.row.menuName}删除成功`)
                    let arr = []
                    this.AllList.map(_ => { _.parentId == scope.row.id ? arr.push(_.menuId) : '' })
                    arr.map(_ => {
                        return new Promise((resolve, reject) => {
                            DeleteMenu(_).then(res => {
                                res.data == true ? this.$message.success(`子菜单删除成功`) : this.$message.error(`子菜单删除失败:${_}`)
                                resolve()
                            }).catch(err => {
                                this.$message.error(`系统错误`)
                                reject()
                            });
                        });
                    })
                } else { this.$message.error(`删除失败`) }
                this.init()
            } else {
                const deleteId = scope.row.id
                const msg = await DeleteMenu(deleteId)
                msg.data == true ? this.$message.success(`删除成功`) : this.$message.error(`删除失败`)
                this.init()
            }
        },
        async handleStatusChange(scope){
            this.loading = true;
            const d = this.AllList.filter(_=>{
                return  _.menuName == scope.row.supMenu
            })
            if (d.length == 0) {
                d.push({ supMenu: '无' })
            }
            const data = await ChangeMenuList({
                menuId: scope.row.id,
                showId: scope.row.index,
                menuName: scope.row.menuName,
                orderNum:scope.row.orderNum,
                visible:scope.row.status,
                parentId: scope.row.supMenu == "无" ? 0 : d[0].menuId, // 处理
                icon: scope.row.icon == null ? "" : scope.row.icon,
                path: scope.row.path == null ? "" : scope.row.path,
                component: scope.row.component == null ? "" : scope.row.component,
            });
            if(data.status = "success"){
                this.$message.success(`修改状态成功`)
            } else {
                this.$message.error(`修改状态失败`);
            }
            this.loading = false;
        },
        pageChange(val) {
            this.pageInfor.pageNo = val;
            this.init()
        },
        sizeChange(val) {
            this.pageInfor.pageSize = val;
            this.init()
        },
    }
}
</script>

<style lang="scss" scoped>
.user_container {
    width: 100%;
    .list_container {
        font-size: 20px;
        padding: 30px 30px 10px;
        color: #333;
        background-color: #fff;
        .container_title {
            padding-bottom: 30px;
            // background: #fff;
            font-size: 20px;
        }
        .list_top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 22px;
            align-items: center;
        }
    }
}
</style>