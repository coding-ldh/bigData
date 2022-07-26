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
import { getRealTimeCityList } from "@/api/userPortrait";
export default {
  props: {
    provinceInfo: Array,
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
    provinceInfo: {
      immediate: true,
      handler: function () {
        this.initParamArea();
      },
    },
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
      if (val[0] != "") {
        // 根据一级选择菜单，加载二级选择菜单
        this.areaLoading = true;
        for (let i = 0; i < this.option.length; i++) {
          this.option[i].children = [
            {
              label: "全部",
              value: "",
            },
          ];
        }
        getRealTimeCityList({ province: val[0] }).then((data) => {
          this.areaLoading = false;
          for (let i = 0; i < this.option.length; i++) {
            if (this.option[i].label == val[0]) {
              let arr = [];
              data.data.map((item) => {
                arr.push({
                  label: item,
                  value: item,
                });
              });
              arr.unshift({
                label: "全部",
                value: "",
              });
              this.option[i].children = arr;
            } else {
            }
          }
        });
      }
    },
    initParamArea() {
      this.option = this.provinceInfo.map((data) => {
        return {
          label: data,
          value: data,
          children: [
            {
              label: "全部",
              value: "",
            },
          ],
        };
      });
      this.option.unshift({ value: "", label: "全部" });
    },
  },
  mounted() {
    // this.initParamArea();
  },
};
</script>

<style lang="scss" scoped></style>
