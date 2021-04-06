module.exports = {
  smtp: {
    get host() {
      return 'smtp.qq.com'
    },
    get user() {
      return '1340881930@qq.com'
    },
    get pass() {
      return 'aibopfwqyeoygiaj'
    },
    // code验证码
    get code() {
      return () => {
        return Math.random().toString(16).slice(4,8).toUpperCase()
      }
    },
    // expire过期时间   60s
    get expire() {
      return () => {
        return new Date().getTime() + 60*1000
      }
    }
  }
}