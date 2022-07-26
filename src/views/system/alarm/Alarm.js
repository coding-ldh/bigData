import { validEmail } from "@/utils/validate.js";
const re = /^\\d+$/
const validThreshold = value => {
  value <= 0 ? true : false;
};
export const validateEmail = (rule, value, callback) => {
  if (!value) {
    return callback();
  }
  setTimeout(() => {
    if (!validEmail(value.trim())) {
      return callback(new Error("请输入正确的邮箱格式"));
    } else {
      return callback();
    }
  });
};

export const validateThreshold = (rule, value, callback) => {
  // if (!value) {
  //   return callback(new Error("阙值不能为空或者零"));
  // }
  setTimeout(() => {
    if (!(/(^[1-9]\d*$)/.test(value))) {
      return callback(new Error("波动阈值只能为非负整数"));
    } else {
      return callback();
    }
  });
};
