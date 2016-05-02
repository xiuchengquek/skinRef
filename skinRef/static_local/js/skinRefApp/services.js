/**
 * Created by xiuchengquek on 29/04/2016.
 */
/**
 * Created by quek on 31/01/2015.
 */

String.format = function() {
    // The string containing the format items (e.g. "{0}")
    // will and always has to be the first argument.
    var theString = arguments[0];

    // start with the second argument (i = 1)
    for (var i = 1; i < arguments.length; i++) {
        // "gm" = RegEx options for Global search (more than one instance)
        // and for Multiline search
        var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
        theString = theString.replace(regEx, arguments[i]);
    }

    return theString;
};


d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
        this.parentNode.appendChild(this);
    });
};


app.config(function($interpolateProvider, $httpProvider, $resourceProvider){
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    $resourceProvider.defaults.stripTrailingSlashes = false;


});

app.factory('dataFactory' ,['$http', function dataFactory($http) {


    var urlBase = '/rest/';
    var dataFactory = {};

    dataFactory.getInit = function () {
        var url = urlBase + 'metrics/?format=json';
        return $http.get(url);
    };

    dataFactory.getGenesinfo = function(gene){





        var url = urlBase + 'description/?format=json&gene_name=' + gene
        console.log(url)
        return $http.get(url);

    }


    return dataFactory;

}]);


app.factory('metricsToTSV' , function metricsToTSV(){


    var metricsToTSV = {output : []};
    var self = metricsToTSV;


    self.generateOutput = function(input){
        self.output = ['\ngene_id\tlog10TPM\tCoV\tMFC'];
        angular.forEach(input, function(ele, idx){
            var row = [ele.HGNC, ele.mean, ele.cov, ele.mfc];
            row = row.join('\t');
            this.push(row);
        },  self.output);

        var data = self.output.join('\n');
        data = "data:attachment/csv" + encodeURIComponent(data)
        return data
    }
    return metricsToTSV
    });
