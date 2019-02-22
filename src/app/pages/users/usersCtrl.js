 (function () {
 	'use strict';

 	angular.module('BlurAdmin.pages.users')
 		.controller('usersCtrl', UsersCtrl)
 		.controller('createUserCtrl', createUserCtrl)
 		.controller('editUserCtrl', editUserCtrl)
 		.controller('deleteUserCtrl', deleteUserCtrl)
		 .controller('userGatewaysCtrl', userGatewaysCtrl)
		 .controller('deleteGatewayCtrl', deleteGatewayCtrl);

 	/** @ngInject */
 	function UsersCtrl($scope, $filter, editableOptions, NgTableParams, editableThemes, $uibModal, httpService, AuthTokenFactory) {

 		var vm = this;
 		this.UserInfo = AuthTokenFactory.getUserInfo();

 		if (this.UserInfo.role == "ADMIN")
 			this.isAdmin = true;

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

 				httpService.getUserList(page, size, sort, token)
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
 				templateUrl: 'app/pages/users/createUser.html',
 				controller: 'createUserCtrl',
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
 				templateUrl: 'app/pages/users/editUser.html',
 				controller: 'editUserCtrl',
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
 				templateUrl: 'app/pages/users/deleteUser.html',
 				controller: 'deleteUserCtrl',
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

 		$scope.userGatewaysCtrl = function (item, size) {
 			var modalInstance = $uibModal.open({
 				animation: $scope.animationsEnabled,
 				templateUrl: 'app/pages/users/gateways.html',
 				controller: 'userGatewaysCtrl',
 				size: size,
 				resolve: {
 					item: function () {
 						return item;
 					}
 				}
 			});

 			// modalInstance.result.then(function (result) {
 			// 	$scope.result = result;
 			// 	 console.log(result);
 			// 	 vm.tableParams.reload();
 			// }, function () {
 			// 	console.log('Modal dismissed at: ' + new Date());
 			// });
 		};

 		$scope.toggleAnimation = function () {
 			$scope.animationsEnabled = !$scope.animationsEnabled;
 		};

 	}

 	/** @ngInject */
 	function createUserCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService) {
 		$scope.item = {};

 		$scope.ok = function () {
 			if ($scope.item) {
 				var token = AuthTokenFactory.getToken();

 				httpService.addUser($scope.item, token)
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
 	function editUserCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
 		var vm = this;
		$scope.item = item;
		$scope.Mphone = item.nationcode + item.mobile_phone;
		//  console.log(item); 

 		$scope.ok = function () {
 			if ($scope.item) {
				var dialCode = $("#Mphone").intlTelInput("getSelectedCountryData").dialCode;
				var phoneNumber = $("#Mphone").intlTelInput("getNumber");
				var len = phoneNumber.indexOf(dialCode)+dialCode.length;
				$scope.item.nationcode = dialCode;
				$scope.item.mobile_phone = phoneNumber.slice(len);
				var token = AuthTokenFactory.getToken();
				console.log(item);
 				httpService.updateUser($scope.item, token)
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
 	function deleteUserCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item) {
 		var vm = this;
 		$scope.item = item;

 		$scope.ok = function () {
 			if ($scope.item) {
 				var token = AuthTokenFactory.getToken();

 				httpService.deleteUser($scope.item.uuid, token)
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
 	function userGatewaysCtrl($scope, $uibModalInstance, AuthTokenFactory, httpService, item, $uibModal) {
 		var vm = this;
 		$scope.item = item;
 		var page = 0;
 		var size = 100;
 		var sort = "";
 		var token = AuthTokenFactory.getToken();

		vm.tableParams = function(){
			httpService.getGatewayListByUserid(page, size, sort, $scope.item.uuid, token)
			.success(function (resp) {
				// console.log(resp);
				$scope.gateway_list = resp.data;
			}).error(function (resp, status) {
				console.log(resp);
				httpService.httpStatusCode(status);
			});
		}
		
		$scope.openDeleteModel = function (item, size) {
			var modalInstance = $uibModal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'app/pages/users/deleteGateway.html',
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
				vm.tableParams();
			}, function () {
				console.log('Modal dismissed at: ' + new Date());
			});
		};

		vm.tableParams();
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

 })();