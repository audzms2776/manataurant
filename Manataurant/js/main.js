var personNum = 0;
var date = new Date();
var today = date.getFullYear() + '-';

if (date.getMonth() < 9) {
    today += '0' + (date.getMonth() + 1);
} else {
    today += (date.getMonth() + 1);
}

function getBaseData($scope, $http) {
    $http({
        method: "GET",
        url: 'http://175.126.112.98:3000/reserves/main/'
        + localStorage.getItem('store_phone')
    }).then(function mySucces(response) {
        console.log(response['data']['arr']);
        $scope.reserveList = response['data']['arr'];
        console.log('Main');
        console.log($scope.reserveList);
        $scope.isMain = $scope.reserveList.length == 0 ? false : true;
        console.log($scope.isMain);
    }, function myError(response) {
        console.log(response)
    });

    $http({
        method: "GET",
        url: 'http://175.126.112.98:3000/stores/'
        + localStorage.getItem('store_phone')
    }).then(function mySucces(response) {
        console.log(response['data']);
        $scope.myData = response['data'];
    }, function myError(response) {
        console.log(response)
    });

    $http({
        method: "GET",
        url: 'http://175.126.112.98:3000/reserves/'
        + localStorage.getItem('store_phone')
    }).then(function mySucces(response) {
        $scope.subscriberData = response['data']['arr'];
        $scope.isPerson = $scope.subscriberData.length == 0 ? false : true;
        console.log($scope.subscriberData.length);
    }, function myError(response) {
        console.log(response)
    });
}

var app = angular.module('Project', []);
app.controller('DefaultCtrl', function ($scope, $http) {

    $scope.reserveList = [];
    $scope.myData = '';
    $scope.subscriberData = '';
    $scope.subscriberReserves = [];
    $scope.mainData = [];
    $scope.isMain = '';
    $scope.isPerson = '';

    $scope.addTime = '00:00';
    $scope.addName = '';
    $scope.addGroup = '';
    $scope.addPhone = '';
    $scope.addNum = '';
    $scope.addDate = '0000-00-00';

    $scope.joinTitle = '';
    $scope.joinPhone = '000-000-0000';
    $scope.joinSTime = '00:00';
    $scope.joinETime = '00:00';
    $scope.joinLocation = '';

    if (localStorage.getItem('store_phone') == null) {
        console.log('전화번호가 없다!');
        $(function () {
            var popupElement = document.getElementById("join_popup"), popup = tau.widget.Popup(popupElement);
            popup.open();
            $("#join_popup").attr('style', 'top:0px; ');
        });
    } else {
        var popupElement = document.getElementById("splash_popup"), popup = tau.widget.Popup(popupElement);
        popup.open();
        $("#splash_popup").attr('style', 'top:0px; ');

        setTimeout(function () {
            popup.close();
        }, 2000);
        getBaseData($scope, $http);
    }

    $scope.changePage = function (data) {
        console.log(data);
        var popup = document.getElementById("listview_popup");
        popup.addEventListener("popupafteropen", function () {
            $('.ui-popup-header b').text(data['name']);
        });
        console.log(data['phone']);
        $http({
            method: "GET",
            url: 'http://175.126.112.98:3000/reserves/list/'
            + localStorage.getItem('store_phone') + '/' + data['phone']
        }).then(function mySucces(response) {
            $scope.subscriberReserves = response['data']['arr'];
            console.log($scope.subscriberReserves);
            $(function () {
                $("#listview_popup").attr(
                    'style', 'top:0px; ');
                var popupElement = document.getElementById("listview_popup"), popup = tau.widget.Popup(popupElement);
                popup.close();
                setTimeout(function () {
                    popup.open();
                    $("#listview_popup").attr('style', 'top:0px; ');
                }, 20)
            });
        }, function myError(response) {
            console.log(response)
        });
    };

    $scope.selectMain = function (index) {
        $scope.mainData = $scope.reserveList[index]['reserves'];

        var arr = $scope.mainData[0]['date'].split('-');
        var date = arr[0] + '-' + arr[1];
        console.log(date);

        $(function () {
            var popup = document.getElementById("main_popup");
            popup.addEventListener("popupafteropen", function () {
                $('.ui-popup-header b').text(date + ' 예약 확인하기');
            });

            $("#main_popup").attr(
                'style', 'top:0px; ');
            var popupElement = document.getElementById("main_popup"), popup = tau.widget.Popup(popupElement);
            popup.close();
            setTimeout(function () {
                popup.open();
                $("#main_popup").attr('style', 'top:0px; ');
            }, 20)
        });
    };

    $scope.addReserve = function () {
        console.log($scope.addTime);
        console.log($scope.addName);
        console.log($scope.addGroup);
        console.log($scope.addPhone);
        console.log($scope.addNum);
        console.log($scope.addDate);

        $http({
            method: "GET",
            url: 'http://175.126.112.98:3000/reserves/add/'
            + localStorage.getItem('store_phone') + '?name=' + $scope.addName + '&group=' + $scope.addGroup + '&date=' + $scope.addDate + '&time=' + $scope.addTime + '&subscriber_phone=' + $scope.addPhone + '&number=' + $scope.addNum
        }).then(function mySucces(response) {
            console.log(response['data']);
            $scope.reserveList = response['data']['main']['arr'];
            $scope.subscriberData = response['data']['list']['arr'];

            $scope.addTime = '00:00';
            $scope.addName = '';
            $scope.addGroup = '';
            $scope.addPhone = '';
            $scope.addNum = '';
            $scope.addDate = '0000-00-00';
            $scope.isMain = true;
            $scope.isPerson = true;

        }, function myError(response) {
            console.log(response)
        });
    };

    $scope.setDateValue = function (data, idx) {
        console.log(data);
        var arr = $scope.addDate.split('-');
        switch (idx) {
            case 1:
                arr[0] = data;
                break;
            case 2:
                if (data < 10)
                    data = '0' + data;
                arr[1] = data;
                break;
            case 3:
                if (data < 10)
                    data = '0' + data;
                arr[2] = data;
                break;
            default:
                break;
        }

        $scope.addDate = arr[0] + '-' + arr[1] + '-' + arr[2];
    };

    $scope.setTimeValue = function (data, idx) {
        var arr = $scope.addTime.split(':');
        switch (idx) {
            case 1:
                if (data < 10)
                    data = '0' + data;
                arr[0] = data;
                break;
            case 2:
                if (data < 10)
                    data = '0' + data;
                arr[1] = data;
                break;
            default:
                break;
        }

        $scope.addTime = arr[0] + ':' + arr[1];
    };

    $scope.joinTask = function () {

        $http({
            method: "GET",
            "url": "http://175.126.112.98:3000/join?name=" + $scope.joinTitle +
            "&store_phone=" + $scope.joinPhone +
            "&location=" + $scope.joinLocation +
            "&startTime=" + $scope.joinSTime +
            "&endTime=" + $scope.joinETime
        }).then(function mySucces(response) {
            console.log(response['data']);
            console.log($scope.joinPhone);
            localStorage.setItem('store_phone', $scope.joinPhone);
            getBaseData($scope, $http);
        }, function myError(response) {
            console.log(response);
            console.log('Fail~');
            var popupElement = document.getElementById("join_popup"), popup = tau.widget.Popup(popupElement);
            popup.open();
            $("#join_popup").attr('style', 'top:0px; ');
        });
    };

    $scope.editData = function(){

      $http({
          method: "GET",
          "url": "http://175.126.112.98:3000/stores/" + localStorage.store_phone + "/edit?name=" + $scope.myData['name'] +
          "&store_phone=" + $scope.myData['store_phone'] +
          "&location=" + $scope.joinLocation +
          "&startTime=" + $scope.myData['startTime'] +
          "&endTime=" + $scope.myData['endTime']
      }).then(function mySucces(response) {
          console.log(response['data']);
          localStorage.store_phone = $scope.myData['store_phone'];
          console.log($scope.myData);
          console.log($scope.joinLocation);
          $scope.joinLocation = '';
          getBaseData($scope, $http);
      }, function myError(response) {
          console.log(response);
          console.log('Fail~');
          var popupElement = document.getElementById("edit_popup"), popup = tau.widget.Popup(popupElement);
          popup.open();
          $("#edit_popup").attr('style', 'top:0px; ');
      });

    }
});

(function () {
    window.addEventListener('tizenhwkey', function (ev) {
        if (ev.keyName === "back") {
            var activePopup = document.querySelector('.ui-popup-active'), page = document.getElementsByClassName('ui-page-active')[0], pageid = page ? page.id : "";
            if (pageid === "main" && !activePopup) {
                try {
                    tizen.application.getCurrentApplication().exit()
                } catch (ignore) {
                }
            } else {
                console.log("back");
                window.history.back()
            }
        }
    })
}());
