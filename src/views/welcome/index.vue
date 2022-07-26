<template>
  <div class="welcome">
    <welcome-top :loading="loading"></welcome-top>
    <welcome-mid :loading="loading"></welcome-mid>
    <welcome-midSec :loading="loading"></welcome-midSec>
    <welcome-bottom :loading="loading"></welcome-bottom>
  </div>
</template>

<script>
import WelcomeTop from "./welcome-top.vue";
import WelcomeMid from "./welcome-mid.vue";
import WelcomeMidSec from "./welcome-midSec.vue";
import WelcomeBottom from "./welcome-bottom.vue";
export default {
  components: {
    WelcomeTop,
    WelcomeMid,
    WelcomeMidSec,
    WelcomeBottom
  },
  data() {
    return {
      timer: null,
      loading: true
    };
  },
  mounted() {
    this.timer = setTimeout(() => {
      this.loading = !this.loading;
    }, 1500);
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  }
};
</script>

<style lang="scss">
.welcome {
  width: 100%;
  font-weight: 500;
}
.text_align {
  text-align: center;
}
.top {
  height: 240px;
}
.mid {
  height: 500px;
}
.bottom {
  height: 500px;
}

.count {
  font-size: 1.6vw;
  color: #1f5dea;
  font-family: "PingFangHK-Medium PingFangHK;", sans-serif;
}

.welcome_advert {
  display: flex;
  justify-content: space-between;
}

.welcome_flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.welcome_live {
  width: 16vw;
}

.yDay_traffic,
.yDay_exposure,
.live_traffic,
.yDay_temperature,
.liveAi_count,
.yDay_app,
.bDay_app {
  .title {
    color: #111;
    margin-bottom: 20px;
  }
  .count {
    margin-bottom: 14px;
  }
  .compare_yDay {
    font-size: 12px;
    color: #999;
  }
}

.yDay_traffic,
.yDay_exposure,
.yDay_temperature,
.liveAi_count {
  margin-top: 20px;
}

.yDayAi_count {
  margin-top: 50px;
  .title {
    font-size: 14px;
    margin-bottom: 20px;
    font-weight: 400;
  }
  .count {
    font-size: 1.4vw;
    margin-bottom: 15px;
  }
}

.yDay_app,
.bDay_app {
  margin-top: 54px;
  .title {
    font-size: 14px;
    margin-bottom: 10px;
  }
}

.pecent_compare {
  height: 25px;
  width: 100%;
  .yDay_percent,
  .bDay_percent {
    height: 100%;
    border-radius: 3px;
    display: inline-block;
  }
  .yDay_percent {
    background-color: #1890ff;
  }
  .bDay_percent {
    background-color: #2fc25b;
  }
}

.welcome_app_flex {
  height: 112px;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .app_count {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .title {
      > span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 8px;
        display: inline-block;
      }
    }
    .count {
      font-size: 1.2vw;
    }
  }
}

.welcome_device {
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 64px;
}

.device_item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0 0 80px;
  .count {
    font-size: 22px;
  }
  .unit {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.6);
  }
}

.device_icon {
  font-size: 46px;
  margin-right: 20px;
}

.el-card__header {
  padding: 14px 0;
  margin: 0 25px;
}

.el-col {
  border-radius: 8px;
  height: 100%;
}

.el-card {
  height: 100%;
}

.el-card__body {
  padding: 0px 20px;
  margin: 20px;
}
</style>
