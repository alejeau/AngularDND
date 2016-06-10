(function () {
  'use strict';

  angular
    .module('app')
    .controller('MainController', ['$log', 'guidFactory', 'localStorageFactory', MainController]);

  /** @ngInject */
  function MainController($log, guidFactory, localStorageFactory) {
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

    // Private variables
    const CHARS = [
      {object: 'A', uuid: guidFactory.getGuid()}, {object: 'B', uuid: guidFactory.getGuid()}, {object: 'C', uuid: guidFactory.getGuid()}, {object: 'D', uuid: guidFactory.getGuid()}, {object: 'E', uuid: guidFactory.getGuid()},
      {object: 'F', uuid: guidFactory.getGuid()}, {object: 'G', uuid: guidFactory.getGuid()}, {object: 'H', uuid: guidFactory.getGuid()}, {object: 'I', uuid: guidFactory.getGuid()}, {object: 'J', uuid: guidFactory.getGuid()},
      {object: 'K', uuid: guidFactory.getGuid()}, {object: 'L', uuid: guidFactory.getGuid()}, {object: 'M', uuid: guidFactory.getGuid()}, {object: 'N', uuid: guidFactory.getGuid()}, {object: 'O', uuid: guidFactory.getGuid()},
      {object: 'P', uuid: guidFactory.getGuid()}, {object: 'Q', uuid: guidFactory.getGuid()}, {object: 'R', uuid: guidFactory.getGuid()}, {object: 'S', uuid: guidFactory.getGuid()}, {object: 'T', uuid: guidFactory.getGuid()},
      {object: 'U', uuid: guidFactory.getGuid()}, {object: 'V', uuid: guidFactory.getGuid()}, {object: 'W', uuid: guidFactory.getGuid()}, {object: 'X', uuid: guidFactory.getGuid()}, {object: 'Y', uuid: guidFactory.getGuid()},
      {object: 'Z', uuid: guidFactory.getGuid()}
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
      $log.debug('source: ');
      $log.debug(source);
      $log.debug('target: ');
      $log.debug(target);
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
})();
