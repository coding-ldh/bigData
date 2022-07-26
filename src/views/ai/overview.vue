<template>
  <div class="container">
    <div class="profile_data_container">
      <div class="text">
        数据概况
        <tool-tip :content="tips"></tool-tip>
      </div>
      <ul v-if="totalData != null">
        <li>
          <div class="type_container">对话交互总次数</div>
          <div class="current_hours">2021.5.24 至今日 {{ currentTime }}</div>
          <div class="count">{{ totalData.dailyAllNum }}次</div>
        </li>
        <li>
          <div class="type_container">语音上报设备总量</div>
          <div class="current_hours">2021.5.24 至今日 {{ currentTime }}</div>
          <div class="count">{{ totalData.devicesNum }}台</div>
        </li>
        <li>
          <div class="type_container">今日交互次数</div>
          <div class="current_hours">截止到{{ currentTime }}</div>
          <div class="count">{{ totalData.todayDailyAllNum }}次</div>
        </li>
        <li>
          <div class="type_container">今日有效对话占比</div>
          <div class="current_hours">截止到{{ currentTime }}</div>
          <div class="count">{{ totalData.todayDailyValidRate }}%</div>
        </li>
      </ul>
    </div>
    <div class="time_container">
      <time-select
        @childChangePeriod="changePeriod"
        @childChangeDateRange="changeDateRange"
      ></time-select>
    </div>
    <!-- 趋势图 -->
    <div class="trend_container">
      <div style="display: flex; justify-content: space-between">
        <ul class="tabs">
          <li
            v-for="(item, index) in tabList"
            :key="item"
            @click="changeTab(index)"
            :class="activeTabIndex == index ? 'active' : ''"
          >
            {{ item }}
          </li>
        </ul>
      </div>

      <line-chart
        id="chart11"
        title="趋势图"
        formatter="{value}次"
        :legendData="trendLegendData"
        :series="trendChartYData"
        :trendXData="trendXData"
        :colorList="trendColorList"
        :noMerge="true"
        flex_title_justify_content="left"
        v-if="trendChartYData.length != 0"
      >
        <tool-tip v-if="trendLegendData.length == 4" :content="tip"></tool-tip>
      </line-chart>
    </div>
    <div style="padding: 0 20px; background: #fff">
      <el-collapse
        @change="
          collapseTitle = collapseTitle == '展开明细' ? '收起明细' : '展开明细'
        "
      >
        <el-collapse-item :title="collapseTitle" class="collapseText">
          <div style="float: right; padding: 10px">
            <el-button type="primary" @click="exportData">导出列表</el-button>
          </div>
          <el-table stripe style="width: 100%" :data="trendListTemp">
            <el-table-column label="时间" prop="dt" align="center" />
            <el-table-column
              label="对话交互次数"
              prop="dailyAllNumArr"
              align="center"
            />
            <el-table-column
              label="有回复的对话总数"
              prop="ciotAnsInteractionArr"
              align="center"
            />
            <el-table-column
              label="语义成功返回次数"
              prop="dailyValidNumArr"
              align="center"
            />
            <el-table-column
              label="语义识别但APP功能关闭对话次数"
              prop="functionOffInteractionArr"
              align="center"
            />
            <el-table-column
              label="语义识别但APP未配置对话次数"
              prop="unconfiguredInteractionArr"
              align="center"
            />
            <el-table-column
              label="闲聊总次数"
              prop="allChatInteractionArr"
              align="center"
            />
            <el-table-column
              label="语义已识别但功能关闭的的闲聊"
              prop="functionChatInteractionArr"
              align="center"
            />
            <el-table-column
              label="语义已识别但APP未配置的闲聊"
              prop="unconfiguredChatInteractionArr"
              align="center"
            />
            <el-table-column
              label="语义识别失败的闲聊次数"
              prop="unsuccessChatInteractionArr"
              align="center"
            />
          </el-table>
          <div class="pageContainer">
            <el-pagination
              :current-page="1"
              background
              layout="total, prev,pager, next"
              :total="trendPageInfor.total"
              :hide-on-single-page="true"
              @current-change="sizeChange"
            >
            </el-pagination>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>

    <ul v-if="effectData != null" class="talk_effect_container">
      <li>
        <div class="left_container">
          对话交互总次数-按所选时间段
          <div class="count">{{ effectData.allInteraction }}次</div>
        </div>
      </li>
      <li>
        <div class="left_container">
          平均单个交互时长
          <div class="count">
            {{ effectData.avgSingleInteractionDuration }}ms
          </div>
        </div>
      </li>
      <li>
        <div class="left_container">
          平均单个交互语义相应时长
          <div class="count">{{ effectData.avgSingleTime }}ms</div>
        </div>
      </li>
      <li>
        <div class="left_container">
          有效交互占比<tool-tip
            content="（总对话回复次数-NLU解析后的我不理解的 回复次数）/总对话的回复次数"
          ></tool-tip>
          <div class="count">{{ effectData.dailyValidRate }}%</div>
        </div>
      </li>
      <li>
        <div class="left_container">
          异常对话次数<tool-tip
            content="网络异常，10s以上响应超时，请求异常的交互"
          ></tool-tip>
          <div class="count">{{ effectData.abnormalNumber }}</div>
        </div>
      </li>
      <li>
        <div class="left_container">
          单台机器人日均交互次数<tool-tip
            content="单台机器人日均交互次数"
          ></tool-tip>
          <div class="count">
            {{ effectData.avgDayDevicesDailyAllNumOfRate }}次
          </div>
        </div>
      </li>
    </ul>
    <!-- 各行业对话数量 -->
    <div class="bar_container">
      <bar-chart
        title="各行业对话数量"
        id="chart4"
        yUnit="次"
        :series="industrySeries"
        :xData="industryXValue"
        v-if="industrySeries.length != 0"
      ></bar-chart>
    </div>
    <ul class="num_rank_container">
      <li class="first">
        <top-10
          :tableData="projectChartData"
          :propLableArr="talkTop10"
          title="对话数量Top10项目"
        ></top-10>
      </li>
      <li>
        <top-10
          :tableData="top10List"
          :propLableArr="top10propLabel"
          title="功能触发次数Top10排名"
        ></top-10>
      </li>
    </ul>
  </div>
</template>

<script>
import { userExport } from "@/utils/tool.js";

import CircleChart from "@/components/Charts/CircleChart";
import BarChart from "@/components/Charts/BarChart";
import LineChart from "@/components/Charts/LineChart";
import Top10 from "@/components/Top10";
// import { getLineChartSeriesObj } from "@/utils/tool.js";
import ToolTip from "@/components/ToolTip";

import TimeSelect from "./component/TimeSelect.vue";

import {
  getAiOverviewData,
  dataOfDailyAllNumAndDailyValidNum,
  dateOfIndustryConversation,
  dateOfProjectConversation,
  dataOfdialogueEffect,
  intentionOfTop10List,
} from "@/api/ai";

export default {
  components: {
    LineChart,
    Top10,
    BarChart,
    CircleChart,
    ToolTip,
    TimeSelect,
  },
  data() {
    return {
      date: {
        Period: "30",
        dateRange: ["", ""],
      },
      tabList: ["对话交互", "有效交互次数", "闲聊次数"],
      trendTemp: [],
      trendListTemp: [],
      trendListAll: [],
      trendPageInfor: {
        total: 0,
      },
      collapseTitle: "展开明细",
      activeTabIndex: 0,
      currentTime: "",
      trendLegendData: [],
      effectData: null,
      currentPeriod: 30,
      totalData: null,
      trendChartYData: [],
      trendXData: [],
      trendColorList: [],
      industrySeries: [],
      industryXValue: [],
      projectChartData: [],
      top10List: [],
      top10propLabel: [
        { label: "语音问题名称", prop: "name" },
        { label: "次数", prop: "value" },
      ],
      talkTop10: [
        { label: "业务名称", prop: "name" },
        { label: "次数", prop: "value" },
      ],
      tips: `对话交互总次数：设备收到的全部上报的语音条数。`,
      tip: `语义识别且有效返回：取语义识别成功且给到用户结果的次数。`,
    };
  },
  methods: {
    changeTab(index) {
      this.activeTabIndex = index;
      this.trendChartYData = [];
      if (index == 0) {
        this.trendColorList = ["#3BA0FF"];
        this.trendLegendData = ["对话交互次数"];
        let obj1 = {
          name: this.trendLegendData[0],
          type: "line",
          data: this.trendTemp.dailyAllNumArr,
        };
        this.trendChartYData.push(obj1);
      } else if (index == 1) {
        this.trendColorList = ["#0787ff", "#45b97c", "#decb00", "#27d7c7"];
        this.trendLegendData = [
          "语义识别且有效返回",
          "语义识别但APP功能关闭对话次数",
          "语义识别但APP未配置对话次数",
          "有回复的对话总数",
        ];

        let obj1 = {
          name: this.trendLegendData[0],
          type: "line",
          data: this.trendTemp.dailyValidNumArr,
        };
        let obj2 = {
          name: this.trendLegendData[1],
          type: "line",
          data: this.trendTemp.functionOffInteractionArr,
        };
        let obj3 = {
          name: this.trendLegendData[2],
          type: "line",
          data: this.trendTemp.unconfiguredInteractionArr,
        };
        let obj4 = {
          name: this.trendLegendData[3],
          type: "line",
          data: this.trendTemp.ciotAnsInteractionArr,
        };
        this.trendChartYData.push(obj1);
        this.trendChartYData.push(obj2);
        this.trendChartYData.push(obj3);
        this.trendChartYData.push(obj4);
      } else if (index == 2) {
        this.trendColorList = ["#45b97c", "#f15a22", "#ffd400", "#999d9c"];
        this.trendLegendData = [
          "闲聊总次数",
          "语义已识别但功能关闭的的闲聊",
          "语义已识别但APP未配置",
          "语义识别失败的闲聊次数",
        ];
        let obj1 = {
          name: this.trendLegendData[0],
          type: "line",
          data: this.trendTemp.allChatInteractionArr,
        };
        let obj2 = {
          name: this.trendLegendData[1],
          type: "line",
          data: this.trendTemp.functionChatInteractionArr,
        };
        let obj3 = {
          name: this.trendLegendData[2],
          type: "line",
          data: this.trendTemp.unconfiguredChatInteractionArr,
        };
        let obj4 = {
          name: this.trendLegendData[3],
          type: "line",
          data: this.trendTemp.unsuccessChatInteractionArr,
        };

        if (
          obj1.data.length == 0 ||
          obj2.data.length == 0 ||
          obj3.data.length == 0 ||
          obj4.data.length == 0
        ) {
          this.trendChartYData = [];
        } else {
          this.trendChartYData.push(obj1);
          this.trendChartYData.push(obj2);
          this.trendChartYData.push(obj3);
          this.trendChartYData.push(obj4);
        }
      }
    },
    getTotalData() {
      getAiOverviewData().then(({ data }) => {
        this.totalData = data;
      });
    },
    getTrendChartData(periodNum, beginDate, endDate, random) {
      dataOfDailyAllNumAndDailyValidNum({
        periodNum,
        beginDate,
        endDate,
        random,
      }).then(({ data }) => {
        this.trendListAll = [];
        for (let i = 0; i < data.date.length; i++) {
          this.trendListAll.push({
            dt: data.date[i],
            allChatInteractionArr: data.data.allChatInteractionArr[i],
            ciotAnsInteractionArr: data.data.ciotAnsInteractionArr[i],
            dailyAllNumArr: data.data.dailyAllNumArr[i],
            dailyValidNumArr: data.data.dailyValidNumArr[i],
            functionChatInteractionArr: data.data.functionChatInteractionArr[i],
            functionOffInteractionArr: data.data.functionOffInteractionArr[i],
            unconfiguredChatInteractionArr:
              data.data.unconfiguredChatInteractionArr[i],
            unconfiguredInteractionArr: data.data.unconfiguredInteractionArr[i],
            unsuccessChatInteractionArr:
              data.data.unsuccessChatInteractionArr[i],
          });
        }
        this.trendListAll = this.trendListAll.reverse();
        this.trendListTemp = this.trendListAll.slice(0, 10);
        this.trendPageInfor.total = this.trendListAll.length;
        this.trendChartYData = [];
        this.trendXData = data.date;
        this.trendTemp = data.data;
        this.changeTab(0);
      });
    },
    sizeChange(val) {
      this.trendListTemp = this.trendListAll.slice(val * 10 - 10, val * 10);
    },
    getTalkData(periodNum, beginDate, endDate, random) {
      dateOfIndustryConversation({
        periodNum,
        beginDate,
        endDate,
        random,
      }).then(({ data }) => {
        let arr = [];
        this.industrySeries = [];
        this.industryXValue = [];
        data.map((item) => {
          arr.push(item.value);
          this.industryXValue.push(item.name);
        });
        let obj = {
          name: "对话次数",
          data: arr,
          type: "bar",
          barWidth: 35, //柱图宽度
        };
        this.industrySeries.push(obj);
      });
    },
    getProjectChartData(periodNum, beginDate, endDate, random) {
      dateOfProjectConversation({ periodNum, beginDate, endDate, random }).then(
        ({ data }) => {
          this.projectChartData = data;
        }
      );
    },
    getDialogueEffectData(periodNum, beginDate, endDate, random) {
      dataOfdialogueEffect({ periodNum, beginDate, endDate, random }).then(
        ({ data }) => {
          this.effectData = data;
        }
      );
    },
    getIntentionTop10(periodNum, beginDate, endDate, random) {
      intentionOfTop10List({ periodNum, beginDate, endDate, random }).then(
        ({ data }) => {
          this.top10List = data;
        }
      );
    },
    switchPeriod(periodNum, beginDate = "", endDate = "", random) {
      this.currentPeriod = periodNum;
      this.getTrendChartData(periodNum, beginDate, endDate, random);
      this.getTalkData(periodNum, beginDate, endDate, random);
      this.getProjectChartData(periodNum, beginDate, endDate, random);
      this.getDialogueEffectData(periodNum, beginDate, endDate, random);
      this.getIntentionTop10(periodNum, beginDate, endDate, random);
    },
    changePeriod(val) {
      this.date.Period = val;
      this.date.dateRange = ["", ""];
      this.switchPeriod(val);
    },
    changeDateRange(val) {
      // const data = new Date();
      // const y = data.getFullYear();
      // const m = data.getMonth() + 1;
      // const d = data.getDate();
      const startDate = Date.parse(val[0]);
      const endDate = Date.parse(val[1]);
      // const nowDate = Date.parse(`${y}-${m}-${d}`);
      const day =
        startDate == endDate
          ? 1
          : (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1;
      this.date.Period = day;
      this.date.dateRange = [val[0], val[1]];
      this.switchPeriod(day, val[0], val[1], true);
    },
    exportData() {
      this.$message.success(`导出中，请稍等`);
      let random = this.date.dateRange[0] != "" ? true : false;
      let url =
        `/aiOverview/dataOfDailyAllNumAndDailyValidNum/export?` +
        `&fileName=AI数据概览趋势图` +
        `&beginDate=${this.date.dateRange[0]}` +
        `&endDate=${this.date.dateRange[1]}` +
        `&periodNum=${this.date.Period}` +
        `&random=${random}`;
      // console.log(url);
      userExport(url);
    },
  },
  created() {
    this.currentTime = new Date().getHours() + ":00:00";
    this.getTotalData();
    this.switchPeriod(30);
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
::v-deep .collapseText .el-collapse-item__header {
  color: #409eff;
  // display: block;
  // text-align: center;
}
.container {
  width: 100%;
  .profile_data_container {
    height: 191px;
    background-color: #fff;
    padding: 30px 30px 40px;
    display: flex;
    flex-direction: column;
    .text {
      font-size: 20px;
      color: #333;
    }
    ul {
      display: flex;
      margin-top: 30px;
      flex: 1;
      justify-content: space-between;
      li {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .type_container {
          text-align: center;
          font-size: 14px;
        }
        .current_hours {
          color: #999999;
          font-size: 12px;
          margin-top: 10px;
          margin-bottom: 10px;
          text-align: center;
        }
        .count {
          font-size: 20px;
          color: #3ba0ff;
          font-weight: bolder;
          text-align: center;
        }
      }
    }
  }
  .time_container {
    height: 70px;
    background-color: #fff;
    margin-bottom: 10px;
    margin-top: 10px;
    font-size: 14px;
    color: #333;
    display: flex;
    align-items: center;
    padding-left: 30px;
    // ul {
    //   display: flex;
    //   li {
    //     width: 80px;
    //     height: 40px;
    //     background-color: #ffffff;
    //     border: 1px solid #dddddd;
    //     border-radius: 3px;
    //     line-height: 40px;
    //     text-align: center;
    //     margin-left: 10px;
    //     cursor: pointer;
    //     color: #ddd;
    //   }
    //   li.active {
    //     color: #3ba0ff;
    //     border-color: #3ba0ff;
    //   }
    // }
  }
  .trend_container {
    // height: 443px;
    background-color: #fff;
    padding-bottom: 15px;
    .tabs {
      display: flex;
      // justify-content: center;
      margin: 15px;
      margin-bottom: 0;
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
      li:last-child {
        border-left: none;
      }
      li.active {
        background-color: rgb(16, 142, 233);
        border-color: rgb(16, 142, 233);
        color: #fff;
      }
    }
  }

  .talk_effect_container {
    height: 106px;
    margin-top: 10px;
    display: flex;
    li {
      flex: 1;
      display: flex;
      background-color: #fff;
      justify-content: center;
      align-items: center;
      margin-right: 11px;
      .left_container {
        color: #666666;
        font-size: 14px;
        .count {
          color: #3ba0ff;
          font-size: 20px;
          margin-top: 8px;
          font-weight: bolder;
          text-align: center;
        }
      }
    }
    li:last-child {
      margin-right: 0;
    }
  }
  .bar_container {
    height: 420px;
    background-color: #fff;
    margin-top: 10px;
  }
  .num_rank_container {
    margin-top: 10px;
    display: flex;
    li {
      background-color: #fff;
      flex: 1;
      padding-bottom: 44px;
    }
    li.first {
      margin-right: 11px;
    }
  }
}
.pageContainer {
  display: flex;
  justify-content: right;
  margin-top: 20px;
  margin-bottom: 20px;
  // padding-bottom: 15px;
  //  border-bottom: 1px dashed  rgb(221, 221, 221);
}
</style>
