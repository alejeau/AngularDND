/* globals angular */
/* jshint esnext: true */

(function () {
  'use strict';
  angular
    .module('angularsJs')
    .directive('cpcDragNDrop', ['$window', '$timeout', '$log', 'localStorageFactory', 'guidFactory', cpcDragNDrop]);

  const CONST = {
    DRAG_EXCHANGE_FILE: 'dragExchangeFile',
    DROP_EXCHANGE_FILE: 'dropExchangeFile',
    STORAGE_FILE: 'storageFile',
    LINEAR_COLUMNS: 'linearColumns'
  };

  var ownControllerUUID = {uuid: null};
  var cols = null;


  /**
   * @name cpcDragNDrop
   * @param localStorageFactory
   * @param guidFactory
   * @param $log
   * @param $window
   * @param $timeout
   */
  function cpcDragNDrop($window, $timeout, $log, localStorageFactory, guidFactory) {//, &whatToDoAfterDragNDrop) {
    var directive = {
      link: link,
      scope: {manager: '&'}
    };
    return directive;

    function link($scope, $elem, attrs) {
      addDNDEventListenersTo($elem);
      if (cols === null) {
        cols = [];
      }
      cols.push($elem);
      $scope.$on('destroy', clearLocalStorage);
    }

    function addDNDEventListenersTo(element) {
      $log.debug('addDNDEventListenersTo');
      element.bind('dragstart', handleDragStart);
      element.bind('dragenter', handleDragEnter);
      element.bind('dragover', handleDragOver);
      element.bind('dragleave', handleDragLeave);
      element.bind('drop', handleDrop);
      element.bind('dragend', handleDragEnd);
    }

    function displayStorageFile() {
      console.log('storageFile: ');
      var storageFile = localStorageFactory.getJSONObject(getOwn(CONST.STORAGE_FILE));
      console.log(storageFile);
    }

// Créer des objets représentants les objets dispo avec ou non un UUID
// Stocker le tout dans le localStorage en String JSON
// Les manipuler par la suite
    function handleDragStart(e) {
      $log.debug('**************************handleDragStart');
      displayStorageFile();
      var fileStorage = localStorageFactory.getJSONObject(getOwn(CONST.STORAGE_FILE));
      if (fileStorage === null) {
        $log.debug('start init');
        init();
        $log.debug('init done');
      }
      // Target (this) element is the source node.
      e.target.style.opacity = '0.4';
      e.dataTransfer.effectAllowed = 'move';

      var json = findObjectViaInnerHTML(e.target.innerHTML);
      $log.debug('object found:');
      $log.debug(json);
      localStorageFactory.storeJSONObject(CONST.DRAG_EXCHANGE_FILE, json);
    }

    /**
     * dragenter is used to toggle the 'over' class instead of the dragover.
     * If we were to use dragover, our CSS class would be toggled many times
     * as the event dragover continued to fire on a column hover.
     * Ultimately, that would cause the browser's renderer to do a large amount of unnecessary work.
     * Keeping redraws to a minimum is always a good idea.
     */
    function handleDragEnter(e) {
      $log.debug('**************************handleDragEnter');
      // this / e.target is the current hover target.
      e.target.classList.add('over');
    }

    function handleDragOver(e) {
      $log.debug('**************************handleDragOver');
      if (e.preventDefault) {
        // Prevents the default behavior of a browser; for instance preventing link opening to allow the DnD.
        e.preventDefault();
      }
      e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
      return false; // Some browsers may not need this, but some do so we add it
    }

    function handleDragLeave(e) {
      $log.debug('**************************handleDragLeave');
      e.target.classList.remove('over');  // this / e.target is previous target element.
    }

    function handleDrop(e) { // this/e.target is current target element.
      $log.debug('**************************handleDrop');
      if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
      }

      // We get the object that's being dragged/dropped
      var source = localStorageFactory.getJSONObject(CONST.DRAG_EXCHANGE_FILE);
      // localStorageFactory.remove(CONST.DRAG_EXCHANGE_FILE);
      $log.debug('source');
      $log.debug(source);

      if (source === null) {
        $log.debug('source is null!');
      }

      // Do nothing if dropping the same column we're dragging.
      if (e.target.innerHTML !== source.body) {
        var target = findObjectViaInnerHTML(e.target.innerHTML);
        var colNumTarget = getColNumOfObject(target);

        // We keep the target's body
        var tmp = target.body;
        // We swap
        e.target.innerHTML = source.body;
        target.body = source.body;

        // We set a new UUID
        target.uuid = guidFactory.getGuid();

        // We update the target
        updateFileStorageAndLinearColumns(colNumTarget, target);

        // We update the source
        source.body = tmp;
        $log.debug('new source');
        $log.debug(source);
        // We save the modifications
        localStorageFactory.storeJSONObject(CONST.DROP_EXCHANGE_FILE, source);
      }
      return false;
    }

    function handleDragEnd(e) { // this/e.target is the source node.
      $log.debug('**************************handleDragEnd');
      displayStorageFile();
      if (e.dataTransfer.dropEffect !== 'none') {
        $log.debug('Waiting for json retrieval...');
        waitAndGetDropped();
      }
    }

// Gets the original objects
    function init() {
      $log.debug('init');
      ownControllerUUID.uuid = guidFactory.getGuid();

      var fileStorage = [];
      var linearColumns = [];

      // populating fileStorage and linearColumns
      var i, j, tmp;
      for (i = 0; i < cols.length; i++) {
        for (j = 0; j < cols[i].length; j++) {
          tmp = {uuid: guidFactory.getGuid(), body: cols[i][j].innerHTML};
          fileStorage.push(tmp);
          var col = i * j + j;
          linearColumns.push({colNum: col, uuid: tmp.uuid});
        }
      }
      // Storing fileStorage in the local storage
      localStorageFactory.storeJSONObject(getOwn(CONST.STORAGE_FILE), fileStorage);
      localStorageFactory.storeJSONObject(getOwn(CONST.LINEAR_COLUMNS), linearColumns);

    }

    /**
     * @param json {JSON}
     * @return {number}
     */
    function getColNumOfObject(json) {
      var linearColumns = localStorageFactory.getJSONObject(getOwn(CONST.LINEAR_COLUMNS));
      for (var i = 0; i < linearColumns.length; i++) {
        if (linearColumns[i].uuid === json.uuid) {
          return i;
        }
      }
      return -1;
    }

    function updateFileStorageAndLinearColumns(colNum, objToUpdate) {
      // getting the files fomr the local storage
      var fileStorage = localStorageFactory.getJSONObject(getOwn(CONST.STORAGE_FILE));
      var linearColumns = localStorageFactory.getJSONObject(getOwn(CONST.LINEAR_COLUMNS));

      // updating...
      fileStorage[colNum] = objToUpdate;
      linearColumns[colNum] = objToUpdate;

      // Storing in the local storage
      localStorageFactory.storeJSONObject(getOwn(CONST.STORAGE_FILE), fileStorage);
      localStorageFactory.storeJSONObject(getOwn(CONST.LINEAR_COLUMNS), linearColumns);
    }

    function updateFileStorage(json) {
      $log.debug('updateFileStorage');
      var fileStorage = localStorageFactory.localStorageFactory.getJSONObjectObject(getOwn(CONST.STORAGE_FILE));

      // populating fileStorage
      var i;
      for (i = 0; i < cols.length; i++) {
        if (fileStorage[i].uuid === json.uuid) {
          fileStorage[i].uuid = guidFactory.getGuid();
          fileStorage[i].body = json.body;
          break;
        }
      }

      // Storing fileStorage in the local storage
      localStorageFactory.storeJSONObject(getOwn(CONST.STORAGE_FILE), fileStorage);
    }

    /**
     * @return {JSON} the JSON object if found, null else
     */
    function findObjectViaInnerHTML(innerHTML) {
      $log.debug('findObjectViaInnerHTML');
      $log.debug('innerHTML');
      $log.debug(innerHTML);
      $log.debug('against: ');
      var fileStorage = localStorageFactory.getJSONObject(getOwn(CONST.STORAGE_FILE));
      var i;
      for (i = 0; i < fileStorage.length; i++) {
        $log.debug(fileStorage[i]);
        if (fileStorage[i].body.indexOf(innerHTML) !== -1) {
          return fileStorage[i];
        }
      }
      return null;
    }

    function getOwn(field) {
      $log.debug('getOwn');
      return field + ownControllerUUID.uuid;
    }

    function waitAndGetDropped() {
      $log.debug('waitAndGetDropped');
      var launcher = setInterval(function () {
        $log.debug('wait');
        var json = localStorageFactory.getJSONObject(CONST.DROP_EXCHANGE_FILE);
        if (json !== null && json !== undefined) {
          clearInterval(launcher);
          getThatDroppedBeat(json);
        }
      }, 100);
    }

    function getThatDroppedBeat(json) {
      $log.debug('getThatDroppedBeat');
      $log.debug('json');
      $log.debug(json);

      // We get the objects column's number
      var colNum = getColNumOfObject(json);

      // Remplacer directement dans linearColumns
      for (var i = 0; i < cols.length; i++) {
        for (var j = 0; j < cols[i].length; j++) {
          if (i * j + j === colNum) {
            cols[i][j].innerHTML = json.body;
            cols[i][j].style.opacity = '1';
          }
        }
      }

      json.uuid = guidFactory.getGuid();
      $log.debug('new json');
      $log.debug(json);
      updateFileStorageAndLinearColumns(colNum, json);
      // localStorageFactory.remove(CONST.DROP_EXCHANGE_FILE);
      // var first = localStorageFactory.getJSONObject(CONST.DRAG_EXCHANGE_FILE);
      // $scope.manager.apply(first, json);
    }

    function clearLocalStorage() {
      localStorageFactory.remove(CONST.DRAG_EXCHANGE_FILE);
      localStorageFactory.remove(CONST.DROP_EXCHANGE_FILE);
      localStorageFactory.remove(getOwn(CONST.LINEAR_COLUMNS));
      localStorageFactory.remove(getOwn(CONST.STORAGE_FILE));
    }
  }
})();
