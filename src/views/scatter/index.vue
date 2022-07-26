<template>
  <div class="container">
    <div class="board_title">语音服务统计</div>
    <div class="line"></div>
    <div class="content">
      <div class="all_count">
        <img :src="require('../../assets/images/scatter.gif')" alt="" />
        <div class="talk_count">
          <!-- <span>{{ newAll }}</span -->
          <!-- ><br /> -->
          <count-to
            :start-val="oldAll"
            :end-val="newAll"
            :duration="duration"
            :easingFn="easingFn"
            class="AI-voice-service-Statistics"
          /><br />
          总对话交互次数
        </div>
      </div>
      <div class="intract_count">
        <div class="today_count">
          <div class="icon">
            <img :src="require('../../assets/images/icon_inter.png')" alt="" />
          </div>
          <div class="number">
            <!-- <span>{{ newToday }}</span>
            <br /> -->
            <count-to
              :start-val="oldToday"
              :end-val="newToday"
              :duration="duration"
              :easingFn="easingFn"
              class="AI-voice-service-Statistics"
            /><br />
            今日交互次数
          </div>
        </div>
        <div class="effect_count">
          <div class="icon">
            <img :src="require('../../assets/images/icon_effect.png')" alt="" />
          </div>
          <div class="number">
            <span>{{ todayDailyValidRate }}%</span>
            <br />
            今日有效对话占比
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAiData } from "@/api/kanbang";
import CountTo from "vue-count-to";

export default {
  components: { CountTo },
  data() {
    return {
      dailyAllNum: "",
      todayDailyAllNum: "",
      todayDailyValidRate: "",
      duration: 1000 * 60 * 60,
      oldAll: 0,
      newAll: 0,
      oldToday: 0,
      newToday: 0,
      // resetDate: [0, 1],
    };
  },
  created() {
    this.initData();
  },
  mounted() {
    if (this.timer) {
      window.clearInterval(this.timer);
    } else {
      this.timer = setInterval(() => {
        this.initData();
      }, this.duration);
    }
  },
  methods: {
    easingFn(t, b, c, d) {
      let y = (c * t) / d + b; //此方法为匀速
      return y;
    },
    delcommafy(num) {
      if (num == undefined || num == null) {
        return 0;
      }
      num = num.toString();
      num = num.replace(/[ ]/g, "");
      num = num.replace(/,/gi, "");
      return Number(num);
    },
    async initData() {
      const { data } = await getAiData();
      // data.dailyAllNum = 0;
      // data.todayDailyAllNum = 0
      // data.todayDailyValidRate = 0
      // console.log(data);
      // let date = new Date();
      // if (this.resetDate.indexOf(date.getHours()) != -1) {
      //   console.log("凌晨重置ing");
      //   this.oldToday = 0;
      //   this.newToday = 0;
      // }
      // 旧 <- 新
      this.oldAll = this.oldAll > this.newAll ? this.oldAll : this.newAll;
      // 新 <- data
      this.newAll =
        this.newAll > this.delcommafy(data.dailyAllNum)
          ? this.newAll
          : this.delcommafy(data.dailyAllNum);
      this.oldToday =
        this.oldToday > this.newToday ? this.oldToday : this.newToday;
      this.newToday =
        this.newToday > this.delcommafy(data.todayDailyAllNum)
          ? this.newToday
          : this.delcommafy(data.todayDailyAllNum);
      this.todayDailyValidRate = data.todayDailyValidRate;
      // first time that was 0 and fill
      if (this.oldAll == 0) {
        this.oldAll = this.newAll - this.newToday * 0.005;
        if (data.dailyAllNum == 0) {
          this.oldAll = this.newAll;
        }
      }
      if (this.oldToday == 0) {
        this.oldToday = this.newToday - this.newToday * 0.005;
      }
    },
  },
  destroyed() {
    window.clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.container {
  ::-webkit-scrollbar {
    display: none;
  }
  .line {
    width: 1756px;
    margin: 0 auto;
    background: linear-gradient(44deg, #0093ff 0%, rgba(0, 147, 255, 0) 100%);
    height: 6px;
    margin-bottom: 56px;
  }
  color: rgba(255, 255, 255, 0.6);
  font-size: 49px;
  font-family: "Source Han Sans CN", sans-serif;
  .board_title {
    font-size: 80px;
    font-weight: 500;
    margin: 0 82px;
    margin-top: 82px;
    margin-bottom: 38px;
    color: #fff;
  }
  .content {
    margin: 0 230px;
    display: flex;
    .all_count {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 730px;
      height: 730px;
      text-align: center;
      > img {
        position: absolute;
        width: 100%;
        height: 100%;
      }
      .talk_count {
        z-index: 99;
        .AI-voice-service-Statistics {
          display: inline-block;
          color: #107cfc;
          font-size: 104px;
          font-weight: bold;
        }
        // > span {
        //   color: #107cfc;
        //   font-size: 104px;
        //   font-weight: bold;
        // }
      }
    }
    .intract_count {
      display: flex;
      // align-items: center;
      flex-direction: column;
      justify-content: center;
      margin-left: 100px;
      .icon {
        height: 180px;
        width: 180px;
      }
      .effect_count,
      .today_count {
        display: flex;
        margin: 32px 0;
        align-items: center;
        .number {
          margin-left: 56px;
        }
      }
      .today_count {
        .number {
          .AI-voice-service-Statistics {
            color: #107cfc;
            font-size: 80px;
            font-weight: bold;
          }
        }
      }
      .effect_count {
        .number {
          > span {
            color: #2fdd91;
            font-size: 80px;
            font-weight: bold;
          }
        }
      }
    }
  }
  width: 100%;
  height: 1080px;
  background-image: url("../../assets/images/bg.png");
}
</style
>>
