#include "./utils.jsx";

#include "./ScoreComponent.jsx";

#include "./DetailedScoreComponent.jsx";

#include "./const.jsx";

#include "./TimelineUtils.jsx"

var activeSeq = app.project.activeSequence;

function run() {
    var timeline = getTimeLine()
    if (timeline) {
        timeline = makeTimeLineReady(timeline)
        executeTimeline(timeline)
    }
}
run()