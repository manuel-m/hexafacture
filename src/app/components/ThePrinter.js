'use strict';

angular.module('hexafacture')
  .service('ThePrinter', function (TheHexafacture) {

    var self = this;
    var d = TheHexafacture.d;
    var g = TheHexafacture;

    var innerConf = {
      maxLines: 24,
      maxCharsPerLine: {
        "ref": 10,
        "designation": 55
      }
    };

    var superPadding = function () {
      return new Array(innerConf.maxLines - d.elements.length).join('\n');
    };

    var labelsTotaux = function () {
      var s = 'Total HT';
      if (d.remiseCommerciale.valeur > 0) {
        s += '\n';
        s += 'Remise';
      }
      s += '\n';
      s += 'TVA';
      s += '\n';

      s += 'Total TTC';

      var acompte = g.total('acompte');
      if (acompte > 0) {
        s += '\n';
        s += '\n';
        s += 'Acompte';
      }
      return s;
    };

    var totaux = function () {

      var s = Number(g.total('ht')).toFixed(2);
      if (d.remiseCommerciale.valeur > 0) {
        s += '\n';
        s += Number(g.total('remiseCommerciale')).toFixed(2);
      }
      s += '\n';
      s += Number(g.total('tva')).toFixed(2);
      s += '\n';
      s += Number(g.total('ttc')).toFixed(2);

      var acompte = g.total('acompte');
      if (acompte > 0) {
        s += '\n\n';
        s += Number(acompte).toFixed(2);
      }

      return s;
    };

    var computesNbLines = function (field_, col_) {
      if (typeof field_ === 'string') {
        return Math.floor(field_.length / innerConf.maxCharsPerLine[col_]) + 1;
      }
      return 1;
    };

    var computesMaxNbLines = function () {
      var elements = d.elements;
      _.forEach(elements, function (item_) {
        item_.maxNbLines = 1;
        _.forEach(item_, function (field_, col_) {
          var nbLines = computesNbLines(field_, col_);
          if (nbLines > item_.maxNbLines) item_.maxNbLines = nbLines;
        });
      });
    };

    var prePadding = function (idx_, col_) {
      var s = '';
      if (idx_ > 0) {
        s += '\n';
        var previousElement = d.elements[idx_ - 1];
        var previousMaxLines = previousElement.maxNbLines;

        var previousNbLine = 1;

        if (!_.isUndefined(col_)) {
          previousNbLine = computesNbLines(previousElement[col_], col_);
        }

        var extraPadding = previousMaxLines - previousNbLine;
        for (var j = 0; j < extraPadding; j++) {
          s += '\n';
        }
      }
      return s;
    };

    var elementsColText = function (col_) {
      var s = '';
      for (var i = 0; i < d.elements.length; i++) {
        var element = d.elements[i];
        var v = element[col_];

        s += prePadding(i, col_);

        if (typeof v === "number") {
          s += Number(v).toFixed(2);
        } else {
          s += v;
        }
        if (i !== (d.elements.length - 1)) {
          s += '\n';
        }
      }
      s += superPadding();
      return s;
    };


    var elementsCallBackText = function (cb_) {
      var s = '';
      for (var i = 0; i < d.elements.length; i++) {

        s += prePadding(i);

        var v = cb_(d.elements[i]);

        if (typeof v === "number") {
          s += Number(v).toFixed(2);
        } else {
          s += v;
        }
        if (i !== (d.elements.length - 1)) {
          s += '\n';
        }
      }
      return s;
    };


    var coordonneesText = function () {
      var r = 'Tél:';
      r += d.emetteur.tel;

      if (d.emetteur.fax !== 'N/A') {
        r += ' - Fax: ';
        r += d.emetteur.fax;
      }
      r += ' - Email: ';
      r += d.emetteur.email;
      return r;
    };

    var headerText = function () {
      var s = '\n';
      s += d.emetteur.nom;
      s += ' - ';
      s += d.emetteur.adresse;
      s += ' - ';
      s += coordonneesText();
      return s;
    };

    var footerText = function () {
      return 'N° Siret '.concat(
        d.emetteur.siret,
        ' - Code APE ',
        d.emetteur.codeApe,
        ' - N° TVA intracom. ',
        d.emetteur.tva);
    };

    var factureContent = function () {
      return 'Référence                   '.concat(
        d.facture.ref, '\n',
        'Date                             ',
        d.facture.date, '\n',
        'Règlement                  ',
        d.facture.modeReglement, '\n',
        'Document libellé en  ',
        d.facture.devise, '\n',
        'TVA                              ',
        d.facture.tauxTva, '%', '\n'
      );
    };

    var clientContent = function () {
      return '\n'.concat(d.client.nom, '\n',
        d.client.adresse);
    };


    var mentionLegaleContent = function () {
      return d.mentionLegale;
    };


    self.generatePdf = function () {

      computesMaxNbLines();
      var dd = {

        header: function () {
          return {
            text: headerText(),
            alignment: 'center',
            style: 'headerMini'
          };
        },
        footer: function () {
          return {
            text: footerText(),
            alignment: 'center'
          }
        },
        content: [
          '\n\n',
          {
            text: d.emetteur.nom, style: 'header', alignment: 'center'
          },
          '\n\n',
          {
            columns: [
              {
                width: 260,
                table: {
                  widths: [220],
                  body: [
                    [{
                      text: 'FACTURE',
                      style: 'subHeader',
                      alignment: 'center'
                    }],
                    [factureContent()]

                  ]
                }
              },
              {
                text: clientContent(),
                style: 'subHeader'
              }
            ]
          },
          '\n\n',
          {
            //elements
            table: {
              widths: [60, 280, 45, 45, 45],
              body: [
                [{
                  text: 'Référence',
                  style: 'tableHeader'
                }, {
                  text: 'Désignation',
                  style: 'tableHeader'
                }, {
                  text: 'Quantité',
                  style: 'tableHeader'
                }, {
                  text: 'Prix unitaire',
                  style: 'tableHeader'
                }, {
                  text: 'PHT',
                  style: 'tableHeader'
                }], [{
                  text: elementsColText('ref'),
                  style: 'tableBody'
                }, {
                  text: elementsColText('designation'),
                  style: 'tableBody'

                },
                  // quantite
                  {
                    text: elementsColText('q'),
                    alignment: 'right',
                    style: 'tableBody'
                  },
                  // prix unitaire
                  {
                    text: elementsColText('pu'),
                    alignment: 'right',
                    style: 'tableBody'
                  },
                  // prix hors taxe
                  {
                    text: elementsCallBackText(g.item_pht),
                    alignment: 'right',
                    style: 'tableBody'
                  }]
              ]
            }
          },
          '\n',
          {
            table: {
              widths: [350, 152],
              body: [
                [' ',
                  {
                    columns: [
                      {
                        width: 80,
                        text: labelsTotaux(),
                        alignment: 'right'
                      },
                      {
                        text: totaux(),
                        alignment: 'right',
                        style: 'totaux'
                      }
                    ]
                  }
                ]
              ]
            }
          },
          '\n',
          {
            text: mentionLegaleContent(),
            style: 'mentionLegaleMini'
          }
        ],
        styles: {
          headerMini: {
            fontSize: 9
          },
          mentionLegaleMini: {
            fontSize: 7
          },
          header: {
            fontSize: 18,
            bold: true
          },
          totaux: {
            fontSize: 12,
            bold: true
          },
          subHeader: {
            fontSize: 12,
            bold: false
          },
          tableBody: {
            fontSize: 10,
            bold: false
          },
          tableHeader: {
            bold: true,
            fontSize: 11,
            color: 'black'
          }
        }
      };

      pdfMake.createPdf(dd).download('efficiel.pdf');
      //pdfMake.createPdf(dd).open();
    };


  })
;
