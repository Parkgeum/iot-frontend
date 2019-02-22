(function () {
    'use strict';

    angular.module('BlurAdmin.pages.sensors', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('sensor', {
                url: '/sensor',
                templateUrl: 'app/pages/sensorDemo/sensor.html',
                title: 'Sensor Demo',
                //  controller: 'sensorsCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-line-chart',
                    order: 10,
                },
            });
    }

})();