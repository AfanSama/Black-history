var server ="https://api.fentuapp.top/index/";
function GetRequest(option) {
    var url = location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1])
        }
    }
    return theRequest[option]
}
var rid=GetRequest("rid");
var code=GetRequest("code");
var userinfo;
//登陆
(function(){
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
		$.post(server+"Login/wechatLogin",{"code":code,"type":"4"},function (data) {
			console.log(data);
			if(data.ret==0){
				userinfo=data.data;
				getInfo();
				wxShare();
			}else{
				console.log("登陆失败");	
				location.href = "404.html"
			}
		})
    } else {
		location.href = "404.html"
    }
})()
function wxShare(){

	var url = window.location.href.split("#")[0];
	$.getJSON(server+"Jsapi/GetSignPackage",{"url":url},function(data){
		wx.config({
			debug: false,
			appId: data.data.appid,
			timestamp: data.data.timestamp,
			nonceStr: data.data.nonceStr,
			signature: data.data.signature,
			jsApiList: ["checkJsApi", "onMenuShareTimeline", "onMenuShareAppMessage","getLocation"]
		});
		var num =parseInt(4*Math.random());
		var message=["红包还有5秒到达手中，请做好准备","喜欢一个人就像领红包一样，嘴上说着不要，心里....","一把年纪，都活在了拆红包这件事上","红包或许会迟到，但绝不会忘记砸到你的头顶"];
		var redirect_uri = "http://redpacket.fentuapp.com.cn/xigua.html?rid=" + rid;
		wx.ready(function() {
			var shareData = {
				title: userinfo.nickName+"给你分享了一个西瓜红包!",
				desc: message[num],
				link: redirect_uri,
				imgUrl: userinfo.avatar,
				success: function(res) {
					//shareRedpacketNum(rid);	
				},
				cancel: function(res) {}
			};
			wx.onMenuShareAppMessage(shareData);
			wx.onMenuShareTimeline(shareData)
		});
		wx.error(function(res) {
			console.log("error: " + res.errMsg)
		})
	});	
}
//红包详情
var redBag;
function getInfo(){
	$.post(server+"Other/details",{"rid":rid,"token":userinfo.token},function (data) {
		if(data.ret==0){
			redBag=data.data;
			alterView();
		}else{
			location.href = "404.html"
		}
	});
}
function alterView(){
	if(redBag.is_get){
		alterInfo();
	}else{
		$(".mian .title").text(redBag.intro)
		$(".mian .name").text(redBag.nick_name)
		$(".mian .head img").attr({"src":redBag.avatar})
		$(".mian").show();
	}
}
function openBag(){
	$.post(server+"Other/get",{"token":userinfo.token,"redpacket_id":rid,"nick_name":userinfo.nickName,"avatar":userinfo.avatar},function(data){
		console.log(data);
		alterInfo(data);
	})
}
function alterInfo(data){
	$(".mian").hide();
	$(".info").show();
	$(".info .title").text(redBag.intro);
    $(".info .ad div p").text("共" + redBag.count + "个红包，剩余" + redBag.residue + "个红包");
	if(redBag.ad_img){
		$(".info .ad img").attr({"src":redBag.ad_img})
		$(".info .ad img").bind("click",function(){
			location.href=redBag.ad_img_url;
		})
	}else{
		$(".info .ad img,.info .ad div a").remove()
	}
	if(data){
		if(data.ret==0){
			$(".info .head .win font").text(data.data.amount)
		}else{
			$(".info .head .win").hide();
			$(".info .head .out").show();
		}
	}else{
			$(".info .head .win font").text(redBag.get_amount)
	}
	resultList();
	refresh();
}


var page=1;
var num=10;
function resultList() {
    //领取人列表
    $.post(server+"Other/get_list",{"redpacket_id":rid,"page":page,"num":num},function (data) {
		console.log(data)
		addList(data.data);
    })
}
// 加载刷新。
function refresh() {
    $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();    //滚动条距离顶部的高度
        var scrollHeight = $(document).height();   //当前页面的总高度
        var clientHeight = $(this).height();    //当前可视的页面高度
        if(scrollTop + clientHeight >= scrollHeight){   //距离顶部+当前高度 >=文档总高度 即代表滑动到底部 count++;         //每次滑动count加1
			var compare= Math.ceil((redBag.count-redBag.residue)/num)
            page++;
      		if(page<=compare){
			resultList()
			console.log(page);
			}
        }
    });
}

function addList(list){
    for (i = 0; i < list.length; i++) {
        var html = "<li><img src="+list[i].avatar+"><span class='name'>"+list[i].nick_name+"</span><span class='time'>"+list[i].add_time+"</span><span class='money'>"+list[i].amount+"元</span></li>";
        $(".info .list").append(html)
    }
}

function goApp(){
 	var u = navigator.userAgent;
    var isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    if (isAndroid) {
        location.href = "http://openbox.mobilem.360.cn/index/d/sid/3897355"
    }
    if (isiOS) {
        location.href = "https://itunes.apple.com/app/id1289601654"
    }
}