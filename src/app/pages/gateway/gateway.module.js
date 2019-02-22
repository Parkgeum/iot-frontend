(function () {
    'use strict';

    angular.module('BlurAdmin.pages.gateway', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('gateway', {
                url: '/gateway',
                templateUrl: 'app/pages/gateway/gateway.html',
                title: 'Gateway',
                controller: 'gatewayCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-hdd-o',
                    order: 50,
                },
            });
    }

})();