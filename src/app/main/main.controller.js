'use strict';

angular.module('hexafacture')
  .controller('MainCtrl', function (TheHexafacture, ThePrinter) {

    var vm = this;
    vm.g = TheHexafacture;
    vm.d = TheHexafacture.d;
    vm.p = ThePrinter;

    vm.change = function(){
      vm.g.localStore();
    };

  });
