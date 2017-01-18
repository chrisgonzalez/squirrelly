// ************ IMPORTS
import { select } from 'd3-selection';
import { scaleLinear, scaleThreshold } from 'd3-scale';
import { transition } from 'd3-transition';

// ********************************************************************** BAR GRAPH VIZ

const drawBarGraph = values => {
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

// ********************************************************************** CLUSTERS VIZ

import { forceSimulation, forceX, forceY, forceCollide, forceCenter } from 'd3-force';
import { forceAttract } from 'd3-force-attract';
import { range } from 'd3-array';

const drawClusters = values => {
    const svg = document.querySelector('.viz');
    const width = window.innerWidth;
    const height = window.innerHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    const votes = select(svg)
                    .selectAll('.votes')
                    .data(values);

    votes
        .each(function(vote, index) {
            const group = this;
            const simulation = window[`simulation-${vote.label}`];

            const newNodes = range(vote.votes - simulation.nodes().length).map(function(i) {
                return {
                    r: 10,
                    x: index * width,
                    y: index * height
                };
            });

            const nodes = simulation.nodes().concat(newNodes);

            const votes = select(group).selectAll(`.vote-${vote.label}`).data(nodes);

            votes.enter()
                .append('circle')
                .attr('class', `vote-${vote.label}`)
                .attr('r', d => d.r)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .merge(votes);

            simulation
                .alphaTarget(0.0000001)
                .alpha(.9)
                .on('tick', tick)
                .nodes(nodes);

            simulation.restart();

            function tick(e) {
                console.log('tick');
                select(group)
                    .selectAll(`.vote-${vote.label}`)
                    .data(nodes)
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', d => d.r);
            }
        })

    votes.enter()
        .append('g')
        .attr('class', 'votes')
        .each(function(vote, index) {
            const group = this;

            const nodes = range(vote.votes).map(function(i) {
                return {
                    r: 10,
                    x: index * width,
                    y: index * height
                };
            });

            console.log(vote.label, nodes.length);

            const votes = select(group).selectAll(`.vote-${vote.label}`).data(nodes);

            votes.enter()
                .append('circle')
                .attr('class', `vote-${vote.label}`)
                .attr('r', d => d.r)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            window[`simulation-${vote.label}`] = forceSimulation()
                            .velocityDecay(.9)
                            .alphaMin(.0005)
                            .force('attract', forceAttract()
                                .target([(index + 1) * (width / 3), (index + 1) * (height / 3)])
                                .strength(0.8)
                            )
                            .force('collide', forceCollide().radius(d => d.r * 1.5))
                            .on('tick', tick)
                            .nodes(nodes);

            function tick(e) {
                console.log('tick');
                select(group)
                    .selectAll(`.vote-${vote.label}`)
                    .data(nodes)
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', d => d.r);
            }
        })
}

// es5 "export"
window.drawBarGraph = drawBarGraph;
window.drawClusters = drawClusters;

// ********************************************************************** VOTE COUNT UTILITIES

// reduce over firebase object and return key/value pair for vote counts
const voteCountsToObject = votes => (
    Object.keys(votes).reduce((voteTotals, key) => {
        const answerKey = Object.keys(votes[key])[0] || '';
        const answer = votes[key][answerKey];
        const answerCount = voteTotals[answer] || 0;
        const newCount = {};
        newCount[answer] = answerCount + 1;

        return Object.assign({}, voteTotals, newCount);
    }, {})
);

// convert key/value Object for vote counts into an array for d3
const voteCounts = votes => {
    const voteCountsObject = voteCountsToObject(votes);

    return Object.keys(voteCountsObject).map(voteKey => (
        {
            label: voteKey,
            votes: voteCountsObject[voteKey]
        }
    ));
}

// es5 "exports" ;)
window.voteCounts = voteCounts;
