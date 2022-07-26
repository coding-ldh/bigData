<template>
  <div class="container">
    <div class="basic_infor_container">
      <user-back @userBack="useBack()"></user-back>
      <ul v-if="portraitBasicInfor != null">
        <li>设备编号：{{ portraitBasicInfor.mid }}</li>
        <li>最近30日日均流量：{{ portraitBasicInfor.avgTraffic }}</li>
        <li>设备类型：{{ portraitBasicInfor.deviceType }}</li>
        <li>
          18-34岁占比：{{
            portraitBasicInfor.avgAge1834Proportion
          }}%
        </li>
        <li>
          男女比例：{{ portraitBasicInfor.avgMaleProportion }}% / {{
            portraitBasicInfor.avgFemaleProportion
          }}%
        </li>
        <li>行业：{{ portraitBasicInfor.projectScene }}</li>
        <li>项目地址：{{ portraitBasicInfor.projectAddr }}</li>
      </ul>
    </div>
    <div class="trend_container">
      <div class="query_container">
        基础信息
        <time-select
          style="margin-top: 20px"
          @childChangePeriod="changePeriod"
          @childChangeDateRange="changeDateRange"
        ></time-select>
      </div>
      <line-chart
        id="chart11"
        title="趋势图"
        :series="trendYData"
        :trendXData="trendXData"
        :colorList="trendColorList"
        v-if="trendYData.length != 0"
        formatter="{value}人次"
      >
      </line-chart>
    </div>
    <ul class="chart_container">
      <li class="first">
        <bar-chart
          title="访客属性-年龄分布"
          id="chart9"
          yUnit="%"
          :xData="barXData"
          v-if="series.length != 0"
          :series="series"
        ></bar-chart>
      </li>
      <li>
        <circle-chart
          id="chart10"
          title="性别占比"
          Unit="人次"
          :chartData="circleData"
          v-if="circleData.length != 0"
          account="广告屏月均人流量"
          :colors="sexChartColors"
        ></circle-chart>
      </li>
    </ul>
    <div class="table_container">
      <div class="title_operate_container">
        流量画像明细
        <el-button plain @click="exportData">导出数据</el-button>
      </div>
      <div class="table_content">
        <el-table :data="rateList" stripe style="width: 100%">
          <el-table-column
            label="日期"
            align="center"
            prop="day"
            width="120"
          ></el-table-column>
          <el-table-column label="日流量" prop="dailyTraffic"></el-table-column>
          <el-table-column
            label="男性占比"
            prop="maleProportion"
          ></el-table-column>
          <el-table-column
            label="女性占比"
            prop="femaleProportion"
          ></el-table-column>
          <el-table-column
            label="0-17岁占比(%)"
            prop="age18Proportion"
            width="120"
          ></el-table-column>
          <el-table-column
            label="18-24岁占比(%)"
            align="center"
            prop="age1824Proportion"
            width="130"
          >
          </el-table-column>
          <el-table-column
            label="25-34岁占比(%)"
            align="center"
            prop="age2534Proportion"
            width="130"
          ></el-table-column>
          <el-table-column
            label="35-44岁占比(%)"
            align="center"
            prop="age3544Proportion"
            width="130"
          ></el-table-column>
          <el-table-column
            label="45-54岁占比(%)"
            align="center"
            prop="age4554Proportion"
            width="130"
          ></el-table-column>
          <el-table-column
            label="55岁以上占比(%)"
            align="center"
            prop="age55Proportion"
            width="130"
          ></el-table-column>
          <!-- <el-table-column
            label="广告位利用率"
            align="center"
            prop="adsutilRate"
            width="130"
            fixed="right"
          ></el-table-column> -->
        </el-table>
        <pagination
          :total="priceDetailTotal"
          :page-size="pageSize"
          @pageChange="pageChange"
          @sizeChange="sizeChange"
        ></pagination>
      </div>
    </div>
  </div>
</template>

<script>
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import CircleChart from "@/components/Charts/CircleChart";
import { userExport } from "@/utils/tool.js";
import TimeSelect from "@/components/TimeSelect";
import pagination from "@/components/Pagination/index.vue";
import { getLineChartSeriesObj } from "@/utils/tool.js";
import UserBack from "@/components/UserBack";
import {
  getPriceDetailList,
  getBasicData,
} from "@/api/userPortrait";
export default {
  components: {
    LineChart,
    BarChart,
    CircleChart,
    pagination,
    TimeSelect,
    UserBack,
  },
  props: {
    mid: String,
  },
  data() {
    return {
      portraitBasicInfor: {},
      trendYData: [],
      trendXData: [],
      trendColorList: ["#3BA0FF"],
      barXData: [
        "18岁以下",
        "18-24岁",
        "25-34岁",
        "35-44岁",
        "45-54岁",
        "55岁以上",
      ],
      series: [],
      circleData: [],
      sexChartColors: ["#F2637B", "#3BA0FF"],
      pageNo: 1,
      pageSize: 10,
      // pageInfor: {
      //   pageNo: 1,
      //   pageSize: 10,
      // },
      queryInfor: {
        period: 30,
        dateRange: [],
      },
      priceDetailTotal: 0,
      priceDetailList: [],
      rateList: [],
      resRateList: [],
      sumAllData: 0,
      sumMale: 0,
      sumFemale: 0,
    };
  },
  methods: {
    useBack() {
      this.$emit("back")
    },
    percentageTrans(data) {
      return data ? Math.round(data * 100) : 0;
    },
    initData() {
      this.sumAllData = 0;
      this.sumMale = 0;
      this.sumFemale = 0;
      this.priceDetailList.forEach((item) => {
        this.sumAllData += item.sumAll;
        this.sumMale += item.sumMale;
        this.sumFemale += item.sumFemale;
      });
    },
    getTrendChartData() {
      const targetList = this.priceDetailList.reverse();
      this.trendXData = targetList.map((item) => {
        return item.dt.split("T")[0];
      });
      this.trendYData = [];
      const trendYDataVal = targetList.map((item) => {
        return item.trafficDtCounts;
      });
      const obj = getLineChartSeriesObj("流量", trendYDataVal);
      this.trendYData.push(obj);
    },
    getAgeData() {
      const targetList = this.priceDetailList.reverse();
      // targetList.forEach(item => sumAllData += item.sumAll);
      const that = this;
      const periodMaleData = targetList
        .reduce((pre, cur) => {
          return pre.length > 0
            ? [
                pre[0] + cur.ageTo18Male,
                pre[1] + cur.ageTo25Male,
                pre[2] + cur.ageTo35Male,
                pre[3] + cur.ageTo45Male,
                pre[4] + cur.ageTo55Male,
                pre[5] + cur.ageTo100Male,
              ]
            : [
                cur.ageTo18Male,
                cur.ageTo25Male,
                cur.ageTo35Male,
                cur.ageTo45Male,
                cur.ageTo55Male,
                cur.ageTo100Male,
              ];
        }, [])
        .map((item) => that.percentageTrans(item / that.sumAllData));
      const periodFemaleData = targetList
        .reduce((pre, cur) => {
          return pre.length > 0
            ? [
                pre[0] + cur.ageTo18Female,
                pre[1] + cur.ageTo25Female,
                pre[2] + cur.ageTo35Female,
                pre[3] + cur.ageTo45Female,
                pre[4] + cur.ageTo55Female,
                pre[5] + cur.ageTo100Female,
              ]
            : [
                cur.ageTo18Female,
                cur.ageTo25Female,
                cur.ageTo35Female,
                cur.ageTo45Female,
                cur.ageTo55Female,
                cur.ageTo100Female,
              ];
        }, [])
        .map((item) => that.percentageTrans(item / that.sumAllData));
      const maleObj = {
        name: "男",
        type: "bar",
        barGap: 0,
        barWidth: 35, //柱图宽度
        emphasis: {
          focus: "series",
        },
        data: periodMaleData,
      };
      const femaleObj = {
        name: "女",
        type: "bar",
        barGap: 0,
        barWidth: 35, //柱图宽度
        emphasis: {
          focus: "series",
        },
        data: periodFemaleData,
      };
      this.series = [];
      this.series.push(maleObj);
      this.series.push(femaleObj);
    },
    getCircleChartData() {
      const circleData = [
        {
          name: "女性",
          value: this.sumFemale,
        },
        {
          name: "男性",
          value: this.sumMale,
        },
      ];
      this.circleData = circleData;
    },

    getRateList() {
      this.resRateList = this.priceDetailList.map((item) => {
        const day = item.dt.split("T")[0];
        const maleProportion = this.percentageTrans(item.sumMale / item.sumAll);
        const femaleProportion = this.percentageTrans(
          item.sumFemale / item.sumAll
        );
        const dailyTraffic = item.trafficDtCounts;
        const age18Proportion = this.percentageTrans(
          item.ageTo18 / item.sumAll
        );
        const age1824Proportion = this.percentageTrans(
          item.ageTo25 / item.sumAll
        );
        const age2534Proportion = this.percentageTrans(
          item.ageTo35 / item.sumAll
        );
        const age3544Proportion = this.percentageTrans(
          item.ageTo45 / item.sumAll
        );
        const age4554Proportion = this.percentageTrans(
          item.ageTo55 / item.sumAll
        );
        const age55Proportion = this.percentageTrans(
          item.ageTo100 / item.sumAll
        );
        return {
          day,
          maleProportion,
          femaleProportion,
          dailyTraffic,
          age18Proportion,
          age1824Proportion,
          age2534Proportion,
          age3544Proportion,
          age4554Proportion,
          age55Proportion,
        };
      });
      this.priceDetailTotal = this.resRateList.length;
      this.rateList = this.resRateList.slice(this.pageNo - 1, this.pageSize);
    },
    pageChange(val) {
      this.pageNo = val;
      const that = this;
      const start = that.pageSize * val - this.pageSize;
      const end = that.pageSize * val;
      if (that.resRateList.length <= that.pageSize) {
        that.rateList = that.resRateList;
      } else {
        if (that.pageSize * val >= that.resRateList.length) {
          that.rateList = that.resRateList.slice(start);
        } else {
          that.rateList = that.resRateList.slice(start, end);
        }
      }
    },
    sizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.rateList = this.resRateList.slice(this.pageNo - 1, this.pageSize);
    },
    changePeriod(val) {
      this.queryInfor.period = val;
      this.queryInfor.dateRange = [];
      this.search();
    },
    changeDateRange(val) {
      this.queryInfor.dateRange = val;
      this.queryInfor.period = "";
      this.search();
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      let { beginDate, endDate, periodNum } = this.getParamVal();
      beginDate = beginDate == undefined ? "" : beginDate;
      endDate = endDate == undefined ? "" : endDate;
      let url = `/advPortrait/export?beginDate=${beginDate}&endDate=${endDate}&fileName=流量画像明细列表&mid=${this.mid}&periodNum=${periodNum}`;
      userExport(url);
    },
    async setPortraitBasicInfor() {
      const { data } = await getBasicData({ mid: this.mid })
      this.portraitBasicInfor = data;
    },
    getList(beginDate, endDate, periodNum = 30) {
      return getPriceDetailList({
        mid: this.mid,
        beginDate,
        endDate,
        periodNum,
      });
    },
    getParamVal() {
      let beginDate = "",
        endDate = "",
        periodNum = "";
      if (this.queryInfor.period != -1) {
        periodNum = this.queryInfor.period;
        beginDate = this.queryInfor.dateRange[0];
        endDate = this.queryInfor.dateRange[1];
      } else {
        periodNum = "";
        beginDate = this.queryInfor.dateRange[0];
        endDate = this.queryInfor.dateRange[1];
      }
      return { beginDate, endDate, periodNum };
    },
    async search() {
      const { beginDate, endDate, periodNum } = this.getParamVal();
      const { data } = await this.getList(beginDate, endDate, periodNum);
      this.priceDetailList = data;
      this.initData();
      this.getTrendChartData(); 
      this.getAgeData();
      this.getCircleChartData(beginDate, endDate, periodNum);
      this.getRateList();
    },
  },
  created() {
    this.setPortraitBasicInfor();
    this.search();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .trend_container {
    // height: 497px;
    background-color: #fff;
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    .query_container {
      padding-top: 20px;
      padding-left: 30px;
    }
  }
  .chart_container {
    display: flex;
    margin-top: 10px;
    li {
      height: 420px;
      flex: 1;
      background-color: #fff;
    }
    .first {
      margin-right: 11px;
    }
  }
  .table_container {
    padding: 30px;
    background-color: #fff;
    margin-top: 10px;
    .title_operate_container {
      display: flex;
      justify-content: space-between;
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .table_content {
      border: 1px solid #fafafa;
    }
  }
}
</style>