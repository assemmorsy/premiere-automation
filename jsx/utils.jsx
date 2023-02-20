function changePropInStringJSON(oldValue, PropName, newValue) {
    var obj = JSON.parse(oldValue)
    obj[PropName] = newValue
    return JSON.stringify(obj)
}

function setObjPropValue(paramObj, PropName, newValue) {
    var strJSONValue = paramObj.getValue()
    var updatedStr = changePropInStringJSON(strJSONValue, PropName, newValue)
    paramObj.setValue(updatedStr)
}

function setPremitivePropValue(paramObj, newValue) {
    paramObj.setValue(newValue)
}

function printComponentParams(paramObj) {
    var value = ""
    for (o = 0; o < paramObj.numItems; o++) {
        var prop = o + " : " + paramObj[o].displayName + " : " + paramObj[o].getValue() + "\n"
        value += prop
        $.write(prop)
    }
    return value
}

function setScore(scoreParamObj, checkboxParamObj, val) {
    setPremitivePropValue(scoreParamObj, val)
    setPremitivePropValue(checkboxParamObj, true)
}

function reduceScoreTo12(array) {
    if (array.length > 12) {
        var gap = array.length - 12
        var newArray = array.slice(gap + 1)
        newArray.unshift(reduce(array.slice(0, gap + 1), function(a, b) {
            return a + b
        }, 0))
        return newArray;
    } else {
        return array
    }
}

function setAllTeamScores(paramsObj, scoresArray, scoreParamsIndeciesArray) {
    scoresArray = reduceScoreTo12(scoresArray)
    for (var i = 0; i < scoresArray.length; i++) {
        setScore(paramsObj[scoreParamsIndeciesArray[i]], paramsObj[scoreParamsIndeciesArray[i] - 1], scoresArray[i])
    }
}

function reduce(array, fn, acc) {
    for (var i = 0; i < array.length; i++) {
        acc = fn(acc, array[i])
    }
    return acc
}