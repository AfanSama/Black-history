// pages/type/type.js
const util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    typelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: util.service + "Activity/activity_class",
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          typelist:res.data.data
        })
      }
    })
  },
  elect:function(e){
    wx.navigateTo({
      url: '../createvote/createvote?id=' + e.target.dataset.id
    })
  }
})