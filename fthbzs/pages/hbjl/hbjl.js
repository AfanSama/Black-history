// pages/hbjl/hbjl.js
//获取应用实例  
var app = getApp()
Page({
  data: {
    /** 
        * 页面配置 
        */
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: 0,
    //分页
    page:1,
    pageSize:10,
    hasMoreData:true,
    redList:{},
    setRedList:{}
  },
  // 分页
  // onReachBottom: function (res) {
  //   var that = this;
  //   console.log(this.data.currentTab);
  //   if (this.data.currentTab==0){
  //   app.getList(function (redList) {
  //     //更新数据
  //     that.setData({
  //       redList: redList
  //     })
  //     }, 1, this.data.page, this.data.pageSize)
  //   console.log(this.data.redList)
  //   } else {
  //     app.getList(function (setRedList) {
  //       //更新数据
  //       that.setData({
  //         setRedList: setRedList
  //       })
  //     }, 2, this.data.page, this.data.pageSize)
  //     console.log(this.data.setRedList)
  //   }
  // },
  onLoad: function () {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    var that = this;
    /** 
     * 获取系统信息 
     */
    var list={};
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    app.getList(function (redList) {
      //更新数据
      that.setData({
        redList:redList
      })
    }, 1, 1, 20)
    app.getList(function (setRedList) {
      //更新数据
      that.setData({
        setRedList: setRedList
      })
      console.log(setRedList)
    }, 2, 1, 20)
  },
  /** 
     * 滑动切换tab 
     */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  }
})  