// ************ IMPORTS
import { select } from 'd3-selection';
import { forceSimulation, forceX, forceY, forceCollide, forceCenter } from 'd3-force';
import { scalePow } from 'd3-scale';
import { forceAttract } from 'd3-force-attract';
import { range } from 'd3-array';
import voteCounts from './viz.parse';

// ********************************************************************** CLUSTERS VIZ

const drawClusters = snapshot => {

    let values = voteCounts(snapshot.val());
    const svg = document.querySelector('.viz');
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);

    // find the max value from the input
    const max = Math.max(...values.map(d => d.votes));

    // scale the vote #s so that we exaggerate winner counts
    const scale = scalePow().exponent([3]).domain([0, max]).rangeRound([0, max * 2]);

    // apply the exaggerated vote counts to the values
    values = values.map(d => Object.assign({}, d, { votes: scale(d.votes)}));

    const votes = select(svg)
                    .selectAll('.votes')
                    .data(values);

    // on update
    votes.each(function(vote, index) {
            const group = this;
            const simulation = window[`simulation-${vote.label}`];

            simulation.stop();

            // generate new nodes at a different starting point
            const newNodes = range(vote.votes - simulation.nodes().length).map(function(i) {
                return {
                    r: 10,
                    x: index * width,
                    y: index * height
                };
            });

            // append the new nodes to the existing nodes in the simulation
            const nodes = simulation.nodes().concat(newNodes);

            // d3 code
            const votes = select(group).selectAll(`.vote-${vote.label}`).data(nodes);

            votes.enter()
                .append('circle')
                .attr('class', `vote-${vote.label}`)
                .attr('r', d => d.r)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)
                .merge(votes);

            // "reheat" the simulation
            simulation
                .alphaTarget(0.001)
                .alphaMin(0.001)
                .alpha(1)
                .on('tick', tick)
                .nodes(nodes);

            simulation.restart();

            function tick(e) {
                select(group)
                    .selectAll(`.vote-${vote.label}`)
                    .data(nodes)
                    .attr('cx', d => d.x)
                    .attr('cy', d => d.y)
                    .attr('r', d => d.r);
            }
        })

    // on start
    votes.enter()
        .append('g')
        .attr('class', 'votes')
        .each(function(vote, index) {
            const group = this;

            const x = (index + 1) * (width / 3);
            const y = (index + 1) * (height / 3);

            const nodes = [
                {
                    r: 70,
                    fixed: true,
                    fx: x,
                    fy: y,
                    img: `#choice${index + 1}`
                }
            ].concat(
                range(vote.votes).map(function(i) {
                    return {
                        r: 10,
                        x: index * width,
                        y: index * height
                    };
                })
            )

            // add pattern

            const img = select(svg).selectAll(`.choice-${vote.label}`).data([vote]);

            img.enter()
                .append('image')
                .attr('id', `choice-${vote.label}`)
                .attr('width', 140)
                .attr('height', 140)
                .attr('x', x - 70)
                .attr('y', y - 70)
                .attr('xlink:href', `img/${vote.label}-head.png`);

            // add circles, start simulation

            const votes = select(group).selectAll(`.vote-${vote.label}`).data(nodes);

            votes.enter()
                .append('circle')
                .attr('class', d => `vote-${vote.label}${d.fixed && ' fixed' || ''}`)
                .attr('r', d => d.r)
                .attr('cx', d => d.x)
                .attr('cy', d => d.y)

            window[`simulation-${vote.label}`] = forceSimulation()
                            .velocityDecay(.95)
                            .alphaMin(.001)
                            .force('x', forceX().strength(.5))
                            .force('y', forceY().strength(.5))
                            .force('center', forceCenter((index + 1) * (width / 3), (index + 1) * (height / 3)))
                            .force('collide',
                                forceCollide()
                                    .radius(d => d.r + 5)
                                    .strength(.5)
                                    .iterations(10)
                            )
                            .on('tick', tick)
                            .nodes(nodes);

            function tick(e) {
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
window.drawClusters = drawClusters;
