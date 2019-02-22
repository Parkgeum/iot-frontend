/**
 * @author wsl
 * created on 2017-04-26
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.alldevice', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('status', {
                url: '/status',
                templateUrl: 'app/pages/status/status.html',
                title: 'Status',
                controller: 'statusCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-cubes',
                    order: 150,
                },
            });
    }

})();