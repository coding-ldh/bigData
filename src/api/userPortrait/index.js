import request from '@/utils/request'

// 广告售价列表
export function getAdPriceList(query) {
  return request({
    url: "advPrice",
    method: 'get',
    params: query
  })
}

// 广告售价的流量画像明细
export function getPriceDetailList(query) {
  return request({
    url: "advPortrait",
    method: 'get',
    params: query
  })
}

// 流量画像详情页   访客属性-年龄分布
export function ageDistribution(query) {
  return request({
    url: "advPortrait/ageDistribution",
    method: 'get',
    params: query
  })
}

// 性别占比
export function femaleProportion(query) {
  return request({
    url: "advPortrait/femaleProportion",
    method: 'get',
    params: query
  })
}

// 投放详情页列表
export function getAdvMaterialList(query) {
  return request({
    url: "advMaterial",
    method: 'get',
    params: query
  })
}

// 投放详情页   投放详情页基础信息
export function advMaterialBaseInfo(query) {
  return request({
    url: "advMaterial/baseInfo",
    method: 'get',
    params: query
  })
}

//广告屏售价管理列表条件筛选
export function advPriceFilterValue(query) {
  return request({
    url: "advPrice/filterValue",
    method: 'get',
    params: query
  })
}

// 广告屏流量画像看板   场景类别设备占比
export function proportionOfScene(query) {
  return request({
    url: "adsOverview/proportionOfScene",
    method: 'get',
    params: query
  })
}

// 广告屏流量画像看板   单台设备日均流量分布区间
export function dailyAverageFlowDistribution(query) {
  return request({
    url: "adsOverview/dailyAverageFlowDistribution",
    method: 'get',
    params: query
  })
}

// 广告屏流量画像看板   年龄占比
export function ageRatio(query) {
  return request({
    url: "adsOverview/ageRatio",
    method: 'get',
    params: query
  })
}

// 广告屏流量画像看板   性别占比
export function sexRatio(query) {
  return request({
    url: "adsOverview/sexRatio",
    method: 'get',
    params: query
  })
}

// 广告屏流量画像看板   地域分布-城市设备量排名
export function rankingOfUrbanEquipment(query) {
  return request({
    url: "adsOverview/rankingOfUrbanEquipment",
    method: 'get',
    params: query
  })
}

// 广告屏流量画像看板  趋势图
export function dataOfEquipmentsAndTraffic(query) {
  return request({
    url: "adsOverview/dataOfEquipmentsAndTraffic",
    method: 'get',
    params: query
  })
}
export function adsOverview(query) {
  return request({
    url: "adsOverview/data",
    method: 'get',
    params: query
  })
}
// 设备列表参数获取
export function getOverviewDeviceType(query) {
  return request({
    url: "adsOverview/deviceInfo",
    method: 'get',
    params: query
  })
}
// 流量画像详情页   趋势图
export function dataOfTraffic(query) {
  return request({
    url: "advPortrait/dataOfTraffic",
    method: 'get',
    params: query
  })
}

// 概览页面场景下拉列表
export function sceneFilterValue(query) {
  return request({
    url: "adsOverview/sceneFilterValue",
    method: 'get',
    params: query
  })
}

// 获取基础信息
export function getBasicData(query) {
  return request({
    url: "advPortrait/baseInfo",
    method: 'get',
    params: query
  })
}

// 广告计划投放-列表
export function adverReleasePlan(query) {
  return request({
    url: "adverReleasePlan",
    method: 'get',
    params: query
  })
}

// 广告计划投放-条件筛选
export function adverPlanFilterValue(query) {
  return request({
    url: "adverReleasePlan/filterValue",
    method: 'get',
    params: query
  })
}
// 单省市区条件
export function getProvinceCityAreaData(query) {
  return request({
    url: "advPrice/administrativeArea/option",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-投放效果明细
export function adsAdverPlanDtList(query) {
  return request({
    url: "adverReleasePlanDetail/adsAdverPlanDtList",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-计划信息
export function planDetailBaseInfor(query) {
  return request({
    url: "adverReleasePlanDetail/baseInfo",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-广告素材列表
export function adverPlanMaterialList(query) {
  return request({
    url: "adverReleasePlanDetail/adverPlanMaterialList",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-年龄占比
export function planDetailAge(query) {
  return request({
    url: "adverReleasePlanDetail/ageRatio",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-性别占比
export function planDetailSex(query) {
  return request({
    url: "adverReleasePlanDetail/sexRatio",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-趋势图
export function dataOfPlanPlayNumAndExposureAndDevices(query) {
  return request({
    url: "adverReleasePlanDetail/dataOfPlanPlayNumAndExposureAndDevices",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-场景类别拉取设备占比
export function proportionOfPlanDevicesScene(query) {
  return request({
    url: "adverReleasePlanDetail/proportionOfPlanDevicesScene",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-场景类别曝光量占比
export function proportionOfPlanExposureScene(query) {
  return request({
    url: "adverReleasePlanDetail/proportionOfPlanExposureScene",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-> -->场景类别场景设备数和曝光量 
export function proportionOfPlanExposureSceneKeySceneDetails(query) {
  return request({
    url: "adverReleasePlanDetail/planSceneAndData",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-重点场景详情-年龄占比
export function ageRatio4PlanScreen(query) {
  return request({
    url: "adverReleasePlanDetail/ageRatio4PlanScreen",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-重点场景详情-性别占比
export function sexRatio4PlanScreen(query) {
  return request({
    url: "adverReleasePlanDetail/sexRatio4PlanScreen",
    method: 'get',
    params: query
  })
}




/**************************************************************************************/
// 广告计划概览-趋势图
export function getSixTrendChartsOfAdvertisingPlan(query) {
  return request({
    url: "adPlanOverview/sixTrendChartsOfAdvertisingPlan",
    method: 'get',
    params: query
  })
}

export function getEquipmentInCityTop10(query) {
  return request({
    url: "adPlanOverview/equipmentInCityTop10",
    method: 'get',
    params: query
  })
}

export function getEquipmentInIndustryTop10(query) {
  return request({
    url: "adPlanOverview/equipmentInIndustryTop10",
    method: 'get',
    params: query
  })
}
/**************************************************************************************/

// 广告计划概览-条件筛选
export function adPlanOverviewScene(query) {
  return request({
    url: "adPlanOverview/sceneFilterValue",
    method: 'get',
    params: query
  })
}

// 广告计划概览-单省市区条件
export function adPlanOverviewArea(query) {
  return request({
    url: "adPlanOverview/administrativeArea/option",
    method: 'get',
    params: query
  })
}

// 广告计划投放详情页-重点场景详情-年龄和性别占比
export function ageAndSexRatio4PlanScreen(query) {
  return request({
    url: "adverReleasePlanDetail/ageAndSexRatio4PlanScreen",
    method: 'get',
    params: query
  })
}

/***************在线时长******************* */
// 看板数据块
export function adsOnlineDurationData(query) {
  return request({
    url: "adsOnlineDuration/data",
    method: 'get',
    params: query
  })
}

// 每月统计趋势图
export function onLineMonthlyTrend(query) {
  return request({
    url: "adsOnlineDuration/dataOfMonthlyTrend",
    method: 'get',
    params: query
  })
}

// 每年统计趋势图
export function onLineYearTrend(query) {
  return request({
    url: "adsOnlineDuration/dataOfYearlyTrend",
    method: 'get',
    params: query
  })
}

// 广告数据-实时数据-获取城市
export function getRealTimeCityList(query) {
  return request({
    url: "adsRealTimeData/cityList",
    method: 'get',
    params: query
  })
}
// 广告数据-实时数据-下拉参数菜单
export function getRealTimeInfoList(query) {
  return request({
    url: "adsRealTimeData/infoList",
    method: 'get',
    params: query
  })
}
// 广告数据-实时数据-实时数据
export function getRealTimeTraffic(query) {
  return request({
    url: "adsRealTimeData/realTimeTraffic",
    method: 'get',
    params: query
  })
}
// 广告数据-实时数据-模糊查询
export function getParamItem(query) {
  return request({
    url: "adsRealTimeData/getProjectName",
    method: 'get',
    params: query
  })
}


/***************在线时长******************* */
export function getAdsOverviewList(query) {
  return request({
    url: "adsOverview/list",
    method: 'get',
    params: query
  })
}

export function getGroupIndustry(query) {
  return request({
    url: "adsOverview/groupIndustry",
    method: 'get',
    params: query
  })
}

export function getNewDeviceOfCity(query) {
  return request({
    url: "adsOverview/countNewDeviceOfCity",
    method: 'get',
    params: query
  })
}

export function getNewDeviceOfProvince(query) {
  return request({
    url: "adsOverview/countNewDeviceOfProvince",
    method: 'get',
    params: query
  })
}

export function getDlFilterList(query) {
  return request({
    url: "deviceLabel/filterList",
    method: 'get',
    params: query
  })
}

export function getDlList(query) {
  return request({
    url: "deviceLabel/queryList",
    method: 'get',
    params: query
  })
}
