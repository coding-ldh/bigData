<template>
  <div class="container" id="pdf-container">
    <!-- 趋势图 -->
    <el-row :gutter="24" style="margin-bottom: 20px">
      <el-col :md="24" :lg="24" :xl="24">
        <el-card>
          <template #header>
            <div class="header" style="padding: 8px 0">
              <span class="title">广告投放趋势图</span>
            </div>
          </template>
          <el-skeleton animated :rows="20" :loading="false">
            <Search from="广告投放" @search="search"> </Search>
            <LineChart
              id="chart10"
              @isSelect="isSelect"
              Yunit="单位：台"
              :title="title"
              :legend="trendLegend"
              :colorList="lineColorList"
              :XData="XData"
              :series="series"
            >
            </LineChart>
            <el-collapse
              @change="
                collapseTitle =
                  collapseTitle == '展开明细' ? '收起明细' : '展开明细'
              "
            >
              <el-collapse-item :title="collapseTitle" class="collapseText">
                <el-table stripe style="width: 100%" :data="trendListTemp">
                  <el-table-column label="时间" prop="dt" align="left">
                  </el-table-column>
                  <el-table-column
                    label="设备总量"
                    prop="midCounts"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    label="已投设备量"
                    prop="midAlreadyCounts"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    label="订单投放设备量"
                    prop="midAlreadyOrderCounts"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    label="广告位总量"
                    prop="adsCounts"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    label="已投广告位数量"
                    prop="adsAlreadyCounts"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    label="订单已投设备量"
                    prop="adsAlreadyOrderCounts"
                    align="center"
                  >
                  </el-table-column>
                </el-table>
                <div class="pageContainer">
                  <el-pagination
                    :current-page="1"
                    background
                    layout="total, prev,pager, next"
                    :total="pageInfor.total"
                    :hide-on-single-page="true"
                    @current-change="sizeChange"
                  >
                  </el-pagination>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
    <!-- TOP10城市投放占比 -->
    <!-- TOP10行业投放占比 -->
    <el-row :gutter="24">
      <!-- TOP10城市投放占比 -->
      <el-col :md="12" :lg="12" :xl="12" style="margin-bottom: 20px">
        <el-card>
          <template #header>
            <div class="header">
              <span class="title">TOP10城市投放占比</span>
              <router-link
                :to="{
                  path: `/user-portrait/detail`,
                  query: { id: 'TOP10City' },
                }"
                class="routerPointer"
              >
                <span></span>
                <span></span>
                <span></span>
              </router-link>
            </div>
          </template>
          <el-skeleton animated :rows="20" :loading="false">
            <el-select
              v-model="CityTime"
              placeholder="最近30天"
              @change="CityTimeChange()"
            >
              <el-option
                v-for="item in CityTimeList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <bar-chart
              id="chart21"
              title="单位：台"
              :legend="trendLegend"
              :xData="CityXdata"
              :colorList="CityColors"
              :series="CitySeries"
            >
            </bar-chart>
          </el-skeleton>
        </el-card>
      </el-col>
      <!-- TOP10行业投放占比 -->
      <el-col :md="12" :lg="12" :xl="12" style="margin-bottom: 20px">
        <el-card>
          <template #header>
            <div class="header">
              <span class="title">TOP10行业投放占比</span>
              <router-link
                :to="{
                  path: `/user-portrait/detail`,
                  query: { id: 'TOP10Industry' },
                }"
                class="routerPointer"
              >
                <span></span>
                <span></span>
                <span></span>
              </router-link>
            </div>
          </template>
          <el-skeleton animated :rows="20" :loading="false">
            <el-select
              v-model="IndustryTime"
              placeholder="最近30天"
              @change="IndustryTimeChange()"
            >
              <el-option
                v-for="item in IndustryTimeList"
                :key="item.value"
                :label="item.lable"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <circle-chart
              id="chart22"
              Unit="台"
              :itemGap="Industryseries.length <= 10 ? 50 : 30"
              :series="Industryseries"
              :colors="IndustryColors"
              legendLeft="65%"
            >
            </circle-chart>
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Card from "./components/Card.vue";
import LineChart from "./components/LineChart";
import Search from "./components/search.vue";
import BarChart from "./components/barChart.vue";
import CircleChart from "./components/circleCharts.vue";
import {
  getSixTrendChartsOfAdvertisingPlan,
  getEquipmentInCityTop10,
  getEquipmentInIndustryTop10,
} from "@/api/userPortrait";

export default {
  components: {
    Card,
    LineChart,
    Search,
    BarChart,
    CircleChart,
  },
  data() {
    return {
      loading: {
        trendLoading: false,
        top10CityLoading: false,
        top10IndustryLoading: false,
      },
      title: ["设备", "广告位"],
      trendLegend: ["设备总量", "已投放设备量", "订单投放设备量"],
      trendData: [],
      tableSelect: 0,
      lineColorList: ["#1F5DEA", "#52CCA3", "#FACC14"],
      XData: [],
      series: [],
      collapseTitle: "展开明细",
      trendList: [],
      trendListTemp: [],
      pageInfor: {
        total: 200,
        index: 1,
      },
      // top 10 city
      CityTime: "",
      CityTimeList: [
        {
          lable: "最近30天",
          value: "30",
        },
        {
          lable: "最近7天",
          value: "7",
        },
        // {
        //   lable: "昨日",
        //   value: "1",
        // },
      ],
      CityXdata: [],
      CityColors: ["#1F5DEA", "#52CCA3", "#FACC14"],
      CitySeries: [],
      // top 10 industry
      IndustryTime: "",
      IndustryTimeList: [
        {
          lable: "最近30天",
          value: "30",
        },
        {
          lable: "最近7天",
          value: "7",
        },
        // {
        //   lable: "昨日",
        //   value: "1",
        // },
      ],
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
      Industryseries: [],
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
    getTop10City(params) {
      getEquipmentInCityTop10(params).then((_) => {
        this.loading.top10CityLoading = true;
        let arr = [];
        this.CityXdata = _.data.map((_) => _.city);
        let trend0 = _.data.map((_) => _.midCounts);
        let trend1 = _.data.map((_) => _.midAlreadyCounts);
        let trend2 = _.data.map((_) => _.midAlreadyOrderCounts);
        arr.push(this.createBar(this.trendLegend[0], trend0));
        arr.push(this.createBar(this.trendLegend[1], trend1));
        arr.push(this.createBar(this.trendLegend[2], trend2));
        this.CitySeries = arr;
        this.loading.top10CityLoading = false;
      });
    },
    getTop10Industry(params) {
      getEquipmentInIndustryTop10(params).then((_) => {
        this.loading.top10IndustryLoading = true;
        this.Industryseries = _.data.map((_) => {
          return { name: _.industry, proportion: 15, value: _.midCounts };
        });
        this.loading.top10IndustryLoading = false;
      });
    },
    search(params) {
      this.getTrendChartOfAdvertisingPlan(params);
    },
    creatSmooth(name, data, color) {
      return {
        name: name,
        type: "line",
        data: data,
        smooth: true,
        lineStyle: {
          color: {
            colorStops: [
              {
                offset: 0,
                color: "#fff",
              },
              {
                offset: 0.5,
                color: color,
              },
              {
                offset: 1,
                color: color,
              },
            ],
          },
        },
      };
    },
    async getTrendChartOfAdvertisingPlan(params) {
      const { data } = await getSixTrendChartsOfAdvertisingPlan({
        ...params,
      });
      this.trendData = data;
      this.XData = data.date;
      let name = this.trendLegend;
      let arr = [];
      if (this.tableSelect == 0) {
        arr.push(this.creatSmooth(name[0], data.data.midCounts, "#1F5DEA"));
        arr.push(
          this.creatSmooth(name[1], data.data.midAlreadyCounts, "#52CCA3")
        );
        arr.push(
          this.creatSmooth(name[2], data.data.midAlreadyOrderCounts, "#FACC14")
        );
        this.series = arr;
      }
      if (this.tableSelect == 1) {
        arr.push(this.creatSmooth(name[0], data.data.adsCounts, "#1F5DEA"));
        arr.push(
          this.creatSmooth(name[1], data.data.adsAlreadyCounts, "#52CCA3")
        );
        arr.push(
          this.creatSmooth(name[2], data.data.adsAlreadyOrderCounts, "#FACC14")
        );
        this.series = arr;
      }
      this.trendList = [];
      for (let i = 0; i < data.date.length; i++) {
        this.trendList.push({
          dt: data.date[i],
          adsAlreadyCounts: data.data.adsAlreadyCounts[i],
          adsAlreadyOrderCounts: data.data.adsAlreadyOrderCounts[i],
          adsCounts: data.data.adsCounts[i],
          midAlreadyCounts: data.data.midAlreadyCounts[i],
          midAlreadyOrderCounts: data.data.midAlreadyOrderCounts[i],
          midCounts: data.data.midCounts[i],
        });
      }
      this.pageInfor.total = this.trendList.length;
      this.trendList = this.trendList.reverse();
      this.trendListTemp = this.trendList.slice(0, 10);
    },
    sizeChange(val) {
      this.trendListTemp = this.trendList.slice(val * 10 - 10, val * 10);
    },
    isSelect(val) {
      this.tableSelect = val;
      let arr = [];
      if (this.tableSelect == 0) {
        this.trendLegend = ["设备总量", "已投放设备量", "订单投放设备量"];
        let name = this.trendLegend;
        arr.push(
          this.creatSmooth(name[0], this.trendData.data.midCounts, "#1F5DEA")
        );
        arr.push(
          this.creatSmooth(
            name[1],
            this.trendData.data.midAlreadyCounts,
            "#52CCA3"
          )
        );
        arr.push(
          this.creatSmooth(
            name[2],
            this.trendData.data.midAlreadyOrderCounts,
            "#FACC14"
          )
        );
        this.series = arr;
      }
      if (this.tableSelect == 1) {
        this.trendLegend = ["广告位总量", "已投广告位数量", "订单已投设备量"];
        let name = this.trendLegend;
        arr.push(
          this.creatSmooth(name[0], this.trendData.data.adsCounts, "#1F5DEA")
        );
        arr.push(
          this.creatSmooth(
            name[1],
            this.trendData.data.adsAlreadyCounts,
            "#52CCA3"
          )
        );
        arr.push(
          this.creatSmooth(
            name[2],
            this.trendData.data.adsAlreadyOrderCounts,
            "#FACC14"
          )
        );
        this.series = arr;
      }
    },
    CityTimeChange() {
      this.getTop10City({ periodNum: Number(this.CityTime) });
    },
    IndustryTimeChange() {
      this.getTop10Industry({ periodNum: Number(this.IndustryTime) });
    },
  },
  mounted() {
    this.getTop10City();
    this.getTop10Industry();
  },
};
</script>
<style lang="scss">
.el-card__header {
  padding: 14px 0;
  margin: 0 25px;
}

.el-col {
  border-radius: 8px;
  height: 100%;
}
@media screen and(min-width:900px) and(max-width:990px) {
  .el-col {
    height: auto;
  }
}

.el-card {
  height: 100%;
}

.el-card__body {
  padding: 0px 20px;
  margin: 20px;
}
.el-collapse {
  border-top: none;
  .el-collapse-item__header {
    border-bottom: none;
  }
  .el-collapse-item__wrap {
    border-bottom: none;
  }
}
</style>
<style lang="scss" scoped>
.container {
  .header {
    display: flex;
    justify-content: space-between;
    .routerPointer {
      span {
        display: inline-block;
        background: #c5c5c5;
        border-radius: 50%;
        height: 4px;
        width: 4px;
        margin: 0 1px;
      }
    }
  }
  width: 100%;
  ::v-deep .collapseText .el-collapse-item__header {
    color: #409eff;
    // display: block;
    // text-align: center;
  }
  ::v-deep .collapseWarp .el-collapse {
    border: 0;
  }
  .pageContainer {
    display: flex;
    justify-content: right;
    margin-top: 20px;
    margin-bottom: 20px;
    // padding-bottom: 15px;
    //  border-bottom: 1px dashed  rgb(221, 221, 221);
  }
}
</style>
