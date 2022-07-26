import request from '@/utils/request'

export function onlineDevicesInCityTop10(query) {
  return request({
    url: "adsOnlineDurationOverview/onlineDevicesInCityTop10",
    method: 'get',
    params: query
  })
}

export function onlineDevicesInSceneTop10(query) {
  return request({
    url: "adsOnlineDurationOverview/onlineDevicesInSceneTop10",
    method: 'get',
    params: query
  })
}

export function dataOfHourlyTrend(query) {
  return request({
    url: "adsOnlineDurationOverview/dataOfHourlyTrend",
    method: 'get',
    params: query
  })
}

export function dataOfMonthlyOrYearlyTrend(query) {
  return request({
    url: "adsOnlineDurationOverview/dataOfMonthlyOrYearlyTrend",
    method: 'get',
    params: query
  })
}

export function getOnlineDurationOviewData(query) {
  return request({
    url: "adsOnlineDurationOverview/data",
    method: 'get',
    params: query
  })
}

export function sceneTop10Detail(query) {
  return request({
    url: "adsOnlineDurationOverview/onlineDevicesInSceneTop10Detail",
    method: 'get',
    params: query
  })
}

export function onLineTop10Detail(query) {
  return request({
    url: "adsOnlineDurationOverview/onlineDevicesInCityTop10Detail",
    method: 'get',
    params: query
  })
}

export function getAreaData(query) {
  return request({
    url: "adsOnlineDurationOverview/administrativeArea/option",
    method: 'get',
    params: query
  })
}

export function filterValue(query) {
  return request({
    url: "adsOnlineDurationOverview/filterValue",
    method: 'get',
    params: query
  })
}

