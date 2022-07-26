<template>
  <div v-if="part == 'TOP10City'" class="content">
    <el-row :gutter="32" style="margin-bottom: 20px">
      <el-col :md="32" :lg="32" :xl="32">
        <el-card>
          <template #header>
            <div class="header" style="padding: 8px 0">
              <span class="title">TOP10城市投放占比</span>
              <el-button type="primary" @click="$router.back(-1)"
                >返回</el-button
              >
            </div>
          </template>
          <el-skeleton animated :rows="20" :loading="false">
            <Search
              from="城市"
              @search="searchCity"
              :multiple="false"
              :clearable="false"
              :collapse_tags="false"
            ></Search>
            <bar-chart
              id="chart22"
              title="单位：台"
              :legend="CityLegend"
              :xData="CityXdata"
              :colorList="CityColors"
              :series="CitySeries"
              style="padding: 0px 20px 60px 20px"
            ></bar-chart>
            <el-table style="width: 100%" :data="CityList">
              <el-table-column
                label="排名"
                prop="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="城市"
                prop="city"
                align="center"
              ></el-table-column>
              <el-table-column
                label="设备总量"
                prop="midCounts"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已投设备量"
                prop="midAlreadyCounts"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已投占比(%)"
                prop="midAlreadyRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="订单已投设备量"
                prop="midAlreadyOrderCounts"
                align="center"
              ></el-table-column>
              <el-table-column
                label="订单已投占比(%)"
                prop="midAlreadyOrderRate"
                align="center"
              ></el-table-column>
            </el-table>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <div v-else-if="part == 'TOP10Industry'" class="content">
    <el-row :gutter="32" style="margin-bottom: 20px">
      <el-col :md="32" :lg="32" :xl="32">
        <el-card>
          <template #header>
            <div class="header" style="padding: 8px 0">
              <span class="title">TOP10行业投放占比</span>
              <el-button type="primary" @click="$router.back(-1)"
                >返回</el-button
              >
            </div>
          </template>
          <el-skeleton animated :rows="20" :loading="false">
            <Search
              @search="searchIndustry"
              from="行业"
              :multiple="false"
              :clearable="false"
              :collapse_tags="false"
            ></Search>
            <circle-chart
              id="chartDetail10"
              Unit="台"
              :itemGap="50"
              :series="IndustrySeries"
              :colors="IndustryColors"
              legendTop="10%"
              :legendPadding="[50, 0, 120, 0]"
              legendLeft="60%"
              marginLeft="-60%"
              :show="false"
            ></circle-chart>
            <el-table style="width: 100%" :data="IndustryList">
              <el-table-column
                label="排名"
                prop="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="行业"
                prop="industry"
                align="center"
              ></el-table-column>
              <el-table-column
                label="设备总量"
                prop="midCounts"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已投设备量"
                prop="midAlreadyCounts"
                align="center"
              ></el-table-column>
              <el-table-column
                label="已投占比(%)"
                prop="midAlreadyRate"
                align="center"
              ></el-table-column>
              <el-table-column
                label="订单已投设备量"
                prop="midAlreadyOrderCounts"
                align="center"
              ></el-table-column>
              <el-table-column
                label="订单已投占比(%)"
                prop="midAlreadyOrderRate"
                align="center"
              ></el-table-column>
            </el-table>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./components/search.vue";
import BarChart from "./components/barChart.vue";
import CircleChart from "./components/circleCharts.vue";
import {
  getEquipmentInCityTop10,
  getEquipmentInIndustryTop10,
} from "@/api/userPortrait";
export default {
  components: { Search, BarChart, CircleChart },
  data() {
    return {
      part: this.$route.query.id,
      CityLegend: ["设备总量", "已投放设备量", "订单投放设备量"],
      CityXdata: [],
      CityList: [],
      CityColors: ["#1F5DEA", "#52CCA3", "#FACC14"],
      CitySeries: [],
      //
      IndustryList: [],
      IndustryColors: [
        "#1F5DEA",
        "#FACC14",
        "#36CBCB",
        "#F35B5B",
        "#6A70F0",
        "#2FC25B",
        "#F06A9A",
        "#AFD442",
        "#1890FF",
        "#F3925B",
      ],
      IndustrySeries: [],
    };
  },
  methods: {
    createBar(name, data) {
      return {
        name: name,
        type: "bar",
        barGap: 0,
        barWidth: 12, //柱图宽度
        data: data,
      };
    },
    searchCity(params) {
      getEquipmentInCityTop10(params).then((_) => {
        let arr = [];
        this.CityXdata = _.data.map((_) => _.city);
        let trend0 = _.data.map((_) => _.midCounts);
        let trend1 = _.data.map((_) => _.midAlreadyCounts);
        let trend2 = _.data.map((_) => _.midAlreadyOrderCounts);
        arr.push(this.createBar(this.CityLegend[0], trend0));
        arr.push(this.createBar(this.CityLegend[1], trend1));
        arr.push(this.createBar(this.CityLegend[2], trend2));
        this.CitySeries = arr;
        this.CityList = _.data.map((_, index) => {
          return {
            index: index + 1,
            city: _.city,
            midCounts: _.midCounts,
            midAlreadyCounts: _.midAlreadyCounts,
            midAlreadyOrderCounts: _.midAlreadyOrderCounts,
            midAlreadyRate: _.midAlreadyRate,
            midAlreadyOrderRate: _.midAlreadyOrderRate,
          };
        });
      });
    },
    searchIndustry(params) {
      getEquipmentInIndustryTop10(params).then((_) => {
        this.IndustrySeries = _.data.map((_) => {
          return { name: _.industry, proportion: 15, value: _.midCounts };
        });
        console.log(this.IndustrySeries);
        this.IndustryList = _.data.map((_, index) => {
          return {
            index: index + 1,
            industry: _.industry,
            midCounts: _.midCounts,
            midAlreadyCounts: _.midAlreadyCounts,
            midAlreadyOrderCounts: _.midAlreadyOrderCounts,
            midAlreadyRate: _.midAlreadyRate,
            midAlreadyOrderRate: _.midAlreadyOrderRate,
          };
        });
      });
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    .title {
      align-items: center;
      height: 35px;
      line-height: 35px;
    }
  }
  ::v-deep .el-table .el-table__body tbody {
    > :nth-child(1) > :nth-child(1) .cell,
    > :nth-child(2) > :nth-child(1) .cell,
    > :nth-child(3) > :nth-child(1) .cell {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      width: 20px;
      padding: 0;
      text-align: center;
      border-radius: 50%;
      background: #314659;
      color: #fff;
    }
    tr:nth-child(2n) {
      background-color: #ffffff !important;
    }
  }
}
</style>
