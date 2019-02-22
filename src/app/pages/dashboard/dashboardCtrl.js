(function () {
    'use strict';

    var app = angular.module('BlurAdmin.pages.dashboard');

    /** @ngInject */
    app.controller('DashboardCtrl', ['$scope', '$interval', 'NgTableParams', '$timeout', 'httpService', '$uibModal', '$http', 'AuthTokenFactory', function ($scope, $interval, NgTableParams, $timeout, httpService, $uibModal, $http, AuthTokenFactory) {
        var vm = this;

        vm.servers_chart = {
            totals: 2,
            nows: 2
        };
        vm.messages_chart = {
            totals: 23
        };

        vm.gateways_total = 0;
        vm.devices_total = 0;
        vm.GatewayList = {};
        vm.DeviceList = {};

        var token = AuthTokenFactory.getToken();
        var page = "";
        var size = "";
        var sort = "";
        /*
         * 获取网关列表的总数
         */
        httpService.getGatewayList(page, size, sort, token)
            .success(function (resp) {
                vm.gateways_total = resp.totalItems;
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });
        
        /*
         * 获取设备列表的总数
         */
        httpService.getDeviceList(page, size, sort, token)
            .success(function (resp) {
                vm.devices_total = resp.totalItems;
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });

        /*
         *在Statuses表中获取最新更新的网关以及设备信息
         */
        function _init() {

            var size = 20;
            var page = 0;
            var sort = "";
            var token = AuthTokenFactory.getToken();
            var type = "Gateway";

            httpService.getTypeStatus(page, size, sort, type, token)
                .success(function (resp) {
                    vm.GatewayList = resp.data;
                    // console.log(vm.GatewayList);
                }).error(function (resp, status) {
                    console.log(resp);
                    httpService.httpStatusCode(status);
                });

            var excludeType = "Gateway";
            httpService.getDeviceStatus(page, size, sort, excludeType, token)
                .success(function (resp) {
                    vm.DeviceList = resp.data;
                    // console.log(new Date(Date.parse(vm.DeviceList[0].updatedAt)));
                }).error(function (resp, status) {
                    console.log(resp);
                    httpService.httpStatusCode(status);
                });

        };
        _init();
        /**
         * 5s重新获取一次
         */
        $scope.sil = $interval(_init, 5000);
        //在页面跳转时触发
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.sil);
        });
    }]);

})();