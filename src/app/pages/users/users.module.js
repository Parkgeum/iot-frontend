(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('users', {
                url: '/users',
                templateUrl: 'app/pages/users/users.html',
                title: 'User',
                controller: 'usersCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-user',
                    order: 200,
                },
            });
    }

})();