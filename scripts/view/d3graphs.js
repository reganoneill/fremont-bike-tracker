'use strict';
(function(module) {
  var charts = {};
  charts.drawCharts = function() {
    var dataTraffic = traffic.allTraffic;
    var dataHourly = traffic.hourlyDataToDisplay;
    var dataDaily = traffic.dailyDataToDisplay;
    var dataMonthly = traffic.monthlyDataToDisplay;
    var dataTrafficByDay = traffic.dailyArray;
    dataTrafficByDay.reverse();
    dataTraffic.reverse();

    var margin = {top: 120, right: 30, bottom: 120, left: 40},
      width = 800 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
      .range([0, width])
      .padding(0.25);

    var y = d3.scaleLinear()
      .range([height, 0]);

    var div = d3.select('body').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0);

    var svg;

    charts.updateSvg = function(chart) {
      $(chart).empty();
      svg = d3.select(chart).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
    };

///////////////////////HOURLY BIKE TRAFFIC TOTALS///////////////////////////////
    charts.displayDataTrafficChart = function() {
      charts.updateSvg('.dataGraphTraffic');
      x.domain(dataTraffic.map(function(d) {
        return d.date;
      }));
      y.domain([0, d3.max(dataTraffic, function(d) {
        return parseInt(d.total);
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Hourly Bike Traffic Totals');

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x))
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-75)');


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
          return y(d.total);
        })
        .attr('height', function(d) {
          return height - y(d.total);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d.total + ' bikers')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////AVG BIKE TRAFFIC PER HOUR///////////////////////////////
    charts.displayHourlyChart = function() {
      charts.updateSvg('.dataGraphHourly');
      x.domain(dataHourly.map(function(d) {
        return d.hour;
      }));
      y.domain([0, d3.max(dataHourly, function(d) {
        return parseInt(d.avg);
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Average Bike Traffic Per Hour of the Day');

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
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d.avg + ' bikers')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////AVG BIKE TRAFFIC PER DAY///////////////////////////////
    charts.displayDailyChart = function() {
      charts.updateSvg('.dataGraphDaily');
      x.domain(dataDaily.map(function(d) {
        return d.day;
      }));
      y.domain([0, d3.max(dataDaily, function(d) {
        return d.avg;
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Average Bike Traffic Per Day of the Week');

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
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d.avg + ' bikers')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////AVG BIKE TRAFFIC PER MONTH//////////////////////////////
    charts.displayMonthlyChart = function() {
      charts.updateSvg('.dataGraphMonthly');
      x.domain(dataMonthly.map(function(d) {
        return d.month;
      }));
      y.domain([0, d3.max(dataMonthly, function(d) {
        return d.avg;
      })]);
      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Average Bike Traffic Per Month of the Year');

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
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d.avg + ' bikers')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };
///////////////////////DAILY BIKE TRAFFIC TOTALS///////////////////////////////
    charts.displayDataTrafficByDayChart = function() {
      charts.updateSvg('.dataGraphTrafficHourly');
      x.domain(dataTrafficByDay.map(function(d) {
        return d.date;
      }));
      y.domain([0, d3.max(dataTrafficByDay, function(d) {
        return d.total;
      })]);

      svg.append('text')
        .attr('x', (width / 2))
        .attr('y', 0 - (margin.top / 2))
        .attr('text-anchor', 'middle')
        .style('font-size', '22px')
        .style('fill', 'white')
        .text('Bike Traffic Totals Per Day');

      svg.append('g')
        .attr('transform', 'translate(0,' + height + ')')
        .attr('class', 'axisWhite')
        .call(d3.axisBottom(x))
        .selectAll('text')
          .style('text-anchor', 'end')
          .attr('dx', '-.8em')
          .attr('dy', '.15em')
          .attr('transform', 'rotate(-75)');

      svg.append('g')
        .attr('class', 'axisWhite')
        .call(d3.axisLeft(y));

      svg.selectAll('.bar')
        .data(dataTrafficByDay)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function(d) {
          return x(d.date);
        })
        .attr('width', x.bandwidth())
        .attr('y', function(d) {
          return y(d.total);
        })
        .attr('height', function(d) {
          return height - y(d.total);
        })
        .on('mouseover', function(d) {
          var rect = $(d3.event.target);
          rect.addClass('mouseover-color');
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(d.total + ' bikers')
            .style('left', (d3.event.pageX) + 'px')
            .style('top', (d3.event.pageY - 28) + 'px');
        })
        .on('mouseout', function() {
          var rect = $(d3.event.target);
          rect.removeClass('mouseover-color');
          div.transition()
            .duration(500)
            .style('opacity', 0);
        });
    };

    if(traffic.allTraffic.length > 8760){
      charts.displayMonthlyChart();
    }
    if(traffic.allTraffic.length < 168){
      charts.displayDataTrafficChart();
    } else {
      charts.displayDailyChart();
    }
    charts.displayDataTrafficByDayChart();
    charts.displayHourlyChart();

  };


  module.charts = charts;
})(window);
