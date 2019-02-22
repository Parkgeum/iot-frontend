/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.register')
        .controller('RegisterCtrl', RegisterCtrl)
        .controller('openmsgCtrl', OpenMsgCtrl);
    
    angular.module('BlurAdmin.pages.register')
        .config(function (ngIntlTelInputProvider) {
            ngIntlTelInputProvider.set({
                preferredCountries: ["cn","us","gb"],
                initialCountry: 'cn',
                // separateDialCode: true,
                nationalMode: false,
                utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/12.1.4/js/utils.js"
            });
        });

    /** @ngInject */
    function RegisterCtrl($scope, $state, httpService, $uibModal, UserService) {

        $scope.emailReg = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@([a-zA-Z0-9]+[-.])+[a-zA-Z]{2,5}$/;
        $scope.registerData = {};
        $scope.registerData.name = "";
        $scope.registerData.mobile_phone = "";
        $scope.registerData.email = "";
        $scope.registerData.password = "";
        $scope.Mphone = "";
        $scope.item = {};
        $scope.item.result = null;
        // $scope.animationsEnabled = true;

        $scope.register = function () {
            var dialCode = $("#Mphone").intlTelInput("getSelectedCountryData").dialCode;
            var phoneNumber = $("#Mphone").intlTelInput("getNumber");
            var len = phoneNumber.indexOf(dialCode) + dialCode.length;

            $scope.registerData.nationcode = dialCode;
            $scope.registerData.mobile_phone = phoneNumber.slice(len);
            console.log($scope.registerData);
            UserService.register($scope.registerData).success(function (resp) {
                console.log(resp);
                if(resp.status === 200){
                    $scope.item.result = true;
                    $scope.item.msg = "We have sent an activation email to your email address, "+ $scope.registerData.email +". Please click the link in the email to complete the registration. If you do not receive the email, please check the spam!";
                    $scope.openMsgModel('md');
                }else if(resp.status === 450){
                    $scope.item.result = false;
                    $scope.item.msg = "The account already exists!";
                    $scope.openMsgModel('sm');
                }else if(resp.status === 400){
                    $scope.item.result = false;
                    $scope.item.msg = "The name already exists!";
                    $scope.openMsgModel('sm');
                }else{
                    $scope.item.result = false;
                    console.log(resp);
                }
            }).error(function (resp) {
                console.log(resp);
            });          
        };

        $scope.openMsgModel = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/user/register/msg.html',
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

    function OpenMsgCtrl($scope, $uibModalInstance, item, $state) {
        $scope.data = item;
        $scope.goLogin = function () {
            $state.go('user.login');
        }
    }

})();