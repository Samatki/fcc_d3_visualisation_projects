/* global d3 */

function d3FDGMaker(data){

var nodes = data.nodes;
var links = data.links;
console.log(links)

 var svgWidth = 1500;
 var svgHeight = 500;
 
 var borders = {
     top: 100,
     bottom: 100,
     left: 100,
     right: 100
 }
 
 var plotAreaHeight = svgHeight - borders.top - borders.bottom;
 var plotAreaWidth = svgHeight - borders.left - borders.right;
 
 var plotAreaX = borders.left;
 var plotAreaY = borders.top;

 var svg = d3.select('#mainContainer');
 
        

    svg.attr('height', svgHeight)
       .attr('width', svgWidth)
       .append('g')
       .attr('id','graphArea');    

 var plotArea = d3.select('#graphArea')
 
     plotArea.attr('transform','translate('+plotAreaX+','+plotAreaY+')');

var link = plotArea.append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "black")
     
     
 var nodes = plotArea.selectAll('.flagElement')
    .data(data.nodes)
    .enter()
    .append('svg')
    .classed('flagElement',true)
    .attr('width',32)
    .attr('height',32)
    .attr('y','10')
    .attr('x',function(d,i){return (i*32)})
    .append('image')
    .attr('width',480)
    .attr('height',480)
    .attr('xlink:href','themes/flags.png')
    .attr('class',function(d){return d.country+':'+d.code})
    .attr('y',function(d){return (-1*(flagImagePosition['flag_'+d.code]['flag_y_position']))})
    .attr('x',function(d){return (-1*(flagImagePosition['flag_'+d.code]['flag_x_position']))})
 

}

