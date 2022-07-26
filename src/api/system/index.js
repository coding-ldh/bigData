import request from '@/utils/request'

export function addUser(data) {
  return request({
    url: "userManager/addUser",
    method: 'post',
    data
  })
}

export function getUserList(query) {
  return request({
    url: "userManager/userList",
    method: 'get',
    params: query
  })
}

export function updateUserStatus(data) {
  return request({
    url: "userManager/updateUserStatus",
    method: 'post',
    data
  })
}

export function getRoleNameList(query) {
  return request({
    url: "userManager/roleNameList",
    method: 'get',
    params: query
  })
}

export function queryUser(query) {
  return request({
    url: "userManager/queryUser",
    method: 'get',
    params: query
  })
}

export function editorUser(userId, data) {
  return request({
    url: `userManager/editor/${userId}`,
    method: 'put',
    data
  })
}

export function addRole(data) {
  return request({
    url: "roleManager/addRole",
    method: 'post',
    data
  })
}

export function deleteRoleById(roleId) {
  return request({
    url: `roleManager/deleteRoleById/${roleId}`,
    method: 'delete',
  })
}

export function getRoles(query) {
  return request({
    url: "roleManager/roleList",
    method: 'get',
    params: query
  })
}

export function getSelectTree() {
  return request({
    url: "roleManager/treeSelect",
    method: 'get',
  })
}

export function getSelectedTree(roleId) {
  return request({
    url: `roleManager/treeSelectById/${roleId}`,
    method: 'get',
  })
}

export function updateRole(data, roleId) {
  return request({
    url: `roleManager/updateRole/${roleId}`,
    method: 'put',
    data
  })
}

export function getAlarmnotify() {
  return request({
    url: '/alarmnotify',
    method: 'get',
  })
}

export function updateAlarmnotify(data) {
  return request({
    url: '/alarmnotify',
    method: 'put',
    data
  })
}