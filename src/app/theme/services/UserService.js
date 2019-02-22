(function () {
    'use strict';

    angular.module('BlurAdmin').service('UserService', UserService);


    /** @ngInject */
    function UserService($http, API_URL, AuthTokenFactory, $q) {

        /* REGISTER */
        this.register = function(user){
            return ($http({
                method: 'post',
                data: user,
                url: API_URL + "/account/register",
                headers: {
                    'Content-Type': 'application/json'
                }
            }));
        }
        
        /* LOGIN */
        this.login = function (user) {
            return ($http({
                method: 'post',
                data: user,
                url: API_URL + "/token",
                headers: {
                    'Content-Type': 'application/json'
                }
            }));
        };

        /* LOGOUT */
        this.logout = function () {
            AuthTokenFactory.removeUserInfo();
        };

        // this.getUser = function () {
        //   if (AuthTokenFactory.getToken()) {
        //       return ($http({
        //         method: 'post',
        //         data: user,
        //         url: API_URL + "/token",
        //         headers: {
        //             'Content-Type': 'application/json'
        //         }
        //     }));
        //   } else {
        //     return $q.reject({ data: 'client has no auth token' });
        //   }
            
        // }

    }

})();