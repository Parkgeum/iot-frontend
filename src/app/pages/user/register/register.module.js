/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.register', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('user.register', {
                url: '/register',
                templateUrl: 'app/pages/user/register/register.html',
                controller: 'RegisterCtrl as vm',
            });
    }

})();
