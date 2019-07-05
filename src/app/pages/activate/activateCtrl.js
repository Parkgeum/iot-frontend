(function () {
    'use strict';

    var app = angular.module('BlurAdmin.pages.dashboard');

    /** @ngInject */
    app.controller('ActivateCtrl', ['$scope','$http','$state', '$timeout', function ($scope, $http, $state, $timeout) {

            var oriUrl = window.location.href;
            var arr = oriUrl.split("?");
            $scope.isValid = true;
            $scope.second = 1;

            if(arr.length == 2){
                var url = "http://192.168.0.45:8080/account/activate?" + arr[1];
                console.log(url);
                $http({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(function success(resp){
                    console.log(resp);
                    if(resp.data.status === 200){
                        $scope.isValid = true;
                        $timeout(function(){
                            window.location= 'http://192.168.0.45:3000';
                        },2000)
                        
                    }else if(resp.data.status === 400){
                        $scope.isValid = false;
                    }
                },function error(resp){
                    $scope.isValid = false
                    console.log(resp);
                });
                
            }
            
    }]);

})();
