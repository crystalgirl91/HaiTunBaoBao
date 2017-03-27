angular.module("personal_distribution", ["ng", "personal", "common","ngRoute"])

.controller("distributeController", ["$scope", "$API", function(scope, api){
	scope.no_infor = true;
	scope.infor = {};
	let ordaid = location.search.slice(location.search.indexOf("=")+1);
	api.transportInfor(ordaid).then(
		data => {
			scope.no_infor = false;
			scope.infor = data.model;
			switch(data.model.state){
				case "0":
					scope.infor.status = "在途中";
					break;
				case "1":
					scope.infor.status = "已揽收";
					break;
				case "2":
					scope.infor.status = "疑难";
					break;
				case "3":
					scope.infor.status = "已签收";
					break;
				case "4":
					scope.infor.status = "退签";
					break;
				case "5":
					scope.infor.status = "同城派送中";
					break;
				case "6":
					scope.infor.status = "退回";
					break;
				case "7":
					scope.infor.status = "转单";
					break;
				default:
					scope.infor.status = "未知";
					break;
			};
		},
		err => {
			console.log(err);
			// alert(err.errMessage);
		}
	)
}])