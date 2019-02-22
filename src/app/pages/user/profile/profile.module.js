(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profile', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('user.profile', {
                url: '/profile',
                templateUrl: 'app/pages/user/profile/profile.html',
                title: 'Profile',
                controller: 'ProfileCtrl as vm',
            });
    }

})();
