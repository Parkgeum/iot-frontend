(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profile')
    .controller('ProfileCtrl', ProfileCtrl)
    .controller('OpenMsgCtrl', OpenMsgCtrl);

    /** @ngInject */
    function ProfileCtrl($scope, httpService, AuthTokenFactory, $uibModal, $state) {
        $scope.profile = {};
        var token = AuthTokenFactory.getToken();
        $scope.uuid = AuthTokenFactory.getUserInfo().userId;
        $scope.isSame = true;
        $scope.animationsEnabled = true;
        $scope.item = {};

        httpService.getUser($scope.uuid, token)
            .success(function (resp) {
                console.log(resp);
                $scope.profile.name = resp.data.name;
                $scope.profile.email = resp.data.email;
                $scope.profile.uuid = resp.data.uuid;
                $scope.profile.userId = resp.data.userId;
                $scope.profile.nationcode = resp.data.nationcode;
                $scope.profile.mobile_phone = resp.data.mobile_phone;
                $scope.Mphone = resp.data.nationcode + resp.data.mobile_phone;
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });

        $scope.updateProfile = function () {
            if ($scope.profile.password != $scope.profile.confirm_password) {
                $scope.isSame = false;
                return;
            }else{
                var dialCode = $("#Mphone").intlTelInput("getSelectedCountryData").dialCode;
                var phoneNumber = $("#Mphone").intlTelInput("getNumber");
                var len = phoneNumber.indexOf(dialCode) + dialCode.length;
                $scope.profile.nationcode = dialCode;
                $scope.profile.mobile_phone = phoneNumber.slice(len);
                $scope.isSame = true;
                console.log($scope.profile);
                httpService.updateUser($scope.profile, token)
                    .success(function (resp) {
                        console.log(resp);
                        if(resp.status === 200){
                            window.sessionStorage.setItem('username', resp.data.name);
                            $scope.item.msg = "Successfully modified!";
                            $scope.openMsgModel('sm');
                        }else if(resp.status === 400){
                            $scope.item.msg = "The name already exists!";
                            $scope.openMsgModel('sm');
                        }
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            }
        };

        $scope.openMsgModel = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/user/profile/msg.html',
                controller: 'OpenMsgCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return $scope.item;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                console.log(result);
			}, function () {
                $state.reload('user.profile');
				console.log('Modal dismissed at: ' + new Date());
			});
        }

    }

    function OpenMsgCtrl($scope, $uibModalInstance, item){
        $scope.data  = item;
    }

})();