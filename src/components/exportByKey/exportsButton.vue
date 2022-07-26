<template>
  <div>
    <el-button type="primary" :disabled="button" @click="exportData"
      >导出</el-button
    >
    <!-- <div class="show">show</div> -->
  </div>
</template>
<script>
import { exportZip, downZip, clickDownZip } from "@/utils/tool.js";
import axios from "axios";
export default {
  props: {
    exportUrl: String,
    isExport: Boolean,
  },
  data() {
    return {
      index: 0,
      timer: null,
      timerData: null,
      timerOnLine: null,
      button: false,
      random: null, //1439308
      fileName: null,
      urls: null,
      dom: {
        percentNum: null,
        currentPercent: null,
        tip: null,
        hiddenDom: null,
      },
      show: "隐藏",
      cancelXHR: null,
    };
  },
  computed: {},
  watch: {
    isExport: {
      immediate: true,
      handler: function (val) {
        this.run();
      },
    },
  },
  methods: {
    run() {
      if (this.exportUrl) {
        // console.log("run", this.exportUrl);
        // 此处为本地随机KEY值，存在与数据库重复的可能(key值较为复杂重复几率很小)
        this.random = Math.random().toString(36).substr(2);
        // console.log(this.random);
        // this.random = "20220302test";
        const url = `${this.exportUrl}&key=${this.random}`;
        this.fileName = this.getFileName(url) + ".zip";
        // console.log(url);
        // this.random = 1
        // this.export();
        exportZip(url).then((data) => {
          if (data.data.status == "fail") {
            this.$message.error(`创建失败`);
            // console.log("创建失败");
          } else {
            // console.log("数据提交成功，success");
            this.export();
            // console.log(this.random);
          }
        });
      }
    },
    exportData() {
      this.$emit("exports");
    },
    getFileName(url) {
      let name = "";
      let index = 0;
      index = url.indexOf("fileName=");
      let cacheUrl = url.slice(index + 9);
      index = cacheUrl.indexOf("&");
      name = cacheUrl.slice(0, index);
      return name;
    },
    export() {
      this.button = true;
      let that = this;
      this.$notify({
        title: "导出请求已提交,请勿关闭窗口",
        dangerouslyUseHTMLString: true,
        type: "warning",
        customClass: "Top_left_info_for_exportData",
        message: `
                <div>
                    <span class="percent" style="color:#1890ff">${this.index}</span>
                    <a class="downLoading" target="_blank" >加载中...</a>
                    <p class="progress_bar"></p>
                    <p class="" style="color:#cbcbcb">提示:当前只可存在一个导出窗口</p>
                    <button class="button_for_show_Notify">${this.show}</button>
                <div>
                  `,
        offset: 35,
        duration: 0,
        onClose: this.close,
      });
      this.dom.hiddenDom = document.getElementsByClassName(
        "button_for_show_Notify"
      );
      this.dom.hiddenDom[0].style.padding = "5px 10px";
      this.dom.hiddenDom[0].style.color = "white";
      this.dom.hiddenDom[0].style.background = "#1890ff";
      this.dom.hiddenDom[0].style.fontSize = "12px";
      this.dom.hiddenDom[0].style.border = "1px solid";
      this.dom.hiddenDom[0].style.borderRadius = "4px ";
      this.dom.hiddenDom[0].addEventListener("click", this.shows);
      this.setTimer();
    },
    shows() {
      let notify = document.getElementsByClassName(
        "Top_left_info_for_exportData"
      );
      this.show = this.show == "隐藏" ? "展示" : "隐藏";
      this.dom.hiddenDom[0].textContent = this.show;
      notify[0].style.right = notify[0].style.right == "-240px" ? "" : "-240px";
    },
    setTimer() {
      clearInterval(this.timer);
      this.dom.percentNum = document.getElementsByClassName("percent");
      this.dom.currentPercent = document.getElementsByClassName("progress_bar");
      this.dom.tip = document.getElementsByClassName("downLoading");
      this.timer = setInterval(() => {
        this.index = this.dom.currentPercent[0].offsetWidth / 2;
        if (this.index >= 95.5) {
          this.dom.percentNum[0].textContent = `99%`;
          this.dom.tip[0].text = "等待数据库打包Zip文件...";
          downZip(this.random).then((data) => {
            this.timerData = setInterval(() => {
              downZip(this.random).then((data) => {
                console.log(data, "time **");
                this.checkData(data);
              });
            }, 10000);
            console.log(data, "once ****");
            this.checkData(data);
          });
          clearInterval(this.timer);
        } else {
          this.dom.percentNum[0].textContent = `${this.index}%`;
        }
      }, 120);
    },
    checkData(data) {
      if (data.errCode == 80002) {
        this.dom.tip[0].text = "出错了，请关闭本窗口并重试";
        this.dom.percentNum[0].style.color = "#ff0000";
        this.dom.tip[0].style.color = "#ff0000";
        clearInterval(this.timerData);
      } else if (data.status == "fail" || data.errCode == 80003) {
        this.dom.tip[0].text = `${data.data.errMsg}`;
      } else if (data.status == "success") {
        this.dom.tip[0].text = `文件处理中...`;
        this.down(data.data);
        clearInterval(this.timerData);
      }
    },
    s() {
      this.$notify.closeAll();
      this.dom.hiddenDom[0].removeEventListener("click", this.shows);
      this.dom.tip[0].removeEventListener("click", this.s, false);
      clearInterval(this.timerOnLine);
    },
    down(data) {
      //j4g4xvhl0e
      let that = this;
      this.urls = data;
      let getZipProgress = clickDownZip();
      const CancelToken = axios.CancelToken;
      this.cancelXHR = CancelToken.source();
      this.dom.tip[0].addEventListener("click", this.s);
      let pullZip = function () {
        that.dom.tip[0].text = "文件处理中...";
        getZipProgress({
          url: that.urls,
          method: "get",
          cancelToken: that.cancelXHR.token,
          responseType: "blob",
          onDownloadProgress(a) {
            // infinity处理
            if ((100 * (a.loaded / a.total)).toFixed(1) == "Infinity") {
              that.dom.percentNum[0].textContent = `网络连接已断开，正在重试`;
            } else {
              that.dom.percentNum[0].textContent = `${(
                100 *
                (a.loaded / a.total)
              ).toFixed(1)}%`;
            }
          },
        })
          .then((_) => {
            that.urls = window.URL.createObjectURL(_);
            that.dom.percentNum[0].textContent = `100%`;
            that.dom.tip[0].text = "已完成，点击下载(点击后窗口将关闭)";
            that.dom.tip[0].style.color = "#1890ff";
            that.dom.tip[0].style.textDecoration = "underline";
            that.dom.tip[0].href = that.urls;
            that.dom.tip[0].download = that.fileName;
          })
          .catch((error) => {
            // 此处开始监听网络化
            console.log(error.message);
            if (error.message == "Network Error") {
              that.dom.tip[0].text = "异常，请检查网络状态";
              that.timerOnLine = setInterval(() => {
                console.log("断网重连");
                if (navigator.onLine == true) {
                  pullZip();
                  clearInterval(that.timerOnLine);
                }
              }, 1000);
            } else if (error.message == "取消请求") {
              console.log("请求已经取消");
            }
          });
      };
      pullZip();
    },
    close() {
      this.dom.tip[0].removeEventListener("click", this.s, false);
      clearInterval(this.timerOnLine);
      this.button = false;
      clearInterval(this.timer);
      clearInterval(this.timerData);
      if (this.cancelXHR !== null) {
        this.cancelXHR.cancel("取消请求");
      } else {
        console.log("是null");
      }
      this.dom.hiddenDom[0].removeEventListener("click", this.shows);
    },
  },
  created() {},
  mounted() {
    // 进页面查看是否存在弹窗，有-> 禁用按钮
    let elButtonEx = document.getElementsByClassName("percent");
    elButtonEx.length >= 1 ? (this.button = true) : (this.button = false);
  },
  beforeDestroy() {
    // clearInterval(this.timer);
    // clearInterval(this.timerData)
    window.URL.revokeObjectURL(this.urls);
    console.log('clear URL')
  },
};
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
.Top_left_info_for_exportData {
  .el-notification__content {
    .progress_bar {
      // display: inline-block;
      // border-radius: 5px;
      height: 5px;
      line-height: 5px;
      width: 200px;
      background: rgb(238, 238, 238);
      background: -webkit-repeating-linear-gradient(
        30deg,
        #c3c3ff,
        #c3c3ff 10px,
        #acacf9 0,
        #acacf9 20px
      );
      animation: notify_Precent_Style_For_ExportZip 800ms linear infinite,
        notify_Precent_Width_Animation_For_ExportZip 2s 1;
      // box-shadow: 0 0 3px 0;
    }
    @keyframes notify_Precent_Style_For_ExportZip {
      0% {
        background-position: 0 0 100%;
      }
      100% {
        background-position: 23px 0;
      }
    }
    @keyframes notify_Precent_Width_Animation_For_ExportZip {
      0% {
        width: 0;
      }
      30% {
        width: 100px;
      }
      50% {
        width: 120px;
      }
      100% {
        width: 200px;
      }
    }
  }
}
</style>