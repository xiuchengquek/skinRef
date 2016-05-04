/**
 * Created by quek on 31/01/2015.
 */


app.directive('scatterplot', ['$document', function($document ){
    return  {restrict: 'E',
        scope: {
            'data' : '=',
            'selected' : '='

        },
        link: function(scope, element, attr) {





            scope.render = function (data) {


                $('svg').remove()


                var svg = d3.select(element[0])
                    .append("svg")
                    .style('width', '100%');

                var margin = {top: 20, right: 20, bottom: 30, left: 20},
                    width = d3.select(element[0]).node().offsetWidth - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var xValue = function (d) {
                        return d.x;
                    }, // data -> value
                    xScale = d3.scale.linear().range([0, width]), // value -> display
                    xMap = function (d) {
                        return xScale(xValue(d));
                    }, // data -> display
                    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

                // setup y
                var yValue = function (d) {
                        return d.y;
                    }, // data -> value
                    yScale = d3.scale.linear().range([height, 0]), // value -> display
                    yMap = function (d) {
                        return yScale(yValue(d));
                    }, // data -> display
                    yAxis = d3.svg.axis().scale(yScale).orient("left");

                // setup fill color
                var cValue = function (d) {
                        return d.Manufacturer;
                    },
                    color = d3.scale.category10();

                // add the graph canvas to the body of the webpage
                 svg.attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                // add the tooltip area to the webpage
                var tooltip = d3.select("body").append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);


                var sampleData = data.map(function (d) {
                    var datapoint = {};
                    datapoint.id = d.hgnc;
                    datapoint.x = d.mean;
                    datapoint.y = d.cov;
                    datapoint.hgnc = d.hgnc;
                    datapoint.mfc = d.mfc;
                    return datapoint
                });
                xScale.domain([d3.min(sampleData, xValue) - 0.5, d3.max(sampleData, xValue) + 1]);
                yScale.domain([d3.min(sampleData, yValue) - 0.5, d3.max(sampleData, yValue) + 1]);

                // x-axis
                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("x", width)
                    .attr("y", -6)
                    .style("text-anchor", "end")
                    .text("Log10TPM");

                // y-axis
                svg.append("g")
                    .attr("class", "y axis")
                    .call(yAxis)
                    .append("text")
                    .attr("class", "label")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", ".71em")
                    .style("text-anchor", "end")
                    .text("CoV");

                // draw dots
                svg.selectAll(".dot")
                    .data(sampleData)
                    .enter().append("circle")
                    .attr("class", "dot")
                    .attr("r", 3.5)
                    .attr("cx", xMap)
                    .attr("cy", yMap)
                    .attr('id', function (d) {
                        return d.id
                    })
                    .on("mousedown", function (d, i) {
                        // _svg_ is the node on which the brush has been created
                        // x is the x-scale, y is the y-scale
                        var xy = d3.mouse(svg.node()),
                            xInv = xScale.invert(xy[0]),
                            yInv = yScale.invert(xy[1]);

                        // Reset brush's extent
                        brush.extent([
                            [xInv, yInv],
                            [xInv, yInv]
                        ]);

                        // Do other stuff which we wanted to do in this listener
                    });

                // draw legend
                var legend = svg.selectAll(".legend")
                    .data(color.domain())
                    .enter().append("g")
                    .attr("class", "legend")
                    .attr("transform", function (d, i) {
                        return "translate(0," + i * 20 + ")";
                    });

                // draw legend colored rectangles
                legend.append("rect")
                    .attr("x", width - 18)
                    .attr("width", 18)
                    .attr("height", 18)
                    .style("fill", color);

                // draw legend text
                legend.append("text")
                    .attr("x", width - 24)
                    .attr("y", 9)
                    .attr("dy", ".35em")
                    .style("text-anchor", "end")
                    .text(function (d) {
                        return d;
                    })

                var brushCell;
                var brush = d3.svg.brush()
                    .x(xScale)
                    .y(yScale)
                    .on("brushstart", brushstart)
                    .on("brush", brushed)
                    .on("brushend", brushend);


                function brushstart() {
                    scope.selected = [];

                    if (brushCell !== this) {
                        d3.select(brushCell).call(brush.clear());

                        brushCell = this;
                    }
                }

                function brushed() {
                    var e = brush.extent();
                    svg.selectAll(".dot").classed("selected", function (d) {
                        return e[0][0] < d.x && d.x < e[1][0]
                            && e[0][1] < d.y && d.y < e[1][1];
                    });

                    var results = [];

                }

                function brushend(){
                    var selectedpoints = []
                    if (brush.empty()) {
                        svg.selectAll(".selected").classed("selected", false);
                        svg.selectAll(".user_clicked").classed("user_clicked", false);

                        scope.selected = []
                        scope.$apply();

                    }

                    else {
                        svg.selectAll(".selected").each(function (d) {
                            selectedpoints.push({
                                'refseq_id': d.id,
                                'HGNC': d.hgnc,
                                'mean': d.x,
                                'cov': d.y,
                                'mfc' : d.mfc
                            })
                        })


                        scope.selected = selectedpoints;
                        scope.$apply();

                    }


                }

                svg.call(brush)
            };


            scope.$on('initial_loaded', function(event, data){
                scope.render(scope.data)
            });



            /* watcher to watch for data change from the controller
            scope.$watch('data', function (newval, oldval) {
                console.log(newval)
                scope.render(newval);
            }, true);
            */

            window.onresize = function () {
                scope.$apply();
            };

            /* watcher to watch for change in window */
            scope.$watch(function () {
                return angular.element(window)[0].innerWidth;
            }, function () {
                scope.render(scope.data);
            });



        }
    }
}]);


app.directive('customsort',[ function() {
    return {
        scope: {'sorticon': "="},
           link: function (scope, ele, attr) {

            scope.$watch(function(){ return ele.attr('class')}, function(newval, oldval){
                if (typeof newval !== 'undefined') {

                    var value_name = ele.attr('st-sort')

                    console.log(newval)
                    console.log(value_name)


                    if (newval.indexOf('descent') > -1) {
                        scope.sorticon[value_name] = 'glyphicon glyphicon-chevron-down'
                    }
                    else if (newval.indexOf('ascent') > -1) {
                        scope.sorticon[value_name] = 'glyphicon glyphicon-chevron-up'
                    }
                    else{
                        scope.sorticon[value_name] = 'glyphicon glyphicon-sort'

                    }

                }
            })
        }
    }
}])

app.directive('rl', [function(){
    return{
        scope: {
            rl: '=',
            sorticon: '='

        },
        link: function(scope, ele, att){
            scope.$watch('rl', function(newVal){
                    console.log(scope.rl)
                    scope.sorticon  = {
                        'HGNC' : 'glyphicon glyphicon-sort',
                        'mean' :'glyphicon glyphicon-sort',
                        'cov' : 'glyphicon glyphicon-sort',
                        'mfc' : 'glyphicon glyphicon-sort'


                    }



                }

                )

            }
        }
    }

])
