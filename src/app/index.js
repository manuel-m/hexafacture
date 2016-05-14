'use strict';

angular.module('hexafacture', ['dr',
  'ngAnimate',
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'LocalStorageModule'])
  .config(function ($stateProvider,
                    $urlRouterProvider,
                    localStorageServiceProvider) {

    localStorageServiceProvider
      .setPrefix('efficiel');

    var doPreLoad = function doPreLoad__(TheHexafacture) {
      TheHexafacture.localFetch();
    };



    $stateProvider
      .state('devis', {
        url: '/devis',
        templateUrl: 'app/main/main.html',
        abstract: true,
        controller: 'MainCtrl',
        controllerAs: 'vm',
        resolve: {
          preload: doPreLoad
        }
      })
      .state('devis.emetteur', {
        url: '/emetteur',
        templateUrl: 'app/main/emetteur.html'
      })
      .state('devis.client', {
        url: '/client',
        templateUrl: 'app/main/client.html'
      })
      .state('devis.composition', {
        url: '/composition',
        templateUrl: 'app/main/composition.html'
      })
      .state('devis.facture', {
        url: '/facture',
        templateUrl: 'app/main/facture.html'
      })
      .state('devis.acompte', {
        url: '/acompte',
        templateUrl: 'app/main/acompte.html'
      })
      .state('devis.remiseCommerciale', {
        url: '/remiseCommerciale',
        templateUrl: 'app/main/remiseCommerciale.html'
      })
      .state('devis.mentionLegale', {
        url: '/mentionLegale',
        templateUrl: 'app/main/mentionLegale.html'
      })


    ;

    $urlRouterProvider.otherwise('/devis/emetteur');

  })
;
