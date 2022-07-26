
import request from '@/utils/request'

export function getMenuList(query) {
  return request({
    url: "menuManager/menuList",
    method: 'get',
    params: query
  })
}

export function ChangeMenuList(query) {
  return request({
    url: `menuManager/updateMenuById/${query.menuId}`,
    method: 'put',
    params: query
  })
}

export function AddMenuList(query) {
  return request({
    url: `menuManager/save`,
    method: 'post',
    params: query
  })
}


export function DeleteMenu(query) {
  return request({
    url: `menuManager/deleteMenuById/${query}`,
    method: 'delete',
    params: ''
  })
}


