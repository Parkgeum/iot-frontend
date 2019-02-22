(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'app/pages/dashboard/dashboard.html',
                title: 'Dashboard',
                controller: 'DashboardCtrl as vm',
                sidebarMeta: {
                    icon: 'ion-android-home',
                    order: 0,
                },
            });
        // $urlRouterProvider.when('/dashboard/dashboard', '/dashboard/dashboard');
    }

})();

