
angular.module("personal_claimfor", ["ng", "personal", "common"])
.directive("uploadList", ["$API", '$compile',function(api, $compile){
	return {
		restrict: "A",
		replace: true,
		transclude: true,
		template: `<ul>
			<li class="upload upload-image" ng-repeat="(key, img) in imgs" ng-style="{
				'background-image': 'url(' + img.url + ')'
			}">
				<a href="javascript:void(0)" class="close" ng-click="removeImage(key)"></a>
			</li>
			<li ng-show="imgs.length < maxImage" class="upload upload-button">
				<form id="headForm" action="javascript:">
					<input id="uploadImage" name="img" accept="image/*" type="file">
				</form>
			</li>
		</ul>`,
		controller: ['$scope', function(scope){
			scope.removeImage = function(index){
				api.removeServlet({
					filename: scope.imgs[index].name
				})
				scope.imgs.splice(index, 1)
			}
		}],
		link: function(scope, element, attrs){
			scope.imgs = []
			scope.maxImage = Number(attrs.uploadList) || 3

			let form = element.find("#headForm")[0]
			console.log(form, element);
			element.find("#uploadImage").on("change", e => {
				console.log(form)
				let upload = api.upload(form);
				upload.onload = function(){
					try {
						var data = JSON.parse(upload.responseText);
						scope.imgs.push.apply(scope.imgs, data)
						form.reset();
					}
					catch (e){
						console.log(12);
					}
					form.reset()
					scope.$apply()
				}
				upload.onerror = function(){

				}
			})
		}
		
	};
}])
// .directive("upload", ["$API", "$http", "$BaseUrl", function(api, $http, $BaseUrl){
// 	return {
// 		restrict: "A",
// 		replace: true,
// 		transclude: true,
// 		template: '<li class="upload">'+
// 						'<form id="headForm" action="javascript:">'+
// 							'<input id="uploadImage" name="img" accept="image/*" type="file">'+
// 						'</form>'+
// 				    '</li>',
// 		link: function(scope, element, attrs){
// 			$(".upload").css("background", "url(../img/personal/icon-noun.png) center center no-repeat");

// 			element.find("input").on("change", function () {
// 				var wrapper = $(this).parent().parent();
// 			    var form = element.find("form")[0];
// 			    if (form.img.files.length) {
// 			        (function () {
// 			            // var progressbar = $("<div data-progress style='position:absolute;top:0;bottom:1px;left:0;right:0;background:transparent;'><em style='width:0%;display:block;height:100%;border-bottom:1px solid green;'></em></div>");
// 			            // var loaded = progressbar.find("em");
// 			            // element.append(progressbar);
// 			            var close = $('<a href="javascript:void(0)" class="close"></a>')
// 			            element.append(close);
// 			            element.find(".close").on("click", function(e){
// 			            	api.removeServlet({filename: element.attr("imagename")}).then(
// 			            		data => {
			            			
// 			            		},
// 			            		err => {
// 			            			console.log(err);
// 			            		}
// 			            	);
// 			            });
// 			            var upload = api.upload(form);
// 			            // upload.onprogress = function (e) {
// 			            //     loaded.css("width", (e.loaded / e.total * 100).toFixed(2) + "%");
// 			            // };

// 			            upload.onload = function () {
// 			                try {
// 			                    var data = JSON.parse(upload.responseText);
// 			                    console.log(2222222222,data);
// 			                    wrapper.attr("imagename", data[0].name);
// 			                    wrapper.css("background", "url("+ data[0].url +") center center no-repeat");
// 			                    wrapper.css("background-size", "100% 100%");
// 			                    form.reset();
// 			                    // progressbar.remove();
// 			                    scope.$broadcast("uploaded", true);
// 			                } catch (e) {
// 			                    // B.showMessage(e.message);
// 			                }
// 			            };
// 			            upload.onerror = function (e) {
// 			                // B.showMessage("头像上传失败");
// 			                $("form")[0].reset();
// 			                progressbar.remove();
// 			            };
// 			        })();
// 			    }
// 			});
// 		}
		
// 	};
// }])
.controller("claimforController", ["$scope", "$API", function(scope, api){
	scope.data = {};
	scope.tipText = "";
	scope.download = function(){
		if(scope.data.isunum){
			api.getResourceUrl(scope.data.isunum.prodAid).then(
				data => {
					console.log(data.model);
				},
				err => {
					console.log(err);
				}
			);			
		}
	};
	api.insureCommAuListall(1,100).then(
		data => {
			scope.lists = data.model.list;
		},
		err => {
			console.log(err);
		}
	);
	scope.submit = function(){
		console.log(scope.imgs);
		let imgs = scope.imgs.map(function(item){ return item.name }).join("|");
		api.fileClaim(scope.data.isowner, scope.data.isunum.isuNum, scope.data.requser, scope.data.requserid, scope.data.isunum.isuType, scope.data.comments, imgs ).then(
			data => {
				window.location = "personal_myclaimfor.html";
			},
			err => {
				console.log(err);
			}
		);
	};
}])