// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/img/bannerx.png',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    billList: [
      '/img/cover.png',
      '/img/bill1.png',
      '/img/cover.png',
      '/img/cover.png',
      '/img/bill2.png'
    ]
    ,
    autoplay: false,
    interval: 5000,
    
    duration: 1000,
    boxcss:"0px 2.5px 5px rgba(255,178,250,.4), 0px 5px 15px rgba(174,37,169,.3)",
    // tab切换  
    currentTab: 0,
    tabList:["热门","公益","商业","促销","比赛","趣味"],
    tabindex:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("home1");
  },
  onReady:function(){
    console.log("home2");
  },
  onClick:function(){
    console.log("123");
  },
  bannerChange:function(e){
    console.log(e.detail.current);
    this.setData({
      boxcss: "0px 3px 5px rgba(255,178,250,.4), 0px 5px 10px rgba(174,37,169,.3)",
      currentTab: e.detail.current
    })
  },
  tabClick:function(e){
    this.setData({
      tabindex: e.target.dataset.index
    })
  },
  billClick: function (e) {
    wx.navigateTo({
      url: '../voting/voting?id=1'
    })
  }
})