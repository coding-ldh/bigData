<template>
  <div class="container" id="pdf-container">
    <Search @queryInfor="search"></Search>
    <DeviceAndPv :params="params" ref="DeviceAndPv"></DeviceAndPv>
    <Trendchart
      :adsOverviewList="adsOverviewList"
      ref="Trendchart"
    ></Trendchart>
    <ChinaMapAndTop10 ref="ChinaMap"></ChinaMapAndTop10>
    <ul class="chart_container second_chart_container">
      <SceneCategory :params="params" ref="SceneCategory"></SceneCategory>
      <SingleEquipPvDistrib
        :adsOverviewList="adsOverviewList"
        ref="SingleEquipPvDistrib"
      ></SingleEquipPvDistrib>
    </ul>
    <ul class="chart_container third_chart_container">
      <AgeProportion
        :adsOverviewList="adsOverviewList"
        ref="AgeProportion"
      ></AgeProportion>
      <SexProportion
        :adsOverviewList="adsOverviewList"
        ref="SexProportion"
      ></SexProportion>
    </ul>
  </div>
</template>

<script>
import { getCurrentDate } from "@/utils/tool.js";
import { getAdsOverviewList } from "@/api/userPortrait";

import Search from "./components/search.vue";
import DeviceAndPv from "./components/deviceAndPv.vue";
import Trendchart from "./components/trendchart.vue";
import ChinaMapAndTop10 from "./components/chinaMap.vue";
import SceneCategory from "./components/sceneCategory";
import SingleEquipPvDistrib from "./components/singleEquipPvDistrib.vue";
import AgeProportion from "./components/ageProportion.vue";
import SexProportion from "./components/sexProportion";

export default {
  components: {
    Search,
    DeviceAndPv,
    Trendchart,
    ChinaMapAndTop10,
    SceneCategory,
    SingleEquipPvDistrib,
    AgeProportion,
    SexProportion,
  },
  data() {
    return {
      queryInfor: {
        area: [],
        scene: "",
        deviceType: [],
        period: 30,
        dateRange: [],
      },
      params: {},
      adsOverviewList: [],
    };
  },
  methods: {
    search(queryInfor) {
      this.queryInfor = queryInfor;
      this.getAllData();
    },
    async getAllData() {
      this.params = this.getParams();
      this.$refs.DeviceAndPv.init();
      this.$refs.ChinaMap.init();
      let { data } = await getAdsOverviewList(this.params);
      this.adsOverviewList = data;
      this.$nextTick((_) => {
        this.$refs.Trendchart.init();
        this.$refs.SceneCategory.init();
        this.$refs.SingleEquipPvDistrib.init();
        this.$refs.AgeProportion.init();
        this.$refs.SexProportion.init();
      });
    },
    getParams() {
      let { area, dateRange, scene, deviceType } = this.queryInfor;
      deviceType = deviceType.join(",");
      const projectProvince = area[0];
      const projectCity = area[1] == "全部" ? "" : area[1];
      const projectDistrict = area[2] == "全部" ? "" : area[2];
      const projectIndustry = scene;
      let beginDate = dateRange[0] ? dateRange[0] : getCurrentDate(30 * 24);
      let endDate = dateRange[1] ? dateRange[1] : getCurrentDate(1);
      return {
        beginDate,
        endDate,
        projectCity,
        projectDistrict,
        projectIndustry,
        projectProvince,
        deviceType,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .chart_container {
    display: flex;
    li {
      flex: 1;
      // height: 548px;
      background-color: #fff;
      margin-top: 10px;
      .title {
        color: #333333;
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 21px;
        padding-left: 30px;
        padding-top: 20px;
      }
    }
    li.first {
      margin-right: 11px;
    }
  }
}
</style>
