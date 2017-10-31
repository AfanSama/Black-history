// pages/saveimg/saveimg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      url: options.url
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '举牌小人',
      path: '/pages/godmode/godmode?item=' + this.options.item + "&str=1",
      imageUrl: this.options.url,
      success: function (res) {
        // 转发成功
        console.log('转发成功');
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  gohome: function () {
    wx.redirectTo({
      url: '../index/index'
    })
  },
  saveImg: function () {
    console.log(this.options.url);
    wx.saveImageToPhotosAlbum({
      filePath: this.options.url,
      success(res) {
        console.log(res);
        wx.showToast({
          title: '已保存到手机相册',
          icon: 'success',
          duration: 2000
        })
      }
    })
  }
})

