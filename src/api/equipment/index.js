
import request from '@/utils/request'

// ****************   概览页面   ****************
// 设备分析
export function getAnalysisDevice(query) {
  return request({
    url: "deviceData/dataAnalyse",
    method: 'get',
    params: query
  })
}
// 设备类型占比-累计激活设备
export function getDeviceTypeRatioActivation(query) {
  return request({
    url: "deviceData/deviceTypeRatio",
    method: 'get',
    params: query
  })
}
// 设备类型占比-出库设备/30天
export function getDeviceTypeRatioOut(query) {
  return request({
    url: "deviceData/checkoutDevice",
    method: 'get',
    params: query
  })
}

// 转化分析-出库设备
export function getTransformAnalyseOut(query) {
  return request({
    url: "deviceData/transformAnalyseCheckout",
    method: 'get',
    params: query
  })
}
// 出库设备情况
export function getOutDeviceSituation(query) {
  return request({
    url: "deviceData/checkoutDeviceSituation",
    method: 'get',
    params: query
  })
}

// ****************   概览列表   ****************
// 获取列表参数
export function getDeviceDataParam(query) {
  return request({
    url: "deviceList/infoList",
    method: 'get',
    params: query
  })
}
// 通过条件查询设备标签列表
export function getDeviceDataList(query) {
  return request({
    url: "deviceList/list",
    method: 'get',
    params: query
  })
}
// 取市
export function getCityList(query) {
  return request({
    url: "deviceList/cityList",
    method: 'get',
    params: query
  })
}
// 取县
export function getDistrictList(query) {
  return request({
    url: "deviceList/districtList",
    method: 'get',
    params: query
  })
}




