import 'jquery'
import 'bootstrap'
import 'angular'
import 'angular-i18n/zh.js'
import 'angular-animate'
import 'angular-route'
import 'angular-ui-bootstrap'
import 'angular-cookies'

import './qrcode.js'

angular.module("common", ["ng", 'ngAnimate', "ui.bootstrap"])
.factory("dialog", ["$q", "$http", "$document", "$window", "$controller", "$rootScope", "$compile", function($q, $http, doc, win, $controller, $rootScope, $compile){
	let dialog_tmpl = `<div class="dialog_wrapper">
		<div class="masker"></div>
		<div class="dialog {{ type }}" style="width: {{ width }}px; margin-top: {{ top }}px;">
		<div class="header">
			<div class="titlebar">{{ title }}</div>
		</div>
		<div class="body"></div>
		<div class="prompt footer">
			<form class="pure-form" action="javascript:">
				<fieldset class="pure-group">
					<textarea ng-model="promptValue" class="pure-input-1" placeholder="{{ promptPlaceHolder }}"></textarea>
				</fieldset>
				<button type="submit" class="pure-button pure-button-primary resolve" ng-click="close(promptValue)">确定</button>
				<button class="pure-button reject" ng-click="close(false)">取消</button>
			</form>
		</div>
		<div class="confirm footer">
			<button class="pure-button pure-button-primary resolve" ng-click="close(true)">确定</button>
			<button class="pure-button reject" ng-click="close(false)">取消</button>
		</div>
		<div class="alertbox footer">
			<button ng-click="close()" class="pure-button pure-button-primary">确定</button>
		</div>
		<div ng-click="close()" class="close_btn reject"></div>
	</div></div>`;

	let dialog = (config = { type: "box" }) => {
		let contentPromise;
		if(config.contentUrl){
			contentPromise = $http.get(config.contentUrl).then(
				res => res.data,
				rej => reject
			);
		}
		else if(config.content){
			contentPromise = $q.resolve(config.content);
		}
		else{
			contentPromise = $q.resolve();
		}
		return contentPromise.then(
			content => {
				return $q((resolve, reject) => {
					let _scope = $rootScope.$new();
					_scope.type = config.type || "box";
					_scope.width = config.width || 400;
					_scope.top = config.top || 100;
					_scope.title = config.title;

					let root = angular.element(document.body);
					let dialog = $compile(dialog_tmpl)(_scope);
					let dialog_content = angular.element(dialog[0].querySelector(".body"));

					_scope.close = value => {
						dialog.remove();
						resolve(value);
					};
					root.append(dialog);

					if(config.controller){
						let parentScope = $rootScope;
						if(config.scope instanceof $rootScope.constructor){
							parentScope = config.scope;
						}
						let __scope = parentScope.$new();
						__scope.$close = _scope.close;

						$controller(config.controller, {
							$scope: __scope
						}, true)();

						dialog_content.append(
							$compile(`<div class="content">${content}</div>`)(__scope)
						);
					}
					else{
						dialog_content.html(`<div class="content">${content}</div>`)
					}
				})
			}
		);
	};
	dialog.box = (config = {}) => {
		config.type = "box";
		return dialog(config);
	};
	dialog.alert = (config = {}) => {
		config.type = "alert";
		return dialog(config);
	};
	dialog.confirm = (config = {}) => {
		config.type = "confirm";
		return dialog(config);
	};

	return dialog;

}])
.directive("ebsgovicon", [function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			let js = document.createElement("script");
			js.src = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
			document.body.appendChild(js);
		}
	};
}])
.controller("ebsgoviconController", ["$scope", function(scope){
	// JavaScript Document
	// zengqingfeng_20130618 create
	function GetRequest() {
	    var d = 'http://szcert.ebs.org.cn/govicon.js?id=d2dff044-f72a-4ccf-92bd-3882180886f5&width=100&height=137&;type=1';
	    var theRequest = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)/.test(d) ? RegExp.$1 : "error";
	    var iconwidth = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)&type=([0-9]+)/.test(d) ? RegExp.$2 : "36"; //default height
	    var iconheight = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)&type=([0-9]+)/.test(d) ? RegExp.$3 : "50"; //default width
	    var type = /govicon.js\?id=([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})&width=([0-9]+)&height=([0-9]+)&type=([0-9]+)/.test(d) ? RegExp.$4 : "1"; //default width
	    var retstr = { "id": theRequest, "width": iconwidth, "height": iconheight, "type": type };
	    return retstr;
	}
	var iconImageURL = "http://szcert.ebs.org.cn/Images/govIcon.gif";
	var niconImageURL = "http://szcert.ebs.org.cn/Images/newGovIcon.gif";
	scope.webprefix = "http://szcert.ebs.org.cn/"
	scope.tempiconImageURL = "";

	scope.params = GetRequest();
	if (scope.params.type == "1") {
	    scope.tempiconImageURL = iconImageURL;
	}
	if (scope.params.type == "2") {
	    scope.tempiconImageURL = niconImageURL;
	}
	console.log(scope)
	// document.write('<a href="' + webprefix + params.id + '" target="_blank"><img src="' + tempiconImageURL + '" title="深圳市市场监督管理局企业主体身份公示" alt="深圳市市场监督管理局企业主体身份公示" width="' + params.width + '" height="' + params.height + '"border="0" style="border-width:0px;border:hidden; border:none;"></a>');

	//在页面加载完成后，获取信息并且异步post到cert.gov.com
	// document.write('<script type="text/javascript" src="http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js"></script>');

}])
.config(["$httpProvider", function($httpProvider){
	$httpProvider.defaults.headers.post = {
		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
	};
	//let withCredentialsSupport = 'withCredentials' in new XMLHttpRequest
	$httpProvider.interceptors.push([
		"$q", "$log", "$location", "$rootScope", "$httpParamSerializerJQLike",
		function($q, console, $location, scope, serializer){
			return {
				request(config){
					if(/https?:\/\//i.test(config.url)){
						config.paramSerializer = serializer;
						config.withCredentials = true;

						let data = config.data;
						let params = config.params;
						if(data && data.token && data.token === "TOKEN_HOLDER"){
							data.token = undefined;
							delete data.token;
						}
						if(params && params.token && params.token === "TOKEN_HOLDER"){
							params.token = undefined;
							delete params.token;
						}
						if(config.method.toUpperCase() === "POST"){
							config.data = serializer(data);
						}
						if(document.documentMode && document.documentMode < 10){
							let url = config.url
							let info = url.split('?')
							if(info.length === 1){
								info.push('')
							}
							info[1] += '&token=' + (localStorage.$AuthToken || '')
							config.url = info.join('?')
						}
					}
					return config;
				},
				requestError(rej){
					console.log("请求错误", rej);
					return $q.reject(rej);
				},
				responseError(rej){
					console.log("响应错误", rej);
					return $q.reject(rej);
				},
				response(res){
					if(/https?:\/\//i.test(res.config.url)){
						let data = res.data;
						if(data.errCode === 0){
							return data;
						}
						switch(data.errCode){
							case 2000:
								scope.$broadcast("noauth");
							break
							case 1010:
							break
							default:
								scope.$broadcast("globalTips", 'warn', data.errMessage);
							break
						}
						return $q.reject(data);
					}
					return res;
				}
			};
		}
	]);
}])
.constant("$BaseUrl", "http://www.htbaobao.com:8081")
.factory("$API", ["$http", "$BaseUrl", "$q", "$rootScope", "$httpParamSerializerJQLike", function($http, $BaseUrl, $q, scope, $httpParamSerializerJQLike){
	function upload(form){
		let xhr = new XMLHttpRequest();
		xhr.open("POST", "http://htbaobao.com:8081/upload/UploadServlet", true);
		setTimeout(ts => xhr.send(new FormData(form)), 10);
		return xhr;
	}
	
	function removeServlet(data){
		return $http.jsonp($BaseUrl + '/upload/RemoveServlet?callback=JSON_CALLBACK', {method: "GET",params: data})
	}

	let cors = "withCredentials" in new XMLHttpRequest;

	function get(url, data){
		if(document.documentMode && document.documentMode < 10){
			data.callback = 'JSON_CALLBACK'
			return $http.jsonp($BaseUrl + url, {
				params: data
			})
		}
		return $http({
			url: $BaseUrl + url,
			method: "GET",
			params: data
		});
	}
	function post(url, data){
		if(document.documentMode && document.documentMode < 10){
			data.callback = 'JSON_CALLBACK'
			return $http.jsonp($BaseUrl + url, {
				params: data
			})
		}
		return $http({
			url: $BaseUrl + url,
			method: "POST",
			data: data
		});
	}
	function jsonPost(url, data){
		return $http({
				url: $BaseUrl + url,
				method: "POST",
				data: data,
				headers: {
					'Content-Type': 'application/json'
				},
				transformRequest: function(){
					return data
				}
			});
	}

	let api = {
		upload,
		removeServlet,
		login(phone, password){
			return post("/uc-controller/login.do", {
				phone: phone,
				password: password
			}).then(res => {
				localStorage.$AuthToken = res.model.token
				scope.$broadcast("authed", res.model);
				return res;
			});
		},
		register(phone, password, confirmpwd, register_source, verifycode, validatecode){
			return post("/uc-controller/register.do", {
				phone: phone,
				password: password,
				confirmpwd: confirmpwd,
				register_source: register_source,
				verifycode: verifycode,
				validatecode: validatecode,
				share_id: localStorage.share_id || ""
			});
		},
		fetchverifycode(phone, action){
			return post("/uc-controller/fetchverifycode.do", {
				phone: phone,
				action: action
			});
		},
		listhotnews(page = 1, countPerPage = 4){
			return post("/uc-controller/listhotnews.do", {
				token: "TOKEN_HOLDER",
				page: page,
				countPerPage: countPerPage
			});
		},
		getnewsdetail(newsId){
			return post("/uc-controller/getnewsdetail.do", {
				newsId: newsId
			});
		},
		listcomments(newsId, page = 1, countPerPage = 4){
			return post("/uc-controller/listcomments.do", {
				newsId: newsId,
				page: page,
				countPerPage: countPerPage
			});
		},
		listadvert(page = 1, countPerPage = 4){
			return post("/uc-controller/listadvert.do", {
				page: page,
				countPerPage: countPerPage
			});
		},
		listallcoupon(page = 1, countPerPage = 4, skuaid){
			return post("/uc-controller/listAllCoupon.do", {
				skuaid: skuaid,
				page: page,
				countPerPage: countPerPage
			});
		},
		listavaliablecoupon(userId,skuAid, page = 1, countPerPage = 0){
			return post("/uc-controller/listAvaliableCoupon.do", {
				userId: userId,
				skuaid:skuAid,
				page: page,
				countPerPage: countPerPage
			});
		},
		listmutualinsurances(userId, page = 1, countPerPage = 4){
			return post("/uc-controller/listMutualInsurances.do", {
				userId, page, countPerPage
			});
		},
		queryPolicyByUserid(userId, page = 1, countPerPage = 4){
			return post("/uc-controller/queryPolicyByUserid.do", {
				userId: userId,
				page: page,
				countPerPage: countPerPage
			});
		},
		addComments(newsId, comments){
			return post("/uc-controller/addComments.do", {
				token: "TOKEN_HOLDER",
				newsId: newsId,
				comments: comments
			});
		},
		resetPassword(password, validatecode, token){
			return post("/uc-controller/resetpassword.do", {
				password: password,
				validatecode: validatecode,
				token: token
			});
		},
		listClaimHistory(page = 1, countPerPage = 4){
			return post("/uc-controller/listClaimHistory.do", {
				page: page,
				countPerPage: countPerPage
			});
		},
		fileClaim(isowner, isunum, requser, requserid, type, comments, imgs){
			return post("/uc-controller/fileClaim.do", {
				isowner: isowner,
				isunum: isunum,
				token: "TOKEN_HOLDER",
				requser: requser,
				requserid: requserid,
				type: type,
				comments: comments,
				imgs: imgs
			});
		},
		listAllInsurances(userId, page = 1, countPerPage = 4){
			return post("/uc-controller/listAllInsurances.do", {
				userId: userId,
				page: page,
				countPerPage: countPerPage
			});
		},
		changePassword(phone, oldpwd, newpwd, confirmnewpwd){
			return post("/uc-controller/changepassword.do", {
				phone: phone,
				oldpwd: oldpwd,
				newpwd: newpwd,
				confirmnewpwd: confirmnewpwd
			});
		},
		_getLocalUserInfo(){
			let cachedInfo = sessionStorage.$UserInfo;
			try{
				return JSON.parse(cachedInfo);
			}
			catch(e){
				return null;
			}
			return null;
		},
		getUserInfo(force = false){
			if(!force){
				let cachedInfo = api._getLocalUserInfo();
				console.log("get user info from cache >>>", cachedInfo);
				if(cachedInfo){
					return $.Deferred().resolve({
						model: cachedInfo
					});
				}
			}
			return post("/uc-controller/getUserInfo.do", {
				token: "TOKEN_HOLDER"
			}).then(res => {
				sessionStorage.$UserInfo = JSON.stringify(res.model);
				return res;
			});
		},
		getCommentsTotal(newsId){
			return post("/uc-controller/getCommentsTotal.do", {
				newsId: newsId
			});
		},
		addFavorite(type, aid){
			return post("/uc-controller/addFavorite.do", {
				type: type,
				aid: aid,
				token: "TOKEN_HOLDER"
			});
		},
		delFavorite(fav_aid){
			return post("/uc-controller/delFavorite.do", {
				fav_aid: fav_aid,
				token: "TOKEN_HOLDER"
			});
		},
		delFavorites(fav_aids){
			return post("/uc-controller/delFavorites.do", {
				fav_aids: fav_aids,
				token: "TOKEN_HOLDER"
			});
		},
		isValidCodeCorrect(phone, code, action){
			return post("/uc-controller/isValidCodeCorrect.do", {
				phone: phone,
				code: code,
				action: action
			});
		},
		removeUploadFile(filename){
			return post("/uc-controller/removeUploadFile.do", {
				filename: filename,
				token: "TOKEN_HOLDER"
			});
		},
		isFavorite(type, aid){
			return post("/uc-controller/isFavorite.do", {
				type: type,
				aid: aid,
				token: "TOKEN_HOLDER"
			});
		},
		riskEvaluate(sex, age, job, address, assets, incomeYear, payYear, social_insurance, healthinsurance, accidentinsurance, propertyinsurance, dutyinsurance){
			return get("/uc-controller/riskEvaluate.do", {
				token: "TOKEN_HOLDER",
				sex: sex,
				age: age,
				job: job,
				address: address,
				assets: assets,
				incomeYear: incomeYear,
				payYear: payYear,
				social_insurance: social_insurance,
				healthinsurance: healthinsurance,
				accidentinsurance: accidentinsurance,
				propertyinsurance: propertyinsurance,
				dutyinsurance: dutyinsurance
			});
		},
		checkin(){
			return post("/uc-controller/checkin.do", {
				token: "TOKEN_HOLDER"
			});
		},
		shakephone(){
			return post("/uc-controller/shakephone.do", {
				token: "TOKEN_HOLDER"
			});
		},
		bindEmail(email){
			return post("/uc-controller/bindEmail.do", {
				token: "TOKEN_HOLDER",
				email: email
			});
		},
		bindPhone(oldphone, newphone, verifycode, code ){
			return post("/uc-controller/bindPhone.do", {
				token: "TOKEN_HOLDER",
				oldphone: oldphone,
				newphone: newphone,
				code: code,
				verifycode: verifycode
			});
		},
		setHeaderimg(img){
			return post("/uc-controller/setHeaderimg.do", {
				img: img,
				token: "TOKEN_HOLDER"
			});
		},
		setNickname(nickname){
			return post("/uc-controller/setNickname.do", {
				token: "TOKEN_HOLDER",
				nickname: nickname
			});
		},
		listNotices(page = 1, countPerPage = 4){
			return post("/uc-controller/listNotices.do", {
				page: page,
				countPerPage: countPerPage
			});
		},
		getNoticeDetail(msg_aid){
			return post("/uc-controller/getNoticeDetail.do", {
				msg_aid: msg_aid
			});
		},
		addNoticeComments(noticeId, comments) {
			return post("/uc-controller/addNoticeComments.do", {
				token: "TOKEN_HOLDER",
				noticeId: noticeId,
				comments: comments
			});
		},
		getNoticeCommentsTotal(noticeId) {
			return post("/uc-controller/getNoticeCommentsTotal.do", {
				noticeId: noticeId
			});
		},
		listNoticeComments(noticeId, page = 1, countPerPage = 4) {
			return post("/uc-controller/listNoticeComments.do", {
				noticeId: noticeId,
				page: page,
				countPerPage: countPerPage
			});
		},
		listCommentsMsg(page = 1, countPerPage = 4){
			return post("/uc-controller/listCommentsMsg.do", {
				page: page,
				countPerPage: countPerPage,
				token: "TOKEN_HOLDER"
			});
		},
		listSystemMsg(page = 1, countPerPage = 4){
			return post("/uc-controller/listSystemMsg.do", {
				page: page,
				countPerPage: countPerPage,
				token: "TOKEN_HOLDER"
			});
		},
		getCommentsMsgDetail(msg_aid){
			return post("/uc-controller/getCommentsMsgDetail.do", {
				msg_aid: msg_aid,
				token: "TOKEN_HOLDER"
			});
		},
		getSystemMsgDetail(msg_aid){
			return post("/uc-controller/getSystemMsgDetail.do", {
				msg_aid: msg_aid,
				token: "TOKEN_HOLDER"
			});
		},
		addCommentsToUser(newsId, comments, touserid, tomsgaid){
			return post("/uc-controller/addCommentsToUser.do", {
				token: "TOKEN_HOLDER",
				newsId: newsId,
				comments: comments,
				touserid: touserid,
				tomsgaid: tomsgaid
			});
		},
		readSystemMsg(msg_aid){
			return post("/uc-controller/readSystemMsg.do", {
				token: "TOKEN_HOLDER",
				msg_aid: msg_aid
			});
		},
		readCommentsMsg(msg_aid){
			return post("/uc-controller/readCommentsMsg.do", {
				token: "TOKEN_HOLDER",
				msg_aid: msg_aid
			});
		},
		delSystemMsg(msg_aid){
			return post("/uc-controller/delSystemMsg.do", {
				token: "TOKEN_HOLDER",
				msg_aid: msg_aid
			});
		},
		delCommentsMsg(msg_aid){
			return post("/uc-controller/delCommentsMsg.do", {
				token: "TOKEN_HOLDER",
				msg_aid: msg_aid
			});
		},
		checkToken(){
			return post("/uc-controller/checkToken.do", {
				token: "TOKEN_HOLDER"
			});
		},
		logout(){
			return post("/uc-controller/logout.do", {
				token: "TOKEN_HOLDER"
			}).then(res => {
				delete sessionStorage.$UserInfo
				scope.$broadcast("noauth", res.model);
				return res;
			});
		},
		listFavoriteNews(page = 1, countPerPage = 4){
			return get("/uc-controller/listFavoriteNews.do", {
				token: "TOKEN_HOLDER",
				page: page,
				countPerPage: countPerPage
			});
		},
		listFavoriteInsurances(page = 1, countPerPage = 4){
			return post("/uc-controller/listFavoriteInsurances.do", {
				token: "TOKEN_HOLDER",
				page: page,
				countPerPage: countPerPage
			});
		},
		listAllFavorites(page = 1, countPerPage = 4){
			return post("/uc-controller/listAllFavorites.do", {
				token: "TOKEN_HOLDER",
				page: page,
				countPerPage: countPerPage
			});
		},
		listAllPointHistory(page = 1, countPerPage = 4){
			return post("/uc-controller/listAllPointHistory.do", {
				token: "TOKEN_HOLDER",
				page: page,
				countPerPage: countPerPage
			});
		},

		

		/*  tc_controller */
		/*  风险检测产品API  */
		ctrlProdList(page = 1, pageSize = 4, status){
			return get(`/tc-controller/api/ctrlprod/au/order/list`, {
				token: 'TOKEN_HOLDER',
				page: page,
				pageSize: pageSize,
				status: status
			});
		},
		ctrlProdPay(ordAid){
			return get(`/tc-controller/api/ctrlprod/au/order/au/pay`, {
				token: 'TOKEN_HOLDER',
				orderAid: ordAid
			})
		},
		// ctrlProdSubmit(skuAid, prodAid, addrAid, addrUsername, phone, itemCount, coupons, usePoint){
		// 	return get(`/tc-controller/api/ctrlprod/au/order/submit/`, {
		// 		token: 'TOKEN_HOLDER',
		// 		skuAid, prodAid, addrAid, addrUsername, phone, itemCount, coupons, usePoint
		// 	})
		// },
		ctrlProdSubmit(skuAid, prodAid, addrAid, addrUsername, phone, itemCount, coupons, usePoint,data){
			return jsonPost(`/tc-controller/api/ctrlprod/au/order/submit/?${$.param({
				skuAid: skuAid,
				prodAid: prodAid,
				addrAid: addrAid,
				addrUsername: addrUsername,
				phone: phone,
				itemCount:itemCount,
				coupons: coupons,
				usePoint: usePoint
			})}`, data, {
				contentType: "application/json"
			});
		},
		ctrlProdDetail(prodAid){
			return get(`/tc-controller/api/insuresku/detail/ctrl/${prodAid}`, {})
		},
		ctrlOrderDetail(orderAid){
			return get(`/tc-controller/api/ctrlprod/au/order/detail`, { orderAid });
		},
		transportInfor(orderAid) {
			return get("/tc-controller/api/express/au/query", { orderAid });
		},
		/*  风险检测产品API end */
		availabelPay(){
			return get("/tc-controller/api/payment/channel/au/available/list", {
				token: "TOKEN_HOLDER"
			});
		},
		
		insureskuDetail(skuId){
			return post(`/tc-controller/api/insuresku/detail/${skuId}`, {
				
			});
		},
		insureskuDetailCommon(prodAid){
			return get(`/tc-controller/api/insuresku/detail/common/${prodAid}`, {
				
			});
		},
		insureskuDetailCommonIsuDocAgree(skuId) {
			return get(`/tc-controller/api/insuresku/detail/common/isuDocAgree/${skuId}`, {
				
			});
		},
		insureskuDetailMutual(prodAid){
			return get(`/tc-controller/api/insuresku/detail/mutual/${prodAid}`, {
				
			});
		},
		insureskuDetailMutualConvention(skuId){
			return get(`/tc-controller/api/insuresku/detail/mutual/convention/${skuId}`, {
				
			});
		},
		insureskuDetailMutualIsuDocAgree(skuId){
			return get(`/tc-controller/api/insuresku/detail/mutual/isuDocAgree/${skuId}`, {
				
			});
		},
		insureskuDetailCtrlIsuDocAgree(prodAid){
			return get(`/tc-controller/api/insuresku/detail/ctrl/docAgree/${prodAid}`, {
				
			});
		},
		insureskuList(category, page = 1, pageSize = 4){
			return get(`/tc-controller/api/insuresku/list`, {
				category: category,
				page: page,
				pageSize: pageSize
			});
		},
		insureskuListSimilar(skuAid, prodAid, page = 1, pageSize = 4){
			return get(`/tc-controller/api/insuresku/list/similar`, {
				skuAid: skuAid,
				prodAid: prodAid,
				page: page,
				pageSize: pageSize
			});
		},
		marketAuExchange(prodAid, skuAid, addrAid, addrUsername, phone){
			return get(`/tc-controller/api/market/au/exchange`, {
				prodAid: prodAid,
				skuAid: skuAid,
				addrAid: addrAid,
				addrUsername: addrUsername,
				phone: phone,
				token: "TOKEN_HOLDER"
			});
		},
		marketAuExchangeHistory(page = 1, pageSize = 4){
			return get(`/tc-controller/api/market/au/exchange/history`, {
				page: page,
				pageSize: pageSize,
				token: "TOKEN_HOLDER"
			});
		},
		marketAuPay(ordAid){
			return get(`/tc-controller/api/market/au/pay`, {
				orderAid:ordAid,
				token: "TOKEN_HOLDER"
			})
		},
		marketProdExchangeHistory(prodAid,skuAid,page = 1, pageSize = 10){
			return get(`/tc-controller/api/market/list/prod/exchange/history`, {
				prodAid:prodAid,
				skuAid:skuAid,
				page:page,
				pageSize:pageSize
			});
		},
		marketDetail(prodAid, skuAid){
			return get(`/tc-controller/api/market/detail`, {
				prodAid: prodAid,
				skuAid: skuAid
			});
		},
		marketList(page = 1, pageSize = 4){
			return get(`/tc-controller/api/market/list`, {
				page: page,
				pageSize: pageSize
			});
		},
		insureCommentsList(prodAid, type, page = 1, pageSize = 4){
			return get(`/tc-controller/api/insure/comments/list`, {
				prodAid: prodAid,
				type: type,
				page: page,
				pageSize: pageSize
			});
		},
		insureCommentsAuAdd(prodAid, ordAid, skuAid, grade, content){
			return get(`/tc-controller/api/insure/comments/au/add`, {
				prodAid: prodAid,
				ordAid: ordAid,
				skuAid: skuAid,
				grade: grade,
				content: content,
				token: "TOKEN_HOLDER"
			});
		},
		insureMutualAuJoin(isuName, isuSsn, email, addrAid, prodAid, money){
			return get(`/tc-controller/api/insure/mutual/au/join`, {
				isuName: isuName,
				isuSsn: isuSsn,
				email: email,
				addrAid: addrAid,
				prodAid: prodAid,
				money: money,
				share_id: localStorage.share_id || "",
				token: "TOKEN_HOLDER"
			});
		},
		insureMutualAuQuit(accountAid, reason){
			return get(`/tc-controller/api/insure/mutual/au/quit`, {
				accountAid: accountAid,
				reason: reason,
				token: "TOKEN_HOLDER"
			});
		},
		insureMutualAuDeposit(accountAid, amount){
			return post(`/tc-controller/api/insure/mutual/au/deposit`, {
				accountAid: accountAid,
				amount: amount,
				token: "TOKEN_HOLDER"
			});
		},
		insureMutualAuList(page = 1, pageSize = 4){
			return get(`/tc-controller/api/insure/mutual/au/list`, {
				page: page,
				pageSize: pageSize,
				token: "TOKEN_HOLDER"
			});
		},
		insureMutualAuGetDetail(orderAid, accountAid){
			return post(`/tc-controller/api/insure/mutual/au/getDetail`, {
				orderAid: orderAid,
				accountAid: accountAid,
				token: "TOKEN_HOLDER"
			});
		},
		insureProposalAuAdd(dsTip, dsMf, dsJob, dsMinAge, dsMaxAge, dsRiskType, dsRemark){
			return get(`/tc-controller/api/insure/proposal/au/add`, {
				dsTip: dsTip,
				dsMf: dsMf,
				dsJob: dsJob,
				dsMinAge: dsMinAge,
				dsMaxAge: dsMaxAge,
				dsRiskType: dsRiskType,
				dsRemark: dsRemark,
				token: "TOKEN_HOLDER"
			});
		},
		insureProposalAuList(page = 1, pageSize = 4){
			return get(`/tc-controller/api/insure/proposal/au/list`, {
				page: page,
				pageSize: pageSize,
				token: "TOKEN_HOLDER"
			});
		},
		insureProposalAuDetail(designAid){
			return post(`/tc-controller/api/insure/proposal/au/detail`, {
				designAid: designAid,
				token: "TOKEN_HOLDER"
			});
		},
		insureIsucoverAuList(page = 1, pageSize = 4){
			return get(`/tc-controller/api/insure/isucover/au/list`, {
				page: page,
				pageSize: pageSize,
				token: "TOKEN_HOLDER"
			});
		},
		insureApplicationAuList(page = 1, pageSize = 4) {
			return get("/tc-controller/api/insure/application/au/list", {
				page: page,
				pageSize: pageSize,
				token: "TOKEN_HOLDER"
			});
		},
		insureCommAuOrderSubmit(isuName, isuSsn, email, addrAid, skuAid, prodAid, money, isuDtStart, coupons, usePoint, data){
			return jsonPost(`/tc-controller/api/insure/comm/au/order/submit?${$.param({
				isuName: isuName,
				isuSsn: isuSsn,
				email: email,
				addrAid: addrAid,
				skuAid: skuAid,
				prodAid: prodAid,
				money: money,
				isuDtStart: isuDtStart,
				share_id: localStorage.share_id || "",
				coupons: coupons,
				//points: points,
				usePoint: usePoint
			})}`, data, {
				contentType: "application/json"
			});
		},
		insureCommAuPolicyList(page = 1, pageSize = 4, policyStatus){
			return get(`/tc-controller/api/insure/comm/au/policy/list`, {
				page: page,
				pageSize: pageSize,
				policyStatus: policyStatus,
				token: "TOKEN_HOLDER"
			});
		},
		insureCommAuPolicyPay(orderAid){
			return get("/tc-controller/api/insure/comm/au/policy/pay", {
				orderAid: orderAid,
				token: "TOKEN_HOLDER"
			});
		},
		insureCommIsuCoverSubmit(skuAid, prodAid, custName, custId, email, address, requirement) {
			return get("/tc-controller/api/insure/isucover/au/submit",{
				skuAid: skuAid,
				prodAid: prodAid,
				custName: custName,
				custId: custId,
				email: email,
				address: address,
				requirement: requirement,
				token: "TOKEN_HOLDER"
			});
		},
		calculateAmtByPoint(point, amount){
			return post(`/uc-controller/calculateAmtByPoint.do`, {
				point: point,
				amount: amount,
				token: "TOKEN_HOLDER"
			});
		},
		calculateAmtByCoupon(couponid, amount){
			return post(`/uc-controller/calculateAmtByCoupon.do`, {
				couponid: couponid,
				amount: amount,
				token: "TOKEN_HOLDER"
			});
		},
		insureCommAuPolicyDetail(orderAid){
			return get(`/tc-controller/api/insure/comm/au/policy/detail`, { orderAid });
		},
		insureCommAuListall(page = 1, pageSize = 4){
			return get(`/tc-controller/api/insure/comm/au/listall`, {
				page: page,
				pageSize: pageSize,
				token: "TOKEN_HOLDER"
			});
		},
		getResourceUrl(prodAid){
			return get(`/uc-controller/getResourceUrl.do`, {
				prodaid: prodAid,
				token: "TOKEN_HOLDER"
			});
		},
		userAddressAuAdd(phone, addrUsername, region, address){
			return get(`/tc-controller/api/user/address/au/add`, {
				phone: phone,
				addrUsername: addrUsername,
				region: region,
				address: address,
				token: "TOKEN_HOLDER"
			});
		},
		userAddressAuUpdate(addrAid, /*phone, addrUsername,*/ region, address){
			return get(`/tc-controller/api/user/address/au/update`, {
				addrAid: addrAid,
				// phone: phone,
				// addrUsername: addrUsername,
				region: region,
				address: address,
				token: "TOKEN_HOLDER"
			});
		},
		userAddressAuList(){
			return get(`/tc-controller/api/user/address/au/list`, {
				token: "TOKEN_HOLDER"
			});
		},
		userAddressAuRemove(addrAid, custAid){
			return get(`/tc-controller/api/user/address/au/remove`, {
				addrAid: addrAid,
				custAid: custAid,
				token: "TOKEN_HOLDER"
			});
		},
		userAddressAuSetDefault(custAid, adddrAid){
			return post(`/tc-controller/api/user/address/au/setDefault`, {
				custAid: custAid,
				adddrAid: adddrAid,
				token: "TOKEN_HOLDER"
			});
		},
		seckillDetail(pmAid){
			return get(`/tc-controller/api/seckill/detail`,
				{ pmAid }
			);
		},


		seckillAuBuy(pmAid, custName, custSsn, email, addrAid, skuAid, prodAid, money, isuDtStart, coupons, usePoint, data){
			return jsonPost(`/tc-controller/api/seckill/au/buy?${$.param({
				pmAid,
				custName,
				custSsn,
				email,
				addrAid,
				skuAid,
				prodAid,
				money,
				isuDtStart,
				share_id: localStorage.share_id || "",
				coupons,
				usePoint
			})}`, data, {
				contentType: "application/json"
			});
		},

		seckillAuBuyBak(pmAid, skuAid, prodAid, custName, custSsn, email, addrAid, money){
			return post(`/tc-controller/api/seckill/au/buy`, {
				pmAid: pmAid,
				skuAid: skuAid,
				prodAid: prodAid,
				custName: custName,
				custSsn: custSsn,
				email: email,
				addrAid: addrAid,
				money: money,
				token: "TOKEN_HOLDER"
			});
		},

		// seckillAuCtrlBuy(pmAid, skuAid, prodAid, addrAid, addrUsername, phone, itemCount, coupons, usePoint){
		// 	return get(`/tc-controller/api/seckill/au/ctrl/buy`, {
		// 		token: 'TOKEN_HOLDER',
		// 		pmAid,
		// 		skuAid, prodAid, addrAid, addrUsername, phone, itemCount, coupons, usePoint
		// 	})
		// },
		seckillAuCtrlBuy(pmAid, skuAid, prodAid, addrAid, addrUsername, phone, itemCount, coupons, usePoint,data){
			return jsonPost(`/tc-controller/api/seckill/au/ctrl/buy/?${$.param({
				pmAid:pmAid,
				skuAid: skuAid,
				prodAid: prodAid,
				addrAid: addrAid,
				addrUsername: addrUsername,
				phone: phone,
				itemCount:itemCount,
				coupons: coupons,
				usePoint: usePoint
			})}`, data, {
				contentType: "application/json"
			});
		},
		seckillAuCtrlBuyBak(pmAid, skuAid, prodAid, addrAid, addrUsername, phone){
			return post(`/tc-controller/api/seckill/au/ctrl/buy`, {
				pmAid,
				skuAid,
				prodAid,
				addrAid,
				addrUsername,
				phone,
				token: "TOKEN_HOLDER"
			});
		},
		seckillList(page = 1, pageSize = 4){
			return get(`/tc-controller/api/seckill/list`, {
				page: page,
				pageSize: pageSize
			});
		},
		listpointhistoryforcheckin(){
			return post(`/uc-controller/listPointHistoryForCheckin.do`, {})
		},
		CheckinlistForToday(page = 1, countPerPage = 7){
			return get(`/uc-controller/CheckinlistForToday.do`, { page, countPerPage })
		}
		
	}



	return api;
}])
.controller("topNavigatorController", ["$scope", "$API",  function(scope, api){
	scope.authed = false;
	scope.$on("authed", e => {
		scope.authed = true;
	});
	scope.$on("noauth", e => {
		scope.authed = false;
	});
	api.getUserInfo().then(data => {
		scope.authed = true;
		scope.authName = data.model.nick_name;
	})
	scope.signout = function(){
		api.logout().then(function(res){
			if(res.success){
				location.replace("signin.html");
			}
		});
	}
}])
.constant('queryParams', (function(){
	let qs = location.search.replace(/^\?/, "").split("&").reduce((qs, fd) => {
		let kv = fd.split("=");
		qs[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
		return qs;
	}, {});
	return qs;
})())
.factory('serialParams', [function(){
	return function(obj){
		if(!obj){
			return;
		}
		let paramsStr =  Object.keys(obj).map(function(item){
			return encodeURIComponent(item) + "=" + encodeURIComponent(obj[item]);
		}).join("&");
		return "?" + paramsStr;
	};
}])
.factory('cnid', [function(){
	var GB2260 = "";
    function IDValidator() {
        var param = {
            error : {
                longNumber : '长数字存在精度问题，请使用字符串传值！ Long number is not allowed, because the precision of the Number In JavaScript.'
            }
        };
        var util = {
            checkArg : function(id) {
                var argType = (typeof id);
     
                switch (argType) {
                case 'number':
                    // long number not allowed
                    id = id.toString();
                    if (id.length > 15) {
                        this.error(param.error.longNumber);
                        return false;
                    }
                    break;
                case 'string':
                    break;
                default:
                    return false;
                }
                id = id.toUpperCase();
                var code = null;
                if (id.length === 18) {
                    // 18位
                    code = {
                        body : id.slice(0, 17),
                        checkBit : id.slice(-1),
                        type : 18
                    };
                } else if (id.length === 15) {
                    // 15位
                    code = {
                        body : id,
                        type : 15
                    };
                } else {
                    return false;
                }
                return code;
            }
            // 地址码检查
            ,
            checkAddr : function(addr, GB2260) {
                var addrInfo = this.getAddrInfo(addr, GB2260);
                return (addrInfo === false ? false : true);
            }
            // 取得地址码信息
            ,
            getAddrInfo : function(addr, GB2260) {
                GB2260 = GB2260 || null;
                // 查询GB/T2260,没有引入GB2260时略过
                if (GB2260 === null) {
                    return addr;
                }
                if (!GB2260.hasOwnProperty(addr)) {
                    // 考虑标准不全的情况，搜索不到时向上搜索
                    var tmpAddr;
                    tmpAddr = addr.slice(0, 4) + '00';
                    if (!GB2260.hasOwnProperty(tmpAddr)) {
                        tmpAddr = addr.slice(0, 2) + '0000';
                        if (!GB2260.hasOwnProperty(tmpAddr)) {
                            return false;
                        } else {
                            return GB2260[tmpAddr] + '未知地区';
                        }
                    } else {
                        return GB2260[tmpAddr] + '未知地区';
                    }
                } else {
                    return GB2260[addr];
                }
            }
            // 生日码检查
            ,
            checkBirth : function(birth) {
                var year, month, day;
                if (birth.length == 8) {
                    year = parseInt(birth.slice(0, 4), 10);
                    month = parseInt(birth.slice(4, 6), 10);
                    day = parseInt(birth.slice(-2), 10);
                } else if (birth.length == 6) {
                    year = parseInt('19' + birth.slice(0, 2), 10);
                    month = parseInt(birth.slice(2, 4), 10);
                    day = parseInt(birth.slice(-2), 10);
                } else {
                    return false;
                }
                // TODO 是否需要判断年份
                /*
                 * if( year<1800 ){ return false; }
                 */
                // TODO 按月份检测
                if (month > 12 || month === 0 || day > 31 || day === 0) {
                    return false;
                }
     
                return true;
            }
            // 顺序码检查
            ,
            checkOrder : function(order) {
                // 暂无需检测
     
                return true;
            }
            // 加权
            ,
            weight : function(t) {
                return Math.pow(2, t - 1) % 11;
            }
            // 随机整数
            ,
            rand : function(max, min) {
                min = min || 1;
                return Math.round(Math.random() * (max - min)) + min;
            }
            // 数字补位
            ,
            str_pad : function(str, len, chr, right) {
                str = str.toString();
                len = len || 2;
                chr = chr || '0';
                right = right || false;
                if (str.length >= len) {
                    return str;
                } else {
                    for (var i = 0, j = len - str.length; i < j; i++) {
                        if (right) {
                            str = str + chr;
                        } else {
                            str = chr + str;
                        }
                    }
                    return str;
                }
            }
            // 抛错
            ,
            error : function(msg) {
                var e = new Error();
                e.message = 'IDValidator: ' + msg;
                throw e;
            }
        };
        var _IDValidator = function(GB2260) {
            if (typeof GB2260 !== "undefined") {
                this.GB2260 = GB2260;
            }
            // 建立cache
            this.cache = {};
        };
        _IDValidator.prototype = {
            isValid : function(id) {
                var GB2260 = this.GB2260 || null;
                var code = util.checkArg(id);
                if (code === false) {
                    return false;
                }
                // 查询cache
                if (this.cache.hasOwnProperty(id)
                        && typeof this.cache[id].valid !== 'undefined') {
                    return this.cache[id].valid;
                } else {
                    if (!this.cache.hasOwnProperty(id)) {
                        this.cache[id] = {};
                    }
                }
     
                var addr = code.body.slice(0, 6);
                var birth = (code.type === 18 ? code.body.slice(6, 14) : code.body
                        .slice(6, 12));
                var order = code.body.slice(-3);
     
                if (!(util.checkAddr(addr, GB2260) && util.checkBirth(birth) && util
                        .checkOrder(order))) {
                    this.cache[id].valid = false;
                    return false;
                }
     
                // 15位不含校验码，到此已结束
                if (code.type === 15) {
                    this.cache[id].valid = true;
                    return true;
                }
     
                /* 校验位部分 */
     
                // 位置加权
                var posWeight = [];
                for (var i = 18; i > 1; i--) {
                    var wei = util.weight(i);
                    posWeight[i] = wei;
                }
     
                // 累加body部分与位置加权的积
                var bodySum = 0;
                var bodyArr = code.body.split('');
                for (var j = 0; j < bodyArr.length; j++) {
                    bodySum += (parseInt(bodyArr[j], 10) * posWeight[18 - j]);
                }
     
                // 得出校验码
                var checkBit = 12 - (bodySum % 11);
                if (checkBit == 10) {
                    checkBit = 'X';
                } else if (checkBit > 10) {
                    checkBit = checkBit % 11;
                }
                checkBit = (typeof checkBit === 'number' ? checkBit.toString()
                        : checkBit);
     
                // 检查校验码
                if (checkBit !== code.checkBit) {
                    this.cache[id].valid = false;
                    return false;
                } else {
                    this.cache[id].valid = true;
                    return true;
                }
     
            }
     
            // 分析详细信息
            ,
            getInfo : function(id) {
                var GB2260 = this.GB2260 || null;
                // 号码必须有效
                if (this.isValid(id) === false) {
                    return false;
                }
                // TODO 复用此部分
                var code = util.checkArg(id);
     
                // 查询cache
                // 到此时通过isValid已经有了cache记录
                if (typeof this.cache[id].info !== 'undefined') {
                    return this.cache[id].info;
                }
     
                var addr = code.body.slice(0, 6);
                var birth = (code.type === 18 ? code.body.slice(6, 14) : code.body
                        .slice(6, 12));
                var order = code.body.slice(-3);
     
                var info = {};
                info.addrCode = addr;
                if (GB2260 !== null) {
                    info.addr = util.getAddrInfo(addr, GB2260);
                }
                info.birth = (code.type === 18 ? (([ birth.slice(0, 4),
                        birth.slice(4, 6), birth.slice(-2) ]).join('-')) : ([
                        '19' + birth.slice(0, 2), birth.slice(2, 4),
                        birth.slice(-2) ]).join('-'));
                info.sex = (order % 2 === 0 ? 0 : 1);
                info.length = code.type;
                if (code.type === 18) {
                    info.checkBit = code.checkBit;
                }
     
                // 记录cache
                this.cache[id].info = info;
     
                return info;
            }
     
            // 仿造一个号
            ,
            makeID : function(isFifteen) {
                var GB2260 = this.GB2260 || null;
     
                // 地址码
                var addr = null;
                if (GB2260 !== null) {
                    var loopCnt = 0;
                    while (addr === null) {
                        // 防止死循环
                        if (loopCnt > 10) {
                            addr = 110101;
                            break;
                        }
                        var prov = util.str_pad(util.rand(50), 2, '0');
                        var city = util.str_pad(util.rand(20), 2, '0');
                        var area = util.str_pad(util.rand(20), 2, '0');
                        var addrTest = [ prov, city, area ].join('');
                        if (GB2260[addrTest]) {
                            addr = addrTest;
                            break;
                        }
                    }
                } else {
                    addr = 110101;
                }
     
                // 出生年
                var yr = util.str_pad(util.rand(99, 50), 2, '0');
                var mo = util.str_pad(util.rand(12, 1), 2, '0');
                var da = util.str_pad(util.rand(28, 1), 2, '0');
                if (isFifteen) {
                    return addr + yr + mo + da
                            + util.str_pad(util.rand(999, 1), 3, '1');
                }
     
                yr = '19' + yr;
                var body = addr + yr + mo + da
                        + util.str_pad(util.rand(999, 1), 3, '1');
     
                // 位置加权
                var posWeight = [];
                for (var i = 18; i > 1; i--) {
                    var wei = util.weight(i);
                    posWeight[i] = wei;
                }
     
                // 累加body部分与位置加权的积
                var bodySum = 0;
                var bodyArr = body.split('');
                for (var j = 0; j < bodyArr.length; j++) {
                    bodySum += (parseInt(bodyArr[j], 10) * posWeight[18 - j]);
                }
     
                // 得出校验码
                var checkBit = 12 - (bodySum % 11);
                if (checkBit == 10) {
                    checkBit = 'X';
                } else if (checkBit > 10) {
                    checkBit = checkBit % 11;
                }
                checkBit = (typeof checkBit === 'number' ? checkBit.toString()
                        : checkBit);
     
                return (body + checkBit);
            }
     
        };// _IDValidator
        GB2260 = GB2260 == null ? "" : GB2260;
        return new _IDValidator(GB2260);
    }
    return function(){
    	return new IDValidator();
    }
}])
.directive('cnidValidate', ['cnid', function(cnid){
	return {
		priority: 2,
		controller: function($scope, $element, $attrs, $transclude) {},
		require: ['?ngModel'],
		restrict: 'A', 
		link: function($scope, iElm, iAttrs, controller) {
			var ngModelCtrl = controller[0];
			if(!ngModelCtrl){
				return;
			}
			ngModelCtrl.$validators.cnid = function(modelValue, viewValue){
				var value = modelValue || viewValue;
				return cnid().isValid(value);
			}
		}
	};
}])
.directive('globalTips', ['$rootScope', function($rootScope){
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		scope: true,
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		restrict: 'AC', // E = Element, A = Attribute, C = Class, M = Comment
		// replace: true,
		// transclude: true,
		template: '<ul><li class="tips-item {{ item.type }}" ng-repeat="item in items">{{ item.text }}</li></ul>',
		controller: ['$scope', '$timeout', function($scope, $timeout){
			$scope.items = []
			$scope.$on('globalTips', (e, type, text) => {
				let item = { type, text }
				$scope.items.push(item)
				$timeout(t => {
					let i = $scope.items.indexOf(item)
					if(i > -1){
						$scope.items.splice(i, 1)
					}
					console.log($scope.items);
				}, 3000);
				console.log($scope);
				$scope.$applyAsync()
			});
		}]
	};
}])
.directive('shareLink', ['$rootScope', 'dialog', function($rootScope, dialog){
	let sharePanel = angular.element(`<div class="share-panel">
			<a href="javascript:" class="share-qzone"></a>
			<a href="javascript:" class="share-weibo"></a>
			<a href="javascript:" class="share-wechat"></a>
		</div>`)

	sharePanel.css({
		position: 'absolute',
		top: '-1000px',
		left: '-1000px',
		background: 'white',
		display: 'none'
	})
	let qzone = sharePanel.find('.share-qzone')
	let weibo = sharePanel.find('.share-weibo')
	let wechat = sharePanel.find('.share-wechat')
	qzone.on('click', e => {
		window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + $.param({
			url: sharePanel.attr('share_url') || location.href,
			site: '',
			summary: '',
			title: sharePanel.attr('share_title') || document.title
		}), '_blank')
		sharePanel.fadeOut(300)
	})
	weibo.on('click', e => {
		window.open('http://service.weibo.com/share/share.php?' + $.param({
			url: sharePanel.attr('share_url') || location.href,
			appkey: '1343713053',
			searchPic: true,
			title: sharePanel.attr('share_title') || document.title
		}), '_blank')
		console.log(99879879879879);
		sharePanel.fadeOut(300)
	})
	wechat.on('click', e => {
		let text = sharePanel.attr('share_url') || location.href
		dialog.box({
			content: '<div id="wechat_qrcode"></div>'
		})
		setTimeout(ts => $('#wechat_qrcode').qrcode({
			width: 338,
			height: 338,
			text
		}), 100)
		sharePanel.fadeOut(300)
	})
	angular.element('html').on('click', e => sharePanel.fadeOut(300))
	sharePanel.on('click', e => e.stopPropagation())


	return {
		restrict: 'A',
		link: function($scope, ele, attrs, controller){
			ele.on('click', e => {
				let url = attrs.shareLink
				if(url){
					if(!/https?:\/\//i.test(url)){
						url = location.protocol + '//' + location.host + '/' + url
					}
				}
				else{
					url = location.href
				}
				sharePanel.attr('share_url', url)
				sharePanel.attr('share_title', attrs.shareTitle || document.title)
				let offset = ele.offset()
				sharePanel.css({
					top: offset.top + ele.height() + 'px',
					left: offset.left + 'px'
				})
				sharePanel.appendTo('body').fadeIn(300)
				console.log(ele.size(), '<<<<<<<', sharePanel)
				e.stopPropagation()
			})
		}
	}
}])
.run(["$rootScope", '$API', function(scope, api){
	let pathname = location.pathname.split('/').pop()
	scope.$on("noauth", e => {
		delete sessionStorage.$UserInfo
		switch(pathname){
			case 'personal_account.html':
			case 'personal_account.html':
			case 'personal_claimfor.html':
			case 'personal_distribution.html':
			case 'personal_editPhone.html':
			case 'personal_myclaimfor.html':
			case 'personal_address.html':
			case 'personal_coupon.html':
			case 'personal_editEmail.html':
			case 'personal_infor.html':
			case 'personal_proposal.html':
			case 'personal_baobao.html':
			case 'personal_design.html':
			case 'personal_editPassword.html':
			case 'personal_jf.html':
			case 'personal_store.html':
			case 'products_control_order.html':
			case 'products_other_order.html':
			case 'products_insurance_order.html':
			case 'products_pay.html':
				sessionStorage.login_return = location.href
				location.replace('signin.html')
			break
			default:

			break
		}
	})
	scope.pathname = pathname
	scope.$on("authed", (e, data) => {
		sessionStorage.$UserInfo = JSON.stringify(data.model);
	})

}])
