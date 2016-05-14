'use strict';

angular.module('hexafacture')
  .service('TheHexafacture', function (localStorageService,
                                       TheExport,
                                       $window) {

    var self = this;

    var xxpad = function pad__(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    };

    self.xxFmt = function (v_) {
      return Number(v_).toFixed(2)
    };

    var xxdate = function (sep_) {
      var dt = new Date();
      var day = dt.getDate();
      var monthIndex = dt.getMonth();
      var year = dt.getFullYear();
      var s = '';
      s += xxpad(day, 2);
      s += sep_;
      s += xxpad(monthIndex + 1, 2);
      s += sep_;
      s += year;
      return s;
    };

    var initProto = function initProto___() {
      return {
        emetteur: {
          nom: '<nom>',
          siret: '<siret>',
          codeApe: '6311Z',
          adresse: '<adresse>',
          tva: '<n°TVA>',
          tel: '<tél>',
          fax: '<fax>',
          email: 'entrez.votre@email.com'
        }
        ,
        client: {
          nom: '<nom>',
          adresse: '<adresse>'
        }
        ,
        facture: {
          ref: '<référence>',
          date: xxdate('/'),
          devise: 'Euro',
          tauxTva: 20,
          modeReglement: 'Comptant'
        },
        acompte: {
          valeur: 30,
          pourcentage: true
        },
        remiseCommerciale: {
          valeur: 0,
          pourcentage: true
        },
        mentionLegale: "Toute somme, y compris l'acompte, non payée à sa date d'éxigibilité produira de plein droit des intérêts de retard équivalent à trois fois le taux d'intérêt légal en vigueur ainsi que le paiement de l'indemnité forfaitaire pour frais de recouvrement d'une somme de 40€, prévue à l'article L.441-6 du Code de commerce"
        ,
        elements: []
      };
    };


    self.createItem = function () {
      return {
        ref: '???',
        q: 1,
        designation: '???',
        pu: 0
      };
    };

    self.deleteItem = function (index_) {
      self.d.elements.splice(index_, 1);
      self.localStore();
    };

    self.item_pht = function (item_) {
      return (item_.q * item_.pu);
    };

    self.addNewItem = function () {
      self.d.elements.push(self.createItem());
      self.localStore();
    };

    self.total = function (data_) {
      var d = self.d;
      var s = {
        ht: 0,
        remiseCommerciale: 0,
        tva: 0,
        ttc: 0,
        acompte: 0
      };

      for (var i = 0; i < d.elements.length; i++) {
        var elem = d.elements[i];
        s.ht += self.item_pht(elem);
      }

      if (d.remiseCommerciale.pourcentage === false) {
        s.remiseCommerciale = (d.remiseCommerciale.valeur) * -1;
      } else {
        s.remiseCommerciale = (d.remiseCommerciale.valeur * s.ht) / -100;
      }

      s.tva = ((s.ht + s.remiseCommerciale) * d.facture.tauxTva) / 100;
      s.ttc = (s.ht + s.remiseCommerciale) + s.tva;


      if (d.acompte.pourcentage === false) {
        s.acompte = d.acompte.valeur;
      } else {
        s.acompte = (d.acompte.valeur * s.ttc) / 100;
      }
      return s[data_];
    };


    self.localStore = function () {
      console.log('store');
      var s = angular.toJson(self.d);
      return localStorageService.set('hexafacture', s);
    };

    self.localOverwrite = function (d_) {
      self.d = d_;
      self.localStore();
    };

    self.localFetch = function () {
      self.d = initProto();
      var l = localStorageService.get('hexafacture');
      console.log(l);

      if (_.isNull(l)) {
        self.localStore();
        console.log('create');
      } else {
        console.log('apply');
        _.forEach(l, function (o_, k_) {
          self.d[k_] = o_;
        });
      }
    };

    self.doExport = function (elementName_) {
      self.localStore();
      TheExport.do(elementName_, 'hexafacture'.concat('_', xxdate('-'), '.txt'), self.d);
    };

    self.doReset = function () {

      self.d = initProto();
      self.localStore();

      $window.location.reload();
    };


  })
;
