<template>
  <div class="content">
    <div class="content_title_itemList">项目数据-项目场景列表</div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select v-model="queryInfor.itemScene" placeholder="请选择场景">
          <el-option
            v-for="item in paramsList.itemScene"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span class="position_params_params" title="场景">场景：</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search()">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="userReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="content_list" v-loading="loading">
      <el-table :data="dataList" stripe style="width: 100%">
        <el-table-column label="序号" width="120px" prop="index" align="center" />
        <el-table-column label="场景名称" prop="projectScene" align="center" />
        <el-table-column label="操作" fixed="right" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goDetailPage(scope.row.projectScene)"
              >场景概览</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="pageInfor.total"
        @pageChange="pageChange"
        @sizeChange="sizeChange"
        :currentPage="pageInfor.pageNo"
      ></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import { reset } from "@/utils/tool.js";
import {
  getProjectSceneList,
  getDeviceOption,
  getSceneOption,
} from "@/api/projectData";

export default {
  components: {
    pagination,
  },
  data() {
    return {
      loading: false,
      queryInfor: {
        deviceType: "",
        itemScene: "",
      },
      paramsList: {
        itemScene: [],
      },
      dataList: [],
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 100,
      },
    };
  },
  created() {},
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      let itemScene = await getSceneOption();
      this.paramsList.itemScene = itemScene.data;
      this.search();
    },
    async search() {
      this.loading = true;
      let { pageInfor, queryInfor } = this;
      let { data } = await getProjectSceneList({
        pageNo: pageInfor.pageNo,
        pageSize: pageInfor.pageSize,
        projectScene: queryInfor.itemScene,
      });
      this.pageInfor.total = data.total;
      data.list = data.list.map((e,index) => {
        return {
          'index':index+1,
          'projectScene':e
        }
      });
      // console.log(data.list);
      this.dataList = data.list;
      this.loading = false;
    },
    pageChange(val) {
      this.pageInfor.pageNo = val;
      this.search();
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.search();
    },
    userReset() {
      reset(this.queryInfor);
      (this.pageInfor = {
        pageNo: 1,
        pageSize: 10,
        total: 100,
      }),
        this.search();
    },
    goDetailPage(scene) {
      this.$router.push({
        name: "General-scene",
        query: { scene },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  background: #fff;
  padding: 20px;
  font-size: 20px;
  display: flex;
  flex-direction: column;
  .content_title_itemList {
    margin-bottom: 20px;
  }
}
</style>