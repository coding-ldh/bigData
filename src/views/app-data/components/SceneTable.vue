<template>
  <div class="sceneTable">
    <el-card>
      <template #header>
        <div class="scene_flex">
          <span>{{ tableName }}</span>
          <el-button type="primary" @click="exportExcel">导出数据</el-button>
        </div>
      </template>
      <el-table stripe style="width: 100%" :data="tableList.slice((currentPage-1)*pageSize, currentPage*pageSize)">
        <el-table-column
          label="排名"
          type="index"
          width="200"
        ></el-table-column>
        <el-table-column :label="tableTitle" prop="name"></el-table-column>
        <el-table-column label="次数" prop="num"></el-table-column>
      </el-table>
      <pagination
        :total="tableList.length"
        @pageChange="handlePageChange"
        @sizeChange="handleSizeChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 40]"
        layout="prev, pager, next"
      ></pagination>
    </el-card>
  </div>
</template>

<script>
import { getSceneStaticsData } from "@/api/ai";
import { userExport } from "@/utils/tool.js";
import Pagination from "@/components/Pagination";
export default {
  components: {
    Pagination
  },
  props: {
    tableId: {
      required: true,
      type: String
    },
    tableName: {
      required: true,
      type: String
    },
    tableTitle: {
      required: true,
      type: String
    },
    // deviceType: {
    //   default: "智能访客机器人",
    //   type: String
    // },
    tableInfo: Object
  },
  data() {
    return {
      tableList: [],
      info: "",
      currentPage: 1,
      pageSize: 10,
    };
  },
  // async created() {
  //   await this.initTableList();
  //   // console.log(this.tableList, this.tableInfo, 'created===========================');
  // },
  methods: {
    async initTableList() {
      const { data } = await getSceneStaticsData({
        ...this.info,
      });
      this.tableList = data;
    },
    handleParam(info) {
      const beginDate = info && info.beginDate;
      const endDate = info && info.endDate;
      const deviceId = info && info.deviceId;
      const industry = info && info.industry;
      const projectName = info && info.projectName;
      const province = info && info.province;
      const city = info && info.city;
      this.info = {
        moduleId: this.tableId,
        // deviceType: this.deviceType,
        beginDate,
        endDate,
        deviceId,
        industry,
        projectName,
        province,
        city
      };
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
    },
    exportExcel() {
      const {
        moduleId,
        beginDate,
        endDate,
        deviceId,
        industry,
        projectName,
        province,
        city,
        // deviceType
      } = this.info;
      const url = `/aiSoftWareScene/exportAiSoftWareSceneData?beginDate=${beginDate}&&endDate=${endDate}&&deviceId=${deviceId}&&industry=${industry}&&projectName=${projectName}&&province=${province}&&city=${city}&&moduleId=${moduleId}`;
      userExport(url, this.tableName);
    }
  },
  watch: {
    tableInfo: {
      handler: function(newVal) {
        this.handleParam(newVal);
        this.initTableList();
      },
      deep: true,
      immediate: true
    }
  }
};
</script>

<style>
.scene_flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
