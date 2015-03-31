var socket = io();
console.log("entered index js");
//$('#message-box').focus(); //focus the message box so you can load and start typing



$('#send-message-btn').click(function () {
    var msg = $('#message-box').val();
    if (msg.trim().length > 0) { //will not send empty strings, saves on empty db entries
        socket.emit('chat', +msg);
        $('#messages').append($('<p>').text(getDateTime() + " " + msg));
        $('#message-box').val('');
        return false;
    }
});



$('#message-box').keypress(function (e) {
    var key = e.which;
    if (key == 13) //this is enter key i believe
    {
        var msg = $('#message-box').val();
        if (msg.trim().length > 0) {
            socket.emit('chat', +msg);
            $('#messages').append($('<p>').text(getDateTime() + " " + msg));
            $('#message-box').val('');
            return false;
        }
    }
});



socket.on('chat', function (msg) {
    $('#messages').append($('<p>').text(msg));
});


function getDateTime() {
    
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
    console.log(year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "." + ms);
    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec + "." + ms;

};