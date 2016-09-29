var personNum = 0;
var store_phone = '042-822-8299';

if(localStorage['store_phone'] == ''){
	console.log('not store phone');
	localStorage.setItem("store_phone", "042-822-8299");
}	

console.log(localStorage['store_phone']);

var app = angular.module('Project', []);
app.controller('DefaultCtrl', function($scope, $http) {
	$scope.dataList = [ 1, 2, 3, 4, 5, 6, 7 ];
	$scope.good = false;
	$scope.text = 'NEW GAME';
	$scope.getData = '';
	$scope.myData = '';
	$scope.subscriberData = '';

	$http({
		method : "GET",
		url : 'http://175.126.112.98:3000/stores/' + store_phone
	}).then(function mySucces(response) {
		console.log(response['data']);
		$scope.myData = response['data'];
	}, function myError(response) {
		console.log(response);
	});

	$http({
		method : "GET",
		url : 'http://175.126.112.98:3000/reserves/' + store_phone
	}).then(function mySucces(response) {
		$scope.subscriberData = response['data']['arr'];
		console.log($scope.subscriberData.length);
		
		for(var i=0; i<$scope.subscriberData.length; i++){
			$(function() {
				var divListTag = '<li class="ui-li-anchor"><a href="#listview_popup"'
					+'data-inline="true" data-rel="popup" data-position-to="window">'
					+$scope.subscriberData[i]['name'] + '</a></li>';

				$("#person-listview").append(divListTag);
			});
		}
	}, function myError(response) {
		console.log(response);
	});

	$scope.changePage = function(data) {
		console.log(data);
		var popup = document.getElementById("listview_popup");
		popup.addEventListener("popupafteropen", function() {
			// Implement code for popupafteropen event
			$(function() {
				$('.ui-popup-header').text(data['name']);
			});
		});
	};
});

(function() {
	/**
	 * Back key event handler
	 */
	window
			.addEventListener(
					'tizenhwkey',
					function(ev) {
						if (ev.keyName === "back") {
							var activePopup = document
									.querySelector('.ui-popup-active'), page = document
									.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id
									: "";

							if (pageid === "main" && !activePopup) {
								try {
									tizen.application.getCurrentApplication()
											.exit();
								} catch (ignore) {
								}
							} else {
								console.log("back");
								window.history.back();
							}
						}
					});
}());
