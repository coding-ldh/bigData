import request from '@/utils/request'

export function getAiOverviewData() {
  return request({
    url: "/aiOverview/data",
    method: 'get',
    params: {}
  })
}

export function dataOfDailyAllNumAndDailyValidNum(query) {
  return request({
    url: "/aiOverview/dataOfDailyAllNumAndDailyValidNum",
    method: 'get',
    params: query
  })
}

export function dateOfIndustryConversation(query) {
  return request({
    url: "/aiOverview/dateOfIndustryConversation",
    method: 'get',
    params: query
  })
}

export function dateOfProjectConversation(query) {
  return request({
    url: "/aiOverview/dateOfProjectConversation",
    method: 'get',
    params: query
  })
}

export function dataOfdialogueEffect(query) {
  return request({
    url: "/aiOverview/dataOfdialogueEffect",
    method: 'get',
    params: query
  })
}

export function robotConversation(query) {
  return request({
    url: "/aiSemanticEffect/robotConversation",
    method: 'get',
    params: query
  })
}

export function getAiSemanticEffectdata(query) {
  return request({
    url: "/aiSemanticEffect/data",
    method: 'get',
    params: query
  })
}

export function aiSemanticEffectFilterValue() {
  return request({
    url: "/aiSemanticEffect/filterValue",
    method: 'get',
    params: {}
  })
}

export function getAreaOption(query) {
  return request({
    url: "/aiSemanticEffect/administrativeArea/option",
    method: 'get',
    params: query
  })
}

export function intentionOfTop10List(query) {
  return request({
    url: "/aiOverview/intentionOfTopList",
    method: 'get',
    params: query
  })
}

export function effectIntentionOfTop10List(query) {
  return request({
    url: "/aiSemanticEffect/intentionOfTopList",
    method: 'get',
    params: query
  })
}

// AI语义效果-项目-模糊查询
export function getProjectNameList(query) {
  return request({
    url: "/aiSemanticEffect/projectNameList",
    method: 'get',
    params: query
  })
}

export function getAiEffectTrend(query) {
  return request({
    url: "/aiSemanticEffect/trend",
    method: 'get',
    params: query
  })
}

export function getAvrFilterList(query) {
  return request({
    url: "/aiVoiceRecord/filterList",
    method: 'get',
    params: query
  })
}

export function getProjectionNameList(query){
  return request({
    url:"/aiVoiceRecord/projectNameList",
    method:'get',
    params:query
  })
}

export function getAvrList(query) {
  return request({
    url: "/aiVoiceRecord/list",
    method: 'get',
    params: query
  })
}




// ****************   语义热词   ****************
// 热词列表
export function getHotWordList(query) {
  return request({
    url: "aiHotWord/hotWord",
    method: 'get',
    params: query
  })
}
// 关键字搜索对话
export function getHotWordDetail(query) {
  return request({
    url: "aiHotWord/detail",
    method: 'get',
    params: query
  })
}

// 获取参数数据
export function getParamList(query) {
  return request({
    url: "aiHotWord/filterValue",
    method: 'get',
    params: query
  })
}

// 筛选项目参数
export function getParamItem(query) {
  return request({
    url: "aiHotWord/filterProjectName",
    method: 'get',
    params: query
  })
}

// 获取地区参数
export function getParamArea(query) {
  return request({
    url: "aiHotWord/filterProjectProvince",
    method: 'get',
    params: query
  })
}


export function getSoftSceneArea(query) {
  return request({
    url: "aiSoftWareScene/area",
    method: 'get',
    params: query
  })
}

export function getSortSceneDeviceType(query) {
  return request({
    url: "/aiSoftWareScene/deviceType",
    method: 'get',
    params: query
  })
}

export function getSortSceneIndustry(query) {
  return request({
    url: "aiSoftWareScene/industry",
    method: 'get',
    params: query
  })
}

export function getSortSceneList(query) {
  return request({
    url: "aiSoftWareScene/list",
    method: 'get',
    params: query
  })
}

export function getSortScenes(query) {
  return request({
    url: "aiSoftWareScene/scene",
    method: 'get',
    params: query
  })
}

export function getSortSceneDepart(query) {
  return request({
    url: "aiSoftWareScene/department",
    method: 'get',
    params: query
  })
}

export function getSortSceneDiseaseTop100(query) {
  return request({
    url: "/aiSoftWareScene/diseaseTop100",
    method: 'get',
    params: query
  })
}

export function getSceneTrigger(query) {
  return request({
    url: "aiSoftWareScene/trigger",
    method: 'get',
    params: query
  })
}

export function getDiseaseTop100(query) {
  return request({
    url: "aiSoftWareScene/hospital/diseaseTop100",
    method: 'get',
    params: query
  })
}

export function getDepartment(query) {
  return request({
    url: "aiSoftWareScene/hospital/department",
    method: 'get',
    params: query
  })
}

export function getSceneVar(query) {
  return request({
    url: "aiSoftWareScene/aiSoftWareSceneVar",
    method: 'get',
    params: query
  })
}

export function getSceneStaticsData(query) {
  return request({
    url: "aiSoftWareScene/aiSoftWareSceneData",
    method: 'get',
    params: query
  })
}