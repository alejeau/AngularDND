(function () {
  'use strict';

  angular
    .module('angularsJs')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController(guidFactory) {
    var vm = this;

    // Public variables
    vm.boxes = [];

    // Public functions
    vm.add = add;
    vm.subtract = subtract;

    // Private variables
    const CHARS = [
      {object: 'A', id: guidFactory.getGuid()}, {object: 'B', id: guidFactory.getGuid()}, {object: 'C', id: guidFactory.getGuid()}, {object: 'D', id: guidFactory.getGuid()}, {object: 'E', id: guidFactory.getGuid()},
      {object: 'F', id: guidFactory.getGuid()}, {object: 'G', id: guidFactory.getGuid()}, {object: 'H', id: guidFactory.getGuid()}, {object: 'I', id: guidFactory.getGuid()}, {object: 'J', id: guidFactory.getGuid()},
      {object: 'K', id: guidFactory.getGuid()}, {object: 'L', id: guidFactory.getGuid()}, {object: 'M', id: guidFactory.getGuid()}, {object: 'N', id: guidFactory.getGuid()}, {object: 'O', id: guidFactory.getGuid()},
      {object: 'P', id: guidFactory.getGuid()}, {object: 'Q', id: guidFactory.getGuid()}, {object: 'R', id: guidFactory.getGuid()}, {object: 'S', id: guidFactory.getGuid()}, {object: 'T', id: guidFactory.getGuid()},
      {object: 'U', id: guidFactory.getGuid()}, {object: 'V', id: guidFactory.getGuid()}, {object: 'W', id: guidFactory.getGuid()}, {object: 'X', id: guidFactory.getGuid()}, {object: 'Y', id: guidFactory.getGuid()},
      {object: 'Z', id: guidFactory.getGuid()}
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
  }
})();
