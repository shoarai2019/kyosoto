// WebSocketオブジェクト
var webSocket = null;

// 表示時の表示
window.onload = (function() {
    // wsopen(cafeUri);

    // 2F
    // data = meetingData;
    // editDisplayData(data);
    // drawMap(data);

    updateImage('./js/1.json');
    updateChart('project', 'week')

    setInterval(function() {
     updateImage(projectUri);
     updateChart('project', 'week');
    }, 60000)



    // 3F
    // var enra_response = getEnraResponse("kw", { "kwcmd": "get" });

    // view1 = new MPSEventViewer($('#camera0'), 0, enra_response, 200, 1.0);
    // view2 = new MPSEventViewer($('#camera1'), 1, enra_response, 200, 1.0);
    // view3 = new MPSEventViewer($('#camera2'), 2, enra_response, 200, 1.0);
    // view4 = new MPSEventViewer($('#camera3'), 3, enra_response, 200, 1.0);



        // // デモ用
        // setInterval(function() {
        //     if (isDemo) {
        //         window.location.href = './meetingroom';
        //     }
        // }, 60000);

})

window.onresize = function(){
    updateImage('./js/1.json');
}
