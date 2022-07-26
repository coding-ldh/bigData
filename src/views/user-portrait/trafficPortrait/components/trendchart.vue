<template>
  <div class="trend_container" v-loading="loading">
    <line-chart
      id="chart11"
      title="趋势图"
      :series="trendSeries"
      :trendXData="trendXData"
      :colorList="trendColorList"
      :formatter="trendFormatter"
      v-if="trendSeries.length != 0"
    >
      <div>
        <el-radio v-model="line.type" :label="1" @change="changeTyep(1)"
          >流量</el-radio
        >
        <el-radio v-model="line.type" :label="2" @change="changeTyep(2)"
          >已激活设备量</el-radio
        >
      </div>
    </line-chart>
  </div>
</template>

<script>
import LineChart from "@/components/Charts/LineChart";
import { getLineChartSeriesObj } from "@/utils/tool.js";
export default {
  props: {
    adsOverviewList: {
      type: Array,
    },
  },
  components: { LineChart },
  data() {
    return {
      loading: false,
      line: { type: "" },
      trendSeries: [],
      trendXData: [],
      trendColorList: ["#2B5DEA"],
      trendFormatter: "",
      sumAllData: 0,
    };
  },
  methods: {
    init() {
      this.loading = true;
      this.setTrendXDataAndSeries();
    },
    setTrendXDataAndSeries() {
      this.sumAllData = 0;
      this.adsOverviewList.forEach((item) => {
        this.sumAllData += item.allCounts;
      });
      this.trendXData = this.adsOverviewList.map((item) => item.dt);
      this.trafficSeries = this.adsOverviewList.map(
        (item) => item.trafficCounts
      );
      this.midSeries = this.adsOverviewList.map((item) => item.midCounts);
      this.changeTyep(1);
    },
    changeTyep(val) {
      this.trendSeries = [];
      this.line.type = val;
      if (this.line.type === 1) {
        const name = "流量";
        this.trendFormatter = "{value}人次";
        let obj = getLineChartSeriesObj(name, this.trafficSeries);
        this.trendSeries.push(obj);
      } else {
        const name = "已激活设备量";
        this.trendFormatter = "{value}台";
        let obj = getLineChartSeriesObj(name, this.midSeries);
        this.trendSeries.push(obj);
      }
      this.loading = false;
    },
  },
  mounted() {
    // this.init();
  },
};
</script>

<style lang="scss" scoped>
.trend_container {
  height: 443px;
  background-color: #fff;
  margin-top: 10px;
}
</style>