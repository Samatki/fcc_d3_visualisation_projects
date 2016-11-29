$(document).ready(function() {

  var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var svgHeight = 750;
  var svgWidth = 1500;

  var svgPadding = {
    top: 10,
    right: 200,
    bottom: 100,
    left: 100
  };

  var plotAreaY = svgPadding.top;
  var plotAreaX = svgPadding.left;

  var plotAreaWidth = svgWidth - svgPadding.left - svgPadding.right;
  var plotAreaHeight = svgHeight - svgPadding.bottom - svgPadding.top;

  var dataPointHeight = plotAreaHeight / Months.length;

  $.ajax({

    url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json',
    type: 'GET',
    dataType: 'JSON',
    success: function(data) {

      var baseTemp = data.baseTemperature;
      var resultData = data.monthlyVariance;
      var svg = d3.select('svg');

      var timeValues = resultData.map((d) => d.year);
      var minTime = d3.min(timeValues);
      var maxTime = d3.max(timeValues);

      var varianceValues = resultData.map((d) => d.variance);
      var minVariance = d3.min(varianceValues);
      var maxVariance = d3.max(varianceValues);

      var yScale = d3.scaleLinear()
        .range([0, plotAreaHeight])
        .domain([0, 12]);

      var yScaleMonth = d3.scaleTime()
        .range([0, plotAreaHeight])
        .domain([0, 12]);

      var xScale = d3.scaleTime()
        .range([0, plotAreaWidth])
        .domain([new Date(minTime, 0), new Date(maxTime, 0)]);

      svg.attr('height', svgHeight).attr('width', svgWidth);
      svg.append('g').attr('id', 'dataPoints').attr('transform', 'translate(' + svgPadding.left + ',' + svgPadding.top + ')');

      var dataPoints = d3.select('#dataPoints');

      svg.append('g')
        .call(d3.axisBottom(xScale).ticks(Math.floor((maxTime - minTime) / 10)))
        .attr('class', 'bottomAxis')
        .attr('transform', 'translate(' + plotAreaX + ',' + (plotAreaY + plotAreaHeight + 10) + ')')

      svg.append('g')
        .classed('leftAxis', true)
        .selectAll('text')
        .data(Months)
        .enter()
        .append('text')
        .attr('text-anchor', 'end')
        .text(function(d) {
          return d
        })
        .attr('y', function(d, i) {
          return i * dataPointHeight
        })

      d3.select('.leftAxis').attr('transform', 'translate(' + (svgPadding.left - 10) + ',' + (svgPadding.top + dataPointHeight / 2) + ')');

      dataPoints.selectAll('.dataPoint')
        .data(resultData)
        .enter()
        .append('rect')
        .classed('dataPoint', true)
        .attr('x', (d) => xScale(new Date(d.year, 0)))
        .attr('y', (d) => yScale(d.month - 1))
        .attr('width', plotAreaWidth / (maxTime - minTime))
        .attr('height', dataPointHeight + 1)
        .style('fill', (d) => 'hsl(' + (100 - 100 * ((d.variance - minVariance) / (maxVariance - minVariance))) + ',100%, 55%)')

      d3.select('svg').append('g')
        .classed('tooltip', true)
        .append('rect')
        .classed('tooltipBox', true)
        .attr('x', '50')
        .attr('y', '65')
        .attr('rx', '10')
        .attr('ry', '10')

      d3.select('.tooltip')
        .append('text')
        .classed('dateText', true)
        .attr('text-anchor', 'middle')
        .attr('x', '114')
        .attr('y', '90');

      d3.select('.tooltip')
        .append('text')
        .classed('tempText', true)
        .attr('text-anchor', 'middle')
        .attr('x', '114')
        .attr('y', '115');

      dataPoints.selectAll('.dataPoint')
        .on('mouseenter', function(d) {
          d3.select(this).classed('highlighted', true)
          d3.select('.tooltip').style('display', 'block')
          d3.select('.tooltip').attr('transform', 'translate(' + (d3.mouse(this)[0] + 60) + ',' + (d3.mouse(this)[1] - 50) + ')')
          console.log(d.year);
          d3.select('.dateText').text(Months[(d.month - 1)] + ' ' + d.year);
          d3.select('.tempText').html('Temp: ' + ((Math.round((baseTemp + d.variance) * 10)) / 10) + '&#8451;');
        })
        .on('mouseleave', function(d) {
          d3.select('.tooltip').style('display', 'none')
          d3.select(this).classed('highlighted', false)
        });

      svg.append('g')
        .attr('id', 'scaleBar')
        .attr('transform', 'translate(' + (plotAreaWidth / 2) + ',' + (svgPadding.top + plotAreaHeight + 70) + ')')

      for (var i = 0; i <= 10; i++) {
        d3.select('#scaleBar')
          .append('rect')
          .attr('x', (i * 20))
          .attr('width', '20')
          .attr('height', '20')
          .style('fill', (d) => 'hsl(' + (100 - 100 * (0.1 * i) + ',100%, 55%)'))
      }

      d3.select('#scaleBar')
        .append('text')
        .html(Math.round(minVariance) + '&#8451;')
        .attr('x', -40)
        .attr('y', 15)

      d3.select('#scaleBar')
        .append('text')
        .html(Math.round(maxVariance) + '&#8451;')
        .attr('x', 225)
        .attr('y', 15)

      svg.append('text')
        .text('Year')
        .attr('text-anchor', 'middle')
        .attr('x', (svgPadding.left + plotAreaWidth / 2))
        .attr('y', (svgPadding.top + plotAreaHeight + 55))

      svg.append('text')
        .text('Month')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (svgPadding.left - 60) + ',' + (svgPadding.top + plotAreaHeight / 2) + ') rotate(-90)')
    }
  })
})