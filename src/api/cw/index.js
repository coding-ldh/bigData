import request from "@/utils/request";

//模糊查询
export function FuzzyQuery(query) {
  return request({
    url: "/temperature/filterValue",
    method: "get",
    params: query
  });
}

export function dataOfDailyTrend(query) {
  return request({
    url: "/temperature/dataOfDailyTrend",
    method: "get",
    params: query
  });
}

export function temperatureFilterValue(query) {
  return request({
    url: "/temperature/filterValue",
    method: "get",
    params: query
  });
}

export function dataOfMonthlyTrend(query) {
  return request({
    url: "/temperature/dataOfMonthlyTrend",
    method: "get",
    params: query
  });
}

export function dataOfYearlyTrend(query) {
  return request({
    url: "temperature/dataOfYearlyTrend",
    method: "get",
    params: query
  });
}

export function temperatureData(query) {
  return request({
    url: "temperature/data",
    method: "get",
    params: query
  });
}

export function getTemperatureDataList(query) {
  return request({
    url: "temperatureRecord/list",
    method: "get",
    params: query
  });
}

export function getTemperatureSelectList(query) {
  return request({
    url: "temperatureRecord/selectList",
    method: "get",
    params: query
  });
}
