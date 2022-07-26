<template>
  <div class="container">
    <div class="search_container" style="margin-bottom: 10px">
      {{ scene }}场景分析
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="queryInfo.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="机器人">
          <el-input
            placeholder="请输入机器人ID"
            v-model="queryInfo.deviceId"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目">
          <el-input
            placeholder="请输入项目名称"
            v-model="queryInfo.projectName"
          ></el-input>
        </el-form-item>
        <el-form-item label="行业">
          <el-select placeholder="全部" v-model="queryInfo.industry">
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in filterData.sceneIndustryCases"
              :label="item"
              :value="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地区">
          <ReArea
            @fromChildArea="getAreaData"
            ref="areaRef"
            :handleArea="handleArea"
            :leaf="1"
          ></ReArea>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="useReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="card_container">
      <el-row :gutter="24">
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
          style="margin-bottom: 20px"
          v-for="item in statisticsData"
          :key="item.moduleId"
        >
          <SceneTable
            :tableId="item.moduleId"
            :tableName="item.moduleComment"
            :tableTitle="item.moduleColumn"
            :tableInfo="info"
            v-if="item.moduleId"
          ></SceneTable>
        </el-col>
        <el-col
          :xs="24"
          :sm="24"
          :md="12"
          :lg="12"
          :xl="12"
          style="margin-bottom: 20px"
          ><el-card>
            <template #header>
              <div>
                <span>触发导览入口统计</span>
              </div>
            </template>
            <template #default>
              <div class="circle">
                <ReCircle
                  :index="2"
                  :colors="circleColors"
                  :chartData="triggerChart"
                  v-if="triggerChart.length != 0"
                  unit="台"
                ></ReCircle>
              </div>
            </template>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { reset, userExport, getCurrentDate } from "@/utils/tool.js";
import { ReCircle } from "@/components/ReCharts";
import Pagination from "@/components/Pagination";
import {
  getSortSceneIndustry,
  getSoftSceneArea,
  getSceneTrigger,
  getSceneVar
} from "@/api/ai";
import ReArea from "@/components/ReArea";
import SceneTable from "./components/SceneTable";

export default {
  components: {
    Pagination,
    ReArea,
    ReCircle,
    SceneTable
  },
  data() {
    return {
      scene: this.$route.query.row.sceneType,
      // deviceType: this.$route.query.row.deviceType,
      handleArea: getSoftSceneArea,
      statisticsData: [],
      info: {},
      eventName: "",
      circleColors: [
        "#3BA0FF",
        "#36CBCB",
        "#4DCB73",
        "#FAD337",
        "#F2637B",
        "#975FE4",
        "#FFA15A"
      ],
      triggerChart: "",
      queryInfo: {
        dateRange: [],
        deviceId: "",
        // deviceType: "",
        industry: "",
        projectName: "",
        province: "",
        city: ""
      },
      copyQueryInfor: {},
      diseaseTopList: [],
      departmentList: [],
      multipleSelection: [],
      filterData: {
        sceneIndustryCases: ""
      },
      eventList: [],
      diseasePageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      departPageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  async created() {
    await this.getStatisticsData()
    this.initData();
  },
  methods: {
    async getFilterData() {
      this.setSceneIndustryCases();
    },
    async setSceneIndustryCases() {
      const { data } = await getSortSceneIndustry();
      this.filterData.sceneIndustryCases = data;
    },
    async getStatisticsData() {
      const { data } = await getSceneVar({scene: this.scene});
      this.statisticsData = data
    },
    async setTriggerData() {
      const inforData = this.info
      const { data } = await getSceneTrigger({
        ...inforData,
        // deviceType: this.deviceType,
        sceneType: this.scene
      });
      this.triggerChart = data.map(item => {
        return {
          name: item.name,
          value: item.num
        };
      });
    },
    initTimeValue() {
      const time1 = getCurrentDate(30 * 24);
      const time2 = getCurrentDate(1 * 24);
      this.queryInfo.dateRange = [time1, time2];
    },
    getInforData() {
      const {
        dateRange,
        deviceId,
        // deviceType,
        projectName,
        industry
      } = this.queryInfo;
      const beginDate = dateRange[0];
      const endDate = dateRange[1];
      this.copyQueryInfor = {
        beginDate,
        endDate,
        deviceId,
        // deviceType,
        projectName,
        industry
      };
      this.diseasePageInfor = {
        pageSize: 10,
        pageNo: 1
      };
      return {
        beginDate,
        endDate,
        deviceId,
        // deviceType,
        projectName,
        industry
      };
    },
    useReset() {
      reset(this.queryInfo);
      this.initData();
    },
    // diseaseTurnPage(val) {
    //   this.diseasePageInfor.pageNo = val;
    //   this.setDisease100(true);
    // },
    // diseaseSizeChange(val) {
    //   this.diseasePageInfor.pageSize = val;
    //   this.setDisease100(true);
    // },
    // departTurnPage(val) {

    // },
    // departSizeChange(val) {

    // },
    getAreaData(arr) {
      if (arr[0] == "全国") {
        this.queryInfo.province = "";
        this.queryInfo.city = "";
      } else if (arr[1] == "全部") {
        this.queryInfo.province = arr[0];
        this.queryInfo.city = "";
      } else {
        this.queryInfo.province = arr[0];
        this.queryInfo.city = arr[1];
      }
    },
    initData() {
      this.initTimeValue();
      this.getFilterData();
      const { dateRange, deviceId, industry, projectName, province, city} = this.queryInfo;
      this.info = { beginDate: dateRange[0], endDate: dateRange[1], deviceId, industry, projectName, province, city};
      // this.setDisease100();
      // this.setDeparment();
      this.setTriggerData();
    },
    handleSearch() {
      const { dateRange, deviceId, industry, projectName, province, city} = this.queryInfo;
      this.info = { beginDate: dateRange[0], endDate: dateRange[1], industry, projectName, province, city, deviceId};
      this.setTriggerData()
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .scene_flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
