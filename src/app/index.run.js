(function() {
  'use strict';

  angular
    .module('angularsJs')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
