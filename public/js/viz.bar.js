// ************ IMPORTS
import { select } from 'd3-selection';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import { transition } from 'd3-transition';
import voteCounts from './viz.parse';

// ********************************************************************** BAR GRAPH VIZ

const drawBarGraph = snapshot => {
    const values = voteCounts(snapshot.val());

    // add the bar graph class
    select('.viz').classed('bar-graph', true);

    const bars = select('.viz').selectAll('.bar').data(values, d => d.label);

    // find the max value from the input
    const max = Math.max(...values.map(d => d.votes));

    // domain scale to pick a reasonable range based on the max
    const domain = scaleThreshold()
                    .domain([0, 31, 51, 101, 501, 1001, 10000])
                    .range([30, 30, 50, 100, 500, 1000, 10000]);

    // height scale for the bars (maps to % values for CSS)
    const height = scaleLinear().domain([0, domain(max)]).range([0, 90]);

    // on update
    bars.attr('data-label', d => d.label)
        .attr('data-votes', d => d.votes)
        .style('height', d => `${height(d.votes)}%`);

    // on init
    bars.enter()
        .append('div')
        .attr('class', 'bar')
        .attr('data-label', d => d.label)
        .attr('data-votes', d => d.votes)
        .style('height', d => `0%`)
        .each(function(d, i) {
            setTimeout(elem => {
                select(elem).style('height', `${height(d.votes)}%`);
            }, i * 200, this);
        });
}

// es5 "export"
window.drawBarGraph = drawBarGraph;
