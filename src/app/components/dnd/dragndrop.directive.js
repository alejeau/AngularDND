/* globals angular */
/* jshint esnext: true */

(function (ng) {
  'use strict';

  ng
    .module('app')
    .directive('cpcDragNDrop', cpcDragNDrop);

  var CONST = {
    DRAG_EXCHANGE_FILE: 'dragExchangeFile',
    DROP_EXCHANGE_FILE: 'dropExchangeFile',
    UUID_FIELD: 'uuid',
    BODY_FIELD: 'div'
  };

  var callback;


  cpcDragNDrop.$inject = ['$log', 'localStorageFactory'];
    /**
   * @name cpcDragNDrop
   * @param $log
   * @param localStorageFactory
   */
  function cpcDragNDrop($log, localStorageFactory) {
    var directive = {
      link: link,
      scope: {manager: '&'}
    };
    return directive;

    function link($scope, $elem) {
      addDNDEventListenersTo($elem);
      callback = $scope.manager;
      $scope.$on('destroy', clearLocalStorage);
    }

    function addDNDEventListenersTo(element) {
      element.bind('dragstart', handleDragStart);
      element.bind('dragenter', handleDragEnter);
      element.bind('dragover', handleDragOver);
      element.bind('dragleave', handleDragLeave);
      element.bind('drop', handleDrop);
      element.bind('dragend', handleDragEnd);
    }

    function handleDragStart(e) {
      // Target (this) element is the source node.
      var elem = angular.element(e.target);
      elem.addClass('dragged');
      e.dataTransfer.effectAllowed = 'move';
      var drag = getJSONFromElement(e);
      localStorageFactory.storeJSONObject(CONST.DRAG_EXCHANGE_FILE, drag);
    }

    /**
     * dragenter is used to toggle the 'over' class instead of the dragover.
     * If we were to use dragover, our CSS class would be toggled many times
     * as the event dragover continued to fire on a column hover.
     * Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work.
     * Keeping redraws to a minimum is always a good idea.
     */
    function handleDragEnter(e) {
      // this / e.target is the current hover target.
      angular.element(e.target).addClass('over');
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        // Prevents the default behavior of a browser; for instance preventing link opening to allow the DnD.
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
      return false; // Some browsers may not need this, but some do so we add it
    }

    function handleDragLeave(e) {
      angular.element(e.target).removeClass('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) { // this/e.target is current target element.
      if (e.stopPropagation) {
        // Stops some browsers from redirecting when the object's dropped.
        e.stopPropagation();
      }

      angular.element(e.target).removeClass('over');  // this / e.target is previous target element.
      // We get the object that's being dragged
      var source = localStorageFactory.getJSONObject(CONST.DRAG_EXCHANGE_FILE);
      if (source === null) {
        $log.warn('source is null!');
      } else {
        var target = getJSONFromElement(e);

        // Do nothing if dropping the same column we're dragging.
        if (target.uuid !== source.uuid) {
          localStorageFactory.storeJSONObject(CONST.DROP_EXCHANGE_FILE, target);
        }
      }
      return false;
    }

    function handleDragEnd(e) { // this/e.target is the source node.
      //Removing the previously added CSS classes
      angular.element(e.target).removeClass('move');
      angular.element(e.target).removeClass('over');
      angular.element(e.target).removeClass('dragged');

      if (e.dataTransfer.dropEffect !== 'none') {
        var source = localStorageFactory.getJSONObject(CONST.DRAG_EXCHANGE_FILE);
        localStorageFactory.remove(CONST.DRAG_EXCHANGE_FILE); //erasing from the local storage

        var target = localStorageFactory.getJSONObject(CONST.DROP_EXCHANGE_FILE);
        if ((target !== null) && (target.uuid !== source.uuid)) {
          callback()(source, target);
          localStorageFactory.remove(CONST.DROP_EXCHANGE_FILE);
        }
      }
    }

    function getJSONFromElement(e) {
      var elem = angular.element(e.target);
      var uuid = elem.find(CONST.UUID_FIELD).text();
      var body = elem.find(CONST.BODY_FIELD).text();
      return {body: body, uuid: uuid};
    }

    function clearLocalStorage() {
      localStorageFactory.remove(CONST.DRAG_EXCHANGE_FILE);
      localStorageFactory.remove(CONST.DROP_EXCHANGE_FILE);
    }
  }
})(angular);
