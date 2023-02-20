function putScoreTrack(activeSequence, vidTrackOffset, audTrackOffset, data, time) {
    if (!activeSequence) {
        throw Error("can't find the active sequence")
    }
    var mogrtToImport = File("~/mogrt_files/score.mogrt")
    var targetTime = new Time()
    targetTime.seconds = time;
    var newTrackItem = activeSeq.importMGT(mogrtToImport.fsName, targetTime.ticks, vidTrackOffset, audTrackOffset);
    if (!newTrackItem) {
        throw Error("can't find the mogrt file to import")
    }

    // var comp0 = newTrackItem.components[0] 
    // printComponentParams(com0.properties) //use comp0 to change opacity

    var comp1 = newTrackItem.components[1]
    // printComponentParams(com1.properties) //use comp1 to change scale
    setPremitivePropValue(comp1.properties[1], scale)

    var moComp = newTrackItem.components[2]; // mogrt component 
    if (!moComp) {
        throw Error("can't find the mogrt component")
    }
    var params = moComp.properties;
    // printComponentParams(params)
    setObjPropValue(params[2], "textEditValue", data.firstName) // first Name 
    setObjPropValue(params[4], "textEditValue", data.secondName) // secound Name
    setPremitivePropValue(params[7], data.firstScore) // first Score
    setPremitivePropValue(params[9], data.secondScore) // secound Score

    // printComponentParams(params)

}