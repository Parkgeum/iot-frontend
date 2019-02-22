/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components').controller('PageTopCtrl', PageTopCtrl);

    /** @ngInject */
    function PageTopCtrl($scope, baSidebarService, $state, UserService, AuthTokenFactory, httpService) {

        $scope.isChange = false;
        var token = AuthTokenFactory.getToken();
        $scope.uuid = AuthTokenFactory.getUserInfo().userId;

        httpService.getUser($scope.uuid,token)
            .success(function(resp){
                $scope.username = resp.data.name;
            }).error(function(resp, status){
                console.log(resp);
                httpService.httpStatusCode(status);
            });

        $scope.signOut = function () {
            UserService.logout();
            // TODO
            window.sessionStorage.removeItem('email');
            window.sessionStorage.removeItem('username');
            $state.go("user.login");  
        };

        $scope.changeLogo = function(){
            if(window.innerWidth > 1200)
                $scope.isChange = !$scope.isChange;
            if(window.innerWidth <=1200)
                $scope.isChange = true;
        };
        
    }
})();