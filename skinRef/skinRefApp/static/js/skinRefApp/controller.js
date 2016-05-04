/**
 * Created by quek on 31/01/2015.
 */
"use strict" ;
var app = angular.module('housekeeper', ['ngResource', 'smart-table']);

app.controller('main_controller', ['dataFactory', 'metricsToTSV' , '$scope', function (dataFactory, metricsToTSV, $scope ) {
  $scope.metricsinfo = [];
  $scope.unfound = [];
  $scope.found = [];


  $scope.axis = {
    xaxis : 'mean',
    yaxis : 'cov'
  };





  $scope.showGenes = function () {
    var selectedpoints = [];
    var found = [];
    var userinput = $scope.MainCtrl.selected;
    var selected_genes = userinput.split('\n');


    d3.selectAll('.dot').classed("selected", function (d) {
        if (selected_genes.indexOf(d.hgnc) > -1) {
          found.push(d.hgnc);
          return true
        }
    });

    var selected = d3.selectAll('.selected');
    selected.moveToFront();
    selected.each(function (d) {
      selectedpoints.push({
        'HGNC': d.hgnc,
        'mean': d.x,
        'cov': d.y,
        'mfc' : d.mfc
      })
    });
    $scope.unfound = $(selected_genes).not(found).get();
    $scope.metricsinfo = selectedpoints;
    $scope.metricstable = selectedpoints;

  };
  $scope.MainCtrl = {'selected': "RPS13\nRPL7A\nEEF1B2\n" +
  "RPS27A\nRPL38\nRPLP0\nEEF1A1\nRPL11\nRPL9\nGAPDH\nRPL23\n" +
  "HPRT1\nACTB"}
  $scope.sort = {

    sortingOrder: 'id',
    reverse: false
  };


  $scope.scattervalue = [];

  $scope.colourDot = function (selected_id) {
    d3.selectAll(".dot").classed('user_clicked', false)
    var selected_dot = d3.select('#' + selected_id);
    selected_dot.classed('user_clicked', true);
    selected_dot.moveToFront();
    var hgnc = selected_dot[0].hgnc;
    console.log(hgnc, selected_dot[0]);
    dataFactory.getGenesinfo(selected_id).then(function (results) {
      console.log(results)
      var gene_info = results.data[0];
      gene_info.hgnc = hgnc
      $scope.geneinfo = gene_info

    })
  };

  $scope.filtericon = {
    'refseq_id': 'glyphicon glyphicon-sort',
    'mean': 'glyphicon glyphicon-sort',
    'HGNC': 'glyphicon glyphicon-sort',
    'cov': 'glyphicon glyphicon-sort'

  }

  $scope.downloadData = function(){

    var urlLink = metricsToTSV.generateOutput($scope.metricsinfo)
    var a         = document.getElementById('downloadEle');
    a.href        = 'data:attachment/csv,' + "\n" + urlLink;
    a.target      = '_blank';
    a.download    = 'urlLink.csv';

    document.body.appendChild(a);
    a.click();





  }


  dataFactory.getInit().then(function (results) {
    $scope.$broadcast('initial_loaded',  results.data)
    $scope.scattervalue = results.data

  });
}]);
