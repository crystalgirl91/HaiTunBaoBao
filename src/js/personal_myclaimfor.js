
angular.module("personal_myclaimfor", ["ng", "personal", "common"])
.controller("myclaimforController", ["$scope", "$API", function(scope, api){
	scope.pageSize = 4;
	scope.pageIndex = 1;
	scope.total = 0;

	scope.selectPage = function(pageIndex){
		scope.loadData();
	};
	scope.loadData = function(){
		api.listClaimHistory(scope.pageIndex, scope.pageSize).then(
			data => {
				scope.claims = data.model.list;
				scope.total = data.model.total;
			},
			err => {
				console.log(err);
			}
		);		
	};
	scope.loadData();
}])
