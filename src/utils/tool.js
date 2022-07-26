import lodash from "lodash";
import store from "@/store";
import {
  getToken
} from "@/utils/auth";
import axios from "axios";
// import { Message } from 'element-ui'

export function reset(obj) {
  const keys = Object.keys(obj);
  keys.map(key => {
    if (Array.isArray(obj[key])) {
      obj[key] = [];
    } else if (typeof obj[key] == "object") {
      obj[key] = {};
    } else {
      obj[key] = "";
    }
  });
}
/**
 * 清空
 * @param {*} cmp  父组件Vue组件实例
 * @param {*} tableRefName table的ref
 */
export function clearContent(cmp, tableRefName) {
  cmp.$refs[tableRefName].clearSelection();
}

function addZero(num) {
  return num < 10 ? `0${num}` : num;
}
export function getCurrentDate(diffHour, referDate = "") {
  let nowMillion = "";
  if (referDate == "") {
    nowMillion = new Date(new Date().toLocaleDateString()).getTime();
  } else {
    nowMillion = new Date(new Date(referDate).toLocaleDateString()).getTime();
  }
  const diffTime = nowMillion - diffHour * 60 * 60 * 1000;
  const date = new Date(diffTime);
  const year = date.getFullYear();
  const month = addZero(date.getMonth() + 1);
  const days = addZero(date.getDate());
  return `${year}-${month}-${days}`;
}

export function getDayAll(starDay, endDay) {
  const arr = [];
  const dates = [];
  const db = new Date(starDay);
  const de = new Date(endDay);
  const s = db.getTime() - 24 * 60 * 60 * 1000;
  const d = de.getTime() - 24 * 60 * 60 * 1000;
  for (var i = s; i <= d;) {
    i = i + 24 * 60 * 60 * 1000;
    arr.push(parseInt(i));
  }
  for (const j in arr) {
    const time = new Date(arr[j]);
    const year = time.getFullYear(time);
    const mouth =
      time.getMonth() + 1 >= 10 ?
      time.getMonth() + 1 :
      "0" + (time.getMonth() + 1);
    const day = time.getDate() >= 10 ? time.getDate() : "0" + time.getDate();
    const YYMMDD = year + "-" + mouth + "-" + day;
    dates.push(YYMMDD);
  }
  return dates;
}

export function MillisecondToDate(msd) {
  let time = parseFloat(msd) / 1000;
  const hour = parseInt(time / 3600);
  const minutes = parseInt(
    (parseFloat(time / 3600) - parseInt(time / 3600)) * 60
  );
  const second = parseInt(
    (parseFloat((parseFloat(time / 3600) - parseInt(time / 3600)) * 60) -
      parseInt((parseFloat(time / 3600) - parseInt(time / 3600)) * 60)) *
    60
  );
  time =
    formatZero(hour, 2) +
    ":" +
    formatZero(minutes, 2) +
    ":" +
    formatZero(second, 2);
  return time;
}

function formatZero(num, len) {
  if (String(num).length > len) return num;
  return (Array(len).join(0) + num).slice(-len);
}
// **************** 导出功能 ****************
export function userExport(url, name) {
  const exportAxios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
  });
  exportAxios.interceptors.request.use(
    config => {
      store.getters.token ? (config.headers["Authorization"] = getToken()) : "";
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  const fileName = name ? name : getFileName(url);
  // console.log(fileName)
  url = url.slice(1);
  return exportAxios({
    url: url,
    method: "get",
    responseType: "blob"
  }).then(res => {
    const data = res.data;
    const urls = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    link.style.display = "none";
    // console.log(urls)
    link.href = urls;
    link.setAttribute("download", `${fileName}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

function getFileName(url) {
  let nameStart = url.indexOf('fileName=')
  let finishName = url.slice(nameStart + 9)
  if (finishName.indexOf('&') == -1) return finishName.slice(0, url.length)
  return finishName.slice(0, finishName.indexOf('&'))
}
// 大文件导出- 提交导出申请
export function exportZip(url) {
  const exportAxios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
  });
  exportAxios.interceptors.request.use(
    config => {
      store.getters.token ? (config.headers["Authorization"] = getToken()) : "";
      return config;
    },
    error => {
      // console.log(error)
      return Promise.reject(error);
    }
  );
  return exportAxios({
    url: url,
    method: "get"
    // responseType: 'blob'
  });
}
// 下载服务器生产大文件ZIP
export function downZip(key) {
  const exportAxios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 10000
  });
  exportAxios.interceptors.request.use(
    config => {
      store.getters.token ? (config.headers["Authorization"] = getToken()) : "";
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  exportAxios.interceptors.response.use(
    response => {
      return response.data;
    },
    err => {
      return Promise.reject(err);
    }
  );
  return exportAxios({
    url: `/file/download?key=${key}`,
    method: "get"
    // responseType: 'blob'
  });
}

export function clickDownZip(url) {
  const exportAxios = axios.create({
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 86400000
  });
  exportAxios.interceptors.request.use(
    config => {
      store.getters.token ? (config.headers["Authorization"] = getToken()) : "";
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  exportAxios.interceptors.response.use(
    response => {
      return response.data;
    },
    error => {
      return Promise.reject(error);
    }
  );
  return exportAxios;
}

export function getCurrentTime(time, min) {
  // input second output d-h-m-s
  if (time == 0) {
    return `${0}秒`;
  }
  if (!time) {
    return null;
  }
  time = Math.floor(time);
  let dMs = 60 * 60 * 24;
  let hMs = 60 * 60;
  let mMs = 60;
  let d = Math.floor(time / dMs);
  time = d > 0 ? time - d * dMs : time;
  let h = Math.floor(time / hMs);
  time = h > 0 ? time - h * hMs : time;
  let m = Math.floor(time / mMs);
  let s = time - m * mMs;
  let transTime = null;
  transTime =
    d > 0 ?
    `${d}天${h}时${m}分${s}秒` :
    h > 0 ?
    `${h}时${m}分${s}秒` :
    m > 0 ?
    `${m}分${s}秒` :
    `${s}秒`;
  if (min) {
    if (s == 0) {
      if (m == 0) {
        return `${d}天${h}时`
      } else {
        return `${d}天${h}时${m}分`
      }
    } else {
      return transTime
    }
  }
  return transTime;
}

export function getLineChartSeriesObj(name, data) {
  let obj = {
    name,
    type: "line",
    data
  };
  return obj;
}
export function getBarChartSeriesObj(name, data) {
  let obj = {
    name,
    type: "bar",
    barGap: 0,
    barWidth: 35, //柱图宽度
    data
  };
  return obj;
}

import html2Canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Loading
} from "element-ui";
let loading;
export default class PadDownloader {
  static install(Vue, options) {
    Vue.prototype.downloadPdf = function (options) {
      loading = Loading.service({
        lock: true,
        text: "正在下载文件...",
        background: "rgba(0,0,0,.5)"
      });
      const tiem = setTimeout(() => {
        const title = options.title;
        const content = document.querySelector("#" + options.selector);
        html2Canvas(content, {
          allowTaint: true,
          useCORS: true,
          scrollX: 180,
          scale: 2,
          width: 1920 //canvas宽
        }).then(function (canvas) {
          var contentWidth = canvas.width;
          var contentHeight = canvas.height;
          // 将canvas转为base64图片
          var pageData = canvas.toDataURL("image/jpeg");

          // 设置pdf的尺寸，pdf要使用pt单位 已知 1pt/1px = 0.75   pt = (px/scale)* 0.75
          // 2为上面的scale 缩放了2倍
          var pdfX = ((contentWidth + 30) / 2) * 0.75;
          var pdfY = ((contentHeight + 500) / 2) * 0.75; // 500为底部留白

          // 设置内容图片的尺寸，img是pt单位
          var imgX = (contentWidth / 2) * 0.75;
          var imgY = (contentHeight / 2) * 0.75; //内容图片这里不需要留白的距离

          // 初始化jspdf 第一个参数方向：默认''时为纵向，第二个参数设置pdf内容图片使用的长度单位为pt，第三个参数为PDF的大小，单位是pt
          var PDF = new jsPDF("", "pt", [pdfX + 50, pdfY]);

          // 将内容图片添加到pdf中，因为内容宽高和pdf宽高一样，就只需要一页，位置就是 0,0
          PDF.addImage(pageData, "jpeg", 25, 0, imgX, imgY);
          loading.close();
          PDF.save(title + ".pdf");
        });
        clearTimeout(tiem);
      }, 500);
    };
  }
}

export function formatNum(num) {
  if (num != undefined) {
    return num.toLocaleString();
  }
}

export function cacheParamList(sourceList) {
  // 创建缓存数据，目的，对参数查询的方法使用缓存数据(页码查询时使用)
  let cacheList = lodash.cloneDeep(sourceList);
  return cacheList;
}
