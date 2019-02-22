/**
 * @author wsl
 * created on 2017-04-20
 */
(function () {
    'use strict';

    function inOldArr(arr, value) {
        var rst = null;
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i].mac) {
                rst = arr[i];
            }
        }
        return rst;
    };

    function inNewArr(arr, value) {
        var rst = true;
        for (var i = 0; i < arr.length; i++) {
            if (value == arr[i].mac) {
                rst = false;
            }
        }
        return rst;
    };

    //根据delete参数为true，除去旧的数据
    function removeOldData(arr) {
        var arrData = arr;
        var iArr = [];

        for (var i = 0; i < arrData.length; i++) {
            if (arrData[i].delete) {
                iArr.push(i);
            }
        }

        for (var i = 0; i < iArr.length; i++) {
            arrData.splice(iArr[i], 1);
        }
        return arrData;
    };

    function bijiaoData(oldData, newData) {
        var countNew = "";
        var countDelete = "";
        //判断哪些数据是消失的
        for (var i = 0; i < oldData.length; i++) {
            var isIn = inOldArr(newData, oldData[i].mac);
            if (isIn == null) {
                oldData[i].delete = true;
                countDelete++;
            } else {
                oldData[i].delete = false;
            }
            oldData[i].isNew = false;
        }
        //判断哪些数据是新增的
        for (var i = 0; i < newData.length; i++) {
            newData[i].isNew = inNewArr(oldData, newData[i].mac);
            if (newData[i].isNew) {
                oldData.unshift(newData[i]); //往开头添加一个或者多个数组
                countNew++;
            }
        }
        oldData.countDelete = countDelete;
        oldData.countNew = countNew;
        return oldData;
    }

    var app = angular.module('BlurAdmin.pages.asset_tags');

    /** @ngInject */
    app.controller('assetTagsCtrl', ['$scope', '$interval', 'NgTableParams', '$timeout', 'httpService', '$uibModal', '$http', 'AuthTokenFactory', function ($scope, $interval, NgTableParams, $timeout, httpService, $uibModal, $http, AuthTokenFactory) {
        var vm = this;
        vm.gatewaylist1 = [];
        vm.gatewaylist2 = [];
        vm.gatewaylist3 = [];
        vm.gatewaylist4 = [];
        vm.gateway1_value = "";
        vm.gateway2_value = "";
        vm.gateway3_value = "";
        vm.gateway4_value = "";
        vm.devicelist1 = [];
        vm.devicelist2 = [];
        vm.devicelist3 = [];
        vm.devicelist4 = [];
        vm.gateway1 = [];
        vm.gateway2 = [];
        vm.gateway3 = [];
        vm.gateway4 = [];
        vm.gateway1_old = [];
        vm.gateway2_old = [];
        vm.gateway3_old = [];
        vm.gateway4_old = [];
        vm.First1 = true;
        vm.First2 = true;
        vm.First3 = true;
        vm.First4 = true;
        vm.isFirst1 = true;
        vm.isFirst2 = true;
        vm.isFirst3 = true;
        vm.isFirst4 = true;
        vm.gatewayMsg = "Select Gateway";

        var size = 100;
        var page = 0;
        var sort = "";
        var token = AuthTokenFactory.getToken();

        /**
         * 初始化4个tableParams
         * 获取网关列表以及每个网关所采集到的设备列表
         */
        httpService.getGatewayList(page, size, sort, token)
            .success(function (resp) {
                vm.gatewaylist1 = resp.data;
                // console.log(resp);
                if (resp.data.length > 0) {
                    vm.gateway1_value = vm.gatewaylist1[0];
                    vm.tableParams1 = new NgTableParams({
                        page: 1,
                        count: 1000
                    }, {
                        filterDelay: 300,
                        counts: [],
                        getData: function ($defer, params) {

                            var filter = params.filter();
                            var size = params.count();
                            var page = params.page() - 1;
                            var sort = "";
                            var token = AuthTokenFactory.getToken();
                            var gatewayMac = filter.gatewayMac;
                            var timeRange = 1800;
                            if (gatewayMac === undefined)
                                gatewayMac = vm.gateway1_value;
                            // console.log(gatewayMac);
                            httpService.getDeviceByGatewayBytimeRange(page, size, sort, "iBeacon", gatewayMac.mac, timeRange, token)
                                .success(function (resp) {
                                    // console.log(resp.data);
                                    vm.gateway1 = resp.data;
                                    if (!vm.isFirst1) {
                                        vm.gateway1_old = removeOldData(vm.devicelist1);
                                        vm.devicelist1 = bijiaoData(vm.gateway1_old, vm.gateway1);
                                    }
                                    if (vm.isFirst1) {
                                        vm.devicelist1 = vm.gateway1;
                                        vm.First1 = false;
                                        vm.isFirst1 = false;
                                    }
                                    // console.log(vm.devicelist1);
                                    params.total(resp.totalItems);
                                    $defer.resolve(vm.devicelist1);
                                }).error(function (resp, status) {
                                    console.log(resp);
                                    httpService.httpStatusCode(status);
                                });
                        }
                    });
                }
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });

        $("#gateway1_new").addClass("animated fadeInLeft wsl-new-title");
        $("#gateway1_delete").addClass("animated fadeInLeft wsl-delete-title");
        // $timeout(function () {
        //     $('#gateway1_new').removeAttr('class').attr('class', '');
        //     $('#gateway1_delete').removeAttr('class').attr('class', '');
        // }, 600);

        httpService.getGatewayList(page, size, sort, token)
            .success(function (resp) {
                vm.gatewaylist2 = resp.data;
                // console.log(resp);
                if (resp.data.length > 0) {
                    vm.gateway2_value = vm.gatewaylist2[0];
                    vm.tableParams2 = new NgTableParams({
                        page: 1,
                        count: 1000
                    }, {
                        filterDelay: 300,
                        counts: [],
                        getData: function ($defer, params) {

                            var filter = params.filter();
                            var size = params.count();
                            var page = params.page() - 1;
                            var sort = "";
                            var token = AuthTokenFactory.getToken();
                            var gatewayMac = filter.gatewayMac;
                            var timeRange = 1800;
                            if (gatewayMac === undefined)
                                gatewayMac = vm.gateway2_value;

                            httpService.getDeviceByGatewayBytimeRange(page, size, sort, "iBeacon", gatewayMac.mac, timeRange, token)
                                .success(function (resp) {
                                    // console.log(resp.data);
                                    vm.gateway2 = resp.data;
                                    if (!vm.isFirst2) {
                                        vm.gateway2_old = removeOldData(vm.devicelist2);
                                        vm.devicelist2 = bijiaoData(vm.gateway2_old, vm.gateway2);
                                    }
                                    if (vm.isFirst2) {
                                        vm.devicelist2 = vm.gateway2;
                                        vm.isFirst2 = false;
                                        vm.First2 = false;
                                    }
                                    params.total(resp.totalItems);
                                    $defer.resolve(vm.devicelist2);
                                }).error(function (resp, status) {
                                    console.log(resp);
                                    httpService.httpStatusCode(status);
                                });
                        }
                    });
                }
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });


        $("#gateway2_new").addClass("animated fadeInLeft wsl-new-title");
        $("#gateway2_delete").addClass("animated fadeInLeft wsl-delete-title");
        // $timeout(function () {
        //     $('#gateway2_new').removeAttr('class').attr('class', '');
        //     $('#gateway2_delete').removeAttr('class').attr('class', '');
        // }, 600);

        httpService.getGatewayList(page, size, sort, token)
            .success(function (resp) {
                vm.gatewaylist3 = resp.data;
                // console.log(resp);
                if (resp.data.length > 0) {
                    vm.gateway3_value = vm.gatewaylist3[0];
                    vm.tableParams3 = new NgTableParams({
                        page: 1,
                        count: 1000
                    }, {
                        filterDelay: 300,
                        counts: [],
                        getData: function ($defer, params) {

                            var filter = params.filter();
                            var size = params.count();
                            var page = params.page() - 1;
                            var sort = "";
                            var token = AuthTokenFactory.getToken();
                            var gatewayMac = filter.gatewayMac;
                            var timeRange = 1800;
                            if (gatewayMac === undefined)
                                gatewayMac = vm.gateway3_value;

                            httpService.getDeviceByGatewayBytimeRange(page, size, sort, "iBeacon", gatewayMac.mac, timeRange, token)
                                .success(function (resp) {
                                    // console.log(resp.data);
                                    vm.gateway3 = resp.data;
                                    if (!vm.isFirst3) {
                                        vm.gateway3_old = removeOldData(vm.devicelist3);
                                        vm.devicelist3 = bijiaoData(vm.gateway3_old, vm.gateway3);
                                    }
                                    if (vm.isFirst3) {
                                        vm.devicelist3 = vm.gateway3;
                                        vm.isFirst3 = false;
                                        vm.First3 = false;
                                    }
                                    params.total(resp.totalItems);
                                    $defer.resolve(vm.devicelist3);
                                }).error(function (resp, status) {
                                    console.log(resp);
                                    httpService.httpStatusCode(status);
                                });
                        }
                    });
                }
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });

        $("#gateway3_new").addClass("animated fadeInLeft wsl-new-title");
        $("#gateway3_delete").addClass("animated fadeInLeft wsl-delete-title");
        // $timeout(function () {
        //     $('#gateway3_new').removeAttr('class').attr('class', '');
        //     $('#gateway3_delete').removeAttr('class').attr('class', '');
        // }, 600);

        httpService.getGatewayList(page, size, sort, token)
            .success(function (resp) {
                vm.gatewaylist4 = resp.data;
                // console.log(resp);
                if (resp.data.length > 0) {
                    vm.gateway4_value = vm.gatewaylist4[0];
                    vm.tableParams4 = new NgTableParams({
                        page: 1,
                        count: 1000
                    }, {
                        filterDelay: 300,
                        counts: [],
                        getData: function ($defer, params) {

                            var filter = params.filter();
                            var size = params.count();
                            var page = params.page() - 1;
                            var sort = "";
                            var token = AuthTokenFactory.getToken();
                            var gatewayMac = filter.gatewayMac;
                            var timeRange = 1800;
                            if (gatewayMac === undefined)
                                gatewayMac = vm.gateway4_value;

                            httpService.getDeviceByGatewayBytimeRange(page, size, sort, "iBeacon", gatewayMac.mac, timeRange, token)
                                .success(function (resp) {
                                    // console.log(resp.data);
                                    vm.gateway4 = resp.data;
                                    if (!vm.isFirst4) {
                                        vm.gateway4_old = removeOldData(vm.devicelist4);
                                        vm.devicelist4 = bijiaoData(vm.gateway4_old, vm.gateway4);
                                        // console.log(vm.devicelist4);
                                    }
                                    if (vm.isFirst4) {
                                        vm.devicelist4 = vm.gateway4;
                                        vm.isFirst4 = false;
                                        vm.First4 = false;
                                    }
                                    params.total(resp.totalItems);
                                    $defer.resolve(vm.devicelist4);
                                }).error(function (resp, status) {
                                    console.log(resp);
                                    httpService.httpStatusCode(status);
                                });
                        }
                    });
                }
            }).error(function (resp, status) {
                console.log(resp);
                httpService.httpStatusCode(status);
            });

        $("#gateway4_new").addClass("animated fadeInLeft wsl-new-title");
        $("#gateway4_delete").addClass("animated fadeInLeft wsl-delete-title");
        // $timeout(function () {
        //     $('#gateway4_new').removeAttr('class').attr('class', '');
        //     $('#gateway4_delete').removeAttr('class').attr('class', '');
        // }, 600);
        function _init1() {
            if (!vm.First1)
                vm.tableParams1.reload();
        };

        function _init2() {
            if (!vm.First2)
                vm.tableParams2.reload();
        };

        function _init3() {
            if (!vm.First3)
                vm.tableParams3.reload();
        };

        function _init4() {
            if (!vm.First4)
                vm.tableParams4.reload();
        };

        vm.selectGateway1 = function (value) {
            vm.gateway1_value = value;
            vm.isFirst1 = true;
            vm.tableParams1.filter({
                gatawayMac: vm.gateway1_value
            })
        };

        vm.selectGateway2 = function (value) {
            vm.gateway2_value = value;
            vm.isFirst2 = true;
            vm.tableParams2.filter({
                gatawayMac: vm.gateway2_value
            })
        };

        vm.selectGateway3 = function (value) {
            vm.gateway3_value = value;
            vm.isFirst3 = true;
            vm.tableParams3.filter({
                gatawayMac: vm.gateway3_value
            })
        };

        vm.selectGateway4 = function (value) {
            vm.gateway4_value = value;
            vm.isFirst4 = true;
            vm.tableParams4.filter({
                gatawayMac: vm.gateway4_value
            })
        };

        $scope.sil1 = $interval(_init1, 5000);
        $scope.sil2 = $interval(_init2, 5000);
        $scope.sil3 = $interval(_init3, 5000);
        $scope.sil4 = $interval(_init4, 5000);
        // 在页面跳转时触发
        $scope.$on('$destroy', function () {
            $interval.cancel($scope.sil1);
            $interval.cancel($scope.sil2);
            $interval.cancel($scope.sil3);
            $interval.cancel($scope.sil4);
        });

    }]);

})();