angular.module("passwd_reset", ["ng", "common", "ngRoute"])
.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/passwd_reset1', {})
		.when('/passwd_reset2', {})
		.when('/passwd_reset3', {})
}])
.run(["$rootScope", "$API", '$route', '$timeout', (scope, api, $route, $timeout) => {
	let $tmp_token = null;
	scope.route = "passwd_reset1";

	scope.$on('$routeChangeSuccess', changeRoute);
	function changeRoute(e, route){
		if(location.hash=='#/passwd_reset1'){
			scope.route = 'passwd_reset1';
		}
		else if(location.hash=='#/passwd_reset2'){
			scope.route = 'passwd_reset2';
		}
		else{
			scope.route = 'passwd_reset3';
		}
		console.log(12121,scope.route);
	}


	scope.seconds = 60;
	scope.is_send = false;
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
	scope.resetTip = function(){
		scope.tipText = "";
	}
	scope.sendCode = function(){
		api.fetchverifycode(scope.data.phone, "findpwd").then(
			data => {
				scope.is_send = true;
				countSecond();
			},
			error => {
				console.log(11111111111,error)
			}
		);
	}
	scope.step1 = function(){
		api.isValidCodeCorrect(scope.data.phone, scope.data.verifycode, "findpwd").then(
			data => {
				$tmp_token = data.model;
				location.replace("passwd_reset.html#/passwd_reset2");
			},
			error => {
				console.log(11111111111,error)
			}
		);
	}
	scope.step2 = function(){
		if(scope.data.new === scope.data.confirmNew){
			api.resetPassword(scope.data.new, scope.data.verifycode, $tmp_token).then(
				data => {
					window.location = "passwd_reset.html#/passwd_reset3";
				},
				error => {
					console.log(11111111111,error)
				}
			);
		}
		else{
			scope.tipText = "两次输入密码不一致！";
		}
	}
}])