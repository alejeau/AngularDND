/**
 * Created by Aurélien LEJEAU on 03/06/16.
 *
 * @ngdoc factory
 * @name localStorageFactory
 *
 * @description Allows for the use of localStorage.
 **/

(function () {
  'use strict';

  angular
    .module('app')
    .factory('localStorageFactory', ['localStorageService', '$log', localStorageFactory]);

})();
/**
 * @param localStorageService
 * @param $log
 * @returns {{store, storeJSONObject, storeObject: string|null, getJSONObject: JSON, remove, list: [JSON], clearAll}}
 */
function localStorageFactory(localStorageService, $log) {

  /* ******************** */
  /* *** DECLARATIONS *** */
  /* ******************** */
  var factory = {
    store: store,
    storeJSONObject: storeJSONObject,
    getObject: getObject,
    getJSONObject: getJSONObject,
    remove: remove,
    list: list,
    clearAll: clearAll
  };
  return factory;

  /* *********************** */
  /* *** IMPLEMENTATIONS *** */
  /* *********************** */

  /**
   * @ngdoc method
   * @name store
   * @methodOf localStorageFactory
   * @param key {string} the key under which the object will be stored.
   * @param string {string} the object to store.
   * @description Stores a JSON object to the local storage.
   */
  function store(key, string) {
    $log.debug('[localStorageFactory] storeJSONObject');
    localStorageService.set(key, string);
  }

  /**
   * @ngdoc method
   * @name storeJSONObject
   * @methodOf localStorageFactory
   * @param key {string} the key under which the object will be stored.
   * @param json {JSON} the object to store.
   * @description Stores a JSON object to the local storage.
   */
  function storeJSONObject(key, json) {
    $log.debug('[localStorageFactory] storeJSONObject');
    store(key, JSON.stringify(json));
  }

  /**
   * @ngdoc method
   * @name getObject
   * @methodOf localStorageFactory
   * @param key {string} the object's key.
   *
   * @return {string|null} A string if there is an item stored, null else.
   */
  function getObject(key) {
    return localStorageService.get(key);
  }


  /**
   * @ngdoc method
   * @name getObject
   * @methodOf localStorageFactory
   * @param key {string} the object's key.
   *
   * @return {JSON} A JSON object if the object was stored as a stringifyed JSON, null else.
   */
  function getJSONObject(key) {
    var obj = getObject(key);
    var json = null;
    if (obj !== null) {
      try {
        json = JSON.parse(obj);
      } catch (err) {
        $log.error('[localStorageFactory] getJSONObject: Error parsing the stored object!');
        $log.error('[localStorageFactory] getJSONObject: ' + err.message);
      }
    }
    return json;
  }

  /**
   * @ngdoc method
   * @name remove
   * @methodOf localStorageFactory
   * @param key {string} the object's key.
   * @description Removes the stored object with the key 'key'.
   */
  function remove(key) {
    return localStorageService.remove(key);
  }

  /**
   * @ngdoc method
   * @name list
   * @methodOf localStorageFactory
   * @description Lists the the content of the localStorage in an array of JSON with fields key and object.
   *
   *  @return {[JSON]}
   */
  function list() {
    var content = [];
    for (var i = 0, len = localStorage.length; i < len; i++) {
      var key = localStorage.key(i);
      var value = localStorage[key];
      content.push({key: key, object: value});
    }
    return content;
  }

  /**
   * @ngdoc method
   * @name clearAll
   * @methodOf localStorageFactory
   * @description Clears the whole local storage.
   */
  function clearAll() {
    localStorageService.clearAll();
  }
}
