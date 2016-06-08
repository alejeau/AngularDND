/* globals angular */
/* jshint esnext: true */

(function() {
  'use strict';
  angular
    .module('angularsJs')
    .directive('cpcDragNDrop', ['$window', '$timeout', cpcDragNDrop]);

  /**
   * @name cpcDragNDrop
   * @param $log
   * @param $window
   * @param $timeout
   // * @returns {{restrict: string, link: link}}
   */
  function cpcDragNDrop($log, $window, $timeout) {
    return {
      link: link,
      scope: {
        cpcDragNDrop: '='
      }
    };

    function link($scope, $elem, attrs){

    }

    /**
     * @name resolutionToScale
     * @param windowWidth
     * @param windowHeight
     * @returns {*}
     */
    function resolutionToScale(windowWidth, windowHeight) {
      var matchScale = SCREENS[Screen.SCALE];
      var matchResolution = SCREENS[Screen.RESOLUTION];

      SCREENS.forEach(function(screen){
        var xy = screen[Screen.RESOLUTION];
        if (windowWidth < xy[0] && windowHeight < xy[1] * MAGIC_RATIO ||
          windowHeight < xy[1] && windowWidth < xy[0] * MAGIC_RATIO) {
          return
        }
        matchScale = screen[Screen.SCALE];
        matchResolution = screen[Screen.RESOLUTION];
      });
      return matchScale;
    }
  }

})();
