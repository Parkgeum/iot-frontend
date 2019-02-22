(function () {
    'use strict';

    angular.module('BlurAdmin.pages.ibeacons', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ibeacon', {
                url: '/ibeacon',
                templateUrl: 'app/pages/ibeaconDemo/ibeacon.html',
                title: 'iBeacon Demo',
                //  controller: 'ibeaconCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-feed',
                    order: 12,
                },
            });
    }

})();