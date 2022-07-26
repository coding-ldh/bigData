
const re = /^[\s\u4e00-\u9fa5a-zA-Z0-9_-]{0,}$/;

export const validatePass = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('菜单名称不能为空'))
  }
  setTimeout(() => {
    if (!re.test(value)) {
      return callback(new Error('不能含非法字符'))
    } else {
      return callback()
    }
  })
}

export const validateIndex = (rule, value, callback) => {
  if (typeof value != 'number') {
    return callback(new Error('必须为数字'))
  } else if (!value) {
    return callback(new Error('不能为空'))
  } else if (value < 0 || value > 10000) {
    return callback(new Error('范围1-9999'))
  } else {
    return callback()
  }
}

export const validateOrderNum = (rule, value, callback) => {
  // console.log(value)
  if (typeof value != 'number') {
    return callback(new Error('必须为数字'))
  } else if (!value) {
    return callback(new Error('不能为空'))
  } else if (value < 0 || value > 100) {
    return callback(new Error('范围1-100'))
  } else if (parseInt(value)!==parseFloat(value)) {
    return callback(new Error(`不可输入小数,违规值${value}`))
  } else {
    return callback()
  }
}
// export const validateAccount = (rule, value, callback) => {
//   if(!value) {
//     return callback(new Error('账号名不能为空'))
//   }
//   setTimeout(() => {
//     if(!re.test(value)) {
//       return callback(new Error('不能含非法字符'))
//     } else {
//       return callback()
//     }
//   })
// }