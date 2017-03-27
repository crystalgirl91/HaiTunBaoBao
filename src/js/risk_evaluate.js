angular.module("risk_evaluate", ["ng", "common", "ngRoute"])
.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/risk_evaluate1', {})
		.when('/risk_evaluate2', {})
}])
.run(["$rootScope", "$API", '$route', (scope, api, $route) => {
	scope.$on('$routeChangeSuccess', changeRoute);
	function changeRoute(e, route){
		if(location.hash=='#/risk_evaluate1'){
			scope.route = 'risk_evaluate1';
		}
		else{
			scope.route = 'risk_evaluate2';
		}
	}
	scope.risk = {
		sex: "a1",
		social_insurance: "h1"
	}
	scope.evaluate = function(){
		console.log(scope.risk)
		api.riskEvaluate(scope.risk.sex, scope.risk.age, scope.risk.job, scope.risk.address, scope.risk.assets, scope.risk.incomeYear, scope.risk.payYear, scope.risk.social_insurance, scope.risk.healthinsurance, scope.risk.accidentinsurance, scope.risk.propertyinsurance, scope.risk.dutyinsurance).then(
			data => {
				sessionStorage.$risktip = data.model.risktip;
				location.replace("risk_result.html#/risk_evaluate1")
			},
			error => {
				console.log(11111111111,error)
			}
		);
	}
}])

