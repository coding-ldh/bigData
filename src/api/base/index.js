import request from '@/utils/request'

// 设备类型，软件类型
export function getDeviceSoftType(query) {
  return request({
    url: "/basic/deviceType",
    method: 'get',
    params: query
  })
}
// 行业
export function getIndustry(query) {
  return request({
    url: "/basic/industry",
    method: 'get',
    params: query
  })
}
// 售卖类型
export function getSellMode(query) {
  return request({
    url: "/basic/sellMode",
    method: 'get',
    params: query
  })
}
// 地区选择
export function getArea(query) {
  return request({
    url: "/basic/area",
    method: 'get',
    params: query
  })
}
