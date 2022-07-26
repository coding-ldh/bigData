import request from '@/utils/request'

export function getArea(query) {
  return request({
    url: "projectoverview/area",
    method: 'get',
    params: query
  })
}

export function getDeviceOption(query) {
  return request({
    url: "projectoverview/deviceType",
    method: 'get',
    params: query
  })
}

export function getHardDeviceOption(query) {
  return request({
    url: "projectoverview/hardwareType",
    method: 'get',
    params: query
  })
}

export function getProjectOption(query) {
  return request({
    url: "projectoverview/projectName",
    method: 'get',
    params: query
  })
}

export function getDeviceModel(query) {
  return request({
    url: "projectoverview/deviceModel/data",
    method: 'get',
    params: query
  })
}

export function getSceneOption(query) {
  return request({
    url: "projectoverview/scenes",
    method: 'get',
    params: query
  })
}

export function getOverviewBase(query) {
  return request({
    url: "projectoverview/overview/basic",
    method: 'get',
    params: query
  })
}

export function getOverviewCard(query) {
  return request({
    url: "projectoverview/overview/card",
    method: 'get',
    params: query
  })
}

export function getOverviewTrend(query) {
  return request({
    url: "projectoverview/overview/trend",
    method: 'get',
    params: query
  })
}

export function getSellModelArea(query) {
  return request({
    url: "projectoverview/sellModel/area",
    method: 'get',
    params: query
  })
}

export function getSellModelData(query) {
  return request({
    url: "projectoverview/sellModel/data",
    method: 'get',
    params: query
  })
}

export function getSellModelOption(query) {
  return request({
    url: "projectoverview/sellModel/option",
    method: 'get',
    params: query
  })
}

export function getSceneList(query) {
  return request({
    url: "projectoverview/scene/list",
    method: 'get',
    params: query
  })
}

export function getAiVoice(query) {
  return request({
    url: "projectoverview/overview/aivoice",
    method: 'get',
    params: query
  })
}

export function getAiVoiceHour(query) {
  return request({
    url: "projectoverview/overview/aivoiceHour",
    method: 'get',
    params: query
  })
}

export function getTop10CityList(query) {
  return request({
    url: "projectoverview/top10city/list",
    method: 'get',
    params: query
  })
}

export function getTop10ProjectList(query) {
  return request({
    url: "projectoverview/top10project/list",
    method: 'get',
    params: query
  })
}

export function getTop10ProvinceList(query) {
  return request({
    url: "projectoverview/top10province/list",
    method: 'get',
    params: query
  })
}

export function getDeviceMap(query) {
  return request({
    url: "projectoverview/deviceMap",
    method: 'get',
    params: query
  })
}

export function getProjectMap(query) {
  return request({
    url: "projectoverview/projectMap",
    method: 'get',
    params: query
  })
}

export function getVersionOption(query) {
  return request({
    url: "/projectoverview/version",
    method: 'get',
    params: query
  })
}

export function getVersionModelData(query) {
  return request({
    url: "projectoverview/versionDistribution/data",
    method: 'get',
    params: query
  })
}
/*       项目场景列表         */

export function getProjectSceneList(query) {
  return request({
    url: "projectoverview/overview/list",
    method: 'get',
    params: query
  })
}