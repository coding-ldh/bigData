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
import { getItemListDetailCityArr } from "@/api/itemData/index.js";

export default {
  props: {
    Areafliter: {
      type: Array,
    },
  },
  data() {
    return {
      areaLoading: false,
      defaultVal: [],
      option: [
        {
          value: "",
          label: "全部",
          children: [{ value: "", label: "全部" }],
        },
      ],
    };
  },
  watch: {
    Areafliter: {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.initParamArea(val);
        }
      },
    },
  },
  methods: {
    async getArea(val) {
      this.areaLoading = true;
      // console.log("获取二级地区", val);
      const { data } = await getItemListDetailCityArr({ projectProvince: val[0] });
      this.option.map((_) => {
        if (_.label == val[0]) {
          // console.log(_.children, data);
          _.children = data.map((_) => {
            return { value: _, label: _ };
          });
          _.children.unshift({
            value: "",
            label: "全部",
          });
        }
      });
      this.areaLoading = false;
    },
    reset() {
      this.defaultVal = [""];
    },
    changeArea(val) {
      // 父组件传日期值
      this.$emit("fromChildArea", val);
    },
    initParamArea(val) {
      this.areaLoading = true;
      this.option = val.map((_) => {
        return {
          value: _,
          label: _,
          children: [{ value: "", label: "全部" }],
        };
      });
      this.option.unshift({ value: "", label: "全部" });
      this.areaLoading = false;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped></style>
