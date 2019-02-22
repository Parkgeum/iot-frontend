/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login')
    .controller('LoginCtrl', LoginCtrl)
    .controller('openmsgCtrl', OpenMsgCtrl);

    /** @ngInject */
    function LoginCtrl($scope, $state, httpService, UserService, AuthTokenFactory, $uibModal) {
        $scope.LoginStatus = null;
        $scope.loginData = {};
        var emailReg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@([a-zA-Z0-9]+[-.])+[a-zA-Z]{2,5}$/;
        $scope.animationsEnabled = true;

        //    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        $scope.login = function () {
            UserService.login($scope.loginData).success(function (response) {
                AuthTokenFactory.storeUserInfo(response.data);
                // console.log("login" + JSON.stringify(response.data));
                // console.log("login2" + JSON.stringify(AuthTokenFactory.getUserInfo()));
                // console.log("token" + AuthTokenFactory.getToken());
                $scope.LoginStatus = false;
                window.sessionStorage.setItem('username', response.data.name);
                window.sessionStorage.setItem('email', response.data.email);
                $state.go('dashboard');
            }).error(function (response, status) {
                if(response.message){
                    if(response.message.indexOf("User is not activated") != -1){
                        $scope.item = "The account is not activated, please login mailbox to activate";
                        $scope.openMsgModel('sm');
                    }else{
                        $scope.LoginStatus = true;
                    }
                }else{
                    $scope.LoginStatus = true;
                }
            });
        };

        $scope.openMsgModel = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/user/login/msg.html',
                controller: 'openmsgCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return $scope.item;
                    }
                }
            });
        };
    }

    function OpenMsgCtrl($scope, $uibModalInstance, item) {
        $scope.data = item;
    }

})();