/**
 * @author chris
 * created on 2017-04-20
 */
(function () {
    'use strict';

    angular.module('BlurAdmin.theme.components')
        .directive('contentTop', contentTop);

    /** @ngInject */
    function contentTop($location, $state) {
        return {
            restrict: 'E',
            templateUrl: 'app/theme/components/contentTop/contentTop.html',
            link: function ($scope) {
                $scope.$watch(function () {
                    $scope.activePageTitle = $state.current.title;
                });
            }
        };
    }

})();