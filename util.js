

exports.checkParam = function (date, counth, counts) {
    var dateRegex = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/

    console.log(dateRegex.test(date),123, typeof date);
    if ((dateRegex.test(date) && counth ^ counts == 1) && (counth <= 1 && counts <= 1 ) ) {
        return true;
    }
    return false;
}

