(function () {
    'use strict';

    angular.module('BlurAdmin.pages.activate', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('activate', {
                url: '/activate',
                templateUrl: 'app/pages/activate/activate.html',
                title: 'Activate',
                controller: 'ActivateCtrl as vm',
            });
        
    }

})();

