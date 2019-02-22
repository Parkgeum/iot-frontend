/**
 * @author chris
 * created on 2017-2-9
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.user', [
        'BlurAdmin.pages.login',
        'BlurAdmin.pages.register',
        'BlurAdmin.pages.profile'
    ]).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('user', {
                url: '/user',
                template: '<ui-view  autoscroll="true" autoscroll-body-top></ui-view>',
                abstract: true
            });

    }

})();
