let populationList = 'real';

// 手前に0を追加して桁数を調整
// NUM=値 LEN=桁数

let heatmap;

function displayHeatmap(heatmapData) {
    heatmapData = JSON.parse(heatmapData);

    let container = document.getElementById('heatmap');
    let width = container.clientWidth;
    let height = container.clientHeight;
    let config = {
        container: container,
        radius: 25,
        // maxOpacity: .5,
        minOpacity: 0,
        blur: .85
    };
    let dataSet = {
        max: 1,
        min: 0,
        data: []
    };

    if(heatmap) {
        // heatmap._renderer._clear(); // 前回描画があれば先に削除する
        // heatmap.configure(config); // 再設定
        heatmap._renderer.setDimensions(width, height);
        // heatmap.repaint();
    } else { // 初回読み込み時
        heatmap = h337.create(config);
    }

    for(let i = 0; i < heatmapData.heatmap.length; i ++) {
        dataSet.data[i] = {
            x: Math.floor(i / 20) / 45 * width,
            y: (i % 20) / 20 * height,
            value: heatmapData.heatmap[i]
        }
    }
    heatmap.setData(dataSet);
}

function getJson() {
    let xmlHttpRequest = new XMLHttpRequest();
    xmlHttpRequest.onreadystatechange = function(){
        if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){
            displayHeatmap(JSON.parse(xmlHttpRequest.responseText));
        }
    }
    xmlHttpRequest.open('GET','http://tof-people-sensing.crl.hitachi.co.jp:8001/sampledata/',true);

    xmlHttpRequest.send();
}

function updataTable(rowdata) {
    const heatmapData = JSON.parse(rowdata);
    const heatmapVal = heatmapData.heatmap
    let projectbase = 0;
    let roomA = 0;
    let roomB = 0;
    let roomC = 0;
    let roomD = 0;

    console.log(heatmapVal)
    for(let i = 0; i < heatmapVal.length; i ++) {
        if(i % 20 < 11) {
            if(heatmapVal[i] > 0.7) { projectbase ++ }
        } else if(i / 20 < 18) {
            if(heatmapVal[i] > 0.7) { roomA ++ }
        } else if(i / 20 < 26) {
            if(heatmapVal[i] > 0.7) { roomB ++ }
        } else if(i / 20 < 33) {
            if(heatmapVal[i] > 0.7) { roomC ++ }
        } else if(i / 20 < 42.7) {
            if(heatmapVal[i] > 0.7) { roomD ++ }
        } else {
            if(heatmapVal[i] > 0.7) { projectbase ++ }
        }
    }

    document.getElementById('project-count').innerText = projectbase;
    document.getElementById('a-count').innerText = roomA;
    document.getElementById('b-count').innerText = roomB;
    document.getElementById('c-count').innerText = roomC;
    document.getElementById('d-count').innerText = roomD;

    let count = 0;
    let usedRoomArray = [roomA, roomB, roomC, roomD];

    // 会議室の稼働率＝（利用数）÷（総室数[4]）＝xx ％
    // プロジェクトベース/ルームの稼働率＝（プロジェクトベース/ルームの合計人数）÷（キャパシティ[15]）＝xx ％
    // 会議室を6割、プロジェクトベース/ルームを4割で100%換算しなおす
    // （会議室の稼働率×0.6）+（プロジェクトベース/ルームの稼働率×0.4）＝xx %
    usedRoomArray.filter(function(n) {n > 0});
    count = (usedRoomArray.length / 4) * 0.6 + (projectbase / 15) * 0.4;

    updateLocalStrage('project', count);
}

function updateImage(url) {
    let xhr = new XMLHttpRequest();

    // ハンドラの登録.
    xhr.onreadystatechange = function() {
        switch ( xhr.readyState ) {
            case 0:
                // 未初期化状態.
                console.log( 'uninitialized!' );
                break;
            case 1: // データ送信中.
                console.log( 'loading...' );
                break;
            case 2: // 応答待ち.
                console.log( 'loaded.' );
                break;
            case 3: // データ受信中.
                console.log( 'interactive... '+xhr.responseText.length+' bytes.' );
                break;
            case 4: // データ受信完了.
                if( xhr.status == 200 || xhr.status == 304 ) {
                    //var data = JSON.parse(xhr.responseText); // responseXML もあり
                    var data = xhr.responseText; // responseXML もあり
                    console.log( 'COMPLETE! :' + data );
                    displayHeatmap(data);
                    updataTable(data);
                } else {
                    console.log( 'Failed. HttpStatus: '+xhr.statusText );
                }
                break;
        }
    };

    xhr.open('GET', url, true);
    xhr.send();
}

function zeroPadding(NUM, LEN){
    return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

function drawImage(image, canvasId) {
    // canvas
    var canvas = document.getElementById(canvasId);

    if (canvas !== null) {
        var context = canvas.getContext('2d');

        // load image
        var img = new Image();
        img.src = "data:image/jpeg;base64," + image;

        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;

            context.drawImage(img, 0, 0);
        }
    }
}

function drawImageWithRects(image, objects, canvasId, classNameArray) {
    // canvas
    var canvas = document.getElementById(canvasId);
    if (canvas !== null) {
        var context = canvas.getContext('2d');
        
        // load image
        var img = new Image();
        img.src = "data:image/png;base64," + image;
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
        
            context.drawImage(img, 0, 0);
         
            objects.forEach(function(object) {
                if (classNameArray.indexOf(object.class) >= 0) {
                    context.save();
                    
                    // common setting
                    context.lineWidth = 3;
                    
                    // rotate rect if using omni camera
                    if (true) {
                        // calculate radian
                        var boxCenterX = (object.left + object.right) / 2;
                        var boxCenterY = (object.top + object.bottom) / 2;
                        var imgCenterX = img.width / 2;
                        var imgCenterY = img.height / 2;
                        var rad = Math.atan2(boxCenterY - imgCenterY, boxCenterX - imgCenterX)
                                    + (90 * Math.PI / 180);
                        
                        context.translate(boxCenterX, boxCenterY);
                        context.rotate(rad)
                        context.translate(-boxCenterX, -boxCenterY);
                    }

                    if (false) {
                        context.fillStyle = "rgb(200, 0, 0)";
                        context.fillRect(
                            Number(object.left),
                            Number(object.top),
                            Number(object.right) - Number(object.left),
                            Number(object.bottom) - Number(object.top)
                        );
                    } else {
                        context.strokeStyle = "rgb(200, 0, 0)";
                        context.strokeRect(
                            Number(object.left),
                            Number(object.top),
                            Number(object.right) - Number(object.left),
                            Number(object.bottom) - Number(object.top)
                        );
                    }
                    
                    context.restore();
                }
            });
        }
    }
}

function drawImageWithSilhouette(image, objects, canvasId, classNameArray) {
    // canvas
    var canvas = document.getElementById(canvasId);
    if (canvas !== null) {
        var context = canvas.getContext('2d');
        
        // load image
        var img = new Image();
        img.src = "data:image/png;base64," + image;
        
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
        
            context.drawImage(img, 0, 0);
         
            objects.forEach(function(object) {
                if (classNameArray.indexOf(object.class) >= 0) {
                    context.save();
                    
                    // common setting
                    context.lineWidth = 3;
                    
                    // rotate rect if using omni camera
                    if (true) {
                        // calculate radian
                        var boxCenterX = (object.left + object.right) / 2;
                        var boxCenterY = (object.top + object.bottom) / 2;
                        var imgCenterX = img.width / 2;
                        var imgCenterY = img.height / 2;
                        var rad = Math.atan2(boxCenterY - imgCenterY, boxCenterX - imgCenterX)
                                    + (90 * Math.PI / 180);
                        
                        context.translate(boxCenterX, boxCenterY);
                        context.rotate(rad)
                        context.translate(-boxCenterX, -boxCenterY);
                    }
                    
                    let silhouette = new Image();
                    silhouette.src = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAAGsAAACgCAMAAAA8TmJJAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAaVBMVEX////////////////////////////////////////g7fagx+Jwq9RAj8XQ5PH///+Qvt0whsAAarIgfbz///9gos9Qmcr+/v////+Atdnw9vr///8Qc7f////A2uz///+w0ef///////+zK7J3AAAAInRSTlMALVmGnLKoOCJwsrKysrILsrKyshaysqhDsrJ7sk6yZbKRUyb6zQAAAAFiS0dEAIgFHUgAAAAJb0ZGcwAAAB4AAAAAAOP21SUAAAAJcEhZcwAAAGAAAABgAPBrQs8AAAAHdElNRQfjBhwFCC+sSKuxAAAACXZwQWcAAACgAAAAoACiyRAOAAAEvUlEQVR42u3b0XaiMBAGYAGHIogiiBWKoO//kpuMbgUyqWEnydnudq52z2n5Sgg/SQir1bIKwmgNWHEUvi385SWVbGKYVLwJ3EhBJA+fZtsca5vt5P8jB9p+I6HiUI6q2qZSO1qm3kTrpXWp1Elo72erVCj+/qYka9sCbCxSov3SQ6mpSly3j71FateV+soEZq8Bs/LLymw1YyDOqixfYhcL1D6GtHtllTt4t9D1xcU6vKTKqoWITSXazj7r+gDseIxMWlBWD2smdQSojagyZ5/YAK0ZJbsH8yZbQ2Fq1QCs9EiMOuG9OmYjXsybUDbiwLE+4GpuFbxbLDK7uT4vGMcCOJlbOdfKzS3ROTiDj0VW+Y9a7Db01zd89nmf97LPjPKZvT6fKV6flT7HAD7HNnLUa3SLiavFnxp5HIuaj7ETvuVz7uB1TmQ017NwsZ6Yrzms17m51zUH0fU/PK2l7OXhfq8RNeoa0dHWQtHxcgMI5b90a1+XGOKPM7t7ICRrff/TiTW9+/mK4nFnPEyb1VfZWmQXQKnPtz1rje84xAjhqC2XFyceZodKBnmS9/7Z1cit/+DkAtnvoH9281P/aLlzgHUOI7x6ozuhamS/jMNlHRNbpi2qyb10KFKYVZvNxsUn2dqwMddQSmsiAqs669uH02dbKreqrDXXHtLLR5a2ukZqw+vrdl9rZUifWvzqiXaJ+RJqhfiTb1/dAYm8cRuzcdOrqvovG/Iir3jFZx4lnwFrehQik7xdMN0ybEjqqiUiAno7zfesXJzaRmnHRHSKrWVJnpq4t28zLHmHdsk03LyKOSYp44nWwhKj79vYurmjEAuf1HnRfH9xXSF+WuHrUTSnqvHCx/BqEM2ssbVoGePH+q+swXzFhG2F0P9Yf7fVASS+rMni7MVt9k6sAODHWl71+Fnp2GrGyzrHZe8yWNbC9yZ/s1V4tPrxmG21djG+1lhuH5Y+rdSjNX0HNzgK+pyw6IdKwz7Ze/82sfjJhdYBYLyycoHUhdWhNXuPSYcv28rxCD6tk0drGr2rPRmIbKvBcczMWrmyes9WP3svEVNBz7auODeeRq8mENlWj0f1aaWz9a+IWglgWylemflWCzIQ2RYVvU6tSrV21I/yKDJ6V6s36rhcSygdYQWOrFKJXrTU9Vc7VjNdPtSEL9dq8AncKC+E3ViycxcerV7ZhnMjQoprXXEX0jwO6UDkWnT0urTUvTEbIqS41u5hzV8XhQ4sOnodWrm6bepMHNiWNaPIQGRamuh1ZZVEHNKBaMlS98fYt7aa6HVh6eKQDERLVqhYkXUrw+jdkZayRs+0dHFILgVYstS356F1C6O3oy1lhMi08MUkucGYCA62lfu1Jmu9I6tSfphD5XjAhtzCpwYH2yr9Whm56zdWdvLyrBq3IVMRRYUUz9LHoSurJbf9bpS98jyrQIv+LkENKZ6lj0NHVk5vdFensXYsgiJCimdh9J60Vjf/aZ6V62KDCI5vYx0wejPNhwlKSLGsexzSsUEEx7exavztVvNlghJSLKv5IqKI4Pg2FkZvrvsWRwkpltXLcbT2k7DAstVoI4oIKb7VaD+EmAcHy2plMniy8GCZ9tupeUjxrUls/ALtnB6STY9hvwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wNi0yOFQxNDowNzo0OCswOTowMJsmhhoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDYtMDZUMTg6MTI6NDArMDk6MDCQN7vSAAAAAElFTkSuQmCC";
                    
                    context.drawImage(
                        silhouette,
                        Number(object.left),
                        Number(object.top),
                        Number(object.right) - Number(object.left),
                        Number(object.bottom) - Number(object.top)
                    );
                    
                    context.restore();
                }
            });
        }
    }
}

function GetCookie(name) {
    var result = null;

    var cookieName = name + '=';
    var allcookies = document.cookie;

    var position = allcookies.indexOf(cookieName);
    if(position != -1) {
        var startIndex = position + cookieName.length;

        var endIndex = allcookies.indexOf(';', startIndex);
        if(endIndex == -1) {
            endIndex = allcookies.length;
        }

        result = decodeURIComponent(
            allcookies.substring(startIndex, endIndex));
    }

    return result;
}

function getUpdateDateTime() {
    // ロケールを取得
    let locale = getLocale();

    // ロケールに合わせた形式で時刻を設定
    let now = new Date();
    now.setTime(now.getTime()); // ブラウザ側のロケールでの時刻

    const year  = now.getFullYear();
    const month = now.getMonth();
    const day   = now.getDate();
    const hour  = now.getHours();
    const min   = now.getMinutes();
    const sec   = now.getSeconds();

    let dispTime;
    switch(locale) {
        case "ja":
            dispTime = '最終更新：' + year + '/' + (month + 1) + '/' + day + ' ' + hour + ':' + ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2);
            break;

        case "en":
            dispTime = (month + 1) + '/' + day + '/' + year +  ' ' + hour + ':' + ('00' + min).slice(-2) + ':' + ('00' + sec).slice(-2) + ' Updated';
            break;
    }

    return dispTime;
}

function getLocale() {
    // クエリパラメタをオブジェクトとして取得する
    let param = window.location.search; // クエリパラメタ文字列
    let variables = []; // forEachが呼び出せるようにからの配列で初期化 
    if (param) {
        variables = param.split("?")[1].split("&");
    }
    let variableObj = {};
    variables.forEach( function(v, i) {
        const variable = v.split("=");
        variableObj[variable[0]] = variable[1];
    });

    // ロケールを取得
    let locale = variableObj.locale;
    if (!locale) {
        // ロケールが設定されていない場合は日本語
        locale = "ja";
    }

    return locale;
}

// ws接続
// function wsopen(uri) {
//     if (webSocket === null) {
//         // 初期化
//         webSocket = new WebSocket(uri);
//         // イベントハンドラ
//         webSocket.onopen = function(ev) {
//             //console.log("Connect..");
//         };

//         webSocket.onmessage = function(ev) {
//             if (ev && ev.data) {
//                 data = JSON.parse(ev.data);
                
//                 editDisplayData(data);
//                 drawMap(data);
//             }
//         };

//         webSocket.onclose = function(ev) {
//             //console.log("disconnect(" + ev.code + ")");
//             webSocket = null;
//         };

//         webSocket.onerror = function(ev) {
//             console.log("Error " + ev);
//         };
//     }
// }

// // ws切断
// function wsclose() {
//     if ( webSocket && webSocket.readyState === 1 ) {
// 	    webSocket.close();
// 	}
// }

// function editDisplayData(data) {
//     // 更新時刻
//     const dispTime = getUpdateDateTime();
                       
//     let updateTime = document.getElementById('update-time');
//     updateTime.innerText = dispTime;
    
//     // 一覧テーブルの編集
//     const dict = {
//         ja: {
//             using: "使用中",
//             vacant: "空室",
//             start: "使用開始",
//             end: "前回終了",
//             unit: "人"
//         },
//         en: {
//             using: "Using",
//             vacant: "Vacant",
//             start: "Start at",
//             end: "End at",
//             unit: ""
//         }
//     };
    
//     let locale = getLocale();
//     // ロケールが指定されていない時は日本語
//     if (!locale) {
//         locale = "ja";
//     }
    
//     // 想定していないロケールの時は日本語
//     if (!dict[locale]) {
//         locale = "ja";
//     }
    
//     roomIds = Object.keys(data);
//     roomIds.forEach(function(roomId) {
//         if (data[roomId].count > 0) {
//             document.getElementById(roomId + '-status').innerText = dict[locale].using + ' (' + data[roomId].count + dict[locale].unit + ')';
//             document.getElementById(roomId + '-time').innerText = dict[locale].start + ' ' + data[roomId].lastStart;
//             document.getElementById(roomId + '-status').parentElement.className = '';
//         } else {
//             document.getElementById(roomId + '-status').innerText = dict[locale].vacant;
//             document.getElementById(roomId + '-time').innerText = dict[locale].end + ' ' + data[roomId].lastEnd;
//             document.getElementById(roomId + '-status').parentElement.className = 'table-success';
//         }
//     });
// }

function drawMap(data) {
    // canvas
    var canvas = document.getElementById('map-canvas');
    if (canvas !== null) {
        var context = canvas.getContext('2d');
        
        // canvas.width = 800;
        // canvas.height = 400;
        
        // 外側の枠線
        context.strokeStyle = "rgb(100, 100, 100)";
        context.lineWidth = 4;
        context.strokeRect(0, 0, canvas.width, canvas.height);
        
        context.font = "bold 40px 'arial'";
        
        // K2A
        drawMtgBox(context, 'K2A', [23, 20, 197, 180], [77, 125]);
        
        // K2B
        drawMtgBox(context, 'K2B', [23, 199, 197, 180], [77, 304]);
        
        // K2C 上段の基準となるBox
        const k2cBox = [312, 61, 94, 160];
        const k2cText = [315, 154];
        drawMtgBox(context, 'K2C', k2cBox, k2cText);
        
        // K2D
        const k2dBox = [k2cBox[0] + k2cBox[2], k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
        const k2dText = [k2cText[0] + k2cBox[2], k2cText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2D', k2dBox, k2dText);
        
        // K2E
        const k2eBox = [k2cBox[0] + k2cBox[2]*2, k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
        const k2eText = [k2cText[0] + k2cBox[2]*2, k2cText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2E', k2eBox, k2eText);
        
        // K2F
        const k2fBox = [k2cBox[0] + k2cBox[2]*3, k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
        const k2fText = [k2cText[0] + k2cBox[2]*3, k2cText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2F', k2fBox, k2fText);
        
        // K2G
        const k2gBox = [k2cBox[0] + k2cBox[2]*4, k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
        const k2gText = [k2cText[0] + k2cBox[2]*4, k2cText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2G', k2gBox, k2gText);
        
        // K2H 下段の基準となるBox
        const k2hBox = [k2cBox[0], k2cBox[1] + k2cBox[3], k2cBox[2], k2cBox[3]]; // heightのぶんだけ下にずらす
        const k2hText = [k2cText[0], k2cText[1] + k2cBox[3]];  // heightのぶんだけ下にずらす
        drawMtgBox(context, 'K2H', k2hBox, k2hText);
        
        // K2I
        const k2iBox = [k2hBox[0] + k2hBox[2], k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
        const k2iText = [k2hText[0] + k2hBox[2], k2hText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2I', k2iBox, k2iText);
        
        // K2J
        const k2jBox = [k2hBox[0] + k2hBox[2]*2, k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
        const k2jText = [k2hText[0] + k2hBox[2]*2, k2hText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2J', k2jBox, k2jText);
        
        // K2K
        const k2kBox = [k2hBox[0] + k2hBox[2]*3, k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
        const k2kText = [k2hText[0] + k2hBox[2]*3, k2hText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2K', k2kBox, k2kText);
        
        // K2L
        const k2lBox = [k2hBox[0] + k2hBox[2]*4, k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
        const k2lText = [k2hText[0] + k2hBox[2]*4, k2hText[1]];  // widthのぶんだけ右にずらす
        drawMtgBox(context, 'K2L', k2lBox, k2lText);
    }
}

function drawMtgBox(context, roomId, rect, textCoord) {
    // 外枠
    context.strokeStyle = "rgb(0, 0, 0)";
    context.lineWidth = 3;
    context.strokeRect(rect[0], rect[1], rect[2], rect[3]);
    
    // 塗りつぶし
    if (data[roomId].count > 0) {
        context.fillStyle = "rgb(200, 200, 200)";
    } else {
        context.fillStyle = "rgb(195, 230, 203)";
    }
    context.lineWidth = 0;
    context.fillRect(rect[0] + 2, rect[1] + 2, rect[2] - 4, rect[3] - 4);
    
    context.fillStyle = "rgb(0, 0, 0)";
    context.fillText(roomId, textCoord[0], textCoord[1]);
}

function getChangedTime(timeToBack) {
    let date = new Date();
    date.setDate(date.getDate() + timeToBack);
    return date.getFullYear() + '.' + zeroPadding(date.getMonth() + 1, 2) + '.' + zeroPadding(date.getDate(), 2)
}

function updateLocalStrage(areaId, count) {
    let date = new Date();
    console.log(areaId + ' : ' + count)

    if(localStorage.getItem(areaId)) {
        let data = JSON.parse(localStorage.getItem(areaId));

        // 10,13,16時のみ保存、すでに値がある場合は上書きしない
        let numOfPeriod = parseInt(date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2));
        for(let k in Object.keys(data)) {
            if(parseInt(k) !== numOfPeriod) {
                if(date.getHours() === 10 || date.getHours() === 13 || date.getHours() === 16) {
                    data[date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2)] = count
                } else {
                    // 今回は保存しない時間帯
                    console.log('kitakore');
                    data[date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2)] = count
                }
            } else { console.log(date.getHours() + '時代はすでに保存されています。') }
        }

        // dataから1カ月より以前のデータを削除
        date.setMonth(date.getMonth() - 1);
        numOfPeriod = parseInt(date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2));
        for(let k in Object.keys(data)) {
            if(parseInt(k) < numOfPeriod) {
                delete data[k];
            }
        }

        // localStorage.removeItem(areaId);
        localStorage.setItem(areaId, JSON.stringify(data));

    } else {
        let data = {}
        if(date.getHours() === 10 || date.getHours() === 13 || date.getHours() === 16) {
            data[date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2)] = count
            console.log(areaId + ':' + data[date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2)]);
        } else {
                                // 今回は保存しない時間帯
                                console.log('kitakore');
                                data[date.getFullYear() + zeroPadding(date.getMonth() + 1, 2) + zeroPadding(date.getDate(), 2) + zeroPadding(date.getHours(), 2)] = count
        }
        localStorage.setItem(areaId, JSON.stringify(data));
    }

}

function getChangedTimeArray(period) {
    let array = [];

    if(period === 'week') {
        for(let i = -6; i <= 0; i ++) {
            array.push(getChangedTime(i).split('.').join('') + '10');
            array.push(getChangedTime(i).split('.').join('') + '13');
            array.push(getChangedTime(i).split('.').join('') + '16');
        }
        return array;
    } else if('month') {
        // monthの処理
    } else {
        return array = ['no data'];
    }
}

function updateChart(areaId, period) {
    const data = JSON.parse(localStorage.getItem(areaId));

    let chartData = [];

    let array = getChangedTimeArray(period);

    // const canvas = document.createElement('canvas');

    // const areaIdDom = document.getElementById(areaId);
    // areaIdDom.getElementsByTagName('td')[1].innerText = '';
    // areaIdDom.getElementsByTagName('td')[1].appendChild(canvas);
    const chart = document.getElementById('chart');
    chart.width = '500px';
    chart.height = '300px';

    let ctx = chart.getContext('2d');
    // let width = canvas.clientWidth;
    let gradientStroke = ctx.createLinearGradient(47, 0, 558, 0);

    for(let i = 0; i < array.length; i ++) {
        chartData.push(data[array[i]] ? data[array[i]] : '');

        let pos = i/(array.length - 1)
        // if(pos - 0.025 > 0) { gradientStroke.addColorStop(pos - 0.025, '#e5f6fb') }
        gradientStroke.addColorStop(pos, data[array[i]] > 9 ? '#fee8de': '#e5f6fb')
        // if(pos + 0.025 < 1) { gradientStroke.addColorStop(pos + 0.025, '#e5f6fb') }

        gradientStroke.addColorStop(0, '#fee8de')
        gradientStroke.addColorStop(0.025, '#e5f6fb')

        // console.log(i/(array.length - 1))
    }

    let labels = [];
    if(period === 'week') {
        labels = [getChangedTime(-6),'','', getChangedTime(-5),'','', getChangedTime(-4),'','', getChangedTime(-3),'','', getChangedTime(-2),'','', getChangedTime(-1),'','', getChangedTime(0), '', '']
    } else if(period === 'month') {
        // monthの処理
    }

    let mainLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: chartData,
                backgroundColor: gradientStroke,
                pointBackgroundColor: 'rgba(18, 35, 64, 1)',
                borderColor: ['rgba(67, 88, 120, 1)'],
                borderWidth: 1.25,
                lineTension: 0,
                pointRadius: 2,
                pointHitRadius: 15,
                // cubicInterpolationMode: 'monotone',
                // fill: 'default',
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        // drawTicks: false,
                        display: false,
                        drawBorder: false
                    }
                }]
            },
            legend: {
                display: false // ラベル非表示
            },
            animation: {
                duration: 0,
                easing: 'easeOutQuad'
            }
        }
    });
}
