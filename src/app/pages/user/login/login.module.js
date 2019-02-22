/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.login', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('user.login', {
                url: '/login',
                templateUrl: 'app/pages/user/login/login.html',
                controller: 'LoginCtrl as vm',
            });
    }

})();
