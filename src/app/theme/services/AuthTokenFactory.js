(function () {
    'use strict';

    angular.module('BlurAdmin.theme').factory('AuthTokenFactory', function AuthTokenFactory($window) {
    'use strict';
    var store = $window.sessionStorage; // $window.localStorage;
    var key = 'currentUser';

    return {
      getUserInfo: getUserInfo,
      storeUserInfo: storeUserInfo,
      removeUserInfo: removeUserInfo,
      isLoggedIn : isLoggedIn,
      getUserName : getUserName,
      getUserId : getUserId,
      getToken : getToken,
      getRole : getRole,
      getEmail : getEmail
    };

    function getUserInfo() {

      if (!isLoggedIn()){
        return null;
      }
      return _unserialize(store.getItem(key));
    }

    function storeUserInfo(userInfo) {
      if (userInfo) {
        store.setItem(key, _serialize(userInfo));
      } else {
        store.removeItem(key);
      }
    }

    function removeUserInfo () {

        store.removeItem(key);
    }

    function isLoggedIn (){
       return store.getItem(key)?true:false;
    }

    function getUserName(){
      var userObj = getUserInfo(key);
      if (userObj !== null){
        return userObj.name;
      }
      return "not login";
    }

    function getUserId(){
      var userObj = getUserInfo(key);
      if (userObj !== null){
        return userObj.userId;
      }
      return null;
    }

    function getToken(){
      var userObj = getUserInfo(key);
      if (userObj !== null){
        return userObj.token;
      }
      return null;
    }

    function getRole(){
      var userObj = getUserInfo(key);
      if (userObj !== null){
        return userObj.role;
      }
      return null;
    }

    function getEmail(){
      var userObj = getUserInfo(key);
      if (userObj !== null){
        return userObj.email;
      }
      return null;
    }

    /**
     * Try to encode value as json, or just return the value upon failure
     *
     * @private
     *
     * @param  {Mixed}  value  The value to serialize
     *
     * @return {Mixed}
     */
    function _serialize(value) {
                        try {
                            return JSON.stringify(value);
                        } catch (e) {
                            return value;
                        }
                    };

      /**
       * Try to parse value as json, if it fails then it probably isn't json
       * so just return it
       *
       * @private
       *
       * @param  {String}  value  The value to unserialize
       *
       * @return {Mixed}
       */
       function _unserialize(value) {
                        try {
                            return JSON.parse(value);
                        } catch (e) {
                            return value;
                        }
                    };
  });

})();