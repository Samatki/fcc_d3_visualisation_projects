/* global $, d3 */

$(document).ready(function() {

    $.ajax({
        url: 'scripts/json/worldmap.json',
        dataType: 'JSON',
        type: 'GET',
        success: function(data) {

            var chartWidth = 1400;
            var chartHeight = 700;

            var svg = d3.select("body")
                .append("svg")
                .classed('chart', true)
                .attr("width", chartWidth)
                .attr("height", chartHeight);

            var g = svg.append("g");

            var mercProjection = d3.geoMercator()
                .scale(200)
                .rotate([1, 0])
                .translate([chartWidth / 2, chartHeight / 2])

            var geoPath = d3.geoPath()
                .projection(mercProjection);

            g.selectAll("path")
                .data(data.features)
                .enter()
                .append("path")
                .attr("fill", "#ccc")
                .attr("d", geoPath);

            $.ajax({
                url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json',
                dataType: 'JSON',
                Type: 'GET',
                success: function(data2) {

                    var Smax = d3.max(data2.features, function(d) {
                        var s = new Date(d.properties.year);
                        return (s.getFullYear())
                    });
                    var Smin = d3.min(data2.features, function(d) {
                        var s = new Date(d.properties.year);
                        return (s.getFullYear())
                    });

                    var Massmax = d3.max(data2.features, function(d) {
                        return parseInt(d.properties.mass)
                    });
                    var Massmin = d3.min(data2.features, function(d) {
                        return parseInt(d.properties.mass)
                    });
                    var data3 = data2.features;

                    data3.sort(function(a, b) {
                        return b.properties.mass - a.properties.mass
                    })

                    console.log(data2.features)
                    console.log(data3)

                    svg.selectAll('.meteorStrike')
                        .data(data3)
                        .enter()
                        .append('circle')
                        .classed('meteorStrike', true)
                        .attr('cx', function(d) {
                            var q = (mercProjection([d.properties.reclong, d.properties.reclat])[0]);

                            return q
                        })
                        .attr('cy', function(d) {
                            var q = (mercProjection([d.properties.reclong, d.properties.reclat])[1]);

                            return q
                        })
                        .attr('r', function(d) {
                            return (2 + 100 * ((parseInt(d.properties.mass) - Massmin) / (Massmax - Massmin)));
                        })
                        .attr('fill', function(d) {
                            var s = new Date(d.properties.year);
                            return 'hsla(' + (1 + 358 * (s.getFullYear() - Smin + 1) / (Smax - Smin)) + ', 70%, 60%, 0.75)'
                        })
                        .on('mouseenter', function(d) {
                            toolTip.style('display', 'block');
                            var mousePos = d3.mouse(document.getElementsByClassName('chart')[0]);
                            toolTip.attr('transform', 'translate(' + (mousePos[0] + 20) + ',' + (mousePos[1]) + ')')
                            d3.select('.meteorName').text(d.properties.name);
                            d3.select('.meteorDate').text(function() {
                                var s = new Date(d.properties.year);
                                return s.getFullYear()
                            });
                            d3.select('.meteorLocation').text((parseInt(Math.round(100 * parseFloat(d.properties.reclong))) / 100) + ',' + (parseInt(Math.round(100 * parseFloat(d.properties.reclat))) / 100));
                            d3.select('.meteorMass').text(d.properties.mass + ' kg');
                            
                            var maxLength = Math.max(d3.select('.meteorName').text().length,d3.select('.meteorDate').text().length,d3.select('.meteorLocation').text().length,d3.select('.meteorMass').text().length)
                            console.log(maxLength)
                            d3.select('.toolTipBox').attr('width',maxLength*10)
                            


                        })
                        .on('mousemove', function(d) {
                            var mousePos = d3.mouse(document.getElementsByClassName('chart')[0]);
                            toolTip.attr('transform', 'translate(' + (mousePos[0] + 20) + ',' + (mousePos[1]) + ')')
                        })

                    .on('mouseleave', function(d) {
                        toolTip.style('display', 'none')
                    })

                    var toolTip = svg.append('g').classed('toolTip', true).style('display', 'none')

                    toolTip.append('rect')
                        .classed('toolTipBox',true)
                        .attr('height', '85')
                        .attr('width', '100')
                        .attr('fill', 'rgba(188,221,232,0.7)')
                        .attr('rx',10)
                        .attr('ry',10)
                    toolTip.append('text')
                        .classed('toolTipText', true)
                        .attr('x', '10')
                        .attr('y', '10')

                    var toolTipText = d3.select('.toolTipText')

                    toolTipText.append('tspan')
                        .classed('meteorName', true)
                        .attr('dy', '15')
                        .attr('x', '10')

                    toolTipText.append('tspan')
                        .classed('meteorDate', true)
                        .attr('dy', '15')
                        .attr('x', '10')

                    toolTipText.append('tspan')
                        .classed('meteorLocation', true)
                        .attr('dy', '15')
                        .attr('x', '10')

                    toolTipText.append('tspan')
                        .classed('meteorMass', true)
                        .attr('dy', '15')
                        .attr('x', '10')
                    

                    var zoom = d3.zoom()
                        .scaleExtent([1, 10])
                        .translateExtent([
                            [0, 0],
                            [chartWidth, chartHeight]
                        ])
                        .on("zoom", function() {
                            d3.selectAll('.meteorStrike').attr('transform', d3.event.transform)
                            toolTip.attr('transform', d3.event.transform)
                            g.attr("transform", d3.event.transform);
                            g.selectAll("path")
                                .attr("d", geoPath);
                        });

                    svg.call(zoom)

                }

            })

        }
    });
});