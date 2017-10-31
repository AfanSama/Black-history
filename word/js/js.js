var server ="https://api.fentuapp.com.cn/";
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
// 登陆
(function(){
    //判断是否微信浏览器
    var ua = navigator.userAgent.toLowerCase();
    //if (ua.match(/MicroMessenger/i) == "micromessenger") {
		var token=JSON.parse(sessionStorage.getItem("userinfo"));
    	if(!token){
			$.post(server+"Login/wechatLogin",{"code":code,"type":"4"},function (data) {
				if(data.ret==0){
					userinfo=data.data;
    				sessionStorage.setItem("userinfo", JSON.stringify(userinfo));
					getInfo();
				}else{
					console.log("登陆失败");	
					location.href = "404.html"
				}
			})
		}else{
			userinfo=token;
			getInfo();
		}
    //} else {
	//	location.href = "404.html"
    //}
})()
//红包详情
var redBag;
function getInfo(){
	$.getJSON(server+"Redpacket/redpacketDetails",{"redpacketId":rid,"token":userinfo.token},function (data) {
		if(data.ret==0){
			redBag=data.data;
			alterView();
			wxShare();
		}else{
			location.href = "404.html"
		}
	});
}

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
		var redirect_uri = "http://redpacket.fentuapp.com.cn/go.html?rid=" + rid;
		wx.ready(function() {
			var shareData = {
				title: redBag.share_title.replace('#分享者昵称#',userinfo.userName),
				desc: redBag.share_details,
				link: redirect_uri,
				imgUrl: redBag.is_use_icon==1?userinfo.avatar:redBag.share_icon,
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

function alterView(){
	if(redBag.code!=0){
		alterInfo();
	}else{
		$(".mian .portrait p").text(redBag.user_name)
		$(".mian .portrait img").attr({"src":redBag.avatar})
		$(".mian").show();
	}
}
//获取口令
function getPortrait(){
	if (redBag.ad_detail_url.indexOf("http://") >= 0 || redBag.ad_detail_url.indexOf("https://") >= 0) {
		location.href = redBag.ad_detail_url;
	}else{
		location.href = "http://"+redBag.ad_detail_url;
	}
}
//立即提现
function withdraw(){


}
function openBag(){
	var command =$(".enter input").val();
	if(command){
		$.post(server+"Redpacket/redpacketGet",{"token":userinfo.token,"redpacketId":rid,"command":command},function(data){
			if(data.ret==0){
				alterInfo(data);
			}else{
		      	confirm("口令输入有误",function(){
		      		getPortrait();
		      	});
			}
		})
	}
}
function alterInfo(data){
	$(".mian").hide();
	$(".open").show();
	$(".open .portrait .head p").text(redBag.user_name)
	$(".open .portrait .head img").attr({"src":redBag.avatar})
	if(data){
		$(".get-money span").text(data.data.amount)
	}else{
		$(".get-money span").text(redBag.get_amount)
	}
	if(redBag.mobile){
		$(".open .btn .mobile").bind("click",function(){
			location.href = 'tel:'+redBag.mobile;
		});
	}else{
		$(".open .btn .mobile").css({"background":"#d2d2d2"});
	}
	if(redBag.qr_code){
		$(".open .btn .wxcode").bind("click",function(){
			rqCode(redBag.qr_code);
		});
	}else{
		$(".open .btn .wxcode").css({"background":"#d2d2d2"});
	}
	resultList();
	refresh();
}


var page=1;
var num=10;
//获取ID
var listId;
function resultList(Listid) {
    //领取人列表
    $.getJSON(server+"Redpacket/redpacketGetList",{"redpacketId":rid,"page":page,"num":num,"id":Listid},function (data) {
		if(!listId){
			listId=data.data[0].id
		}
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
				resultList(listId);
				console.log(page);
			}
        }
    });
}

function addList(list){
    for (i = 0; i < list.length; i++) {
    	var date = new Date().Format(list[i].add_time);
        var html = "<li><img src="+list[i].avatar+"><span class='name'>"+list[i].user_name+"</span><span class='time'>"+date+"</span><span class='money'>"+list[i].amount+"元</span></li>";
        $(".open .list").append(html)
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

//扩展Date格式化  
Date.prototype.Format = function(format) {  
    var date =  new Date(format*1000);
    var y = 1900+date.getYear();
    var m = "0"+(date.getMonth()+1);
    var d = "0"+date.getDate();
    return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
}

function rqCode(rqurl){
    var shield = document.createElement("DIV");
    shield.id = "shield";
    shield.style.position ="fixed";
    shield.style.left = "0px";
    shield.style.top = "0px";
    shield.style.width = "100%";
    shield.style.height = "100%";
    shield.style.background = "#333";
    shield.style.textAlign = "center";
    shield.style.zIndex = "19901000";
    shield.style.filter = "alpha(opacity=.5)";
    shield.style.opacity = ".5";
    var rqCode = document.createElement("DIV");
    rqCode.id="rqCode";
    strHtml = "<img src=\'"+rqurl+"\'>";
    strHtml += "<p>长按扫描二维码</p>";
    strHtml += "<span><img src='img/call.png' onclick=\"call()\"></span>";
    rqCode.innerHTML = strHtml;
    document.body.appendChild(rqCode);
    document.body.appendChild(shield);
    var c = 0;
    this.doAlpha = function(){
        if (c++ > 20){clearInterval(ad);return 0;}
        shield.style.filter = "alpha(opacity="+c+")";
        shield.style.opacity = ".5";
    }
    var ad = setInterval("doAlpha()",5);
    this.call = function(){
        //alertFram.style.display = "none";
        //shield.style.display = "none";
　　　　document.body.removeChild(rqCode);
        document.body.removeChild(shield);
    }
    rqCode.focus();
    document.body.onselectstart = function(){return false;};
}