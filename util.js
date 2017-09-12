

exports.checkParam = function (date, counth, counts) {
    var dateRegex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/

    if ((dateRegex.test(date) && counth ^ counts == 1) && (counth <= 1 && counts <= 1 ) ) {
        return true;
    }
    return false;
}

exports.covertDateFormat = function (date) {
    var date = new Date(date);
    return date.toLocaleDateString();
}

exports.creatMoodList = function (data) {
    var result = {"countH":0,"countS":0};

    console.log("data", data);
    for(var i =0 ; i < data.length; i++) {
        result.countH +=  data[i].countH;
        result.countS +=  data[i].countS;       
    }
    return result;
}