//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {},
    userAccount: {},
    redList:{}
  },
  //提现
  getMoney: function () {
    wx.navigateTo({
      url: '../pay/pay'
    })
  },
  //红包记录
  getRecord: function () {
    wx.navigateTo({
      url: '../hbjl/hbjl'
    })
  },
  goRedPacket:function(){
    console.log("list")
  },
  goShare:function(){
    console.log('share');
    // wx.navigateTo({
    //   url: '../redpacket/redpacket'
    // })
  },
  onLoad: function () {
    wx.showLoading({
      title: '数据加载中...',
       mask: true
    }) 
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
    app.getList(function (redList){
      //更新数据
      console.log(redList);
      that.setData({
        redList: redList
      })
    },1,1,10)
  },
  onShow: function () {
    var that = this
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
        that.setData({
          userAccount: res.data.data
        })
        console.log(res.data.data)
      }
    })
  }
})
