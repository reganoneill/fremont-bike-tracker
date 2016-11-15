'use strict';

var margin = {top: 20, right: 30, bottom: 30, left: 40},
  width = 420 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

var x = d3.scaleBand()
  .range([0, width])
  .padding(0.25);

var y = d3.scaleLinear()
  .range([height, 0]);

var svg = d3.select('.dataGraph').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');

d3.json('../../example.json', function(error, data) {
  console.log(data);
  data.forEach(function(d) {
    d.value = +d.value;
  });

  x.domain(data.map(function(d) {
    return d.name;
  }));
  y.domain([0, d3.max(data, function(d) {
    return d.value;
  })]);

  svg.append('g')
    .attr('transform', 'translate(0,' + height + ')')
    .call(d3.axisBottom(x));

  svg.append('g')
    .call(d3.axisLeft(y));

  svg.selectAll('.bar')
    .data(data)
    .enter().append('rect')
    .attr('class', 'bar')
    .attr('x', function(d) {
      return x(d.name);
    })
    .attr('width', x.bandwidth())
    .attr('y', function(d) {
      return y(d.value);
    })
    .attr('height', function(d) {
      return height - y(d.value);
    });
});
