if (void 0 == QIPA_DEBUG) var QIPA_DEBUG = !1;
if (void 0 == GID) var GID = "qipa";
//if (void 0 == APP_API_URL) var APP_API_URL = /localhost/.test(location.host) ? "http://localhost:8000/": "http://www.playwx.com";
//if (void 0 == APP_LIST_URL) var APP_LIST_URL = "http://www.playwx.com";
if (void 0 == APP_FOLLOW_URL) var APP_FOLLOW_URL = param.WXfollowsrc;
if (void 0 == ENABLE_SHARE) var ENABLE_SHARE = !0;
if (void 0 == ENABLE_LB) var ENABLE_LB = !0;
var APP_DEPLOYMENT = "WX",
IS_IOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? !0 : !1,
IS_ANDROID = -1 < navigator.userAgent.indexOf("Android"),
KEY_MY_ID = "myid",
KEY_FOLLOWED = "flw",
KEY_BEST_SUFFIX = ":best";
function qipaLog() {
    QIPA_DEBUG && console.log(arguments)
}
qipaShare = {
    title: GID,
    desc: GID,
    link: document.URL,
    imgUrl: location.origin + location.pathname.replace("index.html", "") + "img/ico_large.png"
};
/**document.addEventListener("WeixinJSBridgeReady",
function() {
    APP_DEPLOYMENT = "WX";
    WeixinJSBridge.call("showOptionMenu");
    WeixinJSBridge.call("hideToolbar");
    WeixinJSBridge.on("menu:share:appmessage",
    function(a) {
        WeixinJSBridge.invoke("sendAppMessage", {
            title: qipaShare.title,
            desc: qipaShare.desc,
            link: qipaShare.link,
            img_url: qipaShare.imgUrl
        })
    });
    WeixinJSBridge.on("menu:share:timeline",
    function(a) {
        WeixinJSBridge.invoke("shareTimeline", {
            title: qipaShare.desc,
            desc: qipaShare.desc,
            link: qipaShare.link,
            img_url: qipaShare.imgUrl
        })
    });
    WeixinJSBridge.on("menu:share:weibo",
    function(a) {
        WeixinJSBridge.invoke("shareWeibo", {
            content: qipaShare.desc,
            url: qipaShare.link
        })
    })
	
}); **/
(function(a, f) {
    var c = APP_API_URL + "social/",
    d = location.search ? location.search + "&callback=?": "?callback=?",
    g = GID + KEY_BEST_SUFFIX;
    a.myPid = function() {
        return a.storage.get(KEY_MY_ID)
    };
    a.isFollowed = function() {
        return a.storage.get(KEY_FOLLOWED)
    };
    a.updateLoginInfo = function(b, e) {
        qipaLog("updateLoginInfo");
        qipaLog("pid: " + b);
        qipaLog("followed: " + e);
        b && b != a.storage.get(KEY_MY_ID) && a.storage.set(KEY_MY_ID, b);
        b && b != a.storage.get(KEY_FOLLOWED) && a.storage.set(KEY_FOLLOWED, e)
    };
    a.onNewScore = function(b) {
        //更新成绩
        if(qipaApp.score > 0){
            //alert(qipaApp.score);
            //alert(APP_API_SUBMIT);
            $.post(APP_API_SUBMIT, {oid: param.oid, score: qipaApp.score}, function (data) {
                if (data.success == 0) {
                    alert(data.msg);
                    return false;
                }
            }, "json");
        }
        ENABLE_LB && (b > a.best && (newRecord = !0, b > a.best && (a.best = b, a.storage.set(g, a.best))), b > SCORE_LIMIT && a.uploadScore(b))
    };
    a.storage = a.storage || {};
    a.storage.get = function(b) {
        try {
            if (b in localStorage) return localStorage[b]
        } catch(a) {}
        return $.cookie(b)
    };
    a.storage.set = function(b, a) {
        try {
            return localStorage[b] = a,
            !0
        } catch(c) {}
        $.cookie(b, a, {
            expires: 365
        });
        return ! 0
    };
    a.score = 0;
    a.best = a.storage.get(g) || 0;
    a.newRecord = !1;
    a.newscore_wxoauth = function(b) {
        b = APP_API_URL + "wxoauth/newscore/" + GID + "/?score=" + b + "&callback=?";
        qipaLog(b);
        $.getJSON(b).done(function(b) {
            "wxoauth_needed" == b.error ? qipaLog("upload score failed. wxoauth_needed.") : a.updateLoginInfo(b.pid, b.subscribed);
        })
    };
    a.uploadScore = function(b) {
        b = APP_API_URL + "newscore/" + GID + "/" + b + "/?callback=?";
        qipaLog(b);
        $.getJSON(b).done(function(b) {
            qipaLog(b);
            "wxoauth_needed" == b.error ? qipaLog("upload score failed. wxoauth_needed.") : a.updateLoginInfo(b.pid, b.subscribed);
        })
    };
    a.startOAuth = function() {
        qipaLog(APP_API_URL + "wxoauth_start");
        window.open(APP_API_URL + "wxoauth_start");
    };
    a.leaderboard = function(b, a, c) {
        qipaLog(APP_API_URL + "leaderboard/" + a + "/" + c + "?callback=?");
        $.getJSON(APP_API_URL + "leaderboard/" + a + "/" + c + "?callback=?", b);
    };
    a.onGameInit = function() {
    };
    a.onGameStarted = function() {
        qipaStage.showFollowAnim(!1);
		$('.group').hide();
    };
    function judgeAudio(effectAudioScores, score){
        if(effectAudioScores.length == 1){
            if(effectAudioScores[0] > score){
                return 0;
            }else{
                return 1;
            }
        }
        for(var i = 0; i < effectAudioScores.length; i++){
            if(i == 0 && effectAudioScores[0] > score){
                return i;
            }
            if(i == effectAudioScores.length && effectAudioScores[i] < score){
                return i + 1;
            }else if(i == effectAudioScores.length && effectAudioScores[i - 1] < score && effectAudioScores[i] > score){
                return i;
            }
            if(i != 0 && effectAudioScores[i - 1] < score && effectAudioScores[i] > score){
                return i;
            }
        }
    }
    a.onGameOver = function() {
        qipaStage.showFollowAnim(!0);//显示分享图标
        if('' != param.effectAudioScores && '' != param.effectAudioUrls && null != param.effectAudioScores && null != param.effectAudioUrls){
            var effectAudioScores = param.effectAudioScores.split(','),
                effectAudioUrls =  param.effectAudioUrls.split(',');
            if((effectAudioUrls.length - effectAudioScores.length) == 1){
                var audio = new Audio(effectAudioUrls[judgeAudio(effectAudioScores, a.score)]);
                audio.play();
            }
        }
        // if(a.score > effectAudioUrls)
        //console.log(qipaApp.score) //这个是当前分数
    };
    a.social = a.social || {};
    a.social.chongzhi = function(b) {
        qipaLog(c + "chongzhi" + d);
        $.getJSON(c + "chongzhi" + d, b);
    };
    a.social.startOAuth = function(b) {
        b = encodeURIComponent(b);
        qipaLog(c + "wxoauth_start/?ret=" + b);
        window.open(c + "wxoauth_start/?ret=" + b);
    };
    a.social.viewMe = function(b) {
        qipaLog(c + "me" + d);
        $.getJSON(c + "me" + d, b);
    };
    a.social.viewPlayer = function(b, a) {
        qipaLog(c + "view" + d + "&pid=" + a);
        $.getJSON(c + "view" + d + "&pid=" + a, b);
    };
    a.social.searchPlayer = function(b, a) {
        qipaLog(c + "search" + d + "&qstr=" + encodeURIComponent(a));
        $.getJSON(c + "search" + d + "&qstr=" + encodeURIComponent(a), b);
    };
    a.social.friendList = function(b) {
        qipaLog(c + "frdlist" + d);
        $.getJSON(c + "frdlist" + d, b);
    };
    a.social.mywall = function(b) {
        qipaLog(c + "mywall" + d);
        $.getJSON(c + "mywall" + d, b);
    };
    a.social.peerwall = function(b, a) {
        qipaLog(c + "wall" + d + "&pid=" + a);
        $.getJSON(c + "wall" + d + "&pid=" + a, b);
    };
    a.social.conversation = function(b, a) {
        qipaLog(c + "conversation" + d + "&pid=" + a);
        $.getJSON(c + "conversation" + d + "&pid=" + a, b);
    };
    a.social.wallAdd = function(a, e, h) {
        qipaLog(c + "walladd" + d + "&pid=" + h);
        $.getJSON(c + "walladd" + d + "&pid=" + h + "&msg=" + encodeURIComponent(e), a);
    };
    a.social.wallDel = function(a, e) {
        qipaLog(c + "walldel" + d + "&msgid=" + e);
        $.getJSON(c + "walldel" + d + "&msgid=" + e, a);
    };
    a.social.friendDel = function(a, e) {
        qipaLog(c + "frddel" + d + "&pid=" + e);
        $.getJSON(c + "frddel" + d + "&pid=" + e, a);
    };
    a.social.friendAdd = function(a, e) {
        qipaLog(c + "frdadd" + d + "&pid=" + e);
        $.getJSON(c + "frdadd" + d + "&pid=" + e, a);
    };
    a.social.friendBlack = function(a, e) {
        qipaLog(c + "frdblack" + d + "&pid=" + e);
        $.getJSON(c + "frdblack" + d + "&pid=" + e, a);
    };
    a.leaderboard = function(a, c, d) {
        qipaLog(APP_API_URL + "leaderboard/" + c + "/" + d + "?callback=?");
        $.getJSON(APP_API_URL + "leaderboard/" + c + "/" + d + "?callback=?", a);
    }

})(window.qipaApp = window.qipaApp || {});
function qipaUi_showPopup(a) {
    qipaLog("showPopup url: " + a);
    window.scroll(0, 0);
    var f = document.body.scrollWidth,
    c = document.body.scrollHeight;
    void 0 == window.popup && (window.popup = $('<iframe id="popup" class="app-popup">'), $("body").append(window.popup));
    window.popup.attr("src", a);
    window.popup.css({
        width: f,
        height: c
    }).fadeIn()
};