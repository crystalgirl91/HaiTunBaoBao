angular.module("signin", ["ng", "common"])
.controller("loginController", ["$scope", '$API', function(scope, api){
	scope.submit = function(){
		api.login(scope.phone, scope.password)
			.then(
				data => {
					let return_url = sessionStorage.login_return
					console.log(return_url);
					delete sessionStorage.login_return
					location.replace(return_url || 'index.html')
				},
				data => {
					// alert(data.errMessage)
				}
			);
	};
}])
.directive('verifyCode', [function(){
	// Runs during compile
	return {
		// name: '',
		// priority: 1,
		// terminal: true,
		// scope: {}, // {} = isolate, true = child, false/undefined = no change
		// controller: function($scope, $element, $attrs, $transclude) {},
		// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
		// restrict: 'A', // E = Element, A = Attribute, C = Class, M = Comment
		// template: '',
		// templateUrl: '',
		// replace: true,
		// transclude: true,
		// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
		link: function($scope, ele, attrs, controller) {
			ele.html('<input class="m-input" class=""><canvas style="cursor: pointer" width="180" height="60"></canvas>')
			let canvas = ele.find('canvas')
			let cx = canvas[0].getContext('2d')
			canvas.on('click', render)
			render()

			function render(e){
				cx.clearRect(0, 0, 180, 60)
				let code = Math.random().toString(36).substr(2, 6)
				cx.font = [
					['normal', 'italic', 'oblique'][Math.random() * 3 ^ 0],
					['normal', 'small-caps'][Math.random() * 2 ^ 0],
					['normal', 'bold'][Math.random() * 2 ^ 0],
					['28px', '24px', '30px'][Math.random() * 3 ^ 0],
					['sans-serif', 'tahoma', 'mono'][Math.random() * 3 ^ 0]
				].join(' ')
				cx.fillText(code, 20, 38)
			}
		}
	};
}]);
