
import request from '@/utils/request'


export function getItemListFilterValue(query) {
  return request({
    url: "projectList/filterValue",
    method: 'get',
    params: query
  })
}
/********* 模糊查询 *********/ 
export function getItemListProjectIdArrSearch(query) {
  return request({
    url: "projectList/projectIdArr",
    method: 'get',
    params: query
  })
}

export function getItemListProjectNameSearch(query) {
  return request({
    url: "projectList/projectNameArr",
    method: 'get',
    params: query
  })
}

export function getItemListCompanyOwnedArrSearch(query) {
  return request({
    url: "projectList/companyOwnedArr",
    method: 'get',
    params: query
  })
}
export function getItemListProjectCreatorArrSearch(query) {
  return request({
    url: "projectList/projectCreatorArr",
    method: 'get',
    params: query
  })
}
export function getItemListCustomerNameArrSearch(query) {
  return request({
    url: "projectList/customerNameArr",
    method: 'get',
    params: query
  })
}


export function getItemListCityArr(query) {
  return request({
    url: "projectList/getCityArr",
    method: 'get',
    params: query
  })
}
export function getItemListPage(query) {
  return request({
    url: "projectList/page",
    method: 'get',
    params: query
  })
}

//   ****** 查看设备 ******
export function getItemListDetailFilterValue(query) {
  return request({
    url: "checkDevice/filterValue",
    method: 'get',
    params: query
  })
}
export function getItemListDetailCityArr(query) {
  return request({
    url: "checkDevice/getCityArr",
    method: 'get',
    params: query
  })
}
export function getItemListDetailPage(query) {
  return request({
    url: "checkDevice/page",
    method: 'get',
    params: query
  })
}
/********* 模糊查询 *********/ 
// 项目id
export function getItemListDetailCompanyOwnedArrSearch(query) {
  return request({
    url: "checkDevice/companyOwnedArr",
    method: 'get',
    params: query
  })
}
export function getItemListDetailSalesPersonArrSearch(query) {
  return request({
    url: "checkDevice/salesPersonArr",
    method: 'get',
    params: query
  })
}
export function getItemListDetailDeployerArrSearch(query) {
  return request({
    url: "checkDevice/deployerArr",
    method: 'get',
    params: query
  })
}


