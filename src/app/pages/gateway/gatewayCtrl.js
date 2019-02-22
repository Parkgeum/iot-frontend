(function () {
	'use strict';

	angular.module('BlurAdmin.pages.gateway')
		.controller('gatewayCtrl', GatewayCtrl)
		.controller('createGatewayCtrl', createGatewayCtrl)
		.controller('editGatewayCtrl', editGatewayCtrl)
		.controller('deleteGatewayCtrl', deleteGatewayCtrl)
		.controller('rebootGatewayCtrl', rebootGatewayCtrl)
		.controller('OpenMsgCtrl',OpenMsgCtrl);

	/** @ngInject */
	function GatewayCtrl($scope, $filter, editableOptions, NgTableParams, editableThemes, $uibModal, httpService, AuthTokenFactory) {

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

				httpService.getGatewayList(page, size, sort, token)
					.success(function (resp) {
						console.log(resp);
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
				templateUrl: 'app/pages/gateway/createGateway.html',
				controller: 'createGatewayCtrl',
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
				if(result.status === 404){
					$scope.item = "The gateway has been bound by other user";
					openMsgModel('sm');
				}
				vm.tableParams.reload();
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};

		$scope.openEditModel = function (item, size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/pages/gateway/editGateway.html',
				controller: 'editGatewayCtrl',
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
				templateUrl: 'app/pages/gateway/deleteGateway.html',
				controller: 'deleteGatewayCtrl',
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

		$scope.openRebootModel = function (item, size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/pages/gateway/rebootGateway.html',
				controller: 'rebootGatewayCtrl',
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

		$scope.toggleAnimation = function () {
			$scope.animationsEnabled = !$scope.animationsEnabled;
		};

		var openMsgModel = function (size) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'app/pages/gateway/msg.html',
                controller: 'OpenMsgCtrl',
                size: size,
                resolve: {
                    item: function () {
                        return $scope.item;
                    }
                }
            });
		};
		
	}

	/** @ngInject */
	function createGatewayCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService) {
		$scope.item = {};

		$scope.ok = function () {
			if ($scope.item) {
				var token = AuthTokenFactory.getToken();
				$scope.item.status = "Offline";
				$scope.item.mac = $scope.item.mac.toUpperCase();

				httpService.addGateway($scope.item, token)
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
	function editGatewayCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
		var vm = this;
		$scope.item = item;

		$scope.ok = function () {
			if ($scope.item) {
				var token = AuthTokenFactory.getToken();

				httpService.updateGateway($scope.item, token)
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
	function deleteGatewayCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
		var vm = this;
		$scope.item = item;

		$scope.ok = function () {
			if ($scope.item) {
				var token = AuthTokenFactory.getToken();

				httpService.deleteGateway($scope.item.uuid, token)
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
	function rebootGatewayCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
		var vm = this;
		$scope.item = item;

		$scope.ok = function () {
			if ($scope.item) {
				var token = AuthTokenFactory.getToken();

				httpService.addOperation($scope.item.uuid, token)
					.success(function (resp) {
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

	function OpenMsgCtrl($scope, $uibModalInstance, item){
		$scope.data = item;
	}
})();