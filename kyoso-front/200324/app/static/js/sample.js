$(document).ready(function() {
    var namespace = '/omni_eyes';
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port + namespace);

    socket.on('person_detect', function(msg) {
        var p = document.getElementById('sample');
        p.innerText = msg.count;
    });
});