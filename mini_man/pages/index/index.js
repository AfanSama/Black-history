//index.js
//获取应用实例


var app = getApp()
Page({
  data: {
    userInfo: {},
    items: [],
    animationData: {},
    txt:""
  },
  //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // show:function(){
  //   wx.navigateTo({
  //     url: '../animation/animation'
  //   })
  // },

  bindTextAreaFocus: function (e) {
    var animation = wx.createAnimation({
      duration: 750,
      timingFunction: 'ease',
    })
    this.animation = animation
    this.animation.top("-310rpx").step()
    this.setData({
      animationData: this.animation.export()
    })
  },
  subForm: function (res) {
    wx.navigateTo({
      url: '../godmode/godmode?item=' + res.detail.value.text
    })
  },
  // onShareAppMessage: function (res) {
  //   if (res.from === 'button') {
  //     // 来自页面内转发按钮
  //     console.log(res.target)
  //   }
  //   return {
  //     title: '举牌小人',
  //     success: function (res) {
  //       // 转发成功
  //       console.log('转发成功');
  //     },
  //     fail: function (res) {
  //       // 转发失败
  //     }
  //   }
  // },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      console.log(userInfo);

      that.setData({
        userInfo: userInfo
      })
    })
  }
})