// 接続先URI 1F
var uri = "ws://" + "10.232.233.121:1880" + "/ws_workers_cafeteria"; // ← [output] websocket の path に合わせる

// WebSocketオブジェクト
var webSocket = null;

// 接続先URI 2F
var uri = "ws://" + "10.232.233.121:1880" + "/ws_workers_meetingroom"; // ← [output] websocket の path に合わせる


// 表示時の表示
window.onload = (() => {
    wsopen();

    // 1F
    displayData(lastData);

    // 2F
    data = meetingData;
    editDisplayData(data);
    drawMap(data);

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


    const timeDom = document.getElementById('time');

    setInterval(() => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm;

        hours = zeroPadding(hours, 2);
        minutes = zeroPadding(minutes, 2);

        if (hours >= 12) {
            hours -= 12
            ampm = "PM"
        } else {
            ampm = "AM"
        }

        timeDom.innerHTML = `${hours}:${minutes}<span>${ampm}</span>`

    }, 1000)

    const sel = document.getElementById('sel')
    sel.addEventListener('change', (e) => {
        console.log('hhh' + populationList)
        // populationList = e.target;
        if(populationList == 'real') {
            populationList = 'week';
        } else if(populationList == 'week') {
            populationList = 'real';
        }
        console.log(populationList)
        displayData(lastData);
    })

})
