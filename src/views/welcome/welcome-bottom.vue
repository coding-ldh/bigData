<template>
  <el-row :gutter="24" class="bottom" style="margin-bottom: 20px">
    <wel-card
      :md="8"
      :lg="8"
      :xl="8"
      title="已激活设备总量硬件类型分布"
      redirect="itemData/general-data"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <circle-chart
            id="chart40"
            Unit="台"
            :chartData="circleByHard"
            :colors="chartOneColors"
          ></circle-chart>
        </el-skeleton>
      </template>
    </wel-card>
    <wel-card
      :md="8"
      :lg="8"
      :xl="8"
      title="已激活设备总量/项目总量分布"
      redirect="itemData/general-data"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <bar-chart
            id="chart41"
            :legend="BaseLegend"
            :xData="BaseXdata"
            :colorList="chartTATColors"
            :series="overViewBase"
          ></bar-chart
        ></el-skeleton>
      </template>
    </wel-card>
    <wel-card
      :md="8"
      :lg="8"
      :xl="8"
      title="已激活设备总量/项目总量分布"
      redirect="itemData/general-data"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <column-chart
            id="chart42"
            title="单位：台"
            :legend="columnLegend"
            :xData="columnYdata"
            :colorList="chartTATColors"
            :series="columnBarByScenee"
          ></column-chart>
        </el-skeleton>
      </template>
    </wel-card>
  </el-row>
</template>

<script>
import WelCard from "./component/WelCard.vue";
import circleChart from "./component/circleCharts.vue";
import barChart from "./component/barChart.vue";
import columnChart from "./component/columnBarChart.vue";
import {
  getActiveDeviceTypeRate,
  getActiveDeviceSceneRate,
  getDviceAndProjectDistribution,
} from "@/api/welcome/index.js";
export default {
  components: { WelCard, circleChart, barChart, columnChart },
  props: ["loading"],
  data() {
    return {
      // left
      circleByHard: [],
      chartOneColors: [
        "#3BA0FF",
        "#4ECB74",
        "#36CBCB",
        "#FBD437",
        "#F2637B",
        "#975FE5",
      ],
      // mid
      overViewBase: [],
      BaseLegend: ["已激活设备总量(台)", "已激活项目总量(个)"],
      BaseXdata: [],
      BaseYDev: [],
      BaseYPro: [],
      chartTATColors: ["#2FC25B", "#1890FF"],
      //
      columnBarByScenee: [],
      columnLegend: ["设备总量", "项目总量"],
      columnYdata: [],
      columnXdev: [],
      columnXpro: [],
    };
  },
  created() {
    this.initData();
  },
  methods: {
    initData() {
      this.setCircleByHard();
      this.setOverviewBase();
      this.setColumnBarByScene();
    },
    async setCircleByHard() {
      const { data } = await getActiveDeviceTypeRate({});
      this.circleByHard = data.map((data) => {
        return {
          name: data.type,
          proportion: data.rate,
          value: data.devCount,
        };
      });
    },
    createBarObj(name, data) {
      return {
        name,
        type: "bar",
        barGap: 0,
        barWidth: 12, //柱图宽度
        data,
      };
    },
    async setOverviewBase() {
      const { data } = await getDviceAndProjectDistribution();
      // x轴 华北
      this.BaseXdata = data.map((_) => {
        return _.region;
      });
      // Y轴数据 1
      this.BaseYDev = data.map((_) => {
        return _.devCount;
      });
      // Y轴数据 2
      this.BaseYPro = data.map((_) => {
        return _.activeProCount;
      });
      this.overViewBase.push(
        this.createBarObj(this.BaseLegend[0], this.BaseYDev)
      );
      this.overViewBase.push(
        this.createBarObj(this.BaseLegend[1], this.BaseYPro)
      );
    },
    async setColumnBarByScene() {
      let { data } = await getActiveDeviceSceneRate();
      data = data.reverse();
      this.columnYdata = data.map((_) => {
        return _.projectScene;
      });
      this.columnYdata = this.columnYdata;
      // 双值
      this.columnXdev = data.map((_, index, item) => {
        let total = 0;
        let percentage;
        for (let i = 0; i < item.length; i++) {
          total += item[i].robotTotal;
        }
        percentage = Math.round((item[index].robotTotal / total) * 1000) / 10;
        return {
          value: _.robotTotal,
          percentage,
        };
      });
      this.columnXpro = data.map((_, index, item) => {
        let total = 0;
        let percentage;
        for (let i = 0; i < item.length; i++) {
          total += item[i].projectTotal;
        }
        percentage = Math.round((item[index].projectTotal / total) * 1000) / 10;
        return {
          value: _.projectTotal,
          percentage,
        };
      });
      this.columnBarByScenee.push(
        this.createBarObj(this.columnLegend[0], this.columnXdev)
      );
      this.columnBarByScenee.push(
        this.createBarObj(this.columnLegend[1], this.columnXpro)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.bottom {
  height: 502px;
}
</style>
