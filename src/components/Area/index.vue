<template>
  <el-cascader
    placeholder="请选择地区"
    :props="props"
    @change="changeArea"
    v-model="defaultVal"
    ref="cascader"
  ></el-cascader>
</template>

<script>
import {
  getProvinceCityAreaData,
  adPlanOverviewArea,
} from "@/api/userPortrait";
import { getAreaOption } from "@/api/ai";
export default {
  props: {
    methodName: {
      type: String,
      default: "getProvinceCityAreaData",
    },
  },
  data() {
    return {
      defaultVal: [""],
      methodsObj: {
        getProvinceCityAreaData,
        adPlanOverviewArea,
        getAreaOption,
      },
      props: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level } = node;
          if (level == 0) {
            this.getData(0, undefined, resolve);
          } else if (level == 1) {
            this.getData(1, node.data.value, resolve);
          } else if (level == 2) {
            this.getData(2, node.data.value, resolve);
          }
        },
      },
    };
  },
  methods: {
    getData(areaType, areaName, resolve) {
      const methodsObj = this.methodsObj,
        methodName = this.methodName;
      methodsObj[methodName]({ areaType, areaName }).then(({ data }) => {
        let arr = data.map((item) => ({
          value: item.value,
          label: item.value,
          leaf: areaType == 2 ? true : false,
        }));
        if (areaType == 0) {
          arr.unshift({ label: "全国", value: "全国", leaf: true });
        } else if (areaType == 1 || areaType == 2) {
          arr.unshift({ label: "全部", value: "全部", leaf: true });
        }
        resolve(arr);
      });
    },
    changeArea(val) {
      let handleVal = [];
      handleVal = val.length === 1 && val[0] === "全国" ? "" : val;
      this.$emit("fromChildArea", handleVal);
    },
    reset() {
      this.$refs.cascader.panel.clearCheckedNodes();
      this.$refs.cascader.$refs.panel.activePath = [];
    },
  },
};
</script>

<style lang="scss" scoped>
</style>