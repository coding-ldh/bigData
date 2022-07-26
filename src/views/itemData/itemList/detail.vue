<template>
  <div class="content">
    <div class="base_info_title">
      <user-back title="查看设备" @userBack="back()"></user-back>
    </div>
    <div class="base_info">
      <ul>
        <li>项目名称：{{ detail.projectName }}</li>
        <li>场景：{{ detail.projectScene }}</li>
        <li>设备数：{{ detail.devicesCount }}</li>
        <li>项目地址：{{ detail.projectAddr }}</li>
        <li>客户名称：{{ detail.customerName }}</li>
      </ul>
    </div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="">
        <el-autocomplete
          v-model="queryInfor.companyOwned"
          :fetch-suggestions="changeCompanyOwned"
          placeholder="请输入所属公司"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="所属公司">所属公司：</span>
      </el-form-item>
      <el-form-item label="">
        <my-area
          ref="areaRef"
          :Areafliter="Areafliter"
          @fromChildArea="getAreaData"
        />
        <span class="position_params_params" title="设备地址">设备地址：</span>
      </el-form-item>
      <el-form-item label="">
        <el-autocomplete
          v-model="queryInfor.salesPerson"
          :fetch-suggestions="changeSalesPerson"
          placeholder="请输入销售人"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="销售">销售：</span>
      </el-form-item>
      <el-form-item label="">
        <el-autocomplete
          v-model="queryInfor.deployer"
          :fetch-suggestions="changeDeployer"
          placeholder="请输入部署人"
          clearable
        >
          <template slot-scope="{ item }">
            <div class="name">{{ item.value }}</div>
          </template>
        </el-autocomplete>
        <span class="position_params_params" title="部署人">部署人：</span>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="queryInfor.status" placeholder="请选择设备状态">
          <el-option label="全部" value />
          <el-option
            v-for="item in statusArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <span class="position_params_params" title="设备状态">设备状态：</span>
      </el-form-item>
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
    </el-form>
    <div class="content_list" v-loading="detailLoading">
      <el-table :data="detailList" stripe style="width: 100%">
        <el-table-column
          type="selection"
          fixed="left"
          width="55"
        ></el-table-column>
        <el-table-column label="设备id" prop="mid" align="center" />
        <el-table-column label="设备类型" prop="deviceType" align="center" />
        <el-table-column label="设备地址" prop="deviceAddr" align="center" />
        <el-table-column label="销售" prop="salesPerson" align="center" />
        <el-table-column label="所属公司" prop="companyOwned" align="center" />
        <el-table-column label="部署人" prop="deployer" align="center" />
        <el-table-column label="设备状态" prop="status" align="center" />
        <el-table-column label="激活时间" prop="activateTime" align="center" />
        <el-table-column label="注销时间" prop="cancelTime" align="center" />
      </el-table>
      <pagination
        :total="queryInfor.total"
        @pageChange="turnPage"
        @sizeChange="sizeChange"
        :currentPage="queryInfor.pageNo"
      ></pagination>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination";
import UserBack from "@/components/UserBack";
import MyArea from "./components/AreaDetail.vue";
import { reset, userExport, cacheParamList } from "@/utils/tool.js";
import {
  getItemListDetailFilterValue,
  getItemListDetailPage,
  getItemListDetailCompanyOwnedArrSearch,
  getItemListDetailSalesPersonArrSearch,
  getItemListDetailDeployerArrSearch,
} from "@/api/itemData/index.js";
export default {
  props: {
    detail: {
      type: Object,
      default: {},
    },
    selectBeginTime: {
      type: String,
      default: "",
    },
    selectEndTime: {
      type: String,
      default: "",
    },
  },
  components: {
    UserBack,
    MyArea,
    pagination,
  },
  data() {
    return {
      loading: {
        customerNameSearchLoading: false,
        salesPersonSearchLoading: false,
        deployerSearchLoading: false,
      },
      vagueSearch: {
        CompanyOwned: [],
        SalesPerson: [],
        Deployer: [],
      },
      detailLoading: false,
      projectId: "",
      cacheQueryInfor: {},
      queryInfor: {
        projectId: "",
        companyOwned: "",
        deployer: "",
        projectCity: "",
        projectProvince: "",
        salesPerson: "",
        status: "",
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      Areafliter: [],
      statusArr: [],
      detailList: [],
    };
  },
  created() {
    this.init();
  },
  watch: {
    detail: {
      immediate: true,
      handler: function (val) {
        this.projectId = val.projectId;
      },
    },
  },
  methods: {
    async init() {
      const params = { ...this.queryInfor };
      let { data } = await getItemListDetailFilterValue(params);
      this.Areafliter = data.provinceArr;
      this.statusArr = data.statusArr;
      this.search();
    },
    async search(sign) {
      this.detailLoading = true;
      this.queryInfor.projectId = this.projectId;
      this.cacheQueryInfor.projectId = this.projectId;
      this.cacheQueryInfor = sign
        ? this.cacheQueryInfor
        : cacheParamList(this.queryInfor);
      let params = sign ? { ...this.cacheQueryInfor } : { ...this.queryInfor };
      params.pageNo = sign ? this.queryInfor.pageNo : 1;
      params.pageSize = sign ? this.queryInfor.pageSize : 10;
      params.beginDate = this.selectBeginTime;
      params.endDate = this.selectEndTime;
      let { data } = await getItemListDetailPage(params);
      this.detailList = data.records;
      this.queryInfor.total = data.total;
      this.detailLoading = false;
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
    back() {
      this.$emit("back");
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
      this.search(false);
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      const {
        projectId,
        companyOwned,
        deployer,
        pageNo,
        pageSize,
        projectCity,
        projectProvince,
        salesPerson,
        status,
      } = this.cacheQueryInfor;
      // console.log(projectId);
      const url =
        `/checkDevice/export?fileName=查看设备&` +
        `projectId=${projectId}&` +
        `companyOwned=${companyOwned}&` +
        `deployer=${deployer}&` +
        `pageNo=${pageNo}&` +
        `pageSize=${pageSize}&` +
        `projectCity=${projectCity}&` +
        `projectProvince=${projectProvince}&` +
        `salesPerson=${salesPerson}&` +
        `status=${status}&`;
      userExport(url);
    },
    saveParam() {
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
    async changeCompanyOwned(val, cb) {
      var restaurants = [];
      if (val) {
        const { data } = await getItemListDetailCompanyOwnedArrSearch({
          companyOwned: val,
        });
        restaurants = data.map((item) => {
          return { value: item.companyOwned };
        });
      }
      cb(restaurants);
    },
    async changeSalesPerson(val, cb) {
      var restaurants = [];
      if (val) {
        const { data } = await getItemListDetailSalesPersonArrSearch({
          salesPerson: val,
        });
        restaurants = data.map((item) => {
          return { value: item.salesPerson };
        });
      }
      cb(restaurants);
    },
    async changeDeployer(val, cb) {
      var restaurants = [];
      if (val) {
        const { data } = await getItemListDetailDeployerArrSearch({
          deployer: val,
        });
        restaurants = data.map((item) => {
          return { value: item.deployer };
        });
      }
      cb(restaurants);
    },
  },
  mounted() {
    this.saveParam();
  },
};
</script>

<style lang="scss" scoped>
.content {
  .base_info_title {
    padding: 20px 20px 0 20px;
    background-color: #fff;
  }
  .base_info {
    padding: 0px 20px 20px 20px;
    background-color: #fff;
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      padding: 0px 0px 20px 0px;
      text-align: left;
      font-weight: normal;
    }
    ul li {
      font-size: 14px;
      height: 2rem;
      line-height: 2rem;
      width: 33%;
      // margin-bottom: 15px;
    }
  }
  .demo-form-inline {
    margin-top: 10px;
    padding: 30px 20px 5px 20px;
    background-color: white;
  }
  .content_list {
    background-color: #fff;
    margin-top: 10px;
  }
}
</style>