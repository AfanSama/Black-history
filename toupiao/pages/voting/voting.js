// pages/voting/voting.js
const util = require('../../utils/util.js')
const temp = require('../../utils/temp.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: "海报定义海报是一种信息传递艺术，是一种大众化的宣传工具。 海报又称招贴画。是贴在街头墙上，挂在橱窗里的大幅画作，以其醒目的画面吸引路人的注意，20世纪从某种意义上来讲是政治宣传的世纪，海报作为当时的宣传途径也达到了顶峰，其中的两次世界大战、苏联革命与建设、西班牙内战更是政治海报创作的高峰期，尤其在二十世纪前五十年，是宣传海报大行其到的黄金时代。在十月革命胜利后不久的苏俄，首都莫斯科市中心邮电局的橱窗里贴满了海报，以便市民从这些不同表现形式的海报中了解革命形势。在学校里，海报常用于文艺演出、运动会、故事会、展览会、家长会、节庆日、竞赛游戏等。海报设计总的要求是使人一目了然。一般的海报通常含有通知性，所以主题应该明确显眼、一目了然（如xx比赛、打折等），接着概括出如时间、地点、附注等主要内容以最简洁的语句。海报的插图、布局的美观通常是吸引眼球的很好方法。在实际生活中，有比较抽象的和具体的。海报定义海报是一种信息传递艺术，是一种大众化的宣传工具。 海报又称招贴画。是贴在街头墙上，挂在橱窗里的大幅画作，以其醒目的画面吸引路人的注意，20世纪从某种意义上来讲是政治宣传的世纪，海报作为当时的宣传途径也达到了顶峰，其中的两次世界大战、苏联革命与建设、西班牙内战更是政治海报创作的高峰期，尤其在二十世纪前五十年，是宣传海报大行其到的黄金时代。在十月革命胜利后不久的苏俄，首都莫斯科市中心邮电局的橱窗里贴满了海报，以便市民从这些不同表现形式的海报中了解革命形势。在学校里，海报常用于文艺演出、运动会、故事会、展览会、家长会、节庆日、竞赛游戏等。海报设计总的要求是使人一目了然。一般的海报通常含有通知性，所以主题应该明确显眼、一目了然（如xx比赛、打折等），接着概括出如时间、地点、附注等主要内容以最简洁的语句。海报的插图、布局的美观通常是吸引眼球的很好方法。在实际生活中，有比较抽象的和具体的。",
    windowHeight: "",
    windowWidth: "",
    isShow:0,
    list: [{ "num": 10 }, { "num": 2 }, { "num": 3 }, { "num": 1 }, { "num": 5 }, { "num":6}]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    temp.init.apply(this);
    var that = this;
    let list =that.data.list;
    for (let i = 0; i < list.length;i++){
      list[i].ranking = "第"+util.toZhDigit(i+1)+"名";
    }
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
          list: list
        })
      }
    })
  },
  showSearch: function (e) {
    this.setData({
      isShow:1
    })
  },
  hideSearch:function(){
    this.setData({
      isShow: 0
    })
  },
  goBillInfo: function () {
    console.log();
  }
})