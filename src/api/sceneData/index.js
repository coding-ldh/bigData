import request from '@/utils/request'

export function sceneTrafficInSceneTop10(query) {
  return request({
    url: "sceneOverview/sceneTrafficInSceneTop10",
    method: 'get',
    params: query
  })
}

export function sceneTrafficInSceneTop10Detail(query) {
  return request({
    url: "sceneOverview/sceneTrafficInSceneTop10Detail",
    method: 'get',
    params: query
  })
}

export function sceneEquipmentQuantityInSceneTop10(query) {
  return request({
    url: "sceneOverview/sceneEquipmentQuantityInSceneTop10",
    method: 'get',
    params: query
  })
}

export function sceneEquipmentQuantityInSceneTop10Detail(query) {
  return request({
    url: "sceneOverview/sceneEquipmentQuantityInSceneTop10Detail",
    method: 'get',
    params: query
  })
}

export function filterValue(query) {
  return request({
    url: "sceneOverview/filterValue",
    method: 'get',
    params: query
  })
}

export function option(query) {
  return request({
    url: "sceneOverview/administrativeArea/option",
    method: 'get',
    params: query
  })
}
