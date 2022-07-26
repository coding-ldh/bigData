<template>
  <li v-loading="loading">
    <circle-chart
      id="chart6"
      title="性别占比"
      Unit="人次"
      :chartData="sexChartData"
      v-if="sexChartData.length != 0"
      :colors="sexChartColors"
    ></circle-chart>
  </li>
</template>

<script>
import CircleChart from "@/components/Charts/CircleChart";

export default {
  props: {
    adsOverviewList: {
      type: Array,
    },
  },
  components: { CircleChart },
  data() {
    return {
      loading: false,
      sexChartData: [],
      sexChartColors: ["#3BA0FF", "#F2637B"],
      periodMaleData: [],
      periodFemaleData: [],
    };
  },
  methods: {
    init() {
      this.loading = true;
      this.setSexChartData();
    },
    setSexChartData() {
      this.periodMaleData = this.adsOverviewList.reduce((pre, cur) => {
        return pre.length > 0
          ? [
              pre[0] + cur.ageTo18MaleCounts,
              pre[1] + cur.ageTo25MaleCounts,
              pre[2] + cur.ageTo35MaleCounts,
              pre[3] + cur.ageTo45MaleCounts,
              pre[4] + cur.ageTo55MaleCounts,
              pre[5] + cur.ageTo100MaleCounts,
            ]
          : [
              cur.ageTo18MaleCounts,
              cur.ageTo25MaleCounts,
              cur.ageTo35MaleCounts,
              cur.ageTo45MaleCounts,
              cur.ageTo55MaleCounts,
              cur.ageTo100MaleCounts,
            ];
      }, []);
      this.periodFemaleData = this.adsOverviewList.reduce((pre, cur) => {
        return pre.length > 0
          ? [
              pre[0] + cur.ageTo18FemaleCounts,
              pre[1] + cur.ageTo25FemaleCounts,
              pre[2] + cur.ageTo35FemaleCounts,
              pre[3] + cur.ageTo45FemaleCounts,
              pre[4] + cur.ageTo55FemaleCounts,
              pre[5] + cur.ageTo100FemaleCounts,
            ]
          : [
              cur.ageTo18FemaleCounts,
              cur.ageTo25FemaleCounts,
              cur.ageTo35FemaleCounts,
              cur.ageTo45FemaleCounts,
              cur.ageTo55FemaleCounts,
              cur.ageTo100FemaleCounts,
            ];
      }, []);
      const allMaleData = this.periodMaleData.reduce((pre, cur) => {
        return pre + cur;
      }, 0);
      const allFemaleData = this.periodFemaleData.reduce((pre, cur) => {
        return pre + cur;
      }, 0);
      if (allMaleData == 0 || allFemaleData == 0) {
        this.sexChartData = [];
        console.log("空的");
      } else {
        this.sexChartData = [
          { name: "男性", value: allMaleData },
          { name: "女性", value: allFemaleData },
        ];
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
</style>