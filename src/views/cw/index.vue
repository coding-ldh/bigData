<template>
  <div class="cw_container">
    <div class="search_containers">
      <el-form
        :inline="true"
        :model="queryInfor"
        class="demo-form-inline"
        style="margin-top: 20px"
      >
        <el-form-item>
          <el-select
            v-model="queryInfor.company"
            placeholder="请选择子公司"
            filterable
            remote
            reseve-keyword
            allow-create
            :remote-method="inputCompany"
            clearable
            @change="changeCompany()"
          >
            <!-- <el-option value="">全部</el-option> -->
            <el-option
              v-for="item in companyList"
              :label="item"
              :value="item"
              :key="item"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryInfor.project"
            placeholder="请选择项目"
            ref=""
            filterable
            remote
            reseve-keyword
            allow-create
            clearable
            :remote-method="inputItem"
          >
            <!-- <el-option value="">全部</el-option> -->
            <el-option
              v-for="item in projectList"
              :label="item"
              :value="item"
              :key="item"
              >{{ item }}</el-option
            >
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="请输入设备编号"
            v-model="queryInfor.mid"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" plain @click="search()">查询</el-button>
        </el-form-item>
      </el-form>
      <ul v-loading="loading.list" style="display: flex">
        <li>
          <div class="title">累计测温人次</div>
          <span class="num"
            >{{
              getFormatNumVal(oviewData.allPersonTimesOfTemperature)
            }}次</span
          >
        </li>
        <li>
          <div class="title">累计正常测温人次</div>
          <span class="num"
            >{{
              getFormatNumVal(oviewData.allNormalPersonTimesOfTemperature)
            }}次</span
          >
          <div class="explain">
            正常占比
            <span>{{ oviewData.allNormalPersonTimesOfTemperatureRate }}%</span>
          </div>
        </li>
        <li>
          <div class="title">累计异常测温人次</div>
          <span class="num"
            >{{
              getFormatNumVal(oviewData.allAbnormalPersonTimesOfTemperature)
            }}次</span
          >
          <div class="explain">
            异常占比
            <span
              >{{ oviewData.allAbnormalPersonTimesOfTemperatureRate }}%</span
            >
          </div>
        </li>
        <li>
          <div class="title">今日测温人次</div>
          <span class="num"
            >{{
              getFormatNumVal(oviewData.todayPersonTimesOfTemperature)
            }}次</span
          >
        </li>
        <li>
          <div class="title">今日正常测温人次</div>
          <span class="num"
            >{{
              getFormatNumVal(oviewData.todayNormalPersonTimesOfTemperature)
            }}次</span
          >
          <div class="explain">
            正常占比
            <span
              >{{ oviewData.todayNormalPersonTimesOfTemperatureRate }}%</span
            >
          </div>
        </li>
        <li>
          <div class="title">今日异常测温人次</div>
          <span class="num"
            >{{
              getFormatNumVal(oviewData.todayAbnormalPersonTimesOfTemperature)
            }}次</span
          >
          <div class="explain">
            异常占比
            <span
              >{{ oviewData.todayAbnormalPersonTimesOfTemperatureRate }}%</span
            >
          </div>
        </li>
      </ul>
    </div>
    <div class="daily_container" v-loading="loading.day">
      <line-chart
        id="chart1"
        title="每日统计"
        :legendData="dailyLegendData"
        :series="dailyChartYData"
        :trendXData="dailyTrendXData"
        :colorList="dailyColorList"
        :formatter="formatter"
        v-if="dailyChartYData.length != 0"
      >
        <el-date-picker
          v-model="queryInfor.dayDate"
          value-format="yyyy-MM-dd"
          type="date"
          @change="changeDayDate()"
          placeholder="选择日期"
        >
        </el-date-picker>
      </line-chart>
    </div>
    <div class="month_container" v-loading="loading.month">
      <line-chart
        id="chart2"
        title="每月统计"
        :legendData="monthLegendData"
        :series="monthChartYData"
        :trendXData="monthTrendXData"
        :colorList="dailyColorList"
        :formatter="formatter"
        v-if="monthChartYData.length != 0"
      >
        <el-date-picker
          v-model="queryInfor.monthDate"
          value-format="yyyy-MM"
          type="month"
          @change="changeMonthDate()"
          placeholder="选择日期"
        >
        </el-date-picker>
      </line-chart>
    </div>
    <div class="year_container" v-loading="loading.year">
      <line-chart
        id="chart3"
        title="每年统计"
        :legendData="yearLegendData"
        :series="yearChartYData"
        :trendXData="yearTrendXData"
        :colorList="dailyColorList"
        :formatter="formatter"
        v-if="yearChartYData.length != 0"
      >
        <el-date-picker
          v-model="queryInfor.yearDate"
          value-format="yyyy"
          type="year"
          @change="changeYearDate()"
          placeholder="选择日期"
        >
        </el-date-picker>
      </line-chart>
    </div>
  </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import {
  getCurrentDate,
  getLineChartSeriesObj,
  formatNum,
} from "@/utils/tool.js";
import {
  dataOfDailyTrend,
  dataOfMonthlyTrend,
  dataOfYearlyTrend,
  temperatureFilterValue,
  temperatureData,
  FuzzyQuery,
} from "@/api/cw";
export default {
  components: {
    LineChart,
  },
  data() {
    return {
      loading: {
        day: false,
        month: false,
        year: false,
        list: false,
      }, // 加载动画
      formatter: "{value}人次",
      dataOfDailyTrend: dataOfDailyTrend,
      dataOfMonthlyTrend: dataOfMonthlyTrend,
      dailyLegendData: [],
      dailyChartYData: [],
      dailyTrendXData: [],
      dailyColorList: ["#1477E3", "#89D36A", "#B31181"],
      /**月 */
      monthLegendData: [],
      monthChartYData: [],
      monthTrendXData: [],
      /****年 */
      yearLegendData: [],
      yearChartYData: [],
      yearTrendXData: [],
      companyList: [],
      projectList: [],
      queryInfor: {
        company: "",
        project: "",
        mid: "",
        dayDate: "",
        monthDate: "",
        yearDate: "",
      },
      oviewData: {},
    };
  },
  methods: {
    /**
     * 获取每日统计、每月统计、每年统计的数据
     * @param  methodName  方法名称
     * @param  trendXData  x轴的数组名
     * @param  trendYData  y轴的数组名
     * @param  legendData  lengend的数组名
     */
    getTrendData(methodName, trendXData, trendYData, legendData, date) {
      methodName({
        company: this.queryInfor.company,
        date,
        mid: this.queryInfor.mid,
        project: this.queryInfor.project,
      }).then(({ data }) => {
        // console.log(data);
        this[trendXData] = data.date;
        let obj1 = getLineChartSeriesObj("总数", data.total);
        let obj2 = getLineChartSeriesObj("体温正常", data.normal);
        let obj3 = getLineChartSeriesObj("体温异常", data.abnormal);
        this[trendYData] = [obj1, obj2, obj3];
        this[legendData] = ["总数", "体温正常", "体温异常"];
        this.loading.day = false;
        this.loading.month = false;
        this.loading.year = false;
      });
    },
    //条件筛选
    getFilterValue(dataType, name = "") {
      temperatureFilterValue({ dataType, name }).then(({ data }) => {
        if (name == "") {
          this.companyList = data.value;
        } else {
          this.projectList = data.value;
        }
      });
    },
    //改变公司
    changeCompany() {
      this.getFilterValue(1, this.queryInfor.company);
    },
    inputCompany(val) {
      FuzzyQuery({
        companyName: val,
        dataType: 0,
      }).then((_) => {
        this.companyList = _.data.value;
      });
      console.log(val);
    },
    inputItem(val) {
      FuzzyQuery({
        projectName: val,
        dataType: 1,
      }).then((_) => {
        this.projectList = _.data.value;
      });
      console.log(val);
    },
    getOviewData() {
      this.loading.list = true;
      temperatureData({
        company: this.queryInfor.company,
        mid: this.queryInfor.mid,
        project: this.queryInfor.project,
      }).then(({ data }) => {
        this.oviewData = data;
        this.loading.list = false;
      });
    },
    search() {
      this.loading.day = true;
      this.loading.month = true;
      this.loading.year = true;
      this.getTrendData(
        dataOfDailyTrend,
        "dailyTrendXData",
        "dailyChartYData",
        "dailyLegendData",
        this.queryInfor.dayDate
      );
      this.getTrendData(
        dataOfMonthlyTrend,
        "monthTrendXData",
        "monthChartYData",
        "monthLegendData",
        this.queryInfor.monthDate
      );
      this.getTrendData(
        dataOfYearlyTrend,
        "yearTrendXData",
        "yearChartYData",
        "yearLegendData",
        this.queryInfor.yearDate
      );
      this.getOviewData();
    },
    //改变日统计的时间
    changeDayDate() {
      this.loading.day = true;
      this.getTrendData(
        dataOfDailyTrend,
        "dailyTrendXData",
        "dailyChartYData",
        "dailyLegendData",
        this.queryInfor.dayDate
      );
    },
    //改变月统计时间
    changeMonthDate() {
      this.loading.month = true;
      this.getTrendData(
        dataOfMonthlyTrend,
        "monthTrendXData",
        "monthChartYData",
        "monthLegendData",
        this.queryInfor.monthDate
      );
    },
    //改变年统计时间
    changeYearDate() {
      this.loading.year = true;
      this.getTrendData(
        dataOfYearlyTrend,
        "yearTrendXData",
        "yearChartYData",
        "yearLegendData",
        this.queryInfor.yearDate
      );
    },
    getFormatNumVal(num) {
      return formatNum(num);
    },
  },
  created() {
    this.getFilterValue(0);
    this.queryInfor.dayDate = getCurrentDate(0);
    this.queryInfor.monthDate = getCurrentDate(1);
    this.queryInfor.yearDate = getCurrentDate(1);
    this.search();
  },
};
</script>

<style lang="scss" scoped>
.cw_container {
  // flex: 1;
  width: 100%;
  .search_containers {
    background: #fff;
    padding: 10px 20px 20px 20px;
    > ul {
      display: flex;
      justify-content: space-between;
      background-color: #fff;
      padding-right: 40px;
      li {
        .title {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          text-align: center;
        }
        .num {
          display: block;
          color: #3ba0ff;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
        }
        .explain {
          color: #333333;
          font-size: 14px;
          margin-top: 8px;
          text-align: center;
          > span {
            margin-left: 10px;
            color: #3ba0ff;
          }
        }
      }
    }
  }
  .daily_container,
  .month_container,
  .year_container {
    min-height: 200px;
    background-color: #fff;
    margin-top: 10px;
  }
}
</style>
