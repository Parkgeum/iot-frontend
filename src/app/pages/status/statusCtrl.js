/**
 * @author wsl
 * created on 2017-04-26
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.pages.alldevice')
        .controller('statusCtrl', StatusCtrl);

    var app = angular.module('BlurAdmin.pages.alldevice');

    app.filter('unique', function () {
        return function (collection, keyname) {
            var output = [],
                keys = [];
            angular.forEach(collection, function (item) {
                var key = item[keyname];
                if (keys.indexOf(key) === -1) {
                    keys.push(key);
                    output.push(item);
                }
            });
            return output;
        };
    });

    /** @ngInject */
    function StatusCtrl($scope, $echarts, $interval, $timeout, NgTableParams, $filter, httpService, $http, AuthTokenFactory) {
        var vm = this;

        vm.gateway_list = [];
        vm.device_list = [];
        vm.gateway_value = "Select Gateway";
        vm.deviceTypeName = "iBeacon"
        vm.device_value = "Select Device"
        // vm.tableParamsGateway = {};
        // vm.tableParamsDevice = {};
        // vm.tableParams = {};
        vm.deviceTypeValue = "iBeacon";
        vm.tableParams = new NgTableParams({
                page: 1,
                count: 10
            }, {
                filterDelay: 300,
                counts: [],
                getData: function ($defer, params) {

                    var filter = params.filter();
                    var type = filter.type;
                    var gatewayMac = filter.gatewayMac;
                    var mac = filter.mac;
                    var sorting = params.sorting();
                    var size = params.count();
                    var page = params.page() - 1;
                    var sort = "";
                    var token = AuthTokenFactory.getToken();
                    if (vm.deviceTypeValue == "Sensor")
                        vm.deviceTypeValue = "S1";
                    if (type === undefined)
                        type = vm.deviceTypeValue;
                    if (gatewayMac === undefined)
                        gatewayMac = vm.gateway_value;
                    if (mac === undefined)
                        mac = vm.device_value;

                    for (var item in sorting) {
                        sort = item + "," + sorting[item];
                    }


                    httpService.getStatusBy(page, size, sort, type, gatewayMac, mac, token)
                        .success(function (resp) {
                            // console.log(resp);
                            httpService.getDeviceListByType(page, 1000, sort, type, gatewayMac, token)
                                .success(function (resp) {
                                    vm.device_list = resp.data;
                                    // console.log(resp.data);
                                }).error(function (resp, status) {
                                    console.log(resp);
                                    httpService.httpStatusCode(status);
                                });
                            params.total(resp.totalItems);
                            $defer.resolve(resp.data);
                        }).error(function (resp, status) {
                            console.log(resp);
                            httpService.httpStatusCode(status);
                        });
                }
            });

        function _init() {
            vm.tableParams.reload();            
        };
        /* 获取网关列表*/
        var size = 100;
        var page = 0;
        var sort = "";
        var token = AuthTokenFactory.getToken();

        httpService.getGatewayList(page, size, sort, token)
            .success(function (resp) {
                vm.gateway_list = resp.data
            }).error(function (resp) {
                console.log(resp);
            });

        function deviceTypeValue(value) {
            var deviceTypeValue = "iBeacon";
            if (value == "Sensor") {
                deviceTypeValue = "S1"
            } else if (value == "Other") {
                deviceTypeValue = "Unknown";
            }
            return deviceTypeValue;
        };

        vm.selectDeviceType = function (value) {
            vm.deviceTypeName = value;
            vm.deviceTypeValue = deviceTypeValue(value);
            vm.tableParams.filter({
                type: vm.deviceTypeValue
            });
        };

        vm.select_gateway = function (value) {
            vm.gateway_value = value;
            vm.tableParams.filter({
                gatewayMac: vm.gateway_value
            });
        };

        vm.select_device = function (value) {
            vm.device_value = value;
            vm.tableParams.filter({
                mac: vm.device_value
            });
        };
        $scope.sil = $interval(_init, 5000);
        //在页面跳转时触发
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.sil);
        });

    }
})();