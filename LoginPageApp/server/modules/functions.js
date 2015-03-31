
var users = 0; //i have to initialize based on a call to db for # of connected users, hm
var updateUser = function (con) {
    var current = $('#users').val();
    if (con = "connected") {
        //update code here to add 1 to the user counter
    }
    else {
        //update code here to subtract 1 to the user counter
    }
};


var datetime = function () {
    
    var date = new Date();
    
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    
    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    
    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    
    var ms = date.getMilliseconds();
    ms = (ms < 1000 ? "0" : "") + ms;
    
    var year = date.getFullYear();
    
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    
    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    console.log(year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec+"."+ms);
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec+"."+ms;

};

var updateUsers = function (num) {
    var current = $('#users').val();
    $('#users').val(parseInt(current)+parseInt(num));
};

module.exports.datetime = datetime;