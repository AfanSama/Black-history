//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var token = wx.getStorageSync('token') || []
  },
  getUserInfo: function (cb) {
    wx.showLoading({
      title: '微信授权中',
      mask: true
    })
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {      
      //1、调用微信登录接口，获取code
      wx.login({
        success: function (r) {
          var code = r.code;//登录凭证
          if (code) {
            //2、调用获取用户信息接口
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
                //3.解密用户信息 获取unionId
                //...
                wx.request({
                  url: 'https://api.fentuapp.com.cn/Login/miniAppLogin',
                  method: 'POST',
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    'code': code,
                    'encryptedData': res.encryptedData,
                    'iv': res.iv
                  },
                  success: function (res) {
                    var boolen = wx.getStorageSync('token')
                    wx.setStorageSync('token', res.data.data)
                    wx.hideLoading()
                    if (!boolen) {
                      wx.navigateTo({
                        url: '../index/index'
                      })
                    }
                  }
                })
              },
              fail: function () {
                console.log('获取用户信息失败')
              }
            })

          } else {
            console.log('获取用户登录态失败！' + r.errMsg)
          }
        },
        fail: function () {
          callback(false)
        }
      })
      
    }
  },
  getList: function (cb, types, page, num) {
      wx.request({
        url: 'https://api.fentuapp.com.cn/Moneypacket/userRedpacket',
        method: 'GET',
        data: {
          'token': wx.getStorageSync("token"),
          'page': page,
          'type': types,
          'num': num
        },
        success: function (res) {
          typeof cb == "function" && cb(res.data)
          wx.hideLoading()
        }
      })
  },
  getAccount:function (cb){
    var that = this
    if (this.globalData.userAccount) {
      typeof cb == "function" && cb(this.globalData.userAccount)
    } else {
      wx.request({
        url: 'https://api.fentuapp.com.cn/Moneypacket/getAccount',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          'token': wx.getStorageSync("token")
        },
        success: function (res) {
          that.globalData.userAccount = res.data.data
          typeof cb == "function" && cb(that.globalData.userAccount)
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    userAccount:null
  }
})
