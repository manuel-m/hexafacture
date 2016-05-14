'use strict';

angular.module('hexafacture')
  .controller('NavbarCtrl', function ($location) {

    var vm = this;

    var itemsMap = {
      'emetteur': 'émetteur',
      'client': 'client',
      'composition': 'composition',
      'facture': 'facture',
      'acompte': 'acompte',
      'mentionLegale': 'mention légale',
      'remiseCommerciale': 'remise commerciale'
    };

    vm.items = _.pairs(itemsMap);

    vm.currentLocation = function () {
      return itemsMap[$location.path().split('/')[2]];
    };

    vm.getItems = function(){
      return _.filter(vm.items, function(o_){
        return (o_[0] !==  vm.currentLocation());
      });
    };


  });
