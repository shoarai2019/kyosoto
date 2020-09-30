// WebSocketオブジェクト
var webSocket = null;

// 表示時の表示
window.onload = (function() {
    // 2F
    editDisplayData(meetingData); // 仮データ表示
    drawMap(meetingData); // 仮データ表示
    displayGraph(meetingData);

    wsopen();
});
