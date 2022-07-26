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
        :key="item"
        :label="item"
        clearable
        :value="item"
      >
      </el-option>
    </el-select>
    <el-select
      v-loading="loading.cityList"
      v-model="queryInfor.city"
      placeholder="请选择市"
      multiple
      clearable
      collapse-tags
      @change="changeCity"
    >
      <el-option
        v-for="item in cityList"
        :key="item"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
    <el-select
      v-loading="loading.districtList"
      v-model="queryInfor.district"
      placeholder="请选择区"
    >
      <el-option
        v-for="item in districtList"
        :key="item"
        :label="item"
        :value="item"
      >
      </el-option>
    </el-select>
        <span class="position_params_params" title="地区">地区：</span>
  </div>
</template>

<script>
import {
  getDeviceDataParam,
  getCityList,
  getDistrictList
} from "@/api/equipment/index.js";
export default {
  props: {
    resets: Boolean
  },
  data() {
    return {
      loading: {
        cityList: false,
        districtList: false
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
    changeProvince(val) {
      this.loading.cityList = true;
      this.queryInfor.city = [];
      this.queryInfor.district = "";
      getCityList({ province: val }).then(data => {
        this.cityList = data.data.cityList;
        this.loading.cityList = false;
      });
    },
    changeCity(val) {
      if (val.length <= 1) {
        this.loading.districtList = true;
        getDistrictList({ city: val[0] }).then(data => {
          this.districtList = data.data.districtList;
          this.loading.districtList = false;
        });
      }
    }
  },
  watch: {
    resets: {
      handler: function() {
        this.queryInfor = {
          province: "",
          city: "",
          district: ""
        };
        this.cityList=[]
        this.districtList = []
        this.$emit("resetArea");
      }
    }
  },
  created() {},
  mounted() {
    getDeviceDataParam().then(data => {
      this.provinceList = data.data.provinceList;
    });
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
