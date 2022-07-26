<template>
  <div class="container">
    <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
      <div class="container_title">设备数据-设备标签列表</div>
      <el-form-item label="">
        <el-input v-model="queryInfor.id" placeholder="请输入设备id"></el-input>
        <span class="position_params_params" title="设备id">设备id：</span>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="queryInfor.devicetype" placeholder="请选择">
          <el-option
            v-for="item in equiType"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <span class="position_params_params" title="设备类型">设备类型：</span>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="queryInfor.active" placeholder="请选择">
          <el-option
            v-for="item in activation"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
        <span class="position_params_params" title="是否激活">是否激活：</span>
      </el-form-item>
      <el-form-item label="">
        <device-area
          ref="multiArea"
          :resets="resets"
          @resetArea="resetArea"
        ></device-area>
      </el-form-item>
      <el-form-item label="">
        <el-select v-model="queryInfor.saleType" placeholder="请选择">
          <el-option
            v-for="item in saleType"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <span class="position_params_params" title="售卖类型">售卖类型：</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveParamList(), search()"
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
    <div class="content">
      <el-table
        :data="dataList"
        stripe
        style="width: 100%"
        v-loading="listLoading"
      >
        <el-table-column type="selection" fixed="left" width="55">
        </el-table-column>
        <el-table-column
          label="设备id"
          prop="planId"
          width="130"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="设备类型"
          align="center"
          header-align="center"
          width="120"
          prop="planType"
        ></el-table-column>
        <el-table-column
          label="售卖类型"
          header-align="center"
          width="80"
          align="center"
          prop="saleType"
        ></el-table-column>
        <el-table-column
          label="是否激活"
          header-align="center"
          width="120"
          align="center"
          prop="active"
        ></el-table-column>
        <!-- <el-table-column
          label="激活时间"
          prop="avtiveTime"
          width="120"
        ></el-table-column> -->
        <!-- <el-table-column
          label="录入时间"
          prop="entryTime"
          width="120"
        ></el-table-column> -->
        <el-table-column
          label="试用/租赁开始时间"
          align="center"
          prop="TrialLeaseStartTime"
          header-align="center"
          width="140"
        ></el-table-column>
        <el-table-column
          label="试用/租赁结束时间"
          align="center"
          width="140"
          prop="TrialLeaseEndTime"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="地区"
          align="center"
          prop="area"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="客户名称"
          align="center"
          prop="customerName"
        ></el-table-column>
        <el-table-column
          label="业务员名称"
          prop="salerName"
          width="100"
          header-align="center"
          align="center"
        ></el-table-column>
        <el-table-column
          label="所属公司"
          align="center"
          prop="belongCompany"
          header-align="center"
        ></el-table-column>
        <el-table-column
          label="地址来源"
          fixed="right"
          width="110"
          prop="addrSource"
          header-align="center"
          align="center"
        ></el-table-column>
      </el-table>
      <pagination
        :current-page="pageInfor.pageNo"
        layout="total, sizes, prev, pager, next, jumper"
        :total="adverTotal"
        :pager-count="9"
        @sizeChange="sizeChange"
        @pageChange="pageChange"
      >
      </pagination>
    </div>
  </div>
</template>

<script>
import pagination from "@/components/Pagination/index.vue";
// import { mapActions, mapState } from "vuex";
import { getCurrentDate, userExport, cacheParamList } from "@/utils/tool.js";
import { reset } from "@/utils/tool.js";
import DeviceArea from "./components/DeviceArea.vue";
import MultiArea from "@/components/MultiArea";
import {
  getDeviceDataParam,
  getDeviceDataList,
} from "@/api/equipment/index.js";
export default {
  components: {
    pagination,
    MultiArea,
    DeviceArea,
  },
  data() {
    return {
      resets: false,
      listLoading: false,
      currentPage: 1,
      planId: "",
      isDetail: false,
      queryInfor: {
        id: "",
        devicetype: [],
        active: [],
        saleType: [],
        province: "",
        city: [],
        district: "",
      },
      cacheQueryInfor: {}, // 缓存参数，使用缓存数据在点击标签时获取数据
      equiType: ["全部"],
      activation: ["全部", "activate", "expired", "noInUse"],
      saleType: ["试用", "销售", "租用", "捐赠"],
      pageInfor: {
        // 页码与分页方式
        pageNo: 1,
        pageSize: 10,
      },
      adverTotal: 0,
      dataList: [
        // {
        //   planId: "1",
        //   planType: "plan类型",
        //   saleType: "售卖类型",
        //   active: "已激活",
        //   avtiveTime: "2021-08-08",
        //   entryTime: "2021-08-07",
        //   TrialLeaseStartTime: "2021-08-08",
        //   TrialLeaseEndTime: "2021-09-09",
        //   area: "北京",
        //   customerName: "中科大",
        //   salerName: "张三",
        //   belongCompany: "科卫",
        //   addrSource: "orgName"
        // }
      ],
    };
  },
  computed: {
    // ...mapState("userPortrait/index", ["adverPlanList", "adverTotal"]),
  },
  methods: {
    initData() {
      this.initParamList();
    },
    initParamList() {
      getDeviceDataParam().then((data) => {
        // console.log(data.data);
        this.equiType = data.data.deviceTypeList;
        // this.activation = data.data.statusList;
        this.activation = [
          { name: "全部", value: "" },
          { name: "激活", value: data.data.statusList[0] },
          { name: "期满", value: data.data.statusList[1] },
          { name: "终止", value: data.data.statusList[2] },
        ];
        this.saleType = data.data.sellModeList;
        this.equiType.unshift("全部");
        // this.activation.unshift("全部");
        this.saleType.unshift("全部");
        this.search();
      });
    },
    getAreaParam() {
      if (this.$refs.multiArea != undefined) {
        // console.log(this.$refs.multiArea.queryInfor);
        this.queryInfor.province = this.$refs.multiArea.queryInfor.province;
        this.queryInfor.city = this.$refs.multiArea.queryInfor.city;
        this.queryInfor.district = this.$refs.multiArea.queryInfor.district;
        this.saveParamList();
      }
      // console.log(province, city, district);
    },
    search(pageNo = 1, pageSize = this.pageInfor.pageSize, fromPage) {
      this.listLoading = true;
      fromPage ? "" : this.$set(this.pageInfor, "pageNo", 1);
      fromPage ? "" : (pageSize = 10);
      this.getAreaParam();
      let { id, devicetype, active, saleType, province, city, district } =
        fromPage ? this.cacheQueryInfor : this.queryInfor;
      if (city.length <= 1) {
        city = city[0];
      } else {
        city = city.join(",");
      }
      getDeviceDataList({
        mid: id,
        pageNo,
        pageSize,
        province: province,
        district: district,
        city: city,
        deviceType: devicetype == "全部" ? "" : devicetype,
        status: active == "全部" ? "" : active,
        sellMode: saleType == "全部" ? "" : saleType,
      }).then((data) => {
        this.adverTotal = data.data.total;
        this.dataList = data.data.records.map((data) => {
          return {
            planId: data.mid, // 设备id
            planType: data.deviceType, // 设备类型
            saleType: data.sellMode, // 售卖类型
            active:
              data.status == "activate"
                ? "激活"
                : data.status == "expired"
                ? "期满"
                : data.status == "noInUse"
                ? "终止"
                : "", // 是否激活
            avtiveTime: data.trialBillStart, // 激活时间
            entryTime: data.trialBillEnd, // 录入时间
            TrialLeaseStartTime: data.trialStart, //试用/租赁开始时间
            TrialLeaseEndTime: data.trialEnd, // 试用/租赁结束时间
            area: data.address, // 地区
            customerName: data.cusName, // 客户名称
            salerName: data.salesPerson, // 业务员名称
            belongCompany: data.orgName, // 所属公司
            addrSource: data.addrSource, // 所属设备
          };
        });
        this.listLoading = false;
      });
    },
    saveParamList() {
      // 点击查询时 保存当前顶部参数
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
    userReset() {
      // 重置参数为空
      this.resets = !this.resets;
      reset(this.queryInfor);
    },
    resetArea() {
      this.search();
    },
    sizeChange(val) {
      // 更改分页方式
      this.pageInfor.pageSize = val;
      this.pageInfor.pageNo = 1;
      this.search(this.pageInfor.pageNo, this.pageInfor.pageSize, true);
    },
    pageChange(val) {
      // 更改页码
      this.pageInfor.pageNo = val;
      this.search(this.pageInfor.pageNo, this.pageInfor.pageSize, true);
    },
    exportData() {
      // // 导出功能
      this.$message.success(`导出中，请稍等`);
      let url =
        `/deviceList/export?` +
        `&fileName=设备数据-设备标签列表` +
        `&city=${this.cacheQueryInfor.city}` +
        `&deviceType=${this.cacheQueryInfor.devicetype}` +
        `&district=${this.cacheQueryInfor.district}` +
        `&mid=${this.cacheQueryInfor.id}` +
        // `&pageNo=${this.pageInfor.pageNo}` +
        // `&pageSize=${this.pageInfor.pageSize}` +
        `&province=${this.cacheQueryInfor.province}` +
        `&sellMode=${this.cacheQueryInfor.saleType}` +
        `&status=${this.cacheQueryInfor.active}`;
      userExport(url);
    },
  },
  mounted() {
    this.saveParamList();
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  .container_title {
    margin: 0px 20px 20px 0px;
    font-size: 20px;
    color: #333;
  }
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  .el-form {
    background-color: #fff;
    padding: 20px;
    padding-bottom: 0;
    margin-bottom: 10px;
  }
  .el-date-editor {
    width: 195px;
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    padding-bottom: 20px;
  }

  .el-pagination {
    padding: 20px;
    text-align: center;
  }
}
</style>
