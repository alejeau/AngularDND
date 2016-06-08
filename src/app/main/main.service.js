(function() {
  'use strict';

  angular
    .module('angularsJs')
    .constant('baseUrl', 'http://192.168.10.101:3000');

  angular
    .module('angularsJs')
    .service('Services', Services);

  /** @ngInject */
  function Services($http, baseUrl) {

    this.getMessages = function(){
      return $http({
        method: 'GET',
        url: baseUrl + '/getMessages'
      });
    };

    this.sendMessage = function(msg){
      return $http({
        method: 'POST',
        url: baseUrl + '/sendMessage',
        data: {msg: msg, mail: 'alejeau@excilys.com', userName:'alejeau'}
      });
    };

    this.sendAnswer = function(msg, id){
      return $http({
        method: 'POST',
        url: baseUrl + '/sendMessage' + '/' + id,
        data: {msg: msg, mail: 'alejeau@excilys.com', userName:'alejeau'}
      });
    };

  }
})();
