angular.module("personal_coupon", ["ng", "personal", "common","ngRoute"])

.config(["$sceProvider",'$routeProvider',function($sceProvider, $routeProvider) {
	$sceProvider.enabled(false);
	$routeProvider
		.when('/unuse', {})
		.when('/used', {})
		.when('/expire', {})
}])

.run(["$rootScope", "$API", '$route', (scope, api, $route) => {
	scope.type = location.hash.slice(2);
	let getBeautifulDate = function(dateString){
	    let result = "";
	    let date = new Date(dateString);

	    let yy = date.getFullYear();
	    let mm = date.getMonth()+ 1;
	    mm = mm < 10 ? ("0"+ mm ) : mm;
	    let dd = date.getDate();
	    dd = dd < 10 ? ("0"+  dd) : dd;

	    result = yy + "-"+ mm + "-" + dd;
	    return result;
	}
	let filterData = function(data){
		scope.type = location.hash.slice(2);
		console.log(121212,scope.type)
		scope.coupons = data.filter(function(item){
			if(scope.type=="unuse"){
				return item.coup_status!=0 && item.used==0;
			}
			else if(scope.type=="used"){
				return item.coup_status!=0 && item.used==1;
			}
			else{
				return item.coup_status==0;
			}
		});
	}
	api.listallcoupon(1,100).then(
		data => {
			scope.original = data.model.list.map(function(item){
				if(item.valid_date_start && item.valid_date_end){
					item.startdate = getBeautifulDate(item.valid_date_start.toString());
					item.enddate = getBeautifulDate(item.valid_date_end.toString());
				}
				return item;
			}).sort(function(a,b){ return a.enddate>b.enddate?-1:1 });

			scope.unuse = scope.original.filter(function(item){
				return item.coup_status!=0 && item.used==0;
			});
			scope.used = scope.original.filter(function(item){
				return item.coup_status!=0 && item.used==1;
			});
			scope.expire = scope.original.filter(function(item){
				return item.coup_status==0;
			});

			if(scope.type=="unuse"){
				scope.coupons = scope.unuse;
			}
			else if(scope.type=="used"){
				scope.coupons = scope.used;
			}
			else{
				scope.coupons = scope.expire;
			}
		},
		err => {
			console.log(err);
		}
	);
	scope.$on('$routeChangeSuccess', function(){
		if(scope.original)
			filterData(scope.original);
	});
}])