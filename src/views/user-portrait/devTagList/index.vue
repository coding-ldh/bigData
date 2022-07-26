<template>
  <div class="container">
    <div class="search_container" style="margin-bottom: 10px">
      <el-form :inline="true" :model="queryInfor">
        <el-form-item label="设备ID">
          <el-input
            v-model="queryInfor.mid"
            placeholder="请输入设备ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="设备类型">
          <el-select v-model="queryInfor.deviceType" placeholder="全部类型">
            <el-option value="" label="全部类型">全部类型</el-option>
            <el-option
              v-for="item in filterData.deviceTypeList"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行业">
          <el-select
            v-model="queryInfor.projectScene"
            collapse-tags
            multiple
            placeholder="全部行业"
          >
            <el-option value="" label="全部行业">全部行业</el-option>
            <el-option
              v-for="item in filterData.sceneList"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否允许投放商业广告">
          <el-select
            v-model="queryInfor.isAdverAllow"
            collapse-tags
            placeholder="全部"
          >
            <el-option value="">全部</el-option>
            <el-option value="是">是</el-option>
            <el-option value="否">否</el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户地区">
          <my-area @fromChildArea="getAreaData" ref="areaRef"></my-area>
        </el-form-item>
        <el-form-item label="售卖类型">
          <el-select
            v-model="queryInfor.sellMode"
            collapse-tags
            placeholder="全部类型"
          >
            <el-option value="" label="全部类型">全部类型</el-option>
            <el-option
              v-for="item in filterData.sellModeList"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业分布">
          <el-select
            v-model="queryInfor.occupationDistribution"
            collapse-tags
            multiple
            placeholder="全部职业"
          >
            <el-option value="" label="全部职业">全部职业</el-option>
            <el-option
              v-for="item in filterData.occupationDistributionList"
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
          <el-button type="primary" plain @click="userReset">重置</el-button>
        </el-form-item>
        <el-form-item>
          <exports-button
            :exportUrl="exportUrl"
            ref="exportsButton"
            @exports="exportData"
            >导出</exports-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="list_container">
      <!-- <div class="list_top"> -->
        <!-- <span>设备标签列表</span> -->
        <!-- <el-button type="primary" @click="exportData">导出</el-button> -->
      <!-- </div> -->
      <div class="list_content">
        <el-table stripe style="width: 100%" :data="dlList" v-loading="loading">
          <el-table-column
            label="设备ID"
            prop="mid"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            label="设备类型"
            prop="deviceType"
            align="center"
            width="160"
          ></el-table-column>
          <el-table-column
            label="售卖类型"
            prop="sellMode"
            align="center"
            width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.sellMode ? scope.row.sellMode : "未分类" }}
            </template>
          </el-table-column>
          <el-table-column
            label="所属项目"
            prop="projectName"
            align="center"
          ></el-table-column>
          <el-table-column
            label="行业"
            align="center"
            prop="projectScene"
            width="90"
          ></el-table-column>
          <el-table-column prop="deviceAddr" label="地址" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.deviceAddr">{{
                scope.row.deviceAddr
              }}</span>
              <span v-else>{{ scope.row.projectAddr }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="年龄分布"
            prop="ageDistribution"
            align="center"
            width="105"
          ></el-table-column>
          <el-table-column
            label="性别分布"
            prop="genderDistribution"
            align="center"
            width="95"
          ></el-table-column>
          <el-table-column
            label="职业分布"
            prop="occupationDistribution"
            align="center"
            width="80"
          ></el-table-column>
          <el-table-column
            label="日均流量"
            prop="avgTraffic"
            align="center"
            width="100"
          ></el-table-column>
          <el-table-column
            label="城市级别"
            prop="cityLevel"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            label="是否允许投放商业广告"
            prop="isAdverAllow"
            align="center"
          ></el-table-column>
          <el-table-column
            label="地址来源"
            prop="addrSource"
            align="center"
            fixed="right"
          ></el-table-column>
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
import { reset, userExport } from "@/utils/tool.js";
import MyArea from "@/components/Area";
import pagination from "@/components/Pagination";
import exportsButton from "@/components/exportByKey/exportsButton.vue";
import { getDlFilterList, getDlList } from "@/api/userPortrait";
export default {
  components: {
    MyArea,
    pagination,
    exportsButton,
  },
  data() {
    return {
      exportUrl: "",
      loading: true,
      queryInfor: {
        mid: "",
        deviceType: "",
        projectScene: [],
        occupationDistribution: [],
        area: [],
        sellMode: "",
        isAdverAllow: "",
      },
      copyQueryInfor: "",
      dlList: [],
      filterData: {},
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  created() {
    this.getFilterData();
    this.initData();
  },
  methods: {
    userReset() {
      reset(this.queryInfor);
      this.initData();
    },
    async getFilterData() {
      const { data } = await getDlFilterList();
      this.filterData = data;
    },
    async setDlList(isPage = false) {
      this.loading = true;
      const inforData = !isPage ? this.getInforData() : this.copyQueryInfor;
      const { pageNo, pageSize } = this.pageInfor;
      const { data } = await getDlList({
        ...inforData,
        pageNo,
        pageSize,
      });
      this.loading = false;
      this.dlList = data.records;
      this.pageInfor.total = data.total;
    },
    getInforData() {
      const {
        area,
        deviceType,
        isAdverAllow,
        mid,
        occupationDistribution,
        sellMode,
        projectScene,
      } = this.queryInfor;
      const [province = "", city = "", district = ""] = area;
      const inforData = {
        deviceType,
        isAdverAllow,
        mid,
        occupationDistribution: occupationDistribution.join(","),
        sellMode,
        projectScene: projectScene.join(","),
        province,
        city,
        district,
      };
      this.copyQueryInfor = inforData;
      this.pageInfor.pageNo = 1;
      this.pageInfor.pageSize = 10;
      return inforData;
    },
    getAreaData(val) {
      this.queryInfor.area = val;
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setDlList(true);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setDlList(true);
    },
    exportData() {
      const { pageSize, pageNo } = this.pageInfor;
      const {
        city,
        deviceType,
        district,
        isAdverAllow,
        mid,
        occupationDistribution,
        projectScene,
        province,
        sellMode,
      } = this.copyQueryInfor;
      this.exportUrl =
        `/deviceLabel/export?` +
        `deviceType=${deviceType}` +
        `&fileName=设备标签列表` +
        `&isAdverAllow=${isAdverAllow}` +
        `&mid=${mid}` +
        `&occupationDistribution=${occupationDistribution}` +
        `&pageNo=${pageNo}` +
        `&pageSize=${pageSize}` +
        `&projectScene=${projectScene}` +
        `&province=${province}` +
        `&city=${city}` +
        `&district=${district}` +
        `&sellMode=${sellMode}`;
      this.$nextTick((_) => {
        this.$refs.exportsButton.run();
      });
    },
    initData() {
      this.setDlList();
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .list_container {
    font-size: 20px;
    padding: 30px 30px 10px;
    color: #333;
    background-color: #fff;
    // .list_top {
    //   display: flex;
    //   justify-content: space-between;
    //   margin-bottom: 22px;
    //   align-items: center;
    // }
  }
}
</style>