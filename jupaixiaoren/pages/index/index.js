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
      duration: 1500,
      timingFunction: 'ease'
    })
    this.animation = animation
    this.animation.top("-310rpx").step();
    this.animation.opacity("1").step();
    this.setData({
      animationData: this.animation.export()
    })
  },
  subForm: function (res) {
    let text = res.detail.value.text.replace(/(^\s*)|(\s*$)/g, ""); ;
    if (text){
      wx.redirectTo({
        url: '../godmode/godmode?item=' + text
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '请输入您要说的话哦！！！！',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }
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
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function (userInfo) {
    //   //更新数据
    //   that.setData({
    //     userInfo: userInfo
    //   })
    // })
    this.bindTextAreaFocus();
  },
  popupIcon:function(){
    let textlist = ["此刻我很挂念你，请为我小心照顾自己", "你给我带来一生中最大的撞击，我会铭记此生", "如果非要给这个爱一个期限，我希望是一万年", "与你一见如故，是我今生最美丽的相遇", "一生至少有一次，为了谁而忘了自己","爱情正在到达现场"]
    let n = Math.ceil(Math.random() * 6)
    this.setData({
      txt: textlist[n]
    })
  }
})