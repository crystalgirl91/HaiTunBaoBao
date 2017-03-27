angular.module('directives', ["ng"])
.directive('tabs', [function(){
	// Runs during compile
	return {
		priority: 1,
		controller: function($scope, $element, $attrs, $transclude) {
			$scope.blocks = [];
			$scope.changeStatus = function(_scope){
				$scope.blocks.forEach(function(b){ b.active = false;})
				_scope.active = true;
				_scope.tabCallback && _scope.tabCallback({SCOPE:_scope});
			};
			this.changeStatus = $scope.changeStatus;
			this.addBlock = function(_scope){
				$scope.blocks.push(_scope);
			};
		},
		restrict: 'AE',
		template: `
			<div class="tab">
				<ul class="tab-head">
					<li class="tab-title" ng-class="{'active':block.active}" ng-click="changeStatus(block)" ng-repeat="block in blocks">{{block.tabTitle}}</li>
				</ul>
				<div class="tab-content" ng-transclude></div>
			</div>
		`,
		replace: true,
		transclude: true,
		link: function($scope, iElm, iAttrs, controller) {
			
		}
	};
}])
.directive('tabset', [function(){
	// Runs during compile
	return {
		priority: 1,
		scope: {
			tabTitle:"@",
			tabCallback:"&"
		},
		controller: function($scope, $element, $attrs, $transclude) {},
		restrict: 'AE',
		template: '<div class="tab-item" ng-class="{active:active}" ng-transclude></div>',
		replace: true,
		transclude: true,
		require:"^tabs",
		link: function($scope, iElm, iAttrs, controller) {
			controller.addBlock($scope);
			if(iElm.hasClass("active")){
				$scope.active = true;
				controller.changeStatus($scope);
			}
		}
	};
}])
.directive('uiSpinner', ['$compile',function($compile){
	return {
		priority: 1,
		terminal: true,
		scope:{
			value:"=ngModel"
		},
		controller: function($scope, $element, $attrs, $transclude) {
			if(!$scope.value){
				$scope.value = 1;
			}
			$scope.add = function(num){
				$scope.value = $scope.value + num;
				$scope.format();
			};
			$scope.format = function(){
				if(/^\s*([1-9]\d*)?\s*$/.test($scope.value)){}
				else{
					$scope.value = 1;
				}
			};
			$scope.validate = function(){
				if(Number($scope.value)>0){}
				else{
					$scope.value = 1;
				}
			}
		},
		restrict: 'AE',
		replace: false,
		transclude: false,
		link: function($scope, iElm, iAttrs, controller) {
			let templateStr = `
				<div class="addtool">
					<span class="addtool-btn sub" ng-click="add(-1)">-</span>
					<input type="text" ng-model="value" class="addtool-input" ng-blur="validate()" ng-keyup="format()">
					<span class="addtool-btn add" ng-click="add(+1)">+</span>
				</div>
			`;
			let template = angular.element(templateStr);
			iElm.after($compile(template)($scope));
		}
	};
}])
.directive('pagination', [function(){
	return {
		priority: 2,
		scope: {
			pages:"=",
		},
		controller: function($scope, $element, $attrs, $transclude) {
			let defaulpages = 10;
			let modelCtrl;
			let self = this;
			let getNumbers = function(curpage,pages){
				let pagesarr = [];
				for(let i = 0 ; i < pages ; i++){
					pagesarr.push(i+1);
				}
				if(pages < defaulpages){
					return pagesarr;
				}
				if(curpage < Math.floor(defaulpages/2)){
					return pagesarr.slice(0,defaulpages)
				}
				if(curpage > pages - (Math.floor(defaulpages/2))){
					return pagesarr.slice(pages-defaulpages,pages)
				}
				return pagesarr.slice(curpage-(Math.floor(defaulpages/2)),curpage+(Math.floor(defaulpages/2)));
			};
			$scope.render = function(_cur,_pages){
				$scope.numbers = getNumbers(_cur,_pages);
				modelCtrl.$setViewValue(_cur);
				modelCtrl.$render();
			};
			
			$scope.$watch("pages", (newval) => {
				if(newval){
					$scope.render(1,newval);
				}
			});

			this.init = function(_modelCtrl){
				modelCtrl = _modelCtrl;
			};
			
		},
		restrict: 'AE',
		templateUrl: '../include/pagination.html',
		replace: true,
		transclude: false,
		require:['pagination','ngModel'],
		link: function($scope, iElm, iAttrs, controller) {
			let ctrl = controller[0];
			let ngModelCtrl = controller[1];

			if(!ngModelCtrl){
				return;
			}
			ngModelCtrl.$render = function(){
				$scope.page = Number(ngModelCtrl.$viewValue);
			};
			ctrl.init(ngModelCtrl);
		}
	};
}])
.directive('uiSelect', [function(){
	// Runs during compile
	return {
		priority: 2,
		controller: function($scope, $element, $attrs, $transclude) {

		},
		require: ['ngModel'],
		restrict: 'A',
		replace: false,
		link: function($scope, iElm, iAttrs, controller) {
			let ngModelCtrl = controller[0];
			if(!ngModelCtrl){
				return;
			}
			ngModelCtrl.$render = function(){
				$scope.selectedValue = ngModelCtrl.$viewValue;
			};
		}
	};
}])
.directive('moneyInput', [function(){
	return {
		scope: {
			"base":"=moneyInput"
		},
		require:["ngModel"],
		controller: function($scope, $element, $attrs, $transclude) {},
		restrict: 'AE',
		link: function($scope, iElm, iAttrs, controller) {
			let ngModelCtrl = controller[0];
			console.log(ngModelCtrl)
			if(!ngModelCtrl){
				return;
			}
			iElm.on("keyup",e =>{
				console.log(/^\s*[1-9]?\d*\s*$/.test(ngModelCtrl.$viewValue))
				if(/^\s*[1-9]?\d*\s*$/.test(ngModelCtrl.$viewValue) === false){
					ngModelCtrl.$setViewValue(Number($scope.base));
					ngModelCtrl.$render();
				}
			});
		}
	};
}]);