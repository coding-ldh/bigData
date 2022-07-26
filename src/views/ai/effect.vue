<template>
  <div class="container">
    <div class="query_container">
      <div class="text">对话效果</div>
      <el-form
        :inline="true"
        :model="queryInfor"
        class="demo-form-inline"
        label-position="right"
      >
        <el-form-item label="机器人：">
          <el-input
            v-model="queryInfor.mid"
            placeholder="请输入机器人ID"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="交互类型">
          <el-select
            v-model="queryInfor.triggerBusinessType"
            collapse-tags
            multiple
            placeholder="请选择交互类型"
          >
            <el-option
              v-for="(item, index) in filterData.triggerBusinessTypeArr"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="行业：">
          <el-select
            v-model="queryInfor.projectIndustry"
            placeholder="活动区域"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item, index) in filterData.projectIndustryArr"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="版本号：">
          <el-select v-model="queryInfor.version" placeholder="全部版本">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item, index) in filterData.version"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场景：">
          <el-select v-model="queryInfor.projectScene" placeholder="全部场景">
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item, index) in filterData.projectScene"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间：">
          <time-select
            @childChangePeriod="changePeriod"
            @childChangeDateRange="changeDateRange"
            :resetIndex="resetIndex"
            :defaultTime="24"
          ></time-select>
          <!-- <ul class="timeontainer">
            <li
              v-for="item in periodNumList"
              :class="item.value == queryInfor.periodNum ? 'active' : ''"
              @click="switchPeriod(item.value)"
              :key="item.value"
            >
              {{ item.label }}
            </li>
          </ul>-->
        </el-form-item>
        <el-form-item label="地区">
          <my-area
            @fromChildArea="getAreaData"
            methodName="getAreaOption"
            ref="areaRef"
          ></my-area>
        </el-form-item>
        <el-form-item label="项目名称：">
          <el-select
            v-model="queryInfor.projectName"
            filterable
            remote
            reseve-keyword
            allow-create
            placeholder="请输入项目名称"
            :remote-method="changeItem"
            clearable
            :loading="loading.vagueSearchLoading"
          >
            <el-option
              v-for="item in getItem"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="设备类型：">
          <el-select
            v-model="queryInfor.deviceType"
            placeholder="请选择设备类型"
          >
            <el-option label="全部" value></el-option>
            <el-option
              v-for="(item, index) in filterData.deviceTypeArr"
              :label="item"
              :value="item"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchs()">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            plain
            @click="userReset(), (resetIndex = !resetIndex)"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <ul v-if="oviewData != null">
        <li>
          <div class="title">
            交互次数
            <tool-tip content="所选时间段交互次数，和日均设备量"></tool-tip>
          </div>
          <span class="num">{{ oviewData.totalAllInteraction }}次</span>
          <div class="title">
            日活跃设备量：
            <div class="dailyA">{{ oviewData.avgDayDevicesNum }}台</div>
          </div>
        </li>
        <li>
          <div class="title">
            有效对话占比
            <tool-tip
              content="（总回复数-我不...的 回复次数）/总交互的回复次数"
            ></tool-tip>
          </div>
          <span class="num">{{ oviewData.validInteractionRate }}%</span>
        </li>
        <li>
          <div class="title">
            异常对话次数
            <tool-tip
              content="网络异常，10s以上响应超时，请求异常的交互"
            ></tool-tip>
          </div>
          <span class="num">{{ oviewData.abnormalNumber }}</span>
        </li>
        <li>
          <div class="title">
            语音次数/点击次数
            <tool-tip content="语音交互次数和点击交互占比量"></tool-tip>
          </div>
          <span class="num">{{ oviewData.voiceAndClickCount }}</span>
        </li>
        <li>
          <div class="title">
            对话平均响应时间
            <tool-tip
              content="设备收到对话信息后，到结果呈现在用户之前的时长"
            ></tool-tip>
          </div>
          <span class="num"
            >{{ oviewData.avgSingleInteractionDuration }}ms</span
          >
        </li>
        <li>
          <div class="title">
            日均交互时长
            <tool-tip content="总交互时长/天数"></tool-tip>
          </div>
          <span class="num">{{ oviewData.totalAverageResponseTime }}</span>
        </li>
        <li>
          <div class="title">
            单台机器人日均交互次数
            <tool-tip content="日均单个机器人交互次数"></tool-tip>
          </div>
          <span class="num"
            >{{ oviewData.avgDayDevicesDailyAllNumOfRate }}次</span
          >
        </li>
      </ul>
    </div>
    <div class="talk_circle_container">
      <div
        style="
          color: #333;
          font-weight: 700;
          font-size: 16px;
          padding: 20px 0 0 30px;
        "
      >
        功能模块对话次数占比
      </div>
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
      <line-chart
        id="chart1"
        title=""
        formatter="{value}次"
        :legendData="trendLegendData"
        :series="trendChartYData"
        :trendXData="trendXData"
        :colorList="trendColorList"
        :noMerge="true"
        v-if="trendChartYData.length != 0"
        flex_title_justify_content="left"
      ></line-chart>
    </div>
    <ul class="top10_containers">
      <top-10
        title="机器人对话数量Top10"
        :propLableArr="talkPropLabel"
        :tableData="talkRank10Data"
        style="margin-right: 11px"
      >
        <div>
          <el-radio
            v-model="orderBy"
            :label="1"
            :value="1"
            @change="changOrderBy"
            >从高到低</el-radio
          >
          <el-radio
            v-model="orderBy"
            :label="0"
            :value="0"
            @change="changOrderBy"
            >从低到高</el-radio
          >
        </div>
      </top-10>
      <top-10
        title="功能触发次数Top10"
        :propLableArr="intentionPropLabel"
        :tableData="intentionRank10Data"
      ></top-10>
    </ul>
  </div>
</template>

<script>
import Top10 from "@/components/Top10";
import MyArea from "@/components/Area";
import { reset } from "@/utils/tool.js";
import ToolTip from "@/components/ToolTip";
import LineChart from "@/components/Charts/LineChart";
import TimeSelect from "./component/TimeSelect.vue";
import {
  robotConversation,
  getAiSemanticEffectdata,
  aiSemanticEffectFilterValue,
  effectIntentionOfTop10List,
  getProjectNameList,
  getAiEffectTrend,
} from "@/api/ai";
export default {
  components: {
    Top10,
    MyArea,
    ToolTip,
    LineChart,
    TimeSelect,
  },
  data() {
    return {
      tabList: ["有效交互次数", "闲聊次数"],
      activeTabIndex: 0,
      trendColorList: [],
      trendLegendData: [],
      trendXData: [],
      trendTemp: [],
      trendChartYData: [],

      resetIndex: false,
      periodNumList: [
        { label: "近三十天", value: 30 },
        { label: "近七天", value: 7 },
        { label: "昨日", value: 1 },
      ],
      oviewData: null,
      checkAll: false,
      queryInfor: {
        city: "",
        deviceType: "",
        district: "",
        mid: "",
        periodNum: 30,
        projectIndustry: "",
        version: "",
        projectName: "",
        province: "",
        triggerBusinessType: [],
        beginDate: "",
        endDate: "",
        projectScene: "",
      },
      loading: {
        vagueSearchLoading: false,
      },
      getItem: [],
      orderBy: 1,
      talkPropLabel: [
        { prop: "robottype", label: "设备类型" },
        { prop: "conversationNumber", label: "次数" },
      ],
      talkRank10Data: [],
      intentionPropLabel: [
        { prop: "name", label: "语音问题名称" },
        { prop: "value", label: "次数" },
      ],
      intentionRank10Data: [],
      filterData: {},
      talkChartData: [],
      talkChartDatatColors: [
        "#3BA0FF",
        "#36CBCB",
        "#4DCB73",
        "#FAD337",
        "#F2637B",
        "#975FE4",
        "#0080FF",
        "#F8FF3B",
        "#613BFF",
        "#FFA15A",
      ],
    };
  },
  mounted() {
    aiSemanticEffectFilterValue().then(({ data }) => {
      this.filterData = data;
      this.queryInfor.triggerBusinessType =
        this.filterData.triggerBusinessTypeArr;
      this.search();
    });
  },
  methods: {
    changeTab(index) {
      this.activeTabIndex = index;
      this.trendChartYData = [];
      if (index == 0) {
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
          data: this.trendTemp.successInteractionArr,
        };
        this.trendChartYData.push(obj1);
        this.trendChartYData.push(obj2);
        this.trendChartYData.push(obj3);
        this.trendChartYData.push(obj4);
      } else if (index == 1) {
        this.trendColorList = ["#45b97c", "#f15a22", "#ffd400", "#999d9c"];
        this.trendLegendData = [
          "闲聊总次数",
          "语义识别但功能关闭的闲聊次数",
          "语义识别且APP未配置的闲聊次数",
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
        this.trendChartYData.push(obj1);
        this.trendChartYData.push(obj2);
        this.trendChartYData.push(obj3);
        this.trendChartYData.push(obj4);
      }
    },
    async getTrend(param) {
      let { data } = await getAiEffectTrend(param);
      this.trendChartYData = [];
      this.trendXData = data.date;
      this.trendTemp = data.data;
      this.changeTab(0);
    },
    userReset() {
      reset(this.queryInfor);
      this.queryInfor.periodNum = 30;
      this.$refs.areaRef.reset();
      this.search();
    },
    getConversationRank10(random) {
      let types = this.getInteractionTypeStr();
      // console.log(this.queryInfor.triggerBusinessType);
      robotConversation({
        ...this.queryInfor,
        orderBy: this.orderBy,
        triggerBusinessType: types,
        random,
      }).then(({ data }) => {
        this.talkRank10Data = [];
        data.map((item) => {
          this.talkRank10Data.push({
            robottype: `${item.deviceType} - ${item.mid} - ${item.projectIndustry}`,
            conversationNumber: item.allInteraction,
          });
        });
      });
    },
    getInteractionTypeStr() {
      let arr = this.queryInfor.triggerBusinessType.filter(
        (item) => item != ""
      );
      // console.log(this.queryInfor.triggerBusinessType);
      return arr.length == 0 ? undefined : arr.join(",");
    },
    getOviewData(random) {
      let types = this.getInteractionTypeStr();
      getAiSemanticEffectdata({
        ...this.queryInfor,
        triggerBusinessType: types,
        random,
      }).then(({ data }) => {
        this.oviewData = data;
      });
    },
    getIntentionTop10(random) {
      let types = this.getInteractionTypeStr();
      effectIntentionOfTop10List({
        ...this.queryInfor,
        triggerBusinessType: types,
        random,
      }).then(({ data }) => {
        this.intentionRank10Data = [];
        data.map((item) => {
          this.intentionRank10Data.push({
            name: `${item.moduleName}`,
            value: item.allInteraction,
          });
        });
      });
    },

    switchPeriod(val) {
      this.queryInfor.periodNum = val;
    },
    changOrderBy(val) {
      this.orderBy = val;
      this.getConversationRank10();
    },
    getAreaData(arr) {
      if (arr[0] == "全国") {
        this.queryInfor.province = "";
        this.queryInfor.city = "";
        this.queryInfor.district = "";
      } else if (arr[1] == "全部") {
        this.queryInfor.province = arr[0];
        this.queryInfor.city = "";
        this.queryInfor.district = "";
      } else if (arr[2] == "全部") {
        this.queryInfor.province = arr[0];
        this.queryInfor.city = arr[1];
        this.queryInfor.district = "";
      } else {
        this.queryInfor.province = arr[0];
        this.queryInfor.city = arr[1];
        this.queryInfor.district = arr[2];
      }
    },
    changeItem(val) {
      this.loading.vagueSearchLoading = true;
      getProjectNameList({ projectName: val }).then((data) => {
        this.loading.vagueSearchLoading = false;
        this.getItem = data.data;
      });
    },
    search(random) {
      let types = this.getInteractionTypeStr();
      this.getConversationRank10(random);
      this.getOviewData(random);
      this.getIntentionTop10(random);
      this.getTrend({
        ...this.queryInfor,
        triggerBusinessType: types,
        random: true,
      });
    },
    changePeriod(val) {
      // console.log("changePeriod", val);
      this.queryInfor.beginDate = null;
      this.queryInfor.endDate = null;
      this.queryInfor.periodNum = val;
      this.search();
    },
    changeDateRange(val) {
      // console.log("changeDateRange", val);
      this.queryInfor.beginDate = val[0];
      this.queryInfor.endDate = val[1];
      const startDate = Date.parse(val[0]);
      const endDate = Date.parse(val[1]);
      const day =
        startDate == endDate
          ? 1
          : (endDate - startDate) / (1 * 24 * 60 * 60 * 1000) + 1;
      this.queryInfor.periodNum = day;
      this.search(true);
    },
    searchs() {
      // console.log(this.queryInfor.beginDate =='')
      if (
        this.queryInfor.beginDate != "" &&
        this.queryInfor.beginDate != null
      ) {
        this.search(true);
      } else {
        this.search();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .query_container {
    background-color: #fff;
    padding: 30px 26px 32px 30px;
    margin-bottom: 10px;
    .text {
      font-size: 20px;
      color: #333;
      margin-bottom: 30px;
    }
    > ul {
      display: flex;
      justify-content: space-between;
      li {
        .title {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
        }
        .num {
          color: #3ba0ff;
          font-size: 20px;
          font-weight: bold;
        }
        .dailyA {
          font-size: 20px;
          padding-top: 5px;
          font-weight: bold;
          color: #3ba0ff;
        }
        .explain {
          color: #333333;
          font-size: 14px;
          margin-top: 8px;
          > span {
            margin-left: 10px;
          }
        }
      }
    }
    // .timeontainer {
    //   display: flex;
    //   li {
    //     cursor: pointer;
    //     width: 80px;
    //     color: #dddddd;
    //     border: 1px solid #dddddd;
    //     border-radius: 3px;
    //     margin-right: 10px;
    //     text-align: center;
    //   }
    //   li.active {
    //     color: #3ba0ff;
    //     border-color: #3ba0ff;
    //   }
    // }
  }
  .top10_containers {
    display: flex;
    padding-bottom: 10px;
    height: 100%;
  }
  .talk_circle_container {
    background-color: #fff;
    padding-bottom: 10px;
    margin-bottom: 10px;
    .tabs {
      display: flex;
      // justify-content: center;
      margin: 15px;
      margin-bottom: 0;
      padding-left: 15px;
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
}
</style>
