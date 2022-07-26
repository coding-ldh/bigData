<template>
  <div class="container">
    <div class="search_container" style="margin-bottom: 10px">
      自定义事件
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-select
            placeholder="全部设备类型"
            v-model="queryInfor.deviceType"
            @change="getFilterData"
          >
            <el-option value="">全部设备类型</el-option>
            <el-option
              v-for="(item, index) in filterData.deviceTypeList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            placeholder="全部版本"
            v-model="queryInfor.version"
            @change="getFilterData"
          >
            <el-option value="">全部版本</el-option>
            <el-option
              v-for="(item, index) in filterData.versionList"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            placeholder="全部事件"
            v-model="queryInfor.eventName"
            @change="getFilterData"
            filterable
          >
            <el-option value="">全部事件</el-option>
            <el-option
              v-for="(item, index) in filterData.eventList"
              :label="item.eventtitle"
              :value="item.eventname"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            placeholder="全部场景"
            v-model="queryInfor.appScene"
            @change="getFilterData"
            filterable
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="(item, index) in filterData.sceneList"
              :value="item"
              :key="index"
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
      <div class="list_top">
        <span>事件列表</span>
        <el-button type="primary" @click="exportData()">导出</el-button>
      </div>
      <div class="list_content" v-loading="eventCustomLoading">
        <el-table stripe style="width: 100%" :data="eventList">
          <el-table-column label="设备类型" prop="deviceType"></el-table-column>
          <el-table-column label="字段名称" prop="eventName"></el-table-column>
          <el-table-column label="事件名称" prop="eventTitle"></el-table-column>
          <el-table-column
            label="昨日消息数"
            prop="yesterdayMessage"
          ></el-table-column>
          <el-table-column
            label="七日日均消息数"
            prop="avgDay7Message"
          ></el-table-column>
          <el-table-column
            label="30日日均消息数"
            prop="avgDay30Message"
          ></el-table-column>
          <el-table-column
            label="昨日上报设备数"
            prop="yesterdayMid"
          ></el-table-column>
          <el-table-column label="场景" prop="appScene"></el-table-column>
          <el-table-column label="版本号" prop="version"></el-table-column>
          <el-table-column
            label="操作"
            width="100"
            fixed="right"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="
                  goDetailPage(
                    scope.row.eventName,
                    scope.row.deviceType,
                    scope.row.appScene,
                    scope.row.version
                  )
                "
                >详情</el-button
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
import { reset, userExport } from "@/utils/tool.js";
import Pagination from "@/components/Pagination";
import { getAdvEventSelectList, getAdvEventPage } from "@/api/appData";

export default {
  components: {
    Pagination,
  },
  data() {
    return {
      eventCustomLoading: false,
      eventName: "",
      queryInfor: {
        deviceType: "",
        version: "",
        eventName: "",
        appScene: "",
      },
      copyQueryInfor: {},
      multipleSelection: [],
      filterData: {},
      eventList: [],
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      isDetail: true,
    };
  },
  created() {
    this.getFilterData();
    this.initData();
  },
  methods: {
    async getFilterData() {
      const { deviceType, eventName, version, appScene } = this.queryInfor;
      const { data } = await getAdvEventSelectList({
        deviceType,
        eventName,
        version,
        appScene,
      });
      this.filterData = data;
    },
    async setEventList(isPage = false) {
      this.eventCustomLoading = true;
      const inforData = !isPage ? this.getInforData() : this.copyQueryInfor;
      const { pageNo, pageSize } = this.pageInfor;
      const { appScene } = inforData;
      const { data } = await getAdvEventPage({
        pageNo,
        pageSize,
        ...inforData,
        appScene,
      });
      this.eventList = data.records.map((item) => {
        return item.version ? item : { ...item, version: "全部版本" };
      });
      this.pageInfor.total = data.total;
      this.eventCustomLoading = false;
    },
    getInforData() {
      this.copyQueryInfor = { ...this.queryInfor };
      this.pageInfor = {
        pageSize: 10,
        pageNo: 1,
      };
      return { ...this.queryInfor };
    },
    useReset() {
      reset(this.queryInfor);
      this.getFilterData();
      this.initData();
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      const { deviceType, version, eventName, appScene } = this.queryInfor;
      const url = `/advEvent/export?deviceType=${deviceType}&version=${version}&eventName=${eventName}&appScene=${appScene}&fileName=事件列表`;
      userExport(url);
    },
    goDetailPage(eventName, deviceType, appScene, version) {
      this.$router.push({
        name: "Event-detail",
        query: { eventName, deviceType, appScene, version },
      });
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setEventList(true);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setEventList(true);
    },
    initData() {
      this.setEventList();
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
</style>>
