<template>
  <div :id="id" class="com-chart" style="z-index: 100"></div>
</template>
<script>
import $echarts from "echarts";
import $axios from "axios";

const provinces = {
  //23个省
  台湾: "taiwan",
  河北: "hebei",
  山西: "shanxi",
  辽宁: "liaoning",
  吉林: "jilin",
  黑龙江: "heilongjiang",
  江苏: "jiangsu",
  浙江: "zhejiang",
  安徽: "anhui",
  福建: "fujian",
  江西: "jiangxi",
  山东: "shandong",
  河南: "henan",
  湖北: "hubei",
  湖南: "hunan",
  广东: "guangdong",
  海南: "hainan",
  四川: "sichuan",
  贵州: "guizhou",
  云南: "yunnan",
  陕西: "shanxi1",
  甘肃: "gansu",
  青海: "qinghai",
  //5个自治区
  新疆: "xinjiang",
  广西: "guangxi",
  内蒙古: "neimenggu",
  宁夏: "ningxia",
  西藏: "xizang",
  //4个直辖市
  北京: "beijing",
  天津: "tianjin",
  上海: "shanghai",
  重庆: "chongqing",
  //2个特别行政区
  香港: "xianggang",
  澳门: "aomen",
};
export default {
  props: {
    scene: String,
    mapType: {
      type: Number,
    },
    id: String,
    handleMapData: {
      required: true,
      type: Function,
    },
  },
  computed: {
  },
  data() {
    return {
      myChart: null,
      special: ["北京", "天津", "上海", "重庆", "香港", "澳门"],
      mapdata: [],
      originalValue: [], // 保存最初的全国地图的 series 的 data
      mapDataInfo: [],
      option: {
        // animationDuration: 1000,
        // animationEasing: "cubicOut",
        // animationDurationUpdate: 1000,
      },
    };
  },
  methods: {
    async getMapDataInfo(province) {
      const { data } = await this.handleMapData({ province, scene: this.scene });
      const targetData = data.map((item) => {
        const { loc, count, projectNum } = item;
        const latitude = loc ? loc.latitude : null;
        const longitude = loc ? loc.longitude : null;
        return {
          name: count ? count : projectNum,
          value: [longitude, latitude],
        };
      });
      return targetData;
    },

    async initChart() {
      this.myChart = $echarts.init(document.getElementById(this.id));
      let _self = this;
      $axios.get("/map/china.json").then(async function (res) {
        const targetData = await _self.getMapDataInfo();
        _self.originalValue = targetData;
        $echarts.registerMap("china", res.data);
        _self.renderMap("china", targetData);
      });
      this.myChart.on("click", async function (params) {
        const targetData = await _self.getMapDataInfo(params.name);
        if (params.name in provinces) {
          $axios
            .get("/map/province/" + provinces[params.name] + ".json")
            .then(function (res) {
              $echarts.registerMap(params.name, res.data);
              _self.renderMap(params.name, targetData);
            });
        } else {
          _self.renderMap("china", _self.originalValue);
        }
      });
    },
    renderMap(map, data) {
      this.myChart = $echarts.init(document.getElementById(this.id));
      this.option = {
        geo: {
          show: true,
          map: map,
          type: map,
          label: {
            normal: {
              show: true,
              color: "#fff",
            },
            emphasis: {
              show: true,
            },
          },
          roam: true,
          itemStyle: {
            normal: {
              areaColor: "rgba(43,72,167,0.38)",
              borderColor: "rgba(117,175,253,0.6)",
            },
            emphasis: {
              areaColor: "rgba(51,97,237,0.5)",
            },
          },
        },
        tooltip: {
          trigger: "item",
          formatter: "{b}",
        },
        series: {
          name: map,
          type: "scatter",
          coordinateSystem: "geo",
          mapType: map,
          symbol: "pin",
          symbolSize: 65,
          roam: true,
          nameMap: {
            china: "中国",
          },
          itemStyle: {
            normal: {
              color: "#FCEC8E",
              areaColor: "rgba(206,201,169,1)",
              label: {
                show: true,
                formatter: "{b}",
                color: "#333333",
              },
            },
            // emphasis: {
            //   areaColor: "darkorange",
            // },
          },
          data: data,
        },
        layoutCenter: ["50%", "50%"],
        layoutSize: "100%",
      };
      //渲染地图
      this.myChart.setOption(this.option, true);
    },
  },
  mounted() {
    window.addEventListener("resize", () => {
      this.myChart.resize();
      this.initChart();
    });
    this.$nextTick(() => {
      this.initChart();
    });
  },
};
</script>

