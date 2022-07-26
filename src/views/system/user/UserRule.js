

const re = /^[\s\u4e00-\u9fa5\!a-zA-Z0-9_-]{0,}$/;

export const validatePass = (rule, value, callback) => {
  if (!value) {
    return callback(new Error('密码不能为空'))
  }
  setTimeout(() => {
    if(!re.test(value)) {
      return callback(new Error('不能含非法字符'))
    } else {
      return callback()
    }
  })
}

export const validateAccount = (rule, value, callback) => {
  if(!value) {
    return callback(new Error('账号名不能为空'))
  }
  setTimeout(() => {
    if(!re.test(value)) {
      return callback(new Error('不能含非法字符'))
    } else {
      return callback()
    }
  })
}