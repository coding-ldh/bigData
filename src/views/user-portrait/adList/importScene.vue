<template>
  <div class="container">
    <div class="basic_infor">
      <user-back
        @userBack="userBack"
        title="投放计划详情页-重点场景详情"
        titleFontSize="20px"
      ></user-back>
      <ul>
        <li>计划名称：{{ baseInfor.planName }}</li>
        <li>投放时间：{{ baseInfor.planPeriod }}</li>
      </ul>
    </div>
    <div
      v-for="(item, index) in dataList"
      :key="index.scene"
      class="scene_container"
    >
      <div class="scenc_explain">
        场景{{ item.scene }}
        <span>{{ getStr(item.scene) }}</span>
      </div>
      <ul>
        <li>
          <bar-chart
            title="年龄占比"
            yUnit="%"
            :id="getCharId('age', index)"
            :xData="ageCharX"
            :series="getAgeChartData(item)"
          ></bar-chart>
        </li>
        <li>
          <circle-chart
            :id="getCharId('sex', index)"
            title="性别占比"
            Unit="人次"
            :colors="sexChartColors"
            :chartData="getSexChartData(item)"
          ></circle-chart>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { getBarChartSeriesObj } from "@/utils/tool.js";
import BarChart from "@/components/Charts/BarChart";
import CircleChart from "@/components/Charts/CircleChart";
import UserBack from "@/components/UserBack";
import {
  ageAndSexRatio4PlanScreen,
  proportionOfPlanExposureSceneKeySceneDetails
} from "@/api/userPortrait";
export default {
  props: {
    planId: String,
    baseInfor: Object,
    formType: String,
    exposureList: Array,
    deviceDataList: Array
  },
  components: {
    BarChart,
    CircleChart,
    UserBack
  },
  data() {
    return {
      dataList: [],
      ageList: [],
      sexList: [],
      sexChartColors: ["#F2637B", "#3BA0FF"],
      ageCharX: [
        "18岁以下",
        "18-24岁",
        "25-34岁",
        "35-44岁",
        "45-54岁",
        "55岁以上"
      ],
      exposureAndDeviceData: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getCharId(name, index) {
      return `chart${name}${index}`;
    },
    getData() {
      ageAndSexRatio4PlanScreen({
        planId: this.planId,
        descType: this.formType == "投放设备数" ? 2 : 1
      }).then(({ data }) => {
        this.dataList = data;
        console.log(this.dataList);
      });
      proportionOfPlanExposureSceneKeySceneDetails({
        planId: this.planId
      }).then(({ data }) => {
        this.exposureAndDeviceData = data;
        // for(let i=0 ;i<this.exposureAndDeviceData.length;i++){
        //   console.log(this.exposureAndDeviceData[i].planScene,'---')
        // }
      });
    },
    getAgeChartData(item) {
      // console.log('item',item)
      const manDataArr = item.man.map(item => Math.round(item));
      // console.log('manDataArr',manDataArr)
      const manDataObj = getBarChartSeriesObj("男", manDataArr);
      // console.log('manDataObj',manDataObj)
      const womanDataArr = item.woman.map(item => Math.round(item));
      // console.log('womanDataArr',womanDataArr)
      const womanDataObj = getBarChartSeriesObj("女", womanDataArr);
      // console.log('womanDataObj',womanDataObj)
      return [manDataObj, womanDataObj];
    },
    getSexChartData(item) {
      return item.sexRatio;
    },
    getStr(scene) {
      for (let i = 0; i < this.exposureAndDeviceData.length; i++) {
        if (this.exposureAndDeviceData[i].planScene === scene) {
          return `投放设备数:${this.exposureAndDeviceData[i].planDevices}台 曝光量:${this.exposureAndDeviceData[i].planExposure}次`;
        }
      }
    },
    userBack() {
      this.$emit("back");
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.basic_infor {
  background-color: #fff;
  padding-top: 30px;
  padding-left: 30px;
  padding-bottom: 20px;
  color: #333;
  ul {
    li {
      font-size: 16px;
      margin-top: 20px;
    }
  }
}
.scene_container {
  background-color: #fff;
  margin-top: 10px;
  .scenc_explain {
    font-size: 20px;
    color: #333;
    font-weight: bold;
    display: flex;
    align-items: center;
    padding-left: 30px;
    padding-top: 19px;
    margin-bottom: 19px;
    span {
      font-size: 16px;
      font-weight: normal;
      margin-left: 20px;
    }
  }
  ul {
    display: flex;
    li {
      flex: 1;
    }
    li:last-child {
      padding-bottom: 16px;
    }
  }
}
</style>
