(function($) {
  $.fn.date = function(options) {
    var that = $(this);
    var docType = $(this).is('input');
    var nowdate = new Date();
    var indexY = 1,
      indexM = 1;
    var initY = parseInt((nowdate.getYear() + '').substr(1, 2));
    var initM = parseInt(nowdate.getMonth() + '') + 1;
    var yearScroll = null,
      monthScroll = null;
    $.fn.date.defaultOptions = {
      title: '请选择年月',
      beginyear: 2000, //日期--年--份开始
      endyear: nowdate.getFullYear(), //日期--年--份结束
      beginmonth: 1, //日期--月--份结束
      endmonth: 12, //日期--月--份结束
      curdate: false, //打开日期是否定位到当前日期
      mode: null, //操作模式（滑动模式）
      event: "click", //打开日期插件默认方式为点击后后弹出日期
      isShowByDefault: false,
      isSetFinancialDefaultDateValue: false
    }
    var opts = $.extend(true, {}, $.fn.date.defaultOptions, options);
    if (opts.isSetFinancialDefaultDateValue) {
      if (opts.beginyear < opts.endyear) {
        initY = ((opts.endyear - 1) + '').substr(2, 2);
      } else if (opts.beginyear = opts.endyear) {
        initY = (opts.endyear + '').substr(2, 2);
      }
    }
    if (opts.isShowByDefault) {
      showDatePicker()
    }
    that.bind(opts.event, showDatePicker);

    function showDatePicker() {
      createUL();
      init_iScrll();
      extendOptions();
      that.blur();
      refreshDate();
      bindButton();
    }

    function refreshDate() {
      yearScroll.refresh();
      monthScroll.refresh();
      resetInitDete();
      yearScroll.scrollTo(0, initY * 40, 100, true);
      monthScroll.scrollTo(0, initM * 40 - 40, 100, true);
    }

    function resetIndex() {
      indexY = 1;
      indexM = 1;
    }

    function resetInitDete() {
      if (opts.curdate) {
        return false;
      } else if (that.val() === '') {
        if (that.children('input').val() === '') {
          return false;
        }
        initY = parseInt(that.children('input').val().substr(2, 2));
        initM = parseInt(that.children('input').val().substr(5, 2));
      } else {
        initY = parseInt(that.val().substr(2, 2));
        initM = parseInt(that.val().substr(5, 2));
      }
    }

    function bindButton() {
      resetIndex();
      $("#yearwrapper ul li").unbind('click').click(function() {
        if ($(this).hasClass("placeholder")) {
          return false;
        }
        var target = $(this).prev('li');
        yearScroll.scrollToElement(target[0]);
        indexY = $(this).attr('data-params');
        $("#dateconfirm").removeClass("disabled");
      });
      $("#monthwrapper ul li").unbind('click').click(function() {
        if ($(this).hasClass("placeholder")) {
          return false;
        }
        var target = $(this).prev('li');
        monthScroll.scrollToElement(target[0]);
        indexM = $(this).attr('data-params');
        $("#dateconfirm").removeClass("disabled");
      });
      $("#dateshadow").unbind('click').click(function() {
        $("#datePage").hide();
        $("#dateshadow").hide();
      });
      $("#dateconfirm").unbind('click').click(function() {
        if ($(this).hasClass('disabled')) {
          return false;
        }
        if (indexY !== undefined && indexY !== '') {
          indexY = parseInt(parseFloat(indexY).toFixed(0));
        }
        if (indexM !== undefined && indexM !== '') {
          indexM = parseInt(parseFloat(indexM).toFixed(0));
        }
        var datestr = $("#yearwrapper ul li:eq(" + indexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + indexY + ")").html().length - 1) + "-" +
          $("#monthwrapper ul li:eq(" + indexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + indexM + ")").html().length - 1);
        if (docType) {
          that.val(datestr);
          that.trigger('input');
        } else {
          that.children('input').val(datestr);
          that.children('input').trigger('input');
        }
        $("#datePage").hide();
        $("#dateshadow").hide();
      });
      $("#datecancle").click(function() {
        $("#datePage").hide();
        $("#dateshadow").hide();
      });
    }

    function extendOptions() {
      $("#datePage").show();
      $("#dateshadow").show();
    }
    //日期滑动
    function init_iScrll() {
      var oldIndexY = parseInt(indexY.toFixed(0));
      var oldIndexM = parseInt(indexM.toFixed(0));
      var strY = $("#yearwrapper ul li:eq(" + oldIndexY + ")").html().substr(0, $("#yearwrapper ul li:eq(" + oldIndexY + ")").html().length - 1);
      var strM = $("#monthwrapper ul li:eq(" + oldIndexM + ")").html().substr(0, $("#monthwrapper ul li:eq(" + oldIndexM + ")").html().length - 1);
      yearScroll = new iScroll("yearwrapper", {
        snap: "li",
        vScrollbar: false,
        onScrollMove: function() {
          $("#dateconfirm").addClass("disabled");
        },
        onScrollEnd: function() {
          indexY = (this.y / 40) * (-1) + 1;
          $("#dateconfirm").removeClass("disabled");
        }
      });
      monthScroll = new iScroll("monthwrapper", {
        snap: "li",
        vScrollbar: false,
        onScrollMove: function() {
          $("#dateconfirm").addClass("disabled");
        },
        onScrollEnd: function() {
          indexM = (this.y / 40) * (-1) + 1;
          $("#dateconfirm").removeClass("disabled");
        }
      });
    }

    function createUL() {
      CreateDateUI();
      $("#yearwrapper ul").html(createYEAR_UL());
      $("#monthwrapper ul").html(createMONTH_UL());
    }

    function CreateDateUI() {
      var str = '<div id="dateshadow"></div>' +
        '<div id="datePage" class="page">' +
        '<section>' +
        '<div id="datetitle">' + opts.title + '</div>' +
        '<div id="datemark"></div>' +
        '<div id="datescroll">' +
        '<div id="yearwrapper">' +
        '<ul></ul>' +
        '</div>' +
        '<div id="monthwrapper">' +
        '<ul></ul>' +
        '</div>' +
        '</div>' +
        '</section>' +
        '<footer id="dateFooter">' +
        '<div id="setcancle">' +
        '<ul>' +
        '<li id="dateconfirm">确定</li>' +
        '<li id="datecancle">取消</li>' +
        '</ul>' +
        '</div>' +
        '</footer>' +
        '</div>'
      $("#datePlugin").html(str);
    }

    function createYEAR_UL() {
      var str = '<li class="placeholder">&nbsp;</li>';
      for (var i = opts.beginyear; i <= opts.endyear; i++) {
        str += '<li data-params="' + (i - opts.beginyear + 1) + '">' + i + '年</li>';
      }
      return str + '<li class="placeholder">&nbsp;</li>';
    }

    function createMONTH_UL() {
      var str = '<li class="placeholder">&nbsp;</li>';
      for (var i = opts.beginmonth; i <= opts.endmonth; i++) {
        if (i < 10) {
          j = "0" + i;
        } else {
          j = i;
        }
        str += '<li data-params="' + (i - opts.beginmonth + 1) + '">' + j + '月</li>';
      }
      return str + '<li class="placeholder">&nbsp;</li>';
    }
  }
})(jQuery);