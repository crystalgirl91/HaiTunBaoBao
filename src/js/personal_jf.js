
angular.module("personal_jf", ["ng", "personal", "common"])
.directive("jumpRules", [function(){
	return {
		restrict: "A",
		link: function(scope, element, attrs){
			element.find("#jump_rule").on("click",function(){
				$(document).scrollTop($(".rules").offset().top);
			})
		}
	};
}])
.controller("personalJfController", ["$scope", "$API", function(scope, api){
	scope.pageSize = 4;
	scope.pageIndex = 1;
	scope.total = 0;
	scope.expireDate = new Date().getFullYear();
	scope.selectPage = function(pageIndex){
		scope.loadData();
	};
	scope.loadData = function(){
		api.listAllPointHistory(scope.pageIndex, scope.pageSize).then(
			data => {
				scope.records = data.model.list.sort(function(a,b){ return a.createdate>b.createdate?-1:1 });
				scope.total = data.model.total;
			},
			err => {
				console.log(err);
			}
		);		
	};
	scope.loadData();
	api.getUserInfo(true).then(
		data => {
			scope.avalicredit = data.model.avalicredit;
			scope.willexpirecredit = data.model.willexpirecredit;
			console.log(data);
		},
		err => {
			console.log(err);
		}
	);

}])

