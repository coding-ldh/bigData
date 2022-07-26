<template>
  <div class="area_container">
    <el-select
      v-model="queryInfor.province"
      placeholder="请选择省"
      clearable
      @change="changeProvince"
    >
      <el-option
        v-for="item in provinceList"
        :key="item.value"
        :label="item.value"
        clearable
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="queryInfor.city"
      placeholder="请选择市"
      :disabled="queryInfor.province == '' ? true : false"
      multiple
      clearable
      collapse-tags
      @change="changeCity"
    >
      <el-option
        v-for="item in cityList"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
      </el-option>
    </el-select>
    <el-select
      v-model="queryInfor.district"
      :disabled="queryInfor.city.length > 1 ? true : false"
      placeholder="请选择区"
    >
      <el-option
        v-for="item in districtList"
        :key="item.value"
        :label="item.value"
        :value="item.value"
      >
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { getAreaData } from "@/api/onLineTime";
import { option } from "@/api/sceneData";
export default {
  props: {
    methodName: {
      type: String,
      default: "getAreaData"
    }
  },
  data() {
    return {
      methodsObj: {
        getAreaData,
        option
      },
      queryInfor: {
        province: [],
        city: [],
        district: ""
      },
      provinceList: [],
      cityList: [],
      districtList: []
    };
  },
  methods: {
    getProvinceList() {
      this.getData();
    },
    getData(areaName = undefined, areaType = 0) {
      const methodsObj = this.methodsObj,
        methodName = this.methodName;
      methodsObj[methodName]({ areaName, areaType }).then(({ data }) => {
        if (areaType == 0) {
          //省
          this.provinceList = data;
        } else if (areaType == 1) {
          //市
          this.cityList = data;
        } else {
          this.districtList = data;
        }
      });
    },
    //改变省的选项
    changeProvince(val) {
      this.queryInfor.city = [];
      this.queryInfor.district = [];
      if (val == "全国") {
        return;
      }
      this.getData(val, 1);
    },
    changeCity(val) {
      if (val.length == 1) {
        this.getData(val[0], 2);
      }
    }
  },
  created() {
    this.getProvinceList();
  }
};
</script>

<style>
.area_container .el-input__inner {
  border-radius: 0 !important;
}
</style>
<style lang="scss" scoped>
.area_container {
  display: flex;
}
</style>
