define("app/weixinV2.1/book/couponList",["gallery/zepto/1.1.3/zepto","app/weixinV2.1/book/utilities","app/weixinV2.1/book/validator","app/weixinV2.1/book/language"],function(a){var b=a("gallery/zepto/1.1.3/zepto"),c=a("app/weixinV2.1/book/utilities");a("app/weixinV2.1/book/validator");var d=(a("app/weixinV2.1/book/language"),b.mobileModal.getModalElement());b(function(){function e(e){c.getAjaxPageBody(e,function(e){d.addClass("transparentStyle");var g=c.getDomBody(e),h=b("<div id='couponUseContainer'></div>");h.html(g),b.mobileModal.showModal(h),f(),a.async("./couponUse.js")},function(){})}function f(){b("a.guan").on("click",function(){return b.mobileModal.hideModal(),d.removeClass("transparentStyle"),!1})}var g=b("div[data-moduleid='tehui_list']"),h=g.find(".sList05 a");h.on("click",function(){var a=b(this).attr("href");return e(a),!1})})});