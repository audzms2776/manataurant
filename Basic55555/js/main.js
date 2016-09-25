var personNum = 0;

var app = angular.module('Project', []);
app.controller('DefaultCtrl', function($scope) {
	$scope.dataList = [ 1, 2, 3, 4, 5, 6, 7 ];
	$scope.good = false;
	$scope.text = 'NEW GAME';
	$scope.changePage = function(data) {
		console.log(data);
		personNum = data;
		var popup = document.getElementById("listview_popup");
		popup.addEventListener("popupafteropen", function() {
			// Implement code for popupafteropen event
			$(function() {
				$('.ui-popup-header').text('person ' + personNum);
			});
		});
	};

	$scope.test = function(data) {
		console.log(11);
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
