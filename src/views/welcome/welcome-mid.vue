<template>
  <el-row :gutter="24" class="mid" style="margin-bottom: 20px">
    <wel-card :md="8" :lg="8" :xl="8" title="AI概览数据" redirect="ai/overview">
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <div class="welcome_flex" style="flex-direction: column">
            <div class="liveAi_count text_align">
              <div class="title">实时语音交互(次)</div>
              <div
                class="count"
                v-if="aliveInterStart"
                style="display: flex; width: 8vw"
              >
                <count-to
                  :start-val="aliveInterStart"
                  :end-val="aliveInterEnd"
                  :duration="duration"
                  :easingFn="easingFn"
                  class="card-panel-num"
                />
              </div>
            </div>
            <bar-chart
              id="chart20"
              :showPercent="false"
              :series="barDataY"
              :colorList="cityColorList"
              :xData="barDataX"
              v-if="barDataY.length > 0"
              class="welcome_flex"
            ></bar-chart>
            <div
              class="welcome_flex"
              style="
                align-items: center;
                justify-content: space-between;
                width: 100%;
              "
            >
              <div class="yDayAi_count">
                <div class="title">昨日语音交互(次)</div>
                <div class="count">{{ aiData.countAiInteraction }}</div>
              </div>
              <span class="hr"></span>
              <div class="yDayAi_count">
                <div class="title">昨日语音交互时长(小时)</div>
                <div class="count">{{ aiData.timeAiInteraction }}</div>
              </div>
              <span class="hr"></span>
              <div class="yDayAi_count">
                <div class="title">昨日有效交互占比</div>
                <div class="count">{{ aiData.effectAiInteraction }}%</div>
              </div>
            </div>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
    <wel-card
      :md="9"
      :lg="9"
      :xl="9"
      title="AI语音数据"
      redirect="ai/hotWordAnalysis"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <div class="welcome_flex" style="margin-top: -50px">
            <tags-cloud
              v-if="hotWordArray.length > 0"
              :useArray="hotWordArray"
              :boxWidth="500"
              :speed="2000"
              :randomColor="true"
            ></tags-cloud>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
    <wel-card
      :md="7"
      :lg="7"
      :xl="7"
      title="APP数据"
      redirect="app-data/event-detail"
    >
      <template #content>
        <el-skeleton animated :rows="12" :loading="loading">
          <div
            class="welcome_flex"
            style="justify-content: space-between; flex-wrap: wrap"
          >
            <div class="yDay_app">
              <div class="title">昨日总交互次数</div>
              <div class="count">{{ appData.totalConversation }}</div>
            </div>
            <div class="bDay_app">
              <div class="title">前日总交互次数</div>
              <div class="count">{{ appData.totalConversationBY }}</div>
            </div>
            <div class="pecent_compare">
              <span class="yDay_percent" :style="yDayPercent"></span
              ><span class="bDay_percent" :style="bDayPercent"></span>
            </div>
          </div>
          <div class="welcome_app_flex">
            <div class="app_count">
              <div class="title welcome_flex">
                <span style="background-color: #3ba0ff"></span>昨日主动迎宾(次)
              </div>
              <span class="count">{{ appData.activeConversation }}</span>
            </div>
            <div class="app_count">
              <div class="title welcome_flex">
                <span style="background-color: #36cbcb"></span>昨日导览讲解(次)
              </div>
              <span class="count">{{ appData.guideConversation }}</span>
            </div>
            <div class="app_count">
              <div class="title welcome_flex">
                <span style="background-color: #4dcb73"></span>昨日崩溃率
              </div>
              <span class="count">{{ appData.collapseRateYD }}%</span>
            </div>
          </div>
        </el-skeleton>
      </template>
    </wel-card>
  </el-row>
</template>

<script>
import TagsCloud from "./component/WelTagsCloud.vue";
import BarChart from "./component/WelBarChart.vue";
import { getHotWordList } from "@/api/ai/index.js";
import { getAi, getApp, getAiRealDataAndTrend } from "@/api/welcome/index.js";
import CountTo from "vue-count-to";
import WelCard from "./component/WelCard.vue";
export default {
  components: {
    TagsCloud,
    BarChart,
    CountTo,
    WelCard,
  },
  props: ["loading"],
  data() {
    return {
      aliveAiInteraction: "",
      lineChartsTimeData: [
        "00:00",
        "01:00",
        "02:00",
        "03:00",
        "04:00",
        "05:00",
        "06:00",
        "07:00",
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
        "21:00",
        "22:00",
        "23:00",
      ],
      timer: "",
      hotWordArray: [],
      barDataY: [],
      duration: 60000,
      aiData: {},
      aliveInterStart: 0,
      aliveInterEnd: 0,
      appData: {},
      barDataX: [],
      cityColorList: ["#1890FF"],
    };
  },
  created() {
    this.initData();
  },
  computed: {
    yDayPercent: function () {
      return {
        width: `${
          (this.appData.totalConversation /
            (this.appData.totalConversationBY +
              this.appData.totalConversation)) *
          100
        }%`,
      };
    },
    bDayPercent: function () {
      return {
        width: `${
          (this.appData.totalConversationBY /
            (this.appData.totalConversationBY +
              this.appData.totalConversation)) *
          100
        }%`,
      };
    },
  },
  mounted() {
    if (this.timer) {
      window.clearInterval(this.timer);
    } else {
      this.timer = setInterval(async () => {
        await this.setChartData();
        if (this.aliveAiInteraction >= this.aliveInterEnd) {
          this.aliveInterStart = this.aliveInterEnd;
          this.aliveInterEnd = this.aliveAiInteraction;
        }
      }, this.duration);
    }
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
  methods: {
    async initData() {
      this.setAiData();
      this.setAppData();
      this.setHotWord();
      await this.setChartData();
      if (this.aliveAiInteraction > 1000) {
        this.aliveInterStart = this.aliveAiInteraction - 1000;
        this.aliveInterEnd = this.aliveAiInteraction;
      } else {
        this.aliveInterStart = this.aliveAiInteraction;
        this.aliveInterEnd = this.aliveAiInteraction;
      }
    },
    async setAiData() {
      const { data } = await getAi();
      const { effInteractionPercentYD, interactionCountYD, interactionTimeYD } =
        data;
      this.aiData.effectAiInteraction = effInteractionPercentYD;
      this.aiData.countAiInteraction = interactionCountYD;
      this.aiData.timeAiInteraction = interactionTimeYD;
    },
    async setHotWord() {
      const { data } = await getHotWordList();
      this.hotWordArray = data;
    },
    async setAppData() {
      const { data } = await getApp();
      this.appData = data;
      const {
        totalConversation,
        totalConversationBY,
        activeConversation,
        guideConversation,
        collapseRateYD,
      } = data;
      this.appData.totalConversation = totalConversation;
      this.appData.totalConversationBY = totalConversationBY;
      this.appData.activeConversation = activeConversation;
      this.appData.guideConversation = guideConversation;
      this.appData.collapseRateYD = collapseRateYD;
    },
    async setChartData() {
      const { data } = await getAiRealDataAndTrend();
      const { interactionCountReal, trend } = data;
      this.aliveAiInteraction = interactionCountReal;
      const trendData = trend.data.dailyAllNumArr.filter((item) => item != 0);
      this.barDataX = this.lineChartsTimeData.filter(
        (item, index) => index < trendData.length
      );
      this.barDataY = [];
      this.barDataY.push({
        barWidth: 9,
        data: trendData,
        name: "语音交互次数",
        type: "bar",
      });
    },
    easingFn(t, b, c, d) {
      let y = (c * t) / d + b; //此方法为匀速
      return y;
    },
  },
};
</script>
<style lang="scss" scoped>
.hr {
  margin-top: 40px;
  width: 1px;
  height: 52px;
  background-color: #e5e5e5;
}
.mid {
  height: 500px;
}
</style>
