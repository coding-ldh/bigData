import request from '@/utils/request'

export function getOverviewRate(query) {
  return request({
    url: "advBoard/getOverviewRate",
    method: 'get',
    params: query
  })
}

export function getSceneRate(query) {
  return request({
    url: "advBoard/getSceneRate",
    method: 'get',
    params: query
  })
}

export function getCityRate(query) {
  return request({
    url: "advBoard/getCityRate",
    method: 'get',
    params: query
  })
}

export function getNewDeviceOfCity(query) {
  return request({
    url: "advBoard/countNewDeviceOfCity",
    method: 'get',
    params: query
  })
}

export function getAiData(query) {
  return request({
    url: "advBoard/aiData",
    method: 'get',
    params: query
  })
}

export function getMapInfo(query) {
  return request({
    url: "advBoard/getMapProjectInfo",
    method: 'get',
    params: query
  })
}