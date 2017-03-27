angular.module("signup", ["ng", "common", "ngRoute"])
.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/step1', {})
		.when('/step2', {})
		.when('/step3', {})
}])
.run(["$rootScope", "$API", '$route', '$timeout', "$BaseUrl", (scope, api, $route, $timeout, $BaseUrl) => {
	
	function changeRoute(e, route){
		if(location.hash=='#/step1'){
			scope.route = 'step1';
		}
		else if(location.hash=='#/step2'){
			scope.route = 'step2';
		}
		else{
			scope.route = 'step3';
		}
		console.log(12121,scope.route);
	}
	function countSecond(){
		scope.seconds -= 1;
		if(scope.seconds!=0){
			var t = $timeout(countSecond,1000);
		}
		else{
			$timeout.cancel(t);
			scope.seconds = 60;
			scope.is_send = false;
		}
	}
	scope.getCodeUrl = function(){
		let t=new Date().getTime();
		scope.codeUrl = $BaseUrl + "/uc-controller/verifyCodeServlet?t="+t;		
	}
	let $tmp_token = null;
	scope.route = "step1";
	scope.seconds = 60;
	scope.is_send = false;
	scope.getCodeUrl();
	scope.stength = '';
	scope.$on('$routeChangeSuccess', changeRoute);
	scope.resetTip = function(){
		scope.tipText = "";
	}
	scope.checkStrength = function(str){
		scope.tipText = "";
		let level = 0;
		/[a-zA-Z]/i.test(str) && level ++;
		/\d/.test(str) && level ++;
		/[^a-zA-Z0-9]/i.test(str) && level ++;
		if(str && str.length >= 8 && level==3){
			scope.stength = 'strong';
		}
		else if(str && str.length >= 7 && level>=2){
			scope.stength = 'medium';
		}
		else if(str && str.length >= 6  && level>=1){
			scope.stength = 'enough';
		}
		else{
			scope.stength = '';
		}
	}
	scope.sendCode = function(flag){
		api.fetchverifycode(scope.data.phone, "register").then(
			data => {
				scope.is_send = true;
				countSecond();
				if(flag){
					window.location = "signup.html#/step2";
				}
			},
			error => {
				console.log(11111111111,error)
			}
		);
	}
	
	scope.step1 = function(){
		if(scope.data.new === scope.data.confirmNew){
			scope.sendCode(true);
		}
		else{
			scope.tipText = "两次输入密码不一致！";
		}
		
		// sessionStorage.$Register = JSON.stringify(scope.data);
	}
	// scope.localData = sessionStorage.$Register?JSON.parse(sessionStorage.$Register):{};
	// function getUAtype(){
	// 	let ua = window.navigator.userAgent.toLowerCase();
	// 	if(ua.match(/MicroMessenger/i) == 'micromessenger'){
	// 	    return "weixin"
	// 	}
	// 	return "web";
	// }
	scope.step2 = function(){
		// let register_source = getUAtype();
		scope.loading = true;
		api.register(scope.data.phone,scope.data.new,scope.data.confirmNew,'web', scope.data.code, scope.data.verifycode).then(
			data => {
				scope.loading = false;
				window.location = "signup.html#/step3";
			},
			error => {
				scope.loading = false;
				console.log(11111111111,error)
			}
		);
	}
}])