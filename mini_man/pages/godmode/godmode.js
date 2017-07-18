// pages/godmode/godmode.js
var num = 0;
var y = 10;
var x = 40;
var sumX = 30;
var sumY = 7.5;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cls: "show"
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.str==1){
      this.setData({
        cls:"hide"
      })
    }
     num = 0;
     y = 10;
     x = 40;
     sumX = 30;
     sumY = 7.5;
   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var arr = this.options.item.split("");
    const ctx = wx.createCanvasContext('Afan');
    if (arr.length == 1) {
      sumX = 55;
      sumY = 20;
      ctx.scale(2, 2)
    }
    else if (arr.length == 2) {
      sumX = 60;
      sumY = 30;
      ctx.scale(1.5, 1.5)
    }
    else if (arr.length == 3) {
      sumX = 90;
      sumY = 80;
    } else if (arr.length == 4) {
      sumX = 70;
      sumY = 60;
    }else{
      sumX = 35;
      sumY = 7.5;
    }
    ctx.setFillStyle("#5bc8ff");
    
    ctx.fillRect(0, 0, 320 ,320)
    ctx.setFontSize(12);
    var init = [];
    listInit(init);
    var num;
    function listInit(a) {
      for (var i = 1; i <= 18; i++) {
        a.push(i);
      }
    }
    function list(a) {
      var random = Math.ceil(Math.random() * init.length) - 1;
      num = init[random];
      init.splice(random, 1);
    }
    for (var i = 1; i <= arr.length; i++) {
      if (init.length == 0) {
        listInit(init)
      }
      list(init);
      drawPerson(ctx,num, i, arr[i-1]);
    }

    ctx.draw();
    },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
      path: '/pages/godmode/godmode?item=' + this.options.item +"&str=1", 
      success: function (res) {
        // 转发成功
        console.log('转发成功');
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  gohome:function(){
    wx.navigateTo({
      url: '../index/index'
    })
  },
  saveImg:function(){
    wx.canvasToTempFilePath({
      canvasId: 'Afan',
      success: function (res) {
        wx.showLoading({
          title: '正在保存图片',
          mask: "true",
          success(res) {
            wx.hideLoading()
          }
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '已保存到手机相册',
              icon: 'success',
              duration: 2000
            })
          }
        })
      }
    })
  },
  drawOneMan: function (context, word, x, y) {
    context.save()
    var n = Math.ceil(Math.random() * 18)
    context.drawImage('../../imgs/' + n + '.png', x, y, this.data.man_width, this.data.man_height)
    context.setFontSize(18)
    context.setFillStyle('#000000')
    context.translate(x, y)
    context.rotate(40 * Math.PI / 180)
    context.fillText(word, 20, 1)
    context.restore()
  }
})

function drawPerson(ctx, img, index,txt,sum) {
  var br = y;
  y += 10;
  ctx.drawImage("/img/" + img + ".png", sumX + (x * num), sumY + y, 50, 57.5);
  ctx.save();
  ctx.setFillStyle('#000000');
  ctx.translate(sumX+ (x * num), sumY + y);
  ctx.rotate(Math.PI / 4.5);
  ctx.fillText(txt,19,-4);
  ctx.restore();
  num++;
  if (index % 6 == 0) {
    num = 0;
    y = br-10;
  }
}
