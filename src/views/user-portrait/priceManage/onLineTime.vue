<template>
  <div class="container">
    <div class="basic_infor_container">
      <user-back @userBack="useBack()"></user-back>
      <ul>
        <li>设备编号：{{ currentItem.mid }}</li>
        <li>设备类型:{{ currentItem.deviceType }}</li>
        <li>行业：{{ currentItem.projectScene }}</li>
        <li>设备地址：{{ currentItem.customerAddr }}</li>
      </ul>
    </div>
    <div class="explain_container">
      <div class="right_explain" @click="show = true">
        <i class="el-icon-question"></i>
        数据说明
      </div>
    </div>
    <ul class="block_container">
      <li>
        <div class="nav_Time">
          <strong>昨日</strong>
          在线时长 <span class="Hour">{{ kbData.yesterdayOnlineDuration }}</span>小时
        </div>
        <p>
          超过
          <span class="precent">{{ kbData.yesterdayOnlineDurationRate }}</span>的设备
        </p>
      </li>
      <li>
        <div class="nav_Time">
          最近
          <strong>7日</strong>
          在线时长<span class="Hour">{{ kbData.last7DaysOnlineDuration }}</span>小时
        </div>
        <p>
          超过
          <span class="precent">{{ kbData.last7DaysOnlineDurationRate }}</span>的设备
        </p>
      </li>
      <li>
        <div class="nav_Time">
          最近
          <strong>30日</strong>
          在线时长<span class="Hour">{{ kbData.last30DaysOnlineDuration }}</span>小时
        </div>
        <p>
          超过
          <span class="precent">{{ kbData.last30DaysOnlineDurationRate }}</span>的设备
        </p>
      </li>
    </ul>
    <div class="chart_container">
      <line-chart
        id="chart1"
        title="月度统计"
        :legendData="monthLegendData"
        :series="monthYData"
        formatter="{value}小时"
        :trendXData="monthXData"
        :colorList="colorList"
      >
        <el-date-picker
          v-model="monthDate"
          type="daterange"
          formatter="{value}小时"
          value-format="yyyy-MM-dd"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="getMonthTrend()"
          :picker-options="monthPickerOptions"
        ></el-date-picker>
      </line-chart>
    </div>
    <div class="chart_container">
      <line-chart
        id="chart2"
        title="年度统计"
        :legendData="yearLegendData"
        :series="yearYData"
        :trendXData="yearXData"
        :colorList="colorList"
        formatter="{value}小时"
      >
        <el-date-picker
          v-model="yearDate"
          type="monthrange"
          value-format="yyyy-MM"
          range-separator="~"
          @change="getYearTrend()"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </line-chart>
    </div>
    <!-- 说明弹框开始 -->
    <el-dialog title="数据说明" :visible.sync="show" width="500px">
      <div style="line-height: 30px;">
        1.昨日在线时长，统计设备昨日在线时长。超过**设备，设备维度为已激活设备总量。
        <br />2.最近7日在线时长，：最近7日（不含今日）设备在线总时长。超过**设备，设备维度为已激活设备总量。
        <br />3.最近30日在线时长，：最近30日（不含今日）设备在线使用总时长。超过多少设备，设备维度为已激活设备总量。
      </div>
    </el-dialog>
    <!-- 说明弹框结束 -->
  </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import { getLineChartSeriesObj, getCurrentDate } from "@/utils/tool.js";
import UserBack from '@/components/UserBack';
import {
  adsOnlineDurationData,
  onLineMonthlyTrend,
  onLineYearTrend,
} from "@/api/userPortrait";
export default {
  props: {
    mid: String,
    currentItem: Object
  },
  components: {
    LineChart,
    UserBack
  },
  data() {
    return {
      show: false,
      baseInfor: {},
      kbData: {},
      colorList: ["#3BA0FF"],
      monthXData: [],
      monthYData: [],
      monthLegendData: [],
      yearXData: [],
      yearYData: [],
      yearLegendData: [],
      monthDate: [],
      yearDate: [],
      monthPickerOptions: {
        disabledDate: (time) => {
          return (
            time.getTime() > new Date().getTime() ||
            time.getTime() < new Date(getCurrentDate(24 * 31 * 2)).getTime()
          );
        },
      },
    };
  },
  created() {
    this.getMonthTrend();
    this.getYearTrend();
    adsOnlineDurationData({ mid: this.mid }).then(({ data }) => {
      this.kbData = data;
    });
  },
  methods: {
    useBack() {
      this.$emit("back");
    },
    getMonthTrend() {
      onLineMonthlyTrend({
        beginDate: this.monthDate[0],
        mid: this.mid,
        endDate: this.monthDate[1],
      }).then(({ data }) => {
        this.monthXData = data.date;
        let obj = getLineChartSeriesObj(
          "每日在线时长",
          data.onlineDuration
        );
        this.monthLegendData = ["每日在线时长"];
        this.monthYData = [obj];
      });
    },
    getYearTrend() {
      onLineYearTrend({
        beginDate: this.yearDate[0],
        mid: this.mid,
        endDate: this.yearDate[1],
      }).then(({ data }) => {
        this.yearXData = data.date;
        let obj = getLineChartSeriesObj(
          "每月在线时长",
          data.onlineDuration
        );
        this.yearLegendData = ["每月在线时长"];
        this.yearYData = [obj];
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .explain_container {
    background-color: #fff;
    margin-top: 10px;
    padding: 8px 12px;
    font-size: 14px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .right_explain {
      color: #108de9;
      font-size: 16px;
      cursor: pointer;
      i {
        color: #333;
      }
    }
  }
  .block_container {
    margin-top: 10px;
    display: flex;
    li {
      flex: 1;
      height: 132px;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding-left: 10px;
      margin-right: 10px;
      .nav_Time {
        // font-weight: 700;
        padding-bottom: 15px;
        .Hour{
          color: #64acff;
          padding: 0px 5px 0px 2px;
        }
      }
      p {
        .precent {
          font-size: 32px;
          font-weight: 700;
          padding-top: 6px;
          color: #409eff;
          padding: 0px 15px 0px 15px;
        }
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
  .chart_container {
    background-color: #fff;
    margin-top: 10px;
  }
}
</style>