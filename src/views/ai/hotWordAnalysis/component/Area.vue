<template>
  <el-cascader
    @change="changeArea"
    v-model="defaultVal"
    ref="cascader"
    :options="option"
    @expand-change="getArea"
    v-loading="areaLoading"
  ></el-cascader>
</template>
<script>
import { getParamArea } from "@/api/ai/index.js";
export default {
  data() {
    return {
      areaLoading: false,
      defaultVal: [],
      option: [
        {
          value: "",
          label: "全部",
          children: [{ value: "", label: "全部" }]
        }
      ]
    };
  },
  methods: {
    reset() {
      this.defaultVal = [];
    },
    changeArea(val) {
      // 父组件传日期值
      this.$emit("fromChildArea", val);
    },
    getArea(val) {
      // 根据一级选择菜单，加载二级选择菜单
      this.areaLoading = true;
      getParamArea({ projectProvince: val[0] }).then(data => {
        this.areaLoading = false;
        let index = 0;
        for (let i = 0; i < this.option.length; i++) {
          if (this.option[i].label == val[0]) {
            let arr = [];
            data.data.cityList.map(item => {
              arr.push({
                label: item,
                value: item
              });
            });
            arr.unshift({
              label: "全部",
              value: ""
            });
            this.option[i].children = arr;
          } else {
          }
        }
      });
    },
    initParamArea() {
      getParamArea().then(data => {
        // 初始化一级选择菜单
        this.option = data.data.provinceList.map(item => {
          return {
            label: item,
            value: item,
            children: [
              {
                label: "全部",
                value: ""
              }
            ]
          };
        });
        this.option.unshift({ value: "", label: "全部" });
      });
    }
  },
  mounted() {
    this.initParamArea();
  }
};
</script>

<style lang="scss" scoped></style>
