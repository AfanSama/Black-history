function init() {
  var that = this;
  that.goBill = function (e) {
    console.log("模板");
    wx.navigateTo({
      url: '../billinfo/billinfo?id=' + e.target.dataset
    })
  }
  that.addVote = function (e) {
    console.log("addVote");
  }
};
module.exports = {
  init: init
};

