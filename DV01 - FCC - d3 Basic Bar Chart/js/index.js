var Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

var dataSet;
var height = 850;
var width = 1500;
var yScale;
var xScale;
var borders = {
  top: 50,
  right: 100,
  bottom: 300,
  left: 200
}

$.ajax({
  type: 'GET',
  dataType: 'JSON',
  url: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',

  success: function(data2) {
    var ax = (1000 * Math.ceil(d3.max(data2.data, function(d) {
        return d[1];
      }) / 1000) % 2) ?
      (1000 * Math.ceil(d3.max(data2.data, function(d) {
        return d[1];
      }))) :
      (1000 * Math.ceil(d3.max(data2.data, function(d) {
        return d[1];
      }) / 1000) + 1000);

    xScale = d3.scaleTime()
      .range([borders.left, width - borders.right])
      .domain([new Date(data2.data[0][0]), new Date(data2.data[data2.data.length - 1][0])]);

    yScale = d3.scaleLinear()
      .range([borders.top, height - borders.bottom])
      .domain([ax, 0])

    d3.select('svg').append("g")
      .call(d3.axisLeft(yScale).ticks(20).tickSizeInner(-(width - borders.left - borders.right)))
      .attr('class', 'leftAxis')
      .attr("transform", "translate(" + (borders.left) + ",0)")

    d3.select('svg').append('g')
      .call(d3.axisBottom(xScale).tickSizeInner(-(height - borders.top - borders.bottom)).tickSizeOuter(-(height - borders.top - borders.bottom)).tickPadding(20))
      .attr('class', 'bottomAxis')
      .attr('transform', 'translate(0,' + (height - borders.bottom) + ')')

    d3.selectAll('.bottomAxis text').attr('transform', 'translate(-25,6) rotate(-45)')

    d3.select('svg').attr('width', width).attr('height', height).selectAll('rect')
      .data(data2.data)
      .enter()
      .append('rect')
      .attr('class', 'dataPoint')
      .attr('width', function() {
        return 2 + (width - borders.left - borders.right) / data2.data.length
      })
      .attr('x', function(d, i) {
        return (i * ((width - borders.left - borders.right) / data2.data.length) + borders.left)
      })
      .attr('y', function(d) {
        return yScale(d[1]);
      })
      .attr('height', function(d) {
        return height - borders.bottom - yScale(d[1]);
      })

    d3.select('svg')
      .append('text')
      .attr('Class', 'leftAxisTitle')
      .text('GDP (Quarterly, $)')
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('transform', 'translate(100,' + ((height - borders.bottom)/ 2)+ ')rotate(-90)')
    d3.select('svg')
      .append('text')
      .attr('Class', 'bottomAxisTitle')
      .text('Year')
      .attr('text-anchor', 'middle')
      .attr('font-size', '20px')
      .attr('transform', 'translate(' + width / 2 + ',' + (height - borders.bottom + 75) + ')')

    d3.select('svg').append('g').classed('toolTip', true)
    var toolTip = d3.select('.toolTip')
    toolTip.style('opacity', '0')
    toolTip.append('rect')
      .attr('y', '-45')
      .attr('height', '60')
      .attr('width', '150')
      .attr('rx', '10')
      .attr('ry', '10')
      .attr('fill', 'WhiteSmoke')

    toolTip.append('text').classed('ttDateValue', true);
    toolTip.append('text').classed('ttGDPValue', true);

    d3.selectAll('.dataPoint')
      .on('mouseenter', function(d) {
        toolTip.style('opacity', '1')
          .attr('transform', 'translate(' + (d3.mouse(this)[0] + 15) + ',' + (d3.mouse(this)[1] - 30) + ')')

        var GDP = Math.round(d[1]).toString()

        var dateYear = d[0].substr(0, 4);
        var dateMonth = Months[(parseInt(d[0].substr(5, 2)) - 1)];
        console.log(dateMonth);

        if (d[1] >= 1000) {

          var GDPvalue = GDP.slice(0, GDP.length - 3) + ',' + GDP.slice(GDP.length - 4, GDP.length - 1);
        } else {
          var GDPvalue = GDP
        }

        d3.select('.ttDateValue')
          .text(dateMonth + ' ' + dateYear)
          .attr('y', '-20')
          .attr('x', '10')
        d3.select('.ttGDPValue')
          .text('GDP:  $' + GDPvalue + 'bn')
          .attr('x', '10')

      })
      .on('mousemove', function(d) {
        toolTip.style('opacity', '1')
          .attr('transform', 'translate(' + (d3.mouse(this)[0] + 15) + ',' + (d3.mouse(this)[1] - 30) + ')')
      })
      .on('mouseleave', function(d) {
        toolTip.style('opacity', '0')
      })
      .on('click', function(d,i) {
        d3.select('.rqContainer').style('opacity', '1');
        d3.select('.rqContainer').style('display', 'block');
        d3.select(this).classed('solidLine', true)

        var GDP = Math.round(d[1]).toString()

        var dateYear = d[0].substr(0, 4);
        var dateMonth = Months[(parseInt(d[0].substr(5, 2)) - 1)];
        console.log(dateMonth);

        if (d[1] >= 1000) {

          var GDPvalue = GDP.slice(0, GDP.length - 3) + ',' + GDP.slice(GDP.length - 4, GDP.length - 1);
        } else {
          var GDPvalue = GDP
        }

        d3.select('svg').append('g').attr('id','ttFixed-'+i).classed('ttIndicator',true)
          .attr('transform', 'translate(' + (d3.mouse(this)[0] - 75) + ',' + (yScale(d[1])- 30) + ')')

        d3.select('#ttFixed-'+i).append('rect').classed('fixed-Rect', true)
          .attr('y', '-45')
          .attr('height', '60')
          .attr('width', '150')
          .attr('rx', '10')
          .attr('ry', '10')
          .attr('fill', 'WhiteSmoke');
        d3.select('#ttFixed-'+i).append('text').classed('fixed-Date', true)
          .text(dateMonth + ' ' + dateYear)
          .attr('y', '-20')
          .attr('x', '10');
        d3.select('#ttFixed-'+i).append('text').classed('fixed-GDP', true)
          .text('GDP:  $' + GDPvalue + 'bn')
          .attr('x', '10');

      })

    // REMOVE FIXED POINTS BOX //

    var qq = d3.select('svg').append('g')
      .attr('class', 'rqContainer')
      .on('click', function(d) {
        d3.select('.rqContainer').style('opacity', '0');
        d3.select('.rqContainer').style('display', 'none');
        d3.selectAll('.solidLine').classed('solidLine', false);
        d3.selectAll('.ttIndicator').remove();
      })

    qq.append('rect')
      .classed('remove-fixed', true)
      .attr('rx', '10')
      .attr('ry', '10')

    qq.append('text')
      .attr('text-anchor', 'middle')
      .attr('x', '100')
      .attr('y', '30')
      .text('Remove Fixed Points')

  }
})