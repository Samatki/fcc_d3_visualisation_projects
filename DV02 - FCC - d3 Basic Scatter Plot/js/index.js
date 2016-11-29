var svgHeight = 750;
var svgWidth = 1200;

var svgPadding = {
  top: 60,
  right: 100,
  bottom: 100,
  left: 100
}

var plotAreaY = svgPadding.top;
var plotAreaX = svgPadding.left;

var plotAreaWidth = svgWidth - svgPadding.left - svgPadding.right;
var plotAreaHeight = svgHeight - svgPadding.bottom - svgPadding.top;

$(document).ready(function(){
  
  $.ajax({
    dataType:'JSON',
    type:'GET',
    url:'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json',
    success: function(data){

     var timeValues = data.map((d) => d.Seconds);
     var minTime = d3.min(timeValues);
     var maxTime = d3.max(timeValues);
                 
     var yScale = d3.scaleLinear()
        .range([0,plotAreaHeight])
        .domain([0,data.length]);
      
     var xScale = d3.scaleLinear()
        .range([0,plotAreaWidth])
        .domain([maxTime-minTime,0]);

     var svg = d3.select('svg');
         svg.append('g').attr('id','dataPoints');
         svg.attr('height',svgHeight).attr('width',svgWidth);
         svg.append('g').attr('id','tooltip')
      
     var toolTip = d3.select('#tooltip')
      
      toolTip.append('rect').attr('id','tooltipBox').attr('rx','10').attr('ry','10');
      toolTip.append('text').attr('id','toolTipText');
      
      var toolTipText = d3.select('#toolTipText')
      toolTipText.append('tspan').attr('id','tooltipName').attr('dy','25px').attr('text-anchor','middle');
      toolTipText.append('tspan').attr('id','tooltipTime').attr('dy','25px').attr('text-anchor','middle');
      toolTipText.append('tspan').attr('id','tooltipAccusation').attr('dy','25px').attr('text-anchor','middle');         
      
      svg.append('g')
         .call(d3.axisBottom(xScale))
         .attr('class', 'bottomAxis')
         .attr('transform','translate('+plotAreaX+','+(plotAreaY+plotAreaHeight+10)+')')
      
      svg.append('g')
         .call(d3.axisLeft(yScale))
         .attr('class', 'leftAxis')
         .attr('transform','translate('+(plotAreaX-10)+','+plotAreaY+')')      
     
      var dataPoints = d3.select('#dataPoints')
      
      dataPoints.attr('transform','translate('+plotAreaX+','+plotAreaY+')')
      
      dataPoints.selectAll('.dataPoint')
                .data(data)
                .enter()
                .append('a')
                .attr('xlink:href',(d) => d.URL)
                .append('circle')
                .classed('dataPoint',true)
                .classed('druggy', (d) => (d.Doping!="")?true:false)
                .attr('cx',(d)=>xScale(d.Seconds - minTime))
                .attr('cy',(d,i) => yScale(i))
                .attr('r','8')
                .on('mouseenter',function(d){
              
                  d3.select('#tooltipName').text(d.Name + ' (' + d.Nationality + ') - '+d.Year);
                  d3.select('#tooltipTime').text('Time: ' + d.Time + ' (-'+ (d.Seconds - minTime) +'s)');
                  d3.select('#tooltipAccusation').text(d.Doping);
        
                  var boxWidth = 10+8*Math.max((d3.select('#tooltipName').text().length),(d3.select('#tooltipTime').text().length),(d3.select('#tooltipAccusation').text().length));
       
                  (d.Doping!="")?d3.select('#tooltipBox').attr('height', '95px'):d3.select('#tooltipBox').attr('height', '65px');

                  d3.select('#tooltipBox').attr('width', boxWidth);
                 
                  toolTip.attr('transform','translate('+(svgWidth/2 - boxWidth/2)+',500)');
                  toolTip.transition().style('opacity','0.9').duration(300);
        
                  d3.select('#tooltipName').attr('x',boxWidth/2);
                  d3.select('#tooltipTime').attr('x',boxWidth/2);
                  d3.select('#tooltipAccusation').attr('x',boxWidth/2);
                  })
      
                .on('mouseleave',function(d){
                    toolTip.transition().style('opacity','0').duration(300);
      });
      
      svg.append('text')
         .classed('bottomTitle',true)
         .text('Time behind leader (s)')
         .attr('text-anchor','middle')
         .attr('x', svgPadding.left + plotAreaWidth/2)
         .attr('y',svgHeight-svgPadding.bottom + 60);
      svg.append('text')
         .classed('leftTitle',true)
         .text('Ranking')
         .attr('text-anchor','middle')
         .attr('transform','translate('+30+','+(svgPadding.top + plotAreaHeight/2)+')rotate(-90)');

      svg.append('g').classed('key',true)
      
      var key = d3.select('.key');
      
      key.attr('transform','translate(900,400)')
      
       key.append('rect')
         .attr('id','keyBox')
         .attr('x','-13')
         .attr('y','-13')
         .attr('rx','10')
         .attr('ry','10')
         .attr('height','75')
         .attr('width','175')
      
      key.append('circle')
         .attr('fill','purple')
         .attr('cx','10')
         .attr('cy','10')
         .attr('r','8')
      
      key.append('text')
         .text('Caught Doping')
         .attr('x','25')
         .attr('y','15') 

      key.append('circle')
         .attr('fill','green')
         .attr('cx','10')
         .attr('cy','40')
         .attr('r','8')
      
      key.append('text')
         .text('No Doping') 
         .attr('x','25')
         .attr('y','46')
      

    }
  })
})