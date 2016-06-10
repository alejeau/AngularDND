(function (ng) {
  'use strict';

  ng
    .module('app')
    .controller('MainController', MainController);

  MainController.$inject = ['$scope', '$log', 'guidFactory', 'localStorageFactory'];
  /** @ngInject */
  function MainController($scope, $log, guidFactory, localStorageFactory) {
    var vm = this;

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
    vm.read = read;
    vm.write = write;
    vm.source = null;
    vm.target = null;

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
      $log.debug('source: ');
      $log.debug(source);
      $log.debug('target: ');
      $log.debug(target);
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
      $scope.$apply();
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

    function read(){
      vm.readed = localStorageFactory.getObject('UUID_FIELD');
    }

    function write(){
      localStorageFactory.store('UUID_FIELD', guidFactory.getGuid());
      vm.written = localStorageFactory.getObject('UUID_FIELD');
    }
  }
})(angular);
