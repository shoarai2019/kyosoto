// 接続先URI 1F
var uri = "ws://" + "10.232.233.121:1880" + "/ws_workers_cafeteria"; // ← [output] websocket の path に合わせる

// WebSocketオブジェクト
var webSocket = null;

// 接続先URI 2F
// var uri = "ws://" + "10.232.233.121:1880" + "/ws_workers_meetingroom"; // ← [output] websocket の path に合わせる


// 表示時の表示
window.onload = (function() {
    // wsopen();

    setInterval(function() {
        console.log(camera3f[1]);
        for(let i = 0; i < camera3f.length; i ++) {
            updateImage(camera4f[i], i);
        }
    }, 2000)



        // // デモ用
        // setInterval(function() {
        //     if (isDemo) {
        //         window.location.href = './meetingroom';
        //     }
        // }, 60000);


    // const updateTimeDom = document.getElementById('update-time');

    // setInterval(() => {
    //     let date = new Date();
    //     let hours = date.getHours();
    //     let minutes = date.getMinutes();
    //     let ampm;

    //     hours = zeroPadding(hours, 2);
    //     minutes = zeroPadding(minutes, 2);

    //     if (hours >= 12) {
    //         hours -= 12
    //         ampm = "PM"
    //     } else {
    //         ampm = "AM"
    //     }

    //     timeDom.innerHTML = `${hours}:${minutes}<span>${ampm}</span>`

    // }, 1000)

    const sel = document.getElementById('sel')
    sel.addEventListener('change', function(e) {
        console.log('hhh' + populationList)
        // populationList = e.target;
        if(populationList == 'real') {
            populationList = 'week';
        } else if(populationList == 'week') {
            populationList = 'real';
        }
        console.log(populationList)
        // displayData(lastData);
    })

})
