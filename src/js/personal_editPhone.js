angular.module("personal_editPhone", ["ng", "personal", "common"])
.controller("editPhoneController", ["$scope", "$API", "$timeout", "$BaseUrl", function(scope, api, $timeout, $BaseUrl){

	scope.getCodeUrl = function(){
		let t=new Date().getTime();
		scope.codeUrl = $BaseUrl + "/uc-controller/verifyCodeServlet?t="+t;		
	}
	scope.getCodeUrl();
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
	scope.sendCode = function(){
		api.fetchverifycode(scope.data.newPhone, 'bindphone').then(
			data => {
				scope.is_send = true;
				countSecond();
			},
			error => {
				console.log(11111111111,error)
			}
		);
	}
	scope.submit = function(){
		// let phone = JSON.parse(sessionStorage.$UserInfo).cust_phone_uk;
		// console.log(scope.data.oldPhone, phone);
		// if(scope.data.oldPhone!==phone){
		// 	scope.tipText = "输入的原手机号与注册时的不一致！"
		// }
		// else{
			api.bindPhone(scope.data.oldPhone, scope.data.newPhone, scope.data.code, scope.data.verifycode).then(
				data => {
					scope.tipText = "修改成功！";
					location.replace("personal_infor.html")
				},
				err => {
					console.log(err);
				}
			);			
		// }

	}
}])
