/**
 * Created by Aurélien LEJEAU on 05/06/16.
 *
 * @ngdoc factory
 * @name guidFactory
 *
 * @description Allows for the use of GUID (Globally Unique IDs).
 **/

(function (ng) {
  'use strict';
  ng
    .module('app')
    .factory('guidFactory', guidFactory);

  guidFactory.$inject = ['$log'];
  /**
   * @returns {{string}}
   */
  function guidFactory($log) {
    var factory = {
      getGuid: getGuid
    };
    return factory;

    /**
     * Returns a GUID (Globally Unique ID).
     * @return {string}
     */
    function getGuid() {
      $log.debug('getGuid');
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
})(angular);
