//logs.js
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    text:[]
    },
  onLoad: function () {
    wx.clearStorageSync();
    this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    })
  },
  up: function () {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        wx.uploadFile({
          url: 'http://api.fentuapp.vip/index/File/file', //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            var data = res.data
            //do something
            console.log(res);
          },
          fail: err => {
            console.log(err);
          }
        })
      }
    })
  },
  confirm:function(e){
    console.log(e.detail.value);
    var that= this;
    wx.request({
      method: "POST",
      url: util.service + 'Other/test',
      data: {
        "text": e.detail.value ,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data.data.text);
        that.setData({
          text: res.data.data.text
        })
      }
    })
  }
})