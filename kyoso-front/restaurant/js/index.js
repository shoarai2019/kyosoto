// // 接続先URI 1F
// var cafeUri = "ws://" + "10.232.188.186:1880" + "/ws_workers_cafeteria"; // ← [output] websocket の path に合わせる

// WebSocketオブジェクト
var webSocket = null;

// 接続先URI 2F
// var uri = "ws://" + "10.232.233.121:1880" + "/ws_workers_meetingroom"; // ← [output] websocket の path に合わせる


// 表示時の表示
window.onload = (function() {

    // cafe
    drawDefaultImage('image1');
    drawDefaultImage('image2');
    drawDefaultImage('image3');
    drawDefaultImage('image4');
    drawDefaultImage('image5');
    drawDefaultImage('imageCafe');
    // drawImage(cafeData.image, 'imageCafe') // カフェ仮データ表示
    setInterval(function() {
        updateImage();
    }, 2000)

    // 1f
    const bg = document.getElementById('bg');
    const sb = document.getElementById('side-bar');
    console.log(bg.clientHeight);
    sb.style.height = bg.clientHeight + 'px';

    // 1F
    // displayData(resData); //レストラン仮データ表示
    wsopen();

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
        // populationList = e.target;
        if(populationList == 'real') {
            populationList = 'week';
        } else if(populationList == 'week') {
            populationList = 'real';
        }
        console.log(populationList)
        displayData(resData);
    })

})
