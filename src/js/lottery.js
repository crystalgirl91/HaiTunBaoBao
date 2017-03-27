angular.module('lottery', ['common'])
.run(['$rootScope', '$API', '$timeout', function(scope, api, $timeout){
	scope.my_credits = '登录后查看';
	scope.showDialog = false;
	scope.showErrorDialog = false;
	scope.showMessageDialog = false;
	scope.styleObj = {
		transform: 'transform: rotate(0deg)'

	}
	let allow_go = false
	scope.go = function(){
		if(allow_go){
			api.shakephone().then(
				res => {
					allow_go = false
					switch(res.model.point_amt){
						case 10:
							scope.styleObj.transform = `transform: rotate(${360 * 10.1}deg)`
						break;
						case 20:
							scope.styleObj.transform = `transform: rotate(${360 * 10.3}deg)`
						break;
						case 50:
							scope.styleObj.transform = `transform: rotate(${360 * 10.5}deg)`
						break;
						case 100:
							scope.styleObj.transform = `transform: rotate(${360 * 10.7}deg)`
						break;
						case 5:
							scope.styleObj.transform = `transform: rotate(${360 * 10.9}deg)`
						break;
					}
					scope.$applyAsync()
					$timeout(() => {
						scope.showMessageDialog = true
						scope.showErrorDialog = false
						scope.showDialog = true
						scope.messageDialogContent = `恭喜你，中了${res.model.point_amt}积分，哇！人品大爆发啦！`
					}, 8500)
				},
				err => {
					scope.showMessageDialog = false
					scope.showErrorDialog = true
					scope.showDialog = true
					scope.errorDialogContent = err.errMessage
				}
			)
		}
	}
	api.getUserInfo(true).then(
		res => {
			scope.my_credits = res.model.avalicredit
			allow_go = true
		},
		err => {
			scope.my_credits = '登录后查看'
		}
	)
	function Checkinlist(){
		api.CheckinlistForToday(1, 30).then(res => {
			scope.list = res.model.list
			scope.total = res.model.total
		})
		setTimeout(Checkinlist, 30000)
	}
	Checkinlist()
	let wrapper = $('.lottery-list-wrapper')[0]
	let wrapper_list = $('.lottery-list-wrapper')[0]
	let list_item_height = 0
	setInterval(function(){
		wrapper = wrapper || $('.lottery-list-wrapper')[0]
		if(wrapper.clientHeight < wrapper.scrollHeight){
			let ost = wrapper.scrollTop
			wrapper.scrollTop += 1
			if(ost === wrapper.scrollTop){
				wrapper.scrollTop = 0
			}
			// if($('.lottery-list-wrapper li')[0]){
			// 	list_item_height = $('.lottery-list-wrapper li')[0].offsetHeight
			// }
			// if(ost === wrapper.scrollTop && list_item_height){
			// 	wrapper_list = wrapper_list || $('.lottery-list-wrapper')[0]
			// 	let first = scope.list.shift()
			// 	scope.list.push(first)
			// 	wrapper.scrollHeight 
			// 	scope.$applyAsync()
			// }
		}
	}, 1600)
}])