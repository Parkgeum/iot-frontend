/**
 * @author wsl
 * created on 2017-04-19
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.asset_tags', []).config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('asset', {
                url: '/asset',
                templateUrl: 'app/pages/assetDemo/asset.html',
                title: 'Asset Demo',
                controller: 'assetTagsCtrl as vm',
                sidebarMeta: {
                    icon: 'fa fa-money',
                    order: 20,
                },
            });
        // $urlRouterProvider.when('/wsl', '/wsl/basic');
    }

})();