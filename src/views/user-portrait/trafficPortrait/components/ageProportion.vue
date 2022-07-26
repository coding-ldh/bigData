<template>
  <li class="first" v-loading="loading">
    <bar-chart
      title="年龄占比"
      id="chart4"
      :xData="barXData"
      yUnit="%"
      :series="series"
      v-if="series.length != 0"
    ></bar-chart>
  </li>
</template>

<script>
import BarChart from "@/components/Charts/BarChart";

export default {
  props: {
    adsOverviewList: {
      type: Array,
    },
  },
  components: { BarChart },
  data() {
    return {
      loading: false,
      barXData: [
        "18岁以下",
        "18-24岁",
        "25-34岁",
        "35-44岁",
        "45-54岁",
        "55岁以上",
      ],
      sumAllData: 0,
      series: [],
    };
  },
  methods: {
    init() {
      this.loading = true;
      this.setAgeSeries();
    },
    setAgeSeries() {
      this.sumAllData = 0;
      this.adsOverviewList.forEach((item) => {
        this.sumAllData += item.allCounts;
      });
      const that = this;
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
      let maleDataArr = this.periodMaleData.map((item) =>
        that.percentageTrans(item / that.sumAllData)
      );
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
      let femaleDataArr = this.periodFemaleData.map((item) =>
        that.percentageTrans(item / that.sumAllData)
      );
      let maleObj = {
        name: "男",
        type: "bar",
        barGap: 0,
        barWidth: 35, //柱图宽度
        emphasis: {
          focus: "series",
        },
        data: maleDataArr,
      };
      let femaleObj = {
        name: "女",
        type: "bar",
        barGap: 0,
        barWidth: 35, //柱图宽度
        emphasis: {
          focus: "series",
        },
        data: femaleDataArr,
      };
      if (maleDataArr.length == 0 || femaleDataArr.length == 0) {
        this.series = [];
      } else {
        this.series = [];
        this.series.push(maleObj);
        this.series.push(femaleObj);
      }
      this.loading = false;
    },
    percentageTrans(data) {
      return data ? Math.round(data * 100) : 0;
    },
  },
  mounted() {
    // this.init();
  },
};
</script>
<style lang="scss" scoped>
</style>