<template>
  <div class="container">
    <div class="search_container" style="margin-bottom: 10px">
      软件场景分析
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label="设备类型：">
          <el-select
            placeholder="全部"
            v-model="queryInfor.deviceType"
            @change="getFilterData"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in filterData.deviceTypeCases"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <tool-tip :content="tip"></tool-tip>
        </el-form-item>

        <el-form-item label="软件场景：">
          <el-select
            placeholder="全部"
            v-model="queryInfor.sceneType"
            @change="getFilterData"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in filterData.sceneCases"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="initData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="useReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list_container">
      <div class="list_content">
        <el-table
          stripe
          style="width: 100%"
          :data="sceneList"
          v-loading="loading"
        >
          <el-table-column
            label="序号"
            type="index"
            width="100"
            align="center"
          ></el-table-column>
          <!-- <el-table-column label="设备类型" prop="deviceType"></el-table-column> -->
          <el-table-column
            label="软件场景名称"
            prop="sceneType"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="goDetailPage(scope.row)"
                :disabled="
                  ['医院', '商超', '酒店'].indexOf(
                    scope.row.sceneType
                  ) == -1
                "
                >查看数据分析</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="pageInfor.total"
          @pageChange="turnPage"
          @sizeChange="sizeChange"
          :currentPage="pageInfor.pageNo"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { reset } from "@/utils/tool.js";
import Pagination from "@/components/Pagination";
import ToolTip from "@/components/ToolTip";
import {
  getSortSceneDeviceType,
  getSortScenes,
  getSortSceneList,
} from "@/api/ai";
export default {
  components: {
    Pagination,
    ToolTip,
  },
  data() {
    return {
      tip: "目前仅部分场景下存在数据",
      eventName: "",
      queryInfor: {
        // deviceType: "",
        sceneType: "",
      },
      copyQueryInfor: {},
      filterData: {
        // deviceTypeCases: "",
        sceneCases: "",
      },
      sceneList: [],
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      loading: false,
    };
  },
  created() {
    this.initData();
  },
  methods: {
    getFilterData() {
      // this.setDeviceTypeCases();
      this.setSceneCases();
    },
    // async setDeviceTypeCases() {
    //   const { data } = await getSortSceneDeviceType();
    //   this.filterData.deviceTypeCases = data;
    // },
    async setSceneCases() {
      const { data } = await getSortScenes();
      this.filterData.sceneCases = data;
    },
    async setSceneList(isPage = false) {
      this.loading = true;
      const inforData = !isPage ? this.getInforData() : this.copyQueryInfor;
      const { pageNo, pageSize } = this.pageInfor;
      const { data } = await getSortSceneList({
        pageNo,
        pageSize,
        ...inforData,
      });
      this.sceneList = data.list;
      this.pageInfor.total = data.total;
      this.loading = false;
    },
    getInforData() {
      const { sceneType } = this.queryInfor;
      this.copyQueryInfor = { sceneType };
      this.pageInfor = {
        pageSize: 10,
        pageNo: 1,
      };
      return { sceneType };
    },
    useReset() {
      reset(this.queryInfor);
      this.initData();
    },
    goDetailPage(row) {
      this.$router.push({
        name: "Scene-detail",
        query: { row },
      });
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setSceneList(true);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setSceneList(true);
    },
    initData() {
      this.getFilterData();
      this.setSceneList();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .demo-form-inline {
    margin-top: 20px;
  }
  .list_container {
    font-size: 20px;
    padding: 30px 15px 20px 30px;
    color: #333;
    background-color: #fff;
    .list_top {
      display: flex;
      justify-content: space-between;
      margin-bottom: 22px;
      align-items: center;
    }
  }
}
</style>
