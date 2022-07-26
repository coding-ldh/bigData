<template>
  <div v-if="!showDetailPage" style="width: 100%">
    <div class="container main_content">
      <div
        style="background-color: #fff; padding-top: 20px; padding-left: 20px"
      >
        <el-form :inline="true" :model="queryInfor" class="demo-form-inline">
          <el-form-item label="设备编号">
            <el-input v-model="queryInfor.mid" placeholder="请输入设备编号" />
          </el-form-item>
          <el-form-item label="设备类型">
            <el-select v-model="queryInfor.deviceType" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.deviceTypeArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="硬件类型">
            <el-select v-model="queryInfor.hardwareType" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.fireWareArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="设备地址">
            <my-area ref="areaRef" @fromChildArea="getAreaData" />
          </el-form-item>
          <el-form-item label="行业">
            <el-select v-model="queryInfor.customerScene" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.customerSceneArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="场景">
            <el-select v-model="queryInfor.projectType" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.project_type"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="售价">
            <el-select v-model="queryInfor.price" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.priceArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否有订单">
            <el-select v-model="queryInfor.isOrder" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.isOrder"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="售卖类型">
            <el-select v-model="queryInfor.sellMode" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.sellModeArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日均流量">
            <el-select v-model="queryInfor.avgTraffic" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.avgTrafficArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="剩余广告位">
            <el-select v-model="queryInfor.usedPicture" placeholder="请选择">
              <el-option label="全部" value />
              <el-option
                v-for="item in filterData.usedPictureArr"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
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
            <exports-button
              :exportUrl="exportUrl"
              @exports="exportData"
              ref="export"
            ></exports-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <TableList
      v-loading="loading"
      :adPriceList="tableList"
      :pageInfor="pageInfor"
      :adPriceTotal="PageTotal"
      @ChangePageNo="ChangePageNo"
      @ChangePageSize="ChangePageSize"
      @GoDetail="goDetail"
    ></TableList>
  </div>
  <flow-detail
    v-else-if="showDetailName == 'flowDetail'"
    :mid="mid"
    @back="showDetailPage = !showDetailPage"
  />
  <detail-page
    v-else-if="showDetailName == 'detailPage'"
    :mid="mid"
    :current-item="currentItem"
    @back="showDetailPage = !showDetailPage"
  />
  <on-line-time
    v-else-if="showDetailName == 'onLineTime'"
    :mid="mid"
    :current-item="currentItem"
    @back="showDetailPage = !showDetailPage"
  />
</template>

<script>
import { reset, cacheParamList } from "@/utils/tool.js";
import MyArea from "@/components/Area";
import { advPriceFilterValue } from "@/api/userPortrait";
import exportsButton from "@/components/exportByKey/exportsButton.vue";

// import Search from "./components/search.vue";
import TableList from "./components/table.vue";
import FlowDetail from "@/views/user-portrait/priceManage/portrait.vue";
import DetailPage from "@/views/user-portrait/priceManage/detail.vue";
import onLineTime from "@/views/user-portrait/priceManage/onLineTime.vue";
import { getAdPriceList } from "@/api/userPortrait";

export default {
  components: {
    MyArea,
    exportsButton,
    // Search,
    TableList,
    FlowDetail,
    DetailPage,
    onLineTime,
  },
  data() {
    return {
      filterData: {},
      exportUrl: "",

      loading: false,
      queryInfor: {
        mid: "", //设备编号
        sellMode: "", // 售卖类型
        hardwareType: "", // 硬件类型
        area: [], // 设备地址
        customerScene: "", // 行业
        projectType: "", // 场景
        avgTraffic: "", // 日均流量
        deviceType: "", // 设备类型
        price: "", //售价
        usedPicture: "", // 剩余广告位
      },
      cacheQueryInfor: {},
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
      },
      tableList: [],
      PageTotal: 0,

      mid: "", // 点击跳转流量画像详情需要的设备编号
      showDetailPage: false,
      showDetailName: "",
      currentItem: {},
    };
  },
  created() {
    this.saveParamList();
    this.getFilterData();
  },
  methods: {
    saveParamList() {
      this.cacheQueryInfor = cacheParamList(this.queryInfor);
    },
    async getFilterData() {
      let { data } = await advPriceFilterValue();
      this.filterData = data;
      this.filterData.isOrder = ["是", "否"];
    },
    userReset() {
      reset(this.queryInfor);
      this.$refs.areaRef.reset();
      this.$emit("reset");
      this.search();
    },
    getAreaData(val) {
      this.queryInfor.area = val;
    },
    getParamVal() {
      let province = "";
      let city = "";
      let district = "";
      if (this.queryInfor.area.length > 0) {
        if (this.queryInfor.area[0] == "全国") {
          province = "";
          city = "";
          district = "";
        } else if (this.queryInfor.area[1] == "全部") {
          province = this.queryInfor.area[0];
          city = "";
          district = "";
        } else if (this.queryInfor.area[2] == "全部") {
          province = this.queryInfor.area[0];
          city = this.queryInfor.area[1];
          district = "";
        } else {
          province = this.queryInfor.area[0];
          city = this.queryInfor.area[1];
          district = this.queryInfor.area[2];
        }
      }
      let avgTrafficStart = "";
      let avgTrafficEnd = "";
      let priceStart = "";
      let priceEnd = "";
      if (this.queryInfor.avgTraffic != "") {
        const arr = this.queryInfor.avgTraffic.split("-");
        !arr[1]
          ? ([avgTrafficStart, avgTrafficEnd] = [arr[0].split("+")[0], ""])
          : ([avgTrafficStart, avgTrafficEnd] = arr);
      }
      if (this.queryInfor.price != "") {
        const arr = this.queryInfor.price.split("-");
        !arr[1]
          ? ([priceStart, priceEnd] = [arr[0].split("+")[0], ""])
          : ([priceStart, priceEnd] = arr);
      }
      return {
        province,
        city,
        district,
        avgTrafficStart,
        avgTrafficEnd,
        priceStart,
        priceEnd,
      };
    },
    exportData() {
      let {
        province,
        city,
        district,
        avgTrafficStart,
        avgTrafficEnd,
        priceStart,
        priceEnd,
      } = this.getParamVal();
      province = province == undefined ? "" : province;
      city = city == undefined ? "" : city;
      district = district == undefined ? "" : district;
      const url =
        `/advPrice/export?` +
        `fileName=广告屏画像列表&` +
        `avgTrafficEnd=${avgTrafficEnd}&` +
        `avgTrafficStart=${avgTrafficStart}&` +
        `isOrder=${this.cacheQueryInfor.isOrder}&` +
        `city=${city}&` +
        `customerScene=${this.cacheQueryInfor.customerScene}&` +
        `deviceType=${this.cacheQueryInfor.deviceType}&` +
        `district=${district}&` +
        `fireware=${this.cacheQueryInfor.hardwareType}&` +
        `mid=${this.cacheQueryInfor.mid}&` +
        `priceStart=${priceStart}&` +
        `priceEnd=${priceEnd}&` +
        `province=${province}&` +
        `sellMode=${this.cacheQueryInfor.sellMode}&` +
        `usedPicture=${this.cacheQueryInfor.usedPicture}&` +
        `projectType=${this.cacheQueryInfor.projectType}`;
      this.exportUrl = url;
      this.$nextTick((_) => {
        this.$refs.export.run();
      });
    },
    search() {
      this.saveParamList();
      this.getTableList(this.pageInfor.pageNo, this.pageInfor.pageSize, false);
    },
    async getTableList(pageNo, pageSize, sign) {
      this.loading = true;
      const {
        province,
        city,
        district,
        avgTrafficStart,
        avgTrafficEnd,
        priceStart,
        priceEnd,
      } = this.getParamVal();
      let { data } = await getAdPriceList({
        mid: sign ? this.cacheQueryInfor.mid : this.queryInfor.mid,
        isOrder: sign ? this.cacheQueryInfor.isOrder : this.queryInfor.isOrder,
        pageNo,
        pageSize,
        sellMode: sign
          ? this.cacheQueryInfor.sellMode
          : this.queryInfor.sellMode,
        customerScene: sign
          ? this.cacheQueryInfor.customerScene
          : this.queryInfor.customerScene,
        avgTrafficStart,
        avgTrafficEnd,
        deviceType: sign
          ? this.cacheQueryInfor.deviceType
          : this.queryInfor.deviceType,
        priceStart,
        priceEnd,
        province,
        city,
        district,
        usedPicture: sign
          ? this.cacheQueryInfor.usedPicture
          : this.queryInfor.usedPicture,
        projectType: sign
          ? this.cacheQueryInfor.projectType
          : this.queryInfor.projectType,
        fireware: sign
          ? this.cacheQueryInfor.hardwareType
          : this.queryInfor.hardwareType,
      });
      this.tableList = data.records;
      this.PageTotal = data.total;
      this.loading = false;
    },
    getParamVal() {
      let province = "";
      let city = "";
      let district = "";
      if (this.queryInfor.area.length > 0) {
        if (this.queryInfor.area[0] == "全国") {
          province = "";
          city = "";
          district = "";
        } else if (this.queryInfor.area[1] == "全部") {
          province = this.queryInfor.area[0];
          city = "";
          district = "";
        } else if (this.queryInfor.area[2] == "全部") {
          province = this.queryInfor.area[0];
          city = this.queryInfor.area[1];
          district = "";
        } else {
          province = this.queryInfor.area[0];
          city = this.queryInfor.area[1];
          district = this.queryInfor.area[2];
        }
      }
      let avgTrafficStart = "";
      let avgTrafficEnd = "";
      let priceStart = "";
      let priceEnd = "";
      if (this.queryInfor.avgTraffic != "") {
        const arr = this.queryInfor.avgTraffic.split("-");
        !arr[1]
          ? ([avgTrafficStart, avgTrafficEnd] = [arr[0].split("+")[0], ""])
          : ([avgTrafficStart, avgTrafficEnd] = arr);
      }
      if (this.queryInfor.price != "") {
        const arr = this.queryInfor.price.split("-");
        !arr[1]
          ? ([priceStart, priceEnd] = [arr[0].split("+")[0], ""])
          : ([priceStart, priceEnd] = arr);
      }
      return {
        province,
        city,
        district,
        avgTrafficStart,
        avgTrafficEnd,
        priceStart,
        priceEnd,
      };
    },
    // resetPage() {
    //   this.pageInfor = {
    //     pageNo: 1,
    //     pageSize: 10,
    //   };
    // },
    ChangePageNo(pageNo) {
      // console.log(pageNo);
      this.pageInfor.pageNo = pageNo;
      this.getTableList(this.pageInfor.pageNo, this.pageInfor.pageSize, true);
    },
    ChangePageSize(pageSize) {
      this.pageInfor.pageSize = pageSize;
      this.getTableList(this.pageInfor.pageNo, this.pageInfor.pageSize, true);
    },
    goDetail(data) {
      this.showDetailName = data.showDetailName;
      this.mid = data.mid;
      this.currentItem = data.currentItem;
      this.showDetailPage = data.showDetailPage;
    },
  },
  mounted() {
    this.search();
  },
};
</script>

<style lang="scss" scoped>
// .container {
//   width: 100%;
//   flex: 1;
//   display: flex;
//   flex-direction: column;
//   .content {
//     flex: 1;
//     display: flex;
//     flex-direction: column;
//   }
//   .el-button--small {
//     margin: 0 10px;
//   }
// }
.main_content {
  background-color: #fff;
}
</style>
