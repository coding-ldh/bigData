<template>
  <div class="container" id="pdf-container">
    <div class="top_charts">
      <div class="top_title">设备分析</div>
      <div class="month_year_trend_container">
        <div class="tabs_date">
          <ul class="tabs">
            <li
              v-for="(item, index) in tabList"
              :key="item.value"
              @click="changeTab(index)"
              :class="activeTabIndex == index ? 'active' : ''"
            >
              {{ item }}
            </li>
          </ul>
          <time-select
            @childChangePeriod="changePeriod"
            @childChangeDateRange="changeDateRange"
          ></time-select>
        </div>
        <line-area
          v-loading="topLoading"
          id="chart1"
          title="趋势图"
          ref="monthYear"
          :series="monthYearYData"
          :colorList="monthYearColorList"
          :trendXData="monthYearXData"
          :formatter="trendFormatter"
        ></line-area>
      </div>
    </div>
    <div class="circle_charts shadow_charts">
      <ul class="chart_container second_chart_container">
        <li class="first">
          <div style="margin: 20px 20px 0px 20px">设备类型占比</div>
          <div class="tabs_date">
            <div>
              <ul class="tabs">
                <li
                  v-for="(item, index) in leftTabList"
                  :key="item.value"
                  @click="leftChangeTab(index)"
                  :class="leftActiveTabIndex == index ? 'active' : ''"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <div class="chartsLoading" v-loading="leftLoading">
            <circle-chart
              id="chart3"
              class="charts_bars"
              :chartData="dailyFlowData"
              :barGraphic="barGraphic"
              v-if="dailyFlowData.length != 0"
              :colors="chartOneColors"
              :total="equipmentNumber"
            ></circle-chart>
          </div>
        </li>
        <!-- <li class="second">
          <div style="margin: 20px 20px 0px 20px">转化分析-全部设备</div>
          <div class="tabs_date">
            <div>
              <ul class="tabs">
                <li
                  v-for="(item, index) in rightTabList"
                  :key="item.value"
                  @click="rightChangeTab(index)"
                  :class="rightActiveTabIndex == index ? 'active' : ''"
                >
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>
          <div class="chartsLoading" v-loading="rightLoading">
            <shadow-chart
              id="chart4"
              :chartData="shadowFlowData"
              v-if="shadowFlowData.length != 0"
              :colors="chartOneColors"
            ></shadow-chart>
          </div>
        </li> -->
      </ul>
    </div>
    <div class="bottom_data_List">
      <div class="bottom_title">出库设备情况</div>
      <div class="bottom_title_container">
        <div class="bottom_title_tabs_date">
          <ul class="bottom_title_tabs">
            <li
              v-for="(item, index) in bottomTabList"
              :key="item.value"
              @click="bottomChangeTab(index)"
              :class="bottomActiveTabIndex == index ? 'active' : ''"
            >
              {{ item }}
            </li>
          </ul>
          
        </div>
        <div class="deal_data_list" v-loading="bottomLoading">
          <!-- <div class="sale_data_list">
            <div class="deal_data_list_title">销售成交量排名</div>
            <ul>
              <li v-for="(item, index) in saleTableList.sale" :key="item.id">
                <span class="data_list_tip" :class="index + 1 <= 3 ? 'active' : ''">{{ index + 1 }}</span>
                <span>{{ item.name }}</span>
                <span class="data_list_number">{{ item.value }}</span>
              </li>
            </ul>
          </div> -->
          <div class="customer_data_list">
            <div class="deal_data_list_title">客户成交量排名</div>
            <ul>
              <li
                v-for="(item, index) in saleTableList.customer"
                :key="item.id"
              >
                <span
                  class="data_list_tip"
                  :class="index < 3 ? 'active' : ''"
                  >{{ index + 1 }}</span
                >
                <span :title="item.name">{{ item.name }}</span>
                <span class="data_list_number">{{ item.value }}</span>
              </li>
            </ul>
          </div>
          <div class="city_data_list">
            <div class="deal_data_list_title">城市成交量排名</div>
            <ul>
              <li v-for="(item, index) in saleTableList.city" :key="item.name">
                <span
                  class="data_list_tip"
                  :class="index < 3 ? 'active' : ''"
                  >{{ index + 1 }}</span
                >
                <span>{{ item.name }}</span>
                <span class="data_list_number">{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lineArea from "./components/lineAreaCharts.vue";
import LineChart from "@/components/Charts/LineChart.vue";
import CircleChart from "./components/circleCharts.vue";
import ShadowChart from "./components/shadowChart.vue";
import TimeSelect from "./components/TimeSelect.vue";
import { getCurrentDate } from "@/utils/tool.js";

import {
  getAnalysisDevice,
  getDeviceTypeRatioActivation,
  getDeviceTypeRatioOut,
  getTransformAnalyseOut,
  getOutDeviceSituation,
} from "@/api/equipment/index.js";
export default {
  components: {
    lineArea,
    LineChart,
    CircleChart,
    ShadowChart,
    TimeSelect,
  },
  data() {
    return {
      // loading控制
      topLoading: false,
      leftLoading: false,
      rightLoading: false,
      bottomLoading: false,
      // 默认配置属性
      chartOneColors: [
        // chart的颜色
        "#3BA0FF",
        "#36CBCB",
        "#4DCB73",
        "#FAD337",
        "#F2637B",
        "#975FE4",
        "#FFA15A",
      ],
      barGraphic: [
        // bar圆图中间文字
        {
          type: "text",
          left: "center",
          top: "40%",
          style: {
            text: "设备量",
            textAlign: "center",
            fill: "rgba(0, 0, 0, 0.42745098039215684)",
            width: 30,
            height: 30,
            fontSize: 16,
          },
        },
        {
          type: "text",
          left: "center",
          top: "55%",
          style: {
            text: "",
            textAlign: "center",
            fill: "rgba(0, 0, 0, 0.8470588235)",
            width: 30,
            height: 30,
            fontSize: 20,
          },
        },
      ],
      equipmentNumber: 0,
      value: "", // 选择时间周期的默认值
      tabList: ["累计激活设备", "累计未激活设备", "激活设备量变化"],
      leftTabList: [
        "累计激活设备",
        // "出库设备-最近30天"
      ],
      rightTabList: [
        "累计激活设备",
        // "出库设备-最近30天"
      ],
      bottomTabList: [
        "累计激活设备",
        // "出库设备-最近30天"
      ],
      trendFormatter: "{value}台", // charts的单位
      // 更换标签
      activeTabIndex: 0, // 点击切换标签-顶部
      leftActiveTabIndex: 0, // 点击切换标签-左
      rightActiveTabIndex: 0, // 点击切换标签-右
      bottomActiveTabIndex: 0, // 点击切换标签-底
      // top line charts
      monthYearColorList: ["#1477E3"],
      LineChartDataList: [],
      monthYearYData: [
        {
          name: "空数据",
          type: "line",
          data: [100, 200],
        },
      ],
      monthYearXData: ["空数据日期", "空数据日期"],
      // 日期参数
      queryInfor: {
        startTime: "",
        endTime: "",
      },
      // 左侧圆饼图
      dailyFlowData: [
        // {
        //   name: "乐乐",
        //   value: 294166
        // }
      ],
      // 右侧横向柱形图
      shadowFlowData: [
        // {
        //   name: "其他",
        //   value: 15
        // }
      ],
      shadowFlowDataAllList: [],
      // 出库设备情况
      saleTableList: {
        // sale: [{name: "张三", value: "99台" }],
        // customer: [{ name: "张三", value: "99台" }],
        // city: [{name: "北京", value: "99台" }]
      },
    };
  },
  methods: {
    // 初始化全部数据
    initData() {
      this.topLoading = true;
      this.leftLoading = true;
      this.rightLoading = true;
      this.bottomLoading = true;
      this.initTopChartData();
      this.initLeftCharts();
      this.initRightCharts();
      this.initBottomList();
    },
    // ***** 顶部数据初始化 *****
    initTopChartData() {
      //顶部初始化
      // 初始化lin charts 数据
      this.activeTabIndex = 0;
      let { startTime, endTime } = this.queryInfor;
      getAnalysisDevice({ startTime, endTime }).then((data) => {
        this.LineChartDataList = [];
        this.LineChartDataList.push(data.data.countActive);
        this.LineChartDataList.push(data.data.countInactivate);
        this.LineChartDataList.push(data.data.deviceNumVariation);
        this.changeTab(0);
      });
    },
    // 切换时触发
    changeTab(index) {
      this.topLoading = true;
      this.activeTabIndex = index; // 选择框颜色
      this.monthYearYData = [
        {
          name: this.tabList[index],
          type: "line",
          data: this.LineChartDataList[index].map((data) => {
            return data.mid;
          }),
        },
      ];
      this.monthYearXData = this.LineChartDataList[index].map((data) => {
        return `${data.dt.slice(5, 7)}月${data.dt.slice(8, 10)}日`;
      });
      this.topLoading = false;
    },
    // ***** 左侧图表数据初始化 *****
    initLeftCharts() {
      this.leftChangeTab(0);
    },
    // 切换时触发
    // 对后端数据进行排序
    QuickSortBToS(array) {
      if (array.length <= 1) {
        return array;
      }
      const pivotIndex = Math.floor(array.length / 2);
      const pivot = array.splice(pivotIndex, 1)[0];
      const left = [];
      const right = [];
      array.forEach((item) => {
        item.deviceDataNum > pivot.deviceDataNum
          ? left.push(item)
          : right.push(item);
      });
      return this.QuickSortBToS(left).concat(pivot, this.QuickSortBToS(right));
    },
    leftChangeTab(index) {
      this.leftLoading = true;
      this.leftActiveTabIndex = index;
      if (index == 0) {
        getDeviceTypeRatioActivation().then((data) => {
          this.leftLoading = false;
          data.data.percentOfDeviceData = this.QuickSortBToS(
            data.data.percentOfDeviceData
          );
          this.dailyFlowData = data.data.percentOfDeviceData.map((data) => {
            return {
              name: data.deviceType,
              proportion: data.proportion,
              value: data.deviceDataNum,
            };
          });
          this.getMachineNumber(data.data.totalNum);
        });
      } else if (index == 1) {
        getDeviceTypeRatioOut().then((data) => {
          this.leftLoading = false;
          this.dailyFlowData = data.data.latelyDeviceData.map((data) => {
            return {
              name: data.deviceType,
              proportion: data.proportion,
              value: data.checkOutDeviceDataNum,
            };
          });
          this.getMachineNumber(data.data.latelyTotalNum);
        });
      }
    },
    // 设置总设备量
    getMachineNumber(val) {
      this.equipmentNumber = val;
      this.barGraphic[1].style.text = val + "台";
    },
    // ***** 右侧图表数据初始化 *****
    initRightCharts() {
      this.rightChangeTab(0);
    },
    rightChangeTab(index) {
      // 待测试
      this.rightLoading = true;
      this.rightActiveTabIndex = index;
      if (index == 0) {
        getTransformAnalyseOut().then((data) => {
          this.shadowFlowData = data.data.totalDeviceNum.map((data) => {
            return {
              name: data.installType,
              value: data.mid,
            };
          });
          this.shadowFlowData.reverse();
          this.rightLoading = false;
        });
      } else if (index == 1) {
        getTransformAnalyseOut().then((data) => {
          this.shadowFlowData = data.data.checkoutDeviceNum.map((data) => {
            return {
              name: data.installType,
              value: data.mid,
            };
          });
          this.shadowFlowData.reverse();
          this.rightLoading = false;
        });
      }
    },
    initBottomList() {
      this.bottomLoading = true;
      getOutDeviceSituation().then((data) => {
        this.shadowFlowDataAllList = data.data;
        this.bottomChangeTab(0);
      });
    },
    bottomChangeTab(index) {
      this.bottomActiveTabIndex = index;
      if (index == 0) {
        this.saleTableList.sale = this.shadowFlowDataAllList.salesCount.map(
          (data) => {
            return {
              name: data.salesPerson,
              value: `${data.mid}台`,
            };
          }
        );
        this.saleTableList.customer =
          this.shadowFlowDataAllList.companyCount.map((data) => {
            return {
              name: data.projectCompany,
              value: `${data.mid}台`,
            };
          });
        this.saleTableList.city = this.shadowFlowDataAllList.cityCount.map(
          (data) => {
            return {
              name: data.projectCity,
              value: `${data.mid}台`,
            };
          }
        );
        this.bottomLoading = false;
      } else if (index == 1) {
        this.saleTableList.sale =
          this.shadowFlowDataAllList.checkoutSalesCount.map((data) => {
            return {
              name: data.salesPerson,
              value: `${data.mid}台`,
            };
          });
        this.saleTableList.customer =
          this.shadowFlowDataAllList.checkoutCompanyCount.map((data) => {
            return {
              name: data.projectCompany,
              value: `${data.mid}台`,
            };
          });
        this.saleTableList.city =
          this.shadowFlowDataAllList.checkoutCityCount.map((data) => {
            return {
              name: data.projectCity,
              value: `${data.mid}台`,
            };
          });
        this.bottomLoading = false;
      }
    },
    changePeriod(val) {
      if (val != -1) {
        this.queryInfor.startTime = getCurrentDate(val * 24);
        this.queryInfor.endTime = getCurrentDate(1);
        this.initData();
      }
    },
    changeDateRange(val) {
      //时间选择
      this.queryInfor.startTime = val[0];
      this.queryInfor.endTime = val[1];
      this.initData();
    },
  },
  created() {},
  mounted() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  background-color: #f0f2f5;
  font-size: 20px;
  color: #333;
  .top_charts {
    background: #fff;
    .top_title {
      margin: 20px 20px 0px 20px;
    }
    .month_year_trend_container {
      padding-top: 20px;
      .tabs_date {
        flex-wrap: wrap;
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
      }
      .tabs {
        display: flex;
        justify-content: center;
        margin-bottom: 15px;
        li {
          width: 166px;
          height: 41px;
          font-size: 14px;
          border: 1px solid rgb(121, 121, 121);
          text-align: center;
          line-height: 41px;
          cursor: pointer;
        }
        li:first-child {
          border-right: none;
        }
        li:last-child{
        border-left: none;
      }
        li.active {
          background-color: rgb(16, 142, 233);
          border-color: rgb(16, 142, 233);
          color: #fff;
        }
      }
    }
  }
  .circle_charts {
    // margin-top: 5px;
    .chart_container {
      display: flex;
      margin-bottom: 0px;

      li {
        flex: 1;
        width: 50%;
        height: 515px;
        background-color: #fff;
        margin-top: 10px;
        .chartsLoading {
          height: 400px;
        }
        .title {
          color: #333333;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 21px;
          padding-left: 30px;
          padding-top: 20px;
        }
        .tabs_date {
          display: flex;
          justify-content: space-between;
          padding-left: 20px;
          padding-right: 20px;
          padding-top: 20px;
        }
        .tabs {
          display: flex;
          justify-content: center;
          li {
            width: 166px;
            height: 41px;
            font-size: 14px;
            border: 1px solid rgb(121, 121, 121);
            text-align: center;
            line-height: 41px;
            cursor: pointer;
          }
          li:first-child {
            border-right: none;
          }
          li:last-child{
        border-left: none;
      }
          li.active {
            background-color: rgb(16, 142, 233);
            border-color: rgb(16, 142, 233);
            color: #fff;
          }
        }
      }
      li.first {
        margin-right: 11px;
        margin-bottom: 10px;
        .charts_bars canvas {
          margin-left: -150px;
        }
      }
    }
  }
  .bottom_data_List {
    background: #fff;
    .bottom_title {
      margin: 20px 20px 0px 20px;
    }
    .bottom_title_container {
      padding-top: 20px;
      .bottom_title_tabs_date {
        display: flex;
        justify-content: space-between;
        padding-left: 20px;
        padding-right: 20px;
      }
      .bottom_title_tabs {
        display: flex;
        justify-content: center;
        li {
          width: 166px;
          height: 41px;
          font-size: 14px;
          border: 1px solid rgb(121, 121, 121);
          text-align: center;
          line-height: 41px;
          cursor: pointer;
        }
        li:first-child {
          border-right: none;
        }
        li:last-child{
        border-left: none;
      }
        li.active {
          background-color: rgb(16, 142, 233);
          border-color: rgb(16, 142, 233);
          color: #fff;
        }
      }
      .deal_data_list {
        display: flex;
        width: 100%;
        padding: 20px;
        margin-bottom: 80px;
        .deal_data_list_title {
          text-align: left;
          padding: 5px 0px 5px 30px;
          font-weight: 600;
          font-size: 14px;
        }

        .sale_data_list,
        .customer_data_list,
        .city_data_list {
          width: 50%;
          display: inline-block;
          padding: 5px 5px 5px 15px;
          ul li {
            display: flex;
          }
          ul li span {
            display: inline-block;
            width: 57%;
            height: 35px;
            line-height: 35px;
            text-align: left;
            margin: 5px 0px 5px 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-size: 14px;
            // color:#7d7d7d;
          }
          ul li span:nth-child(1) {
            font-size: 16px;
          }
          .data_list_tip {
            margin-left: 25px;
            margin-right: 25px;
            height: 35px;
            width: 35px;
            border-radius: 2000px;
            text-align: center;
            border: 1px;
            background: #f0f2f5;
            color: #665a6e;
          }
          .data_list_number {
            width: 30%;
            text-align: left;
            // padding-left: 190px;
          }
          ul li .active {
            background: #314659;
            color: white;
          }
        }
      }
    }
  }
}
</style>
