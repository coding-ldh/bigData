import request from '@/utils/request'

export function getAds() {
  return request({
    url: '/index/ads',
    method: 'get'
  })
}

export function getAliveTraffic() {
  return request({
    url: '/index/realPersonFlow',
    method: 'get'
  })
}

export function getTemperature() {
  return request({
    url: '/index/temperature',
    method: 'get'
  })
}

export function getAi() {
  return request({
    url: '/index/ai',
    method: 'get'
  })
}

export function getApp() {
  return request({
    url: '/index/app',
    method: 'get'
  })
}

export function getDevice() {
  return request({
    url: '/index/device',
    method: 'get'
  })
}

export function getDeviceTrend() {
  return request({
    url: '/index/deviceTrend',
    method: 'get'
  })
}

export function getAiRealDataAndTrend() {
  return request({
    url: '/index/aiRealDataAndTrend',
    method: 'get'
  })
}

// item data
export function getActiveDeviceTypeRate() {
  return request({
    url: '/index/activeDeviceTypeRate',
    method: 'get'
  })
}

export function getActiveDeviceSceneRate() {
  return request({
    url: '/index/activeDeviceSceneRate',
    method: 'get'
  })
}

export function getDviceAndProjectDistribution() {
  return request({
    url: '/index/dviceAndProjectDistribution',
    method: 'get'
  })
}
