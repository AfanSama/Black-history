// pages/pay/pay.js
var util = require('../../utils/md5.js')
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    moeny:"",
    userAccount:{},
    click:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    app.getAccount(function (userAccount) {
      //更新数据
      that.setData({
        userAccount: userAccount
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  
  formSubmit: function (e) {
    var items = e.detail.value;
    var that = this;
    that.setData({
      click:true
    })
    setTimeout(() => {
      if (items.phone == null || items.phone == "") {
        this.setData(
          { popErrorMsg: "手机号码内容不能为空" }
        );
        this.ohShitfadeOut();
        return;
      } else if (items.userName == null || items.userName == "") {
        this.setData(
          { popErrorMsg: "真实姓名不能为空" }
        );
        this.ohShitfadeOut();
        return;
      } else if (that.data.userAccount.account < items.money){
        this.setData(
          { popErrorMsg: "提现金额不能大于账户余额" }
        );
        this.ohShitfadeOut();
        return;
      }else {
        var t = Date.parse(new Date()) / 1000;
        var s = randomString(8);
        var key = "MIIEvQIBADANBgkqhkiG9w0B";
        var sign = (t + key + s).toUpperCase();
        //提现
        wx.showLoading({
          title: '提现中...',
          mask: true
        })
        wx.login({
          success: function (r) {
            wx.request({
              url: 'https://api.fentuapp.com.cn/Weixin/weixinTransfer',
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "t":t,
                "s":s,
                "sign": util.md5(sign)
              },
              data: {
                'code': r.code,
                'reUserName': items.userName,
                'amount': items.money,
                'mobile': items.phone,
                'type': 0
              },
              success: function (res) {
                if (res.data.errcode == 0) {
                  that.setData(
                    {past: that.data.userAccount.account}
                  );
                  var slow = setTimeout(() => {
                    that.formReset();
                    clearTimeout(slow);
                  }, 3000);
                } else {
                  that.setData(
                    { popErrorMsg: res.data.errstr }
                  );
                  wx.hideLoading();
                  that.ohShitfadeOut();
                  return;
                }
              }
            })
          }
        })
      }
    }, 100)
  },
  formReset() {
    var that = this;
    wx.request({
      url: 'https://api.fentuapp.com.cn/Moneypacket/getAccount',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        'token': wx.getStorageSync("token")
      },
      success: function (res) {
        that.setData({
          userAccount: res.data.data,
          now: res.data.data.account
        })
          that.verify();
      }
    })
  },
  verify() {
      var that = this;
      if (that.data.past == that.data.now) {
        that.setData(
          { popErrorMsg: "提现失败，您的真实姓名有误" }
        );
        wx.hideLoading();
        that.ohShitfadeOut();
      } else {
        that.setData({
          name: "",
          phone: "",
          moeny: "",
          click:false 
        })
        wx.hideLoading();
        wx.showModal({
          title: '提现成功',
          showCancel: false,
          content:"如需领取更多红包，请在各大应用商店下载分图APP，进入红包广场每天都能领红包！！！",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
  },
  ohShitfadeOut() {
    wx.showModal({
      title: '提示',
      showCancel:false,
      content: this.data.popErrorMsg,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '',click:false });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  }, 
  bindNameInput: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  total: function (e) {
    console.log(this.data.name);
    console.log(this.data.phone);
  }
})

function randomString(len) {
  　　len = len || 32;
  　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  　　var maxPos = $chars.length;
  　　var pwd = '';
  　　for (var i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  　　}
  　　return pwd;
}