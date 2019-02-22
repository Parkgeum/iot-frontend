(function () {
    'use strict';

    angular.module('BlurAdmin.pages.device', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('device', {
                url: '/device',
                templateUrl: 'app/pages/device/device.html',
                title: 'Device',
                controller: 'deviceCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-desktop',
                    order: 50,
                },
            });
    }

})();