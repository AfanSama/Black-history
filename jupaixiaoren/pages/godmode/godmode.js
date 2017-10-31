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
    cls: "show",
    imgUrls: [
      'http://image.fentuapp.com.cn/jupai/huoying.png',
      'http://image.fentuapp.com.cn/jupai/katong.png',
      'http://image.fentuapp.com.cn/jupai/xiongmao.png',
      'http://image.fentuapp.com.cn/jupai/huluwa.png',
      'http://image.fentuapp.com.cn/jupai/qidai_1.png',
    ],
    tab:"show",
    tabs:"hide",
    tabsUrl:""
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
  subBtn: function (val) {
    let types = val.currentTarget.dataset.val;
    if (types == 0) {
      num = 0;
      y = 10;
      x = 40;
      sumX = 30;
      sumY = 7.5;
      const ctx = wx.createCanvasContext('Afan');
      ctx.clearActions();
      this.drawOneMan();
    }else if(types == 4){
      wx.showModal({
        title: '提示',
        content: '更多小人模型，UI设计狮正在加班中！！！！',
        confirmText:"继续加班",
        cancelText:"我不忍心",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    }else{
      this.drawImages(types)
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.drawOneMan();
  },
  drawOneMan: function () {
      wx.showLoading({
        title: '女娲捏人中...',
        mask:true
      })
      var that=this;
      that.setData({
        tab: "show",
        tabs: "hide"
      });
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
      } else {
        sumX = 35;
        sumY = 7.5;
      }
      ctx.setFillStyle("#2eb7fd");

      ctx.fillRect(0, 0, 320, 320)
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
        drawPerson(ctx, num, i, arr[i - 1]);
      }
      ctx.draw();
      var slow = setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'Afan',
          success: function (res) {
            that.setData({
              tabsUrl: res.tempFilePath
            })
            console.log(res.tempFilePath);
          }
        })
        clearTimeout(slow);
        wx.hideLoading()
      }, 1000);
  },
  drawImages: function (types) {
    wx.showLoading({
      title: '女娲捏人中...',
      mask: true
    })
    var that=this;
    var t = this.options.item;
    wx.request({
      url: 'https://api.fentuapp.com.cn/Other/jupai', //仅为示例，并非真实的接口地址
      method:"POST",
      data: {
        jpdw: types,
        jptxt: t,
        setbg:"#2eb7fd"
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      success: function (res) {
        wx.downloadFile({
          url: "https://img.gs/dctltwccbr/fit/"+res.data, //仅为示例，并非真实的资源
          success: function (result) {
            var slow = setTimeout(() => {
              that.setData({
                tab: "hide",
                tabs: "show",
                tabsUrl: result.tempFilePath
              });
              clearTimeout(slow);
              wx.hideLoading()
            }, 1000);
          }
        })
      }
    })
  }, 
  nextImg:function(){
    wx.redirectTo({
      url: '../saveimg/saveimg?url=' + this.data.tabsUrl + "&item=" + this.options.item
    })
  }
})

function drawPerson(ctx, img, index,txt,sum) {
  var br = y;
  y += 10;
  ctx.drawImage("/img/" + img + ".png", sumX + (x * num), sumY + y, 70, 71.5);
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
