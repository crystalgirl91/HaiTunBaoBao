angular.module("personal_editEmail", ["ng", "personal", "common"])
.controller("editEmailController", ["$scope", "$API", function(scope, api){
	scope.submit = function(){
		api.bindEmail(scope.email).then(
			data => {
				location.replace("personal_infor.html");
			},
			err => {
				console.log(err);
			}
		);
	}
}])
