function getTimeLine() {
    var timeline = File.openDialog("select timeline file", "", false)
    if (!timeline) {
        return null
    }
    timeline.open('r')
    var obj = timeline.read()
    timeline.close()
    return JSON.parse(obj)
}

function checkWinner(state) {
    var WINNING_SCORE = 152;

    function sum(a, b) {
        return a + b
    }
    var team1TotalScore = reduce(state.team1.scores, sum, 0);
    var team2TotalScore = reduce(state.team2.scores, sum, 0);

    if (team1TotalScore < WINNING_SCORE && team2TotalScore < WINNING_SCORE) {
        return null;
    } else if (
        team1TotalScore >= WINNING_SCORE ||
        team2TotalScore >= WINNING_SCORE
    ) {
        if (team1TotalScore === team2TotalScore) return null;
        else {
            if (team1TotalScore > team2TotalScore) return "team1";
            else {
                return "team2";
            }
        }
    }
}

function makeTimeLineReady(timeline) {
    var res = []
    var state = {
        team1: {
            name: "",
            scores: [],
            matchesScore: 0
        },
        team2: {
            name: "",
            scores: [],
            matchesScore: 0
        },
        winner: null
    }

    function updateNames(state, record) {
        state.team1.name = record.data.team1.name
        state.team2.name = record.data.team2.name
    }

    function updateScore(state, record) {
        state.team1.scores = record.data.team1.scores
        state.team2.scores = record.data.team2.scores
    }

    function pushLastScore(state, record) {
        state.team1.scores.push(record.data.team1.scores[record.data.team1.scores.length - 1])
        state.team2.scores.push(record.data.team2.scores[record.data.team2.scores.length - 1])
    }

    function popLastScore(state) {
        var team1 = state.team1.scores.pop()
        var team2 = state.team2.scores.pop()
        return {
            team1: team1,
            team2: team2
        }
    }

    function pushStateToResult(state, res, eventName, record) {
        res.push({
            startAt: record.startAt,
            data: JSON.parse(JSON.stringify(state)),
            event: eventName
        })
    }


    for (var i = 0; i < timeline.records.length; i++) {
        var record = timeline.records[i]
        record.startAt = record.startAt / 1000
        switch (record.event) {
            case "start":
                updateNames(state, record)
                updateScore(state, record)
                state.winner = checkWinner(state)
                pushStateToResult(state, res, "start", record)
                break;

            case "score increased":
                var lastRecord = res.pop();
                if (lastRecord.event !== "start" && (record.startAt - lastRecord.startAt) < 20) {
                    // if (lastRecord.event === "score increased with winner") {
                    //     state[lastRecord.data.winner].matchesScore -= 1
                    // }
                    var lastStateScore = popLastScore(state)

                    record.data.team1.scores[record.data.team1.scores.length - 1] += lastStateScore.team1;
                    record.data.team2.scores[record.data.team2.scores.length - 1] += lastStateScore.team2;

                    pushLastScore(state, record)
                } else {
                    res.push(lastRecord)
                    pushLastScore(state, record)
                }
                state.winner = checkWinner(state)
                if (state.winner) {
                    state[state.winner].matchesScore += 1
                    pushStateToResult(state, res, "score increased with winner", record)
                } else {
                    pushStateToResult(state, res, "score increased without winner", record)
                }
                break;

            case "back":
                popLastScore(state)
                state.winner = checkWinner(state)
                res.pop()
                break;

            case "delete":
                updateScore(state, record)
                break;

            case "end":
                break;
        }
    }
    return res
}

function executeTimeline(timeline) {
    for (var i = 0; i < timeline.length; i++) {
        var record = timeline[i]
        switch (record.event) {
            case "start":
                if (record.data.winner) {
                    putScoreTrack(activeSeq, vidTrackOffsetForWinner, audTrackOffset, data = {
                        firstName: record.data.team1.name,
                        secondName: record.data.team2.name,
                        firstScore: record.data.team1.matchesScore,
                        secondScore: record.data.team2.matchesScore,
                    }, time = record.startAt)
                } else {
                    putScoreTrack(activeSeq, vidTrackOffsetForScore, audTrackOffset, data = {
                        firstName: record.data.team1.name,
                        secondName: record.data.team2.name,
                        firstScore: reduce(record.data.team1.scores, function(a, b) {
                            return a + b
                        }, 0),
                        secondScore: reduce(record.data.team2.scores, function(a, b) {
                            return a + b
                        }, 0),
                    }, time = record.startAt)
                }
                break;

            case "score increased without winner":
                var clipEndTime = putDetailedScoreTrack(activeSeq, vidTrackOffsetForScoreDetails, audTrackOffset, data = {
                    firstName: record.data.team1.name,
                    secondName: record.data.team2.name,
                    firstPlayerScores: record.data.team1.scores,
                    secondPlayerScores: record.data.team2.scores
                }, time = record.startAt)

                putScoreTrack(activeSeq, vidTrackOffsetForScore, audTrackOffset, data = {
                    firstName: record.data.team1.name,
                    secondName: record.data.team2.name,
                    firstScore: reduce(record.data.team1.scores, function(a, b) {
                        return a + b
                    }, 0),
                    secondScore: reduce(record.data.team2.scores, function(a, b) {
                        return a + b
                    }, 0),
                }, time = clipEndTime.seconds)
                break;

            case "score increased with winner":
                var clipEndTime = putDetailedScoreTrack(activeSeq, vidTrackOffsetForScoreDetails, audTrackOffset, data = {
                    firstName: record.data.team1.name,
                    secondName: record.data.team2.name,
                    firstPlayerScores: record.data.team1.scores,
                    secondPlayerScores: record.data.team2.scores
                }, time = record.startAt)

                putScoreTrack(activeSeq, vidTrackOffsetForWinner, audTrackOffset, data = {
                    firstName: record.data.team1.name,
                    secondName: record.data.team2.name,
                    firstScore: record.data.team1.matchesScore,
                    secondScore: record.data.team2.matchesScore,
                }, time = clipEndTime.seconds)
                break;

        }
    }
}