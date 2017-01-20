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

export default voteCounts;
