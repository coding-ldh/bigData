<template>
  <div class="cw_container">
    <div class="search_container" style="margin-bottom: 10px">
      <el-form :inline="true">
        <!-- <el-form-item>
          <tool-tip :content="tip"></tool-tip>
        </el-form-item> -->
        <el-form-item label="设备编码:">
          <el-input
            v-model="queryInfor.mid"
            placeholder="请输入设备编码"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目ID:">
          <el-input
            v-model="queryInfor.project"
            placeholder="请输入项目ID"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择日期:">
          <el-date-picker
            v-model="queryInfor.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="体温区间:">
          <el-col :span="10"
            ><el-input
              v-model="queryInfor.minTemperature"
              placeholder="最小体温"
            ></el-input
          ></el-col>
          <el-col :span="2" style="text-align: center">~</el-col>
          <el-col :span="10"
            ><el-input
              v-model="queryInfor.maxTemperature"
              placeholder="最大体温"
            ></el-input
          ></el-col>
        </el-form-item>
        <el-form-item label="姓名:">
          <el-select v-model="queryInfor.showAvailableName" placeholder="全部">
            <el-option
              v-for="item in filterValue.name"
              :value="item.value"
              :label="item.label"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证:">
          <el-select v-model="queryInfor.showAvailableCard" placeholder="全部">
            <el-option
              v-for="item in filterValue.identifys"
              :value="item.value"
              :label="item.label"
              :key="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="体温情况:">
          <el-select
            v-model="queryInfor.temperatureStatus"
            collapse-tags
            placeholder="全部"
          >
            <el-option value="">全部</el-option>
            <el-option
              v-for="item in filterValue.tempStatus"
              :value="item"
              :label="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="设备类型:">
          <el-select
            v-model="queryInfor.deviceType"
            collapse-tags
            placeholder="全部"
          >
            <el-option
              v-for="item in filterValue.deviceType"
              :value="item"
              :label="item"
              :key="item"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="设备名称:">
          <el-input
            v-model="queryInfor.robotName"
            placeholder="请输入设备名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="账户:">
          <el-input
            v-model="queryInfor.account"
            placeholder="请输入账号"
          ></el-input>
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
        <span>通行记录列表</span>
        <exports-button
          :exportUrl="exportUrl"
          :isExport="isExport"
          @exports="exportData"
        ></exports-button>
      </div>
      <div class="list_content">
        <el-table
          stripe
          style="width: 100%"
          :data="temperatureDataList"
          v-loading="loading"
        >
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column label="设备ID" prop="mid"></el-table-column>
          <el-table-column label="项目ID" prop="project"></el-table-column>
          <el-table-column label="人脸照片" align="center">
            <template slot-scope="scope">
              <img :src="scope.row.faceUrl" alt="" style="width: 40px" />
            </template>
          </el-table-column>
          <el-table-column label="姓名" prop="name"></el-table-column>
          <el-table-column label="手机号" prop="phone"></el-table-column>
          <el-table-column label="身份证号" prop="idCard"></el-table-column>
          <el-table-column label="人员类型" prop="type"></el-table-column>
          <el-table-column
            label="过闸体温"
            prop="temperature"
          ></el-table-column>
          <el-table-column label="楼层" prop="floor"></el-table-column>
          <el-table-column
            label="健康码区域"
            prop="healthCode"
          ></el-table-column>
          <el-table-column
            label="健康码颜色"
            prop="healthColor"
          ></el-table-column>
          <el-table-column
            label="健康码类型"
            prop="healthType"
          ></el-table-column>
          <el-table-column
            label="核酸检测机构"
            prop="pcrPlace"
          ></el-table-column>
          <el-table-column label="检测结果" prop="pcrResult"></el-table-column>
          <el-table-column label="检测时间" prop="pcrTime"></el-table-column>
          <el-table-column label="大数据行程" prop="trip"></el-table-column>
          <el-table-column
            label="机器人型号"
            prop="deviceType"
          ></el-table-column>
          <el-table-column
            label="机器人名称"
            prop="robotName"
          ></el-table-column>
          <el-table-column label="机器人账户" prop="account"></el-table-column>
          <el-table-column label="测量时间" prop="createTime"></el-table-column>
          <el-table-column label="疫苗接种次数" prop="vaccinationsnumber">
            <template slot-scope="scope">
              <span>{{ temperatureVan[scope.row.vaccinationsnumber] }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="疫苗接种时间"
            prop="vaccinationtime"
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
import ToolTip from "@/components/ToolTip";
import { reset, userExport, getCurrentDate } from "@/utils/tool.js";
import pagination from "@/components/Pagination/index.vue";
import exportsButton from "@/components/exportByKey/exportsButton.vue";
import { getTemperatureDataList, getTemperatureSelectList } from "@/api/cw";
export default {
  components: {
    pagination,
    exportsButton,
    ToolTip,
  },
  data() {
    return {
      loading: false,
      queryInfor: {
        dateRange: "",
        beginDate: "",
        endDate: "",
        account: "",
        beginDate: "",
        endDate: "",
        deviceType: "",
        maxTemperature: "",
        mid: "",
        minTemperature: "",
        robotName: "",
        showAvailableCard: "",
        showAvailableName: "",
        temperatureStatus: "",
        project: "",
      },
      copyQueryInfor: {},
      pageInfor: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      filterValue: {
        name: [
          { label: "全部", value: "" },
          { label: "有效", value: true },
        ],
        identifys: [
          { label: "全部", value: "" },
          { label: "有效", value: true },
        ],
        tempStatus: ["正常", "异常"],
        deviceType: [],
      },
      temperatureDataList: [],
      temperatureVan: [
        "未接种",
        "已接种第一针",
        "已接种第二针",
        "已接种第三针",
      ],
      pickerOptions: {
        disabledDate: (time) => {
          const endTime = getCurrentDate(1);
          // const startTime = getCurrentDate(31 * 24);
          // 三年  365 * 3 *24 = 26280
          const startTime = getCurrentDate(3 * 12 * 31 * 24);
          return (
            time.getTime() < new Date(startTime).getTime() ||
            time.getTime() > new Date(endTime).getTime()
          );
        },
      },
      defaultValue: String,
      exportUrl: "",
      isExport: true,
      tip: "数据量较大，必输入项为:日期、项目ID。查询后点击导出可等待服务器打包",
    };
  },
  methods: {
    useReset() {
      reset(this.queryInfor);
      this.temperatureDataList = [];
      this.initData();
    },
    initdefaultValue() {
      const yestreDayTime = getCurrentDate(1);
      this.queryInfor.dateRange = [yestreDayTime, yestreDayTime];
    },
    exportData() {
      const {
        account,
        beginDate,
        endDate,
        deviceType,
        maxTemperature,
        mid,
        minTemperature,
        robotName,
        showAvailableCard,
        showAvailableName,
        temperatureStatus,
        project,
      } = this.copyQueryInfor;
      if (project && beginDate && endDate) {
        this.isExport = !this.isExport;
        this.exportUrl = `/temperatureRecord/export?deviceType=${deviceType}&account=${account}&beginDate=${beginDate}&endDate=${endDate}&maxTemperature=${maxTemperature}&mid=${mid}&project=${project}&minTemperature=${minTemperature}&robotName=${robotName}&showAvailableCard=${showAvailableCard}&showAvailableName=${showAvailableName}&temperatureStatus=${temperatureStatus}&fileName=通行记录列表`;
      } else {
        this.$mb.alert(
          `只能导出单个项目设备通行记录数据,
           项目ID与时间为必须输入才能导出`,
          "导出提示",
          {
            confirmButtonText: "确定",
          }
        );
      }
    },
    //条件筛选
    async getFilterValue() {
      const { data } = await getTemperatureSelectList();
      const { deviceType } = data;
      this.filterValue.deviceType = deviceType;
    },
    async setTemperatureDataList(isPage = false) {
      // 测试用数据 project = '5e0b17c8fd79d3137850ee3a' 2022-3-1 ~ 2022-3-1
      const inforData = !isPage ? this.getInforData() : this.copyQueryInfor;
      if (!inforData.project || !inforData.beginDate || !inforData.endDate) {
        this.$message.warning(
          `请输入项目ID与时间，如遇无数据情况：请尝试延长搜索日期区间`
        );
      } else {
        this.loading = true;
        const { pageNo, pageSize } = this.pageInfor;
        const { data } = await getTemperatureDataList({
          pageNo,
          pageSize,
          ...inforData,
        });
        this.loading = false;
        this.temperatureDataList = data.records.map((item) => {
          const types = {
            stranger: "陌生人",
            employee: "员工",
            visitor: "访问者",
            _eles: "未知",
          };
          return {
            ...item,
            name: item.name === "unknown" ? "未知" : item.name,
            type: types[item.type] ? types[item.type] : types["_eles"],
            temperature_status:
              item.temperature_status === "normal" ? "正常" : "异常",
          };
        });
        this.pageInfor.total = data.total;
      }
    },
    getInforData() {
      const {
        dateRange,
        account,
        deviceType,
        maxTemperature,
        mid,
        minTemperature,
        robotName,
        showAvailableCard,
        showAvailableName,
        temperatureStatus,
        project,
      } = this.queryInfor;
      const inforData = {
        beginDate: dateRange.length ? dateRange[0] : "",
        endDate: dateRange.length ? dateRange[1] : "",
        account,
        deviceType,
        minTemperature,
        maxTemperature,
        mid,
        robotName,
        showAvailableCard,
        showAvailableName,
        temperatureStatus,
        project,
      };
      this.copyQueryInfor = inforData;
      this.pageInfor = {
        pageSize: 10,
        pageNo: 1,
      };
      return inforData;
    },
    turnPage(val) {
      this.pageInfor.pageNo = val;
      this.setTemperatureDataList(true);
    },
    sizeChange(val) {
      this.pageInfor.pageSize = val;
      this.setTemperatureDataList(true);
    },
    initData() {
      this.setTemperatureDataList();
    },
  },
  created() {
    this.initdefaultValue();
    this.getFilterValue();
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.cw_container {
  width: 100%;
  .list_container {
    font-size: 20px;
    padding: 30px 30px 10px;
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
