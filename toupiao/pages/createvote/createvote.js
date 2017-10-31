// pages/createvote/createvote.js
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:1,
    list:["1","2","3"],
    focus:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
  },
  bindName:function(e){
    if (e.detail.value) {
      var fadeOutTimeout = setTimeout(() => {
        this.setData({ show1: true });
        clearTimeout(fadeOutTimeout);
      }, 600);
    }else{
      this.setData({
        show1: false
      })
    }
  },
  bindContact: function (e) {
    if (e.detail.value) {
      var fadeOutTimeout = setTimeout(() => {
        this.setData({ show2: true });
        clearTimeout(fadeOutTimeout);
      }, 600);
    }else{ 
      this.setData({
        show2: false
      })
    }
  },
  bindDateEnd: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateend: e.detail.value,
      showdateend:'out'
    })
  }, 
  bindDateOver: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      dateover: e.detail.value,
      showdateover: 'out'
    })
  },
  bindDescribe: function (e) {
  },
  bindAwards:function(e){
  },
  describe:function(){
    var describeHight = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    describeHight.height('400rpx').step()
    this.setData({
      describeHight: describeHight
    })
    var fadeOutTimeout = setTimeout(() => {
      this.setData({show3: true});
      clearTimeout(fadeOutTimeout);
    }, 600);
  },
  awards: function () {
    var awardsHight = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease',
    })
    awardsHight.height('400rpx').step()
    this.setData({
      awardsHight: awardsHight
    })
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ show4: true });
      clearTimeout(fadeOutTimeout);
    }, 600);
  },
  goCutInside:function(){
    wx.navigateTo({
      url: '../cutInside/cutInside'
    })
  },
  upImages: function () {
    wx.chooseImage({
      count: 7, // 默认9
      sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        for(let i=0;tempFilePaths.length>i;i++){
          wx.uploadFile({
            url: util.service +'File/file', //仅为示例，非真实的接口地址
            filePath: tempFilePaths[i],
            name: 'file',
            success: function (res) {
              var data = JSON.parse(res.data)
              //do something
              console.log(data.data.key);
            },
            fail: err => {
              console.log(err);
            }
          })
        }
      }
    })
  }
})