// 接続先URI 1F
var cafeUri = "ws://" + "10.232.233.121:1880" + "/ws_workers_cafeteria"; // ← [output] websocket の path に合わせる

// 接続先URI 2F
var meetingUri = "ws://" + "10.232.233.121:1880" + "/ws_workers_meetingroom"; // ← [output] websocket の path に合わせる


// 表示時の表示
window.onload = (function() {
    // WebSocketオブジェクト
    let wsCafe = null;
    wsopen(wsCafe, cafeUri);

    // top
    const bg = document.getElementById('bg');
    const sb = document.getElementById('side-bar');
    console.log(bg.clientHeight);
    sb.style.height = bg.clientHeight + 'px';

    let date = new Date();
    let hours = date.getHours();

    // 初回背景設定
        if(hours>= 5 && hours < 11) { // 朝
            bg.style.backgroundImage = "url(./img/top/morning.png)"
        } else if(hours >= 11 && hours < 16) { // 昼
            bg.style.backgroundImage = 'url(./img/top/daytime.png)'
        } else if(hours >= 16 && hours < 18) { // 夕
            bg.style.backgroundImage = 'url(./img/top/evening.png)'
        } else if(hours >= 18 || hours < 5) { // 晩
            bg.style.backgroundImage = 'url(./img/top/night.png)'
        }

    // 1F
    displayData(lastData);

    // 2F
    data = meetingData;
    // editDisplayData(data);
    // drawMap(data);

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
    const periodDom = document.getElementById('period');

    const periodNameDom = document.getElementsByClassName('period-name');

    setInterval(function() {
        let num;
        for(let i = 0; i < periodNameDom.length; i ++) {
            if (periodNameDom[i].classList.contains('active')) {
                num = i;
                periodNameDom[i].classList.remove('active');
            }
        }

        let date = new Date();
        
        if(num == 0) {
            periodDom.innerText = strOfPeriod(date, 'week');
            num ++;
        } else if(num == 1) {
            periodDom.innerText = strOfPeriod(date, 'month');
            num ++;
        } else if(num == 2) {
            periodDom.innerText = ''
            num = 0;
        }

        periodNameDom[num].classList.add('active');

    }, 6000)



    setInterval(function() {
        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDay();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm;

        // 背景変更
        if(minutes == 0) {
            if(hours>= 5 && hours < 11) { // 朝
                bg.style.backgroundImage = 'url(./img/top/morning.png)'
            } else if(hours >= 11 && hours < 16) { // 昼
                bg.style.backgroundImage = 'url(./img/top/daytime.png)'
            } else if(hours >= 16 && hours < 18) { // 夕
                bg.style.backgroundImage = 'url(./img/top/evening.png)'
            } else if(hours >= 18 || hours < 5) { // 晩
                bg.style.backgroundImage = 'url(./img/top/night.png)'
            }
        }

        // 現在時刻表示
        hours = zeroPadding(hours, 2);
        minutes = zeroPadding(minutes, 2);

        if (hours >= 12) {
            hours -= 12
            ampm = "PM"
        } else {
            ampm = "AM"
        }

        timeDom.innerHTML = hours + ':' + minutes + '<span>' + ampm + '</span>'

        

    }, 1000)

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
        displayData(lastData);
    })

})
