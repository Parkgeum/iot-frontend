/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages', [
        'ui.router',

        'BlurAdmin.pages.dashboard',
        'BlurAdmin.pages.gateway',
        'BlurAdmin.pages.device',
        'BlurAdmin.pages.alldevice',
        'BlurAdmin.pages.sensors',
        'BlurAdmin.pages.asset_tags',
        'BlurAdmin.pages.user',
        'BlurAdmin.pages.users',
        'BlurAdmin.pages.ibeacons',
        'BlurAdmin.pages.activate'
        
    ]).config(routeConfig);

    /** @ngInject */
    function routeConfig($urlRouterProvider, $stateProvider, baSidebarServiceProvider) {

        $stateProvider
            .state('pages', {
                url: '/pages',
                templateUrl: 'app/pages/pages.html'
            });


        // $urlRouterProvider.otherwise('/dashboard');
        $urlRouterProvider.otherwise('/user/login');

    }

    angular.module('BlurAdmin.pages').config(function($echartsProvider) {
        $echartsProvider.setGlobalOption({
            theme: 'macarons',
            driftPalette: true,
            title: {
                left: 'center',
                top: 'top',
                padding: [20, 10, 10, 10]
            },
            backgroundColor: '',
            textStyle:{
                color:"#ffffff"
            }
        })
    });
})();
