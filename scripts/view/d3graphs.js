'use strict';
(function(module) {
  var charts = {};
  charts.drawCharts = function() {
    var dataTraffic = traffic.allTraffic;
    var dataHourly = traffic.hourlyDataToDisplay;
    var dataDaily = traffic.dailyDataToDisplay;
    var dataMonthly = traffic.monthlyDataToDisplay;

    console.log(dataTraffic);

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 800 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.25);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var svg;

    charts.updateSvg = function(chart) {
      svg = d3.select(chart).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    };

///////////////////////
    charts.displayDataTrafficChart = function() {
      charts.updateSvg('.dataGraphTraffic');
      x.domain(dataTraffic.map(function(d) {
        console.log(d);
        return d.date;
      }));
      y.domain([0, d3.max(dataTraffic, function(d) {
        return d.fremont_bridge_nb;
      })]);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataTraffic)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.date);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d.fremont_bridge_nb);
        })
        .attr('height', function(d) {
          return height - y(d.fremont_bridge_nb);
        });
    };

    charts.displayHourlyChart = function() {
      charts.updateSvg('.dataGraphHourly');
      x.domain(dataHourly.map(function(d) {
        console.log(d);
        return d.hour;
      }));
      y.domain([0, d3.max(dataHourly, function(d) {
        return d.avg;
      })]);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataHourly)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.hour);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d.avg);
        })
        .attr('height', function(d) {
          return height - y(d.avg);
        });
    };

    charts.displayDailyChart = function() {
      charts.updateSvg('.dataGraphDaily');
      x.domain(dataDaily.map(function(d) {
        console.log(d);
        return d.day;
      }));
      y.domain([0, d3.max(dataDaily, function(d) {
        return d.avg;
      })]);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataDaily)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.day);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d.avg);
        })
        .attr('height', function(d) {
          return height - y(d.avg);
        });
    };

    charts.displayMonthlyChart = function() {
      charts.updateSvg('.dataGraphMonthly');
      x.domain(dataMonthly.map(function(d) {
        console.log(d);
        return d.month;
      }));
      y.domain([0, d3.max(dataMonthly, function(d) {
        return d.avg;
      })]);

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x));

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataMonthly)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.month);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d.avg);
        })
        .attr('height', function(d) {
          return height - y(d.avg);
        });
    };
    charts.displayDataTrafficChart();
    charts.displayHourlyChart();
    charts.displayDailyChart();
    charts.displayMonthlyChart();
  };


  module.charts = charts;
})(window);
