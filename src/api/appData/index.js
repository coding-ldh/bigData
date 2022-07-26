import request from '@/utils/request'

export function getAdvEventSelectList(query) {
  return request({
    url: "/advEvent/selectList",
    method: 'get',
    params: query
  })
}

export function getAdvEventPage(query) {
  return request({
    url: "/advEvent/page",
    method: 'get',
    params: query
  })
}

export function getAdvDetailSelectList(query) {
  return request({
    url: "/advEventDetail/selectList",
    method: 'get',
    params: query
  })
}

export function getAdvDetailList(query) {
  return request({
    url: "/advEventDetail/list",
    method: 'get',
    params: query
  })
}

export function getUploadRecordParamList(query){
  return request({
    url: "/advEventDetailList/selectList",
    method: 'get',
    params: query
  }) 
}


export function getUploadRecordDataList(query){
  return request({
    url: "/advEventDetailList/page",
    method: 'get',
    params: query
  }) 
}
