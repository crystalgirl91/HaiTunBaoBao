angular.module("personal_account", ["ng", "personal", "common","ngRoute"])

.controller("inforController", ["$scope", "$API", "dialog", function(scope, api, dialog){

	scope.is_sigin = false;
	scope.infor = {};
	api.getUserInfo(true).then(
		data => {
			scope.infor = data.model;
			function renderDate(date){
				let ordDate = new Date(date);
				let obj ={
				    year:ordDate.getFullYear(),
				    month:ordDate.getMonth()+1,
				    date:ordDate.getDate(),
				    hour: ordDate.getHours(),
				    minute: ordDate.getMinutes(),
				    second: ordDate.getSeconds()
				}
				let newDate = obj.year+'-'+obj.month+'-'+obj.date+" "+obj.hour+":"+obj.minute+":"+obj.second;
				return newDate;
			};
			scope.infor.registerDate = renderDate(data.model.login_date_last);
			
			let level = parseInt(scope.infor.cust_risklevel);
			console.log(level)
			if(level>=0 && level<50){
				scope.infor.cust_risk = '高风险';
			}
			if(level>=50 && level<70){
				scope.infor.cust_risk = '中风险';
			}
			else{
				scope.infor.cust_risk = '低风险';
			}

			console.log(data);
		},
		err => {
			console.log(err);
		}
	);

	scope.type = "comm";
	scope.pageSize = 4;
	scope.pageIndex = 1;
	scope.total = 0;
	scope.changeType = function(){
		scope.loadData();
	}
	scope.selectPage = function(pageIndex){
		scope.loadData();
	};
	scope.loadData = function(){
		if(scope.type=="comm"){
			api.insureCommAuPolicyList(scope.pageIndex, scope.pageSize, 3).then(
				data => {
					scope.comm = data.model.list;
					scope.total = data.model.total;
				},
				err => {
					console.log(err);
				}
			);
		}
		else{
			api.ctrlProdList(scope.pageIndex, scope.pageSize, 7).then(
				data => {
					scope.mutual = data.model.list;
					scope.total = data.model.total
				},
				err => {
					console.log(err);
				}
			);
		}
	}
	scope.loadData();

	scope.evaluateBaobao = function(cur_item){
		scope.curItem = cur_item;
		dialog.box({
			title: "",
			width: 598,
			top: 100,
			scope: scope,
			contentUrl: "include/evaluate_baobao.html",
			controller: "evaluateBaobaoController"
		}).then(
			res => {
				console.log(res);
			},
			err => {
			}
		);
	}

	scope.sigin = function(){
		api.checkin().then(
			data => {
				scope.is_sigin = true;
				api.getUserInfo(true);
			},
			err => {
				console.log(err);
			}
		)
	}
	scope.signout = function(){
		api.logout().then(function(res){
			if(res.success){
				location.replace("signin.html");
			}
		});
	}
}])
.controller("evaluateBaobaoController", ["$scope", "$API", function($scope, api){
	$scope.evaluate = { grade: "5" };
	$scope.submit = () => {
		api.insureCommentsAuAdd($scope.curItem.prodAid, $scope.curItem.ordAid, $scope.curItem.skuAid, $scope.evaluate.grade, $scope.evaluate.content).then(
			data => {
				$scope.loadData();
			},
			err => {
				console.log(err);
				// alert(err.errMessage)
			}
		);
		$scope.$close();
	};
}])