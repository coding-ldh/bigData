<template>
  <div class="content" v-if="!detailCtrl">
    <div class="content_title_itemList">项目列表</div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-autocomplete
          v-model="queryInfor.projectId"
          :fetch-suggestions="changeItemId"
          placeholder="请输入大于3位项目ID"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="项目ID">项目ID：</span>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="queryInfor.projectName"
          :fetch-suggestions="changeItemName"
          placeholder="输入项目名称"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="项目名称">项目名称：</span>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryInfor.projectScene"
          placeholder="请选择场景"
        >
          <el-option label="全部" value />
          <el-option
            v-for="item in Filter.projectSceneArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span class="position_params_params" title="场景">场景：</span>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryInfor.deviceNum" placeholder="请选择设备数">
          <el-option label="全部" value />
          <el-option
            v-for="item in Filter.deviceNumArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span class="position_params_params" title="设备数">设备数：</span>
      </el-form-item>
      <el-form-item>
        <el-select v-model="queryInfor.region" placeholder="请选择所属大区">
          <el-option label="全部" value />
          <el-option
            v-for="item in Filter.regionArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span class="position_params_params" title="所属大区">所属大区：</span>
      </el-form-item>
      <el-form-item>
        <my-area
          ref="areaRef"
          :Areafliter="Areafliter"
          @fromChildArea="getAreaData"
        />
        <span class="position_params_params" title="项目地址">项目地址：</span>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="queryInfor.companyOwned"
          :fetch-suggestions="changeOwned"
          placeholder="输入所属公司"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="所属公司">所属公司：</span>
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="queryInfor.projectCreator"
          :fetch-suggestions="changeCreator"
          placeholder="请输入项目创建人"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="项目创建人"
          >项目创建人：</span
        >
      </el-form-item>
      <el-form-item>
        <el-autocomplete
          v-model="queryInfor.customerName"
          :fetch-suggestions="changeCustomerName"
          placeholder="请输入客户名称"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="客户名称">客户名称：</span>
      </el-form-item>
      <time-select ref="timeRef" @childChangeDateRange="changeDateRange">
      </time-select>
      <!-- <div> -->
      <el-form-item>
        <el-button type="primary" @click="saveParam(), search(false)"
          >查询</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="userReset">重置</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="exportData()">导出</el-button>
      </el-form-item>
      <!-- </div> -->
    </el-form>
    <div class="content_list" v-loading="itemListLoading">
      <el-table :data="dataList" stripe style="width: 100%">
        <el-table-column
          type="selection"
          fixed="left"
          width="55"
        ></el-table-column>
        <el-table-column
          label="项目ID"
          prop="projectId"
          align="center"
          width="120"
        />
        <el-table-column label="项目名称" prop="projectName" align="center" />
        <el-table-column
          label="场景"
          prop="projectScene"
          align="center"
          width="90"
        />
        <el-table-column
          label="设备数"
          prop="devicesCount"
          align="center"
          width="100"
        />
        <el-table-column
          label="所属大区"
          prop="region"
          align="center"
          width="100"
        />
        <el-table-column label="项目地址" prop="projectAddr" align="center" />
        <el-table-column label="所属公司" prop="companyOwned" align="center" />
        <el-table-column
          label="项目创建人"
          prop="projectCreator"
          align="center"
        />
        <el-table-column label="客户名称" prop="customerName" align="center" />
        <el-table-column
          label="创建时间"
          prop="projectCreatetime"
          align="center"
          width="150"
        />
        <el-table-column label="操作" fixed="right" width="190" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="switchDetial(scope.row)"
              >查看设备</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="queryInfor.total"
        @pageChange="turnPage"
        @sizeChange="sizeChange"
        :currentPage="queryInfor.pageNo"
      ></pagination>
    </div>
  </div>
  <detail-page
    v-else-if="detailCtrl"
    @back="switchDetial"
    :detail="detail"
    :selectBeginTime="queryInfor.beginDate"
    :selectEndTime="queryInfor.endDate"
  ></detail-page>
</template>

<script>
import pagination from "@/components/Pagination";
import TimeSelect from "./components/timeSelect.vue";
import MyArea from "./components/AreaIndex.vue";
import DetailPage from "./detail.vue";
import { reset, userExport, cacheParamList } from "@/utils/tool.js";
import {
  getItemListFilterValue,
  getItemListPage,
  getItemListProjectIdArrSearch,
  getItemListProjectNameSearch,
  getItemListCompanyOwnedArrSearch,
  getItemListProjectCreatorArrSearch,
  getItemListCustomerNameArrSearch,
} from "@/api/itemData/index.js";
export default {
  components: {
    TimeSelect,
    DetailPage,
    MyArea,
    pagination,
  },
  data() {
    return {
      detailCtrl: false,
      itemListLoading: false,
      cacheQueryInfor: {},
      queryInfor: {
        projectId: "",
        projectName: "",
        projectScene: "",
        region: "",
        deviceNum: "",
        companyOwned: "",
        projectProvince: "",
        projectCity: "",
        projectCreator: "",
        customerName: "",
        beginDate: "",
        endDate: "",
        deviceNumBegin: "",
        deviceNumEnd: "",
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      Filter: {},
      Areafliter: [],
      dataList: [],
      detail: {},
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const data = await getItemListFilterValue();
      this.Filter = data.data;
      this.Areafliter = this.Filter.provinceArr;
      this.search(false);
    },
    async search(sign) {
      this.itemListLoading = true;
      this.getDeviceNum();
      let params = sign ? { ...this.cacheQueryInfor } : { ...this.queryInfor };
      params.pageNo = sign ? this.queryInfor.pageNo : 1;
      params.pageSize = sign ? this.queryInfor.pageSize : 10;
      const { data } = await getItemListPage(params);
      this.queryInfor.total = data.total;
      this.dataList = data.list;
      this.itemListLoading = false;
    },
    getDeviceNum() {
      let deviceNumBegin = "";
      let deviceNumEnd = "";
      if (this.queryInfor.deviceNum == "") {
        deviceNumBegin = "";
        deviceNumEnd = "";
      } else if (this.queryInfor.deviceNum == "0") {
        deviceNumBegin = 0;
        deviceNumEnd = 0;
      } else if (this.queryInfor.deviceNum == "200以上") {
        deviceNumBegin = this.queryInfor.deviceNum.slice(0, 3);
        deviceNumEnd = "";
      } else {
        let arr = this.queryInfor.deviceNum.split("-");
        deviceNumBegin = arr[0];
        deviceNumEnd = arr[1];
      }
      this.queryInfor.deviceNumBegin = deviceNumBegin;
      this.queryInfor.deviceNumEnd = deviceNumEnd;
    },
    getAreaData(val) {
      this.queryInfor.projectProvince = val[0] ? val[0] : "";
      this.queryInfor.projectCity = val[1] ? val[1] : "";
    },
    turnPage(val) {
      this.queryInfor.pageNo = val;
      this.search(true);
    },
    sizeChange(val) {
      this.queryInfor.pageSize = val;
      this.search(true);
    },
    userReset() {
      reset(this.queryInfor);
      reset(this.cacheQueryInfor);
      this.queryInfor.pageNo = 1;
      this.queryInfor.pageSize = 10;
      this.queryInfor.total = 0;
      this.cacheQueryInfor.pageNo = 1;
      this.cacheQueryInfor.pageSize = 10;
      this.cacheQueryInfor.total = 0;
      this.$refs.areaRef.reset();
      this.$refs.timeRef.reset();
      this.search(false);
    },
    changeDateRange(val) {
      this.queryInfor.beginDate = val[0];
      this.queryInfor.endDate = val[1];
    },
    async changeItemName(val, cb) {
      var restaurants = [];
      if (val) {
        let { data } = await getItemListProjectNameSearch({ projectName: val });
        restaurants = data.map((item) => {
          return { value: item.projectName };
        });
      }
      cb(restaurants);
    },
    async changeItemId(val, cb) {
      var restaurants = [];
      if (val.length > 3) {
        let { data } = await getItemListProjectIdArrSearch({ projectId: val });
        restaurants = data.map((item) => {
          return { value: item.projectId };
        });
      }
      cb(restaurants);
    },
    async changeOwned(val, cb) {
      var restaurants = [];
      if (val) {
        let { data } = await getItemListCompanyOwnedArrSearch({
          companyOwned: val,
        });
        restaurants = data.map((item) => {
          return { value: item.companyOwned };
        });
      }
      cb(restaurants);
    },
    async changeCreator(val, cb) {
      var restaurants = [];
      if (val) {
        let { data } = await getItemListProjectCreatorArrSearch({
          projectCreator: val,
        });
        restaurants = data.map((item) => {
          return { value: item.projectCreator };
        });
      }
      cb(restaurants);
    },
    async changeCustomerName(val, cb) {
      var restaurants = [];
      if (val) {
        let { data } = await getItemListCustomerNameArrSearch({
          customerName: val,
        });
        restaurants = data.map((item) => {
          return { value: item.customerName };
        });
      }
      cb(restaurants);
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      const {
        projectId,
        beginDate,
        endDate,
        companyOwned,
        customerName,
        deviceNumBegin,
        deviceNumEnd,
        pageNo,
        pageSize,
        projectCity,
        projectCreator,
        projectName,
        projectProvince,
        projectScene,
        region,
      } = this.cacheQueryInfor;
      const url =
        `/projectList/export?fileName=项目列表&` +
        `projectId=${projectId}&` +
        `beginDate=${beginDate}&` +
        `endDate=${endDate}&` +
        `companyOwned=${companyOwned}&` +
        `customerName=${customerName}&` +
        `deviceNumBegin=${deviceNumBegin}&` +
        `deviceNumEnd=${deviceNumEnd}&` +
        `pageNo=${pageNo}&` +
        `pageSize=${pageSize}&` +
        `projectCity=${projectCity}&` +
        `projectCreator=${projectCreator}&` +
        `projectName=${projectName}&` +
        `projectProvince=${projectProvince}&` +
        `projectScene=${projectScene}&` +
        `region=${region}`;
      userExport(url);
    },
    switchDetial(scope) {
      this.detail = scope;
      this.detailCtrl = !this.detailCtrl;
    },
    saveParam() {
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
  },
  mounted() {
    this.saveParam();
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  // flex: 1;
  display: flex;
  position: relative;
  flex-direction: column;
  // padding: 20px;
  .content_title_itemList {
    font-size: 20px;
    padding: 20px;
    background-color: white;
  }
  .demo-form-inline {
    background-color: white;
    font-size: 20px;
    padding: 0px 0px 0px 20px;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
  }
  .content_list {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: white;
    margin-top: 10px;
  }
}
</style>