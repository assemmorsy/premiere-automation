function putDetailedScoreTrack(activeSequence, vidTrackOffset, audTrackOffset, data, time, endTime) {
    if (!activeSequence) {
        throw Error("can't find the active sequence")
    }
    var mogrtToImport = File("~/mogrt_files/details.mogrt")
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

    setObjPropValue(params[10], "textEditValue", data.firstName) // first Name 
    setObjPropValue(params[13], "textEditValue", data.firstName) // secound Name

    setObjPropValue(params[3], "textEditValue", data.secondName) // first Name 
    setObjPropValue(params[6], "textEditValue", data.secondName) // secound Name

    setObjPropValue(params[3], "fontEditValue", fontsArary) // first Name 
    setObjPropValue(params[6], "fontEditValue", fontsArary) // secound Name


    setObjPropValue(params[10], "fontEditValue", fontsArary) // first Name 
    setObjPropValue(params[13], "fontEditValue", fontsArary) // secound Name

    // printComponentParams(params)

    var firstScoresIndecies = [19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52].reverse() // first player scores indecies from 12 to 1 
    var secondScoresIndecies = [56, 59, 62, 65, 68, 71, 74, 77, 80, 83, 86, 89].reverse() // second player scores indecies from 12 to 1 

    setAllTeamScores(params, data.firstPlayerScores, firstScoresIndecies) // first team setting scores 
    setAllTeamScores(params, data.secondPlayerScores, secondScoresIndecies) // first team setting scores
    return newTrackItem.end
}