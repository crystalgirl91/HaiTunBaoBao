angular.module("personal_editPassword", ["ng", "personal", "common"])
.controller("editPasswordController", ["$scope", "$API", function(scope, api){
	scope.tipText = "";
	scope.resetTip = function(){
		scope.tipText = "";
	}
	scope.submit = function(){
		if(scope.data.new!==scope.data.confirmNew){
			scope.tipText = "两次输入密码不一致！"
		}
		else{
			let phone = JSON.parse(sessionStorage.$UserInfo).cust_phone_uk;
			api.changePassword(phone, scope.data.old, scope.data.new, scope.data.confirmNew).then(
				data => {
					scope.tipText = "修改成功！";
					location.replace("personal_infor.html")
				},
				err => {
					console.log(err);
				}
			);
		}
	}
}])
