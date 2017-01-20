// ************ IMPORTS
import { select } from 'd3-selection';
import { scalePow } from 'd3-scale';
import { transition } from 'd3-transition';
import voteCounts from './viz.parse';

// ********************************************************************** BAR GRAPH VIZ

const drawBreakViz = snapshot => {
    const values = voteCounts(snapshot.val());

    // add the break class so we can style it
    select('.viz').classed('break', true);

    const viz = document.querySelector('.viz');

    const { width, height } = viz.getBoundingClientRect();

    // find the max value from the input
    const max = Math.max(...values.map(d => d.votes));

    // scale to generate a power-based diameter (non-linear means the size will be easier to differentiate)
    const diameter = scalePow().exponent([3]).domain([0, max]).rangeRound([0, Math.min(width / 2, height / 2)]);

    // create the votes divs
    const votes = select(viz).selectAll('.vote').data(values, d => d.label);

    votes.transition()
        .duration(500)
        .style('width', d => `${diameter(d.votes)}px`)
        .style('height', d => `${diameter(d.votes)}px`)
        .style('line-height', d => `${diameter(d.votes)}px`)
        .select('.vote-count')
        .text(d => d.votes);

    votes.enter()
        .append('div')
        .attr('class', 'vote')
        .attr('data-label', d => d.label)
        .style('width', `0px`)
        .style('height', `0px`)
        .style('line-height', '0px')
        .each(function(d) {
            select(this).append('span').attr('class', 'vote-count').text(d => d.votes);
        })
        .transition()
        .duration(500)
        .style('width', d => `${diameter(d.votes)}px`)
        .style('height', d => `${diameter(d.votes)}px`)
        .style('line-height', d => `${diameter(d.votes)}px`);
}

// es5 "export"
window.drawBreakViz = drawBreakViz;
