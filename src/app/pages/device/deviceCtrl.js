(function () {
    'use strict';

    angular.module('BlurAdmin.pages.device')
        .controller('deviceCtrl', DeviceCtrl)
        .controller('createDeviceCtrl', createDeviceCtrl)
        .controller('editDeviceCtrl', editDeviceCtrl)
        .controller('deleteDeviceCtrl', deleteDeviceCtrl);

    function DeviceCtrl($scope, $filter, editableOptions, NgTableParams, editableThemes, $uibModal, httpService, AuthTokenFactory) {

        var vm = this;

        this.animationsEnabled = true;

        vm.tableParams = new NgTableParams({
            page: 1, // show first page
            count: 10 // count per page
        }, {
            filterDelay: 300,
            counts: [],
            getData: function ($defer, params) {
                // ajax request to api

                var filter = params.filter();
                // var term = filter.$;
                // var sorting = params.sorting();
                var size = params.count();
                var page = params.page() - 1;
                var sort = "";
                // var order = "";
                var token = AuthTokenFactory.getToken();

                httpService.getDeviceList(page, size, sort, token)
                    .success(function (resp) {
                        // console.log(resp);
                        params.total(resp.totalItems);
                        $defer.resolve(resp.data);
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            }
        });

        $scope.openCreateModel = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/device/createDevice.html',
                controller: 'createDeviceCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return $scope.item;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.result = result;
                // console.log(result);
                vm.tableParams.reload();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };


        $scope.openEditModel = function (item, size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/device/editDevice.html',
                controller: 'editDeviceCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.result = result;
                // console.log(result);
                vm.tableParams.reload();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

        $scope.openDeleteModel = function (item, size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/device/deleteDevice.html',
                controller: 'deleteDeviceCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return item;
                    }
                }
            });

            modalInstance.result.then(function (result) {
                $scope.result = result;
                // console.log(result);
                vm.tableParams.reload();
            }, function () {
                console.log('Modal dismissed at: ' + new Date());
            });
        };

    }

    /** @ngInject */
    function createDeviceCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService) {
        $scope.item = {};
        $scope.type_list = ["iBeacon", "Sensor", "Unknown"];
        if ($scope.select == "Sensor") {
            $scope.item.type = "S1";
        } else if ($scope.select == "iBeacon") {
            $scope.item.type = "iBeacon";
        } else {
            $scope.item.type = "Unknown";
        }


        $scope.ok = function () {
            if ($scope.item) {
                var token = AuthTokenFactory.getToken();
                $scope.item.mac = $scope.item.mac.toUpperCase();
                if ($scope.select == "Sensor") {
                    $scope.item.type = "S1";
                } else if ($scope.select == "iBeacon") {
                    $scope.item.type = "iBeacon";
                } else {
                    $scope.item.type = "Unknown";
                }
                httpService.addDevice($scope.item, token)
                    .success(function (resp) {
                        // console.log(resp);
                        $uibModalInstance.close(resp);
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    function editDeviceCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
        var vm = this;
        $scope.item = item;
        $scope.type_list = ["iBeacon", "Sensor", "Unknown"];
        if ($scope.item.type == "S1") {
            $scope.item.type = "Sensor";
        }
        $scope.ok = function () {
            if ($scope.item) {
                var token = AuthTokenFactory.getToken();
                if ($scope.item.type == "Sensor")
                    $scope.item.type = "S1";
                httpService.updateDevice($scope.item, token)
                    .success(function (resp) {
                        // console.log(resp);
                        $uibModalInstance.close(resp);
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

    /** @ngInject */
    function deleteDeviceCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
        var vm = this;
        $scope.item = item;

        $scope.ok = function () {
            if ($scope.item) {
                var token = AuthTokenFactory.getToken();

                httpService.deleteDevice($scope.item.uuid, token)
                    .success(function (resp) {
                        // console.log(resp);
                        $uibModalInstance.close(resp);
                    }).error(function (resp, status) {
                        console.log(resp);
                        httpService.httpStatusCode(status);
                    });
            }
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

    }

})();