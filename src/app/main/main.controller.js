(function () {
  'use strict';

  angular
    .module('angularsJs')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController() {
    var vm = this;

    // Public variables
    vm.boxes = [];

    // Public functions
    vm.add = add;
    vm.subtract = subtract;

    // Private variables
    const CHARS = [
      {object: 'A', id: getGuid()}, {object: 'B', id: getGuid()}, {object: 'C', id: getGuid()}, {object: 'D', id: getGuid()}, {object: 'E', id: getGuid()},
      {object: 'F', id: getGuid()}, {object: 'G', id: getGuid()}, {object: 'H', id: getGuid()}, {object: 'I', id: getGuid()}, {object: 'J', id: getGuid()},
      {object: 'K', id: getGuid()}, {object: 'L', id: getGuid()}, {object: 'M', id: getGuid()}, {object: 'N', id: getGuid()}, {object: 'O', id: getGuid()},
      {object: 'P', id: getGuid()}, {object: 'Q', id: getGuid()}, {object: 'R', id: getGuid()}, {object: 'S', id: getGuid()}, {object: 'T', id: getGuid()},
      {object: 'U', id: getGuid()}, {object: 'V', id: getGuid()}, {object: 'W', id: getGuid()}, {object: 'X', id: getGuid()}, {object: 'Y', id: getGuid()},
      {object: 'Z', id: getGuid()}
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
      if (numberOfElements > len) {
        for (var i = len; i < numberOfElements; i++) {
          vm.boxes.push(CHARS[i]);
        }
      } else {
        for (var i = len-1; i >= numberOfElements; i--) {
          vm.boxes.pop();
        }
      }
    }

    function getGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }
})();
