(function (ng) {
  'use strict';

  ng
    .module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$window', '$log', 'guidFactory', 'localStorageFactory'];
  // /** @ngInject */
  function MainController($scope, $window, $log, guidFactory, localStorageFactory) {
    var vm = this;
    var CONST = {
      SOURCE_ELEMENT: 'source_element',
      TARGET_ELEMENT: 'target_element'
    };

    addEventListeners();
    // Public variables
    vm.boxes = [];
    vm.readed = '';
    vm.written = '';

    // Public functions
    vm.add = add;
    vm.subtract = subtract;
    vm.dragNDropManager = dragNDropManager;
    vm.listStorageContent = listStorageContent;
    vm.clearStorageContent = clearStorageContent;

    // Private variables
    var CHARS = [
      {body: 'A', uuid: guidFactory.getGuid()}, {body: 'B', uuid: guidFactory.getGuid()}, {body: 'C', uuid: guidFactory.getGuid()}, {body: 'D', uuid: guidFactory.getGuid()}, {body: 'E', uuid: guidFactory.getGuid()},
      {body: 'F', uuid: guidFactory.getGuid()}, {body: 'G', uuid: guidFactory.getGuid()}, {body: 'H', uuid: guidFactory.getGuid()}, {body: 'I', uuid: guidFactory.getGuid()}, {body: 'J', uuid: guidFactory.getGuid()},
      {body: 'K', uuid: guidFactory.getGuid()}, {body: 'L', uuid: guidFactory.getGuid()}, {body: 'M', uuid: guidFactory.getGuid()}, {body: 'N', uuid: guidFactory.getGuid()}, {body: 'O', uuid: guidFactory.getGuid()},
      {body: 'P', uuid: guidFactory.getGuid()}, {body: 'Q', uuid: guidFactory.getGuid()}, {body: 'R', uuid: guidFactory.getGuid()}, {body: 'S', uuid: guidFactory.getGuid()}, {body: 'T', uuid: guidFactory.getGuid()},
      {body: 'U', uuid: guidFactory.getGuid()}, {body: 'V', uuid: guidFactory.getGuid()}, {body: 'W', uuid: guidFactory.getGuid()}, {body: 'X', uuid: guidFactory.getGuid()}, {body: 'Y', uuid: guidFactory.getGuid()},
      {body: 'Z', uuid: guidFactory.getGuid()}
    ];
    var numberOfElements = 5;

    updateBoxes();


    //Private functions
    function add() {
      if (numberOfElements < CHARS.length) {
        numberOfElements++;
      }
      updateBoxes();
    }

    function subtract() {
      if (numberOfElements > 0) {
        numberOfElements--;
      }
      updateBoxes();
    }

    function updateBoxes() {
      var len = vm.boxes.length;
      var i;
      if (numberOfElements > len) {
        for (i = len; i < numberOfElements; i++) {
          vm.boxes.push(CHARS[i]);
        }
      } else {
        for (i = len-1; i >= numberOfElements; i--) {
          vm.boxes.pop();
        }
      }
    }

    function dragNDropManager(source, target) {
      vm.source = source;
      vm.target = target;

      var completeSwap = swapper(source, target);

      if (!completeSwap) {
        localStorageFactory.storeJSONObject(CONST.SOURCE_ELEMENT, source);
        localStorageFactory.storeJSONObject(CONST.TARGET_ELEMENT, target);
      }
      $scope.$apply();
    }

    function addEventListeners() {
      if ($window.addEventListener) {
        // Normal browsers
        $window.addEventListener("storage", handler, false);
      } else {
        // for IE (why make your life more difficult)
        $window.attachEvent("onstorage", handler);
      }
    }

    function handler(e) {
      $log.debug('Successfully communicate with other tab');
      $log.debug('Received data: ');
      var source = localStorageFactory.getJSONObject(CONST.SOURCE_ELEMENT);
      var target = localStorageFactory.getJSONObject(CONST.TARGET_ELEMENT);
      if ((source !== null) && (target !== null)) {
        swapper(source, target);
        localStorageFactory.remove(CONST.SOURCE_ELEMENT);
        localStorageFactory.remove(CONST.TARGET_ELEMENT);
        $scope.$apply();
      }
    }

    function swapper(source, target) {
      var sourceRank = -1, targetRank = -1;
      for (var i = 0; i < vm.boxes.length; i++) {
        if (vm.boxes[i].uuid === source.uuid) {
          $log.debug('Matching source!');
          sourceRank = i;
        } else if (vm.boxes[i].uuid === target.uuid) {
          $log.debug('Matching target!');
          targetRank = i;
        }
      }

      if (sourceRank !== -1) {
        $log.debug('Changing source!');
        vm.boxes[sourceRank] = target;
      }

      if (targetRank !== -1) {
        $log.debug('Changing target!');
        vm.boxes[targetRank] = source;
      }

      return ((sourceRank === -1) && (targetRank === -1));
    }

    function listStorageContent() {
      $log.debug('Listing local storage content');
      var content = localStorageFactory.list();
      for (var i = 0; i < content.length; i++) {
        $log.debug(content[i]);
      }
    }

    function clearStorageContent() {
      $log.debug('Clearing local storage content');
      localStorageFactory.clearAll();
    }
  }
})(angular);
