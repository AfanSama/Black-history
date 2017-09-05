$(function() {
    Bmob.initialize("40f2021becdf993b8ea48f90cc4ad2c9", "6541aa61f59b385fe4b4e5f7719e74f7")
});
function getRedPacket(code) {
    sessionStorage.clear();
    getUserinfo(code)
}
function getUserinfo(code) {
    Bmob.Cloud.run("wechatRegister", {
        "code": code
    },
    {
        success: function(result) {
            var userinfo = JSON.parse(result);
            if (userinfo.code == 200) {
                saveUserinfo(userinfo)
            } else {
                confiremError("请重扫面二维码领取红包");
                console.log("error:登陆失败")
            }
        },
        error: function(error) {
            console.log(error)
        }
    })
}
function openRed() {
    $(".open-red").addClass("change").one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend",
    function() {
        $(this).removeClass("change")
    });
    var Request = new Object();
    Request = GetRequest();
    var gohref = "openredpk.html?go=" + new Date().getTime() + "&rid=" + Request["rid"];
    location.href = gohref
}
function saveUserinfo(userinfo) {
    sessionStorage.setItem("userinfo", JSON.stringify(userinfo));
    var Request = new Object();
    Request = GetRequest();
    Bmob.Cloud.run("getRedPacket", {
        "redPacketID": Request["rid"],
        "userID": userinfo.result.userID
    },
    {
        success: function(result) {
            var items = JSON.parse(result);
            if (items.code == "200") {
                resultRpk(items);
                removeloading();
                $(".red-pk .contet").show()
            } else {
                if (items.code == "1000" || items.code == "1001") {
                    removeloading();
                    confiremError(items.text)
                }
                if (items.code == "1002") {
                    resultRpk(items);
                    removeloading();
                    $(".open-redpk").hide();
                    $(".red-pk .title").text(items.text);
                    $(".red-pk .contet").show()
                }
                if (items.code == "1003" || items.code == "1004") {
                    resultRpk(items);
                    removeloading();
                    $(".open-redpk").hide();
                    $(".red-pk .title").text(items.text);
                    $(".sub").text("").append("<a href='javascript:void(0)' onClick='openRed()'>点击查看详情></a>");
                    $(".red-pk .contet").show()
                }
            }
        },
        error: function(error) {
            console.log(error)
        }
    });
    wxShare(window.location.href.split("#")[0], Request["rid"], userinfo)
}
function resultRpk(ojb) {
    rpk = ojb;
    $(".red-pk .title").text(ojb.intro);
    $(".red-pk .head p").text(ojb.userName);
    $(".red-pk .head img").attr({
        "src": ojb.userAvatar
    });
    sessionStorage.setItem("ojb", JSON.stringify(ojb))
}
function getrpk() {
    var items = JSON.parse(sessionStorage.getItem("ojb"));
    var userinfo = JSON.parse(sessionStorage.getItem("userinfo"));
    items.userid = userinfo.result.userID;
    items.avatar = userinfo.result.avatar;
    items.name = userinfo.result.userName;
    $(".orpk-view .head img").attr({
        "src": items.userAvatar
    });
    $(".orpk-view .head p").text(items.userName);
    $(".orpk-view footer .slogan").text(items.intro);
    receiveRedPacket(items)
}
function receiveRedPacket(items) {
    Bmob.Cloud.run("receiveRedPacket", {
        "redPacketID": items.redPacketID,
        "userID": items.userid,
        "avatar": items.avatar,
        "userName": items.name
    },
    {
        success: function(result) {
            var list = JSON.parse(result);
            if (list.code == 1003) {
                $(".orpk-view .content .money p").text("红包已领取")
            }
            if (list.code == 1004) {
                $(".orpk-view .content .money a").remove();
                $(".orpk-view .content .money p").text("红包抢完了")
            }
            resultReceiveRedPacket(list)
        },
        error: function(error) {
            console.log(error)
        }
    })
}
function resultReceiveRedPacket(items) {
    $(".singlemoney").text(items.result.singleMoney);
    $(".redpk-num").text("共" + items.result.totalCount + "个红包，剩余" + (items.result.totalCount - items.result.receiveArray.length) + "个红包");
    if (items.result.adImageUrl) {
        $(".banner a img").attr({
            "src": items.result.adImageUrl
        });
        if (items.result.adDetailUrl) {
            if (items.result.adDetailUrl.indexOf("http://") >= 0 || items.result.adDetailUrl.indexOf("https://") >= 0) {
                $(".banner a,.adlink a").attr({
                    "href": items.result.adDetailUrl
                });
                $(".share-hint").bind("click",
                function() {
                    location.href = items.result.adDetailUrl
                })
            } else {
                $(".banner a,.adlink a").attr({
                    "href": "http://" + items.result.adDetailUrl
                });
                $(".share-hint").bind("click",
                function() {
                    location.href = "http://" + items.result.adDetailUrl
                })
            }
        } else {
            $(".banner a").attr({
                "href": "javascript:void(0)"
            });
            $(".share-hint").hide()
        }
    } else {
        $(".banner,.adlink").remove();
        $(".share-hint").hide()
    }
    var list = items.result.receiveArray;
    for (i = list.length - 1; i >= 0; i--) {
        var date = new Date(list[i].receiveTime);
        var html = "<li><img src=" + list[i].avatar + "/><p>" + list[i].userName + "<span>" + ("0" + date.getHours()).slice( - 2) + ":" + ("0" + date.getMinutes()).slice( - 2) + "</span></p><font>" + list[i].receiveMoney + "元</font></li>";
        $(".redpk-list").append(html)
    }
    removeloading();
    $(".orpk-view").show()
}
function closeBrower() {
    $(".loading").remove();
    WeixinJSBridge.invoke("closeWindow", {},
    function(res) {})
}
function loading() {
    var html = "<div class='loading'><div class='windows8'><div class='wBall' id='wBall_1'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_2'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_3'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_4'><div class='wInnerBall'></div></div><div class='wBall' id='wBall_5'> <div class='wInnerBall'></div></div></div></div>";
    $("body").append(html)
}
function removeloading() {
    $(".loading").remove()
}
function GetRequest() {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
        }
    }
    return theRequest
}
function is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true
    } else {
        return false
    }
}
function confiremError(text) {
    removeloading();
    var html = "<div class='loading errorbg'><div class='error'>" + text + "<p><button onClick='closeBrower()'>关闭</button></p></div></div>";
    $("body").append(html)
}
function mobiledge() {
    var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
        location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.billliao.fentu"
    }
    if (isiOS) {
        location.href = "https://itunes.apple.com/cn/app/fen-tu-jiu-gong-ge-qie-tu-shen-qi/id1179260950?mt=8"
    }
}
function wxShare(url, rid, userinfo) {
	$.getJSON("http://api.fentuapp.com.cn/Jsapi/GetSignPackage",{"url":url},function(result){
        wxConfig(JSON.parse(result),rid,userinfo)
	});
	
   // Bmob.Cloud.run("getWebShareUrl", {
   //     "url": url
   // },
   // {
   //     success: function(result) {
   //         wxConfig(JSON.parse(result), rid, userinfo)
   //     }
   // })
}
function wxConfig(itmes, rid, userinfo) {
    wx.config({
        debug: false,
        appId: itmes.appid,
        timestamp: itmes.timestamp,
        nonceStr: itmes.nonceStr,
        signature: itmes.signature,
        jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage"]
    });
    var redirect_uri = "http://redpacket.fentuapp.com.cn/redpacket.html?rid=" + rid;
    var url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx1b36f9f74f362a67&redirect_uri=" + encodeURIComponent(redirect_uri) + "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
    var num = parseInt(4 * Math.random());
    var message = ["红包还有5秒到达手中，请做好准备", "喜欢一个人就像领红包一样，嘴上说着不要，心里....", "一把年纪，都活在了拆红包这件事上", "红包或许会迟到，但绝不会忘记砸到你的头顶"];
    wx.ready(function() {
        var shareData = {
            title: userinfo.result.userName + "喊你来抢钱啦!",
            desc: message[num],
            link: "http://redpacket.fentuapp.com.cn/go.html?rid=" + rid,
            imgUrl: userinfo.result.avatar,
            success: function(res) {},
            cancel: function(res) {}
        };
        wx.onMenuShareAppMessage({
            title: userinfo.result.userName + "喊你来抢钱啦!",
            desc: message[num],
            link: "http://redpacket.fentuapp.com.cn/go.html?rid=" + rid,
            imgUrl: userinfo.result.avatar,
            trigger: function(res) {},
            success: function(res) {},
            cancel: function(res) {},
            fail: function(res) {
                alert(JSON.stringify(res))
            }
        });
        wx.onMenuShareTimeline(shareData)
    });
    wx.error(function(res) {
        alert("error: " + res.errMsg)
    })
};