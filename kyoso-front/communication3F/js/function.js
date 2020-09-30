let populationList = 'real';

// 手前に0を追加して桁数を調整
// NUM=値 LEN=桁数
function zeroPadding(NUM, LEN){
    return ( Array(LEN).join('0') + NUM ).slice( -LEN );
}

function drawImage(image, canvasId) {
    // canvas
    var canvas = document.getElementById('image' + canvasId);
        
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
                    silhouette.src = "data:image/png;base64," + "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";
                    
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
function wsopen() {
    if (webSocket === null) {
        // 初期化
        webSocket = new WebSocket(uri);
        // イベントハンドラ
        webSocket.onopen = function(ev) {
            console.log("Connect..");
        };

        webSocket.onmessage = function(ev) {
            if (ev && ev.data) {
                var data = JSON.parse(ev.data);

                console.log('getMessage:' + data);

                displayData(data);

                setTimeout(function() {
                    const now = new Date();
                    const hour = now.getHours();
                    const min = now.getMinutes();
                    if ((hour === 11 && min >= 30) || (hour === 12) || ((hour === 13 && min < 30))) {
                        //screenShot(document.getElementById("counters"), "counters");
                        //screenShot(document.getElementById("sheets"), "sheets");
                    }
                }, 3000);
            }
        };

        webSocket.onclose = function(ev) {
            //console.log("disconnect(" + ev.code + ")");
            webSocket = null;
        };

        webSocket.onerror = function(ev) {
            console.log("Error " + ev);
        };
    }
}

// ws切断
function wsclose() {
    if ( webSocket && webSocket.readyState === 1 ) {
	    webSocket.close();
	}
}

function updateImage(url, num) {
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
                    var data = JSON.parse(xhr.responseText); // responseXML もあり
                    console.log( 'COMPLETE! :' + data );
                    displayData(data, num);
                } else {
                    console.log( 'Failed. HttpStatus: '+xhr.statusText );
                }
                break;
        }
    };

    xhr.open('GET', url, true);
    xhr.send();
}

function displayData(data, num) {
    // 更新時刻
    const dispTime = getUpdateDateTime();

    let updateTime = document.getElementById("update-time");
    updateTime.innerText = dispTime;

    // 画像の描画
    // var camIds = Object.keys(data.images);
    // camIds.forEach(function(camId) {
    //     if (data.hasOwnProperty('objects')) {
    //         //drawImageWithRects(data.images[camId], data.objects[camId], data.imageIds[camId], ["person"]);
    //         drawImageWithSilhouette(data.images[camId], data.objects[camId], data.imageIds[camId], ["person"]);
    //     } else {
    //         drawImage(data.images[camId], data.imageIds[camId]);
    //     }
    // });
    drawImage(data, num);

    // 待ち人数に応じて表の混雑度表示を変更する
    let counts = data.counts;

    // カウンターの表
    let counterTable = document.getElementById("counter-table");
    let counterTableRows = counterTable.getElementsByTagName("tr");

    if(populationList == 'real') {
        for (let i = 0; i < counterTableRows.length; i++) {
            let areaId = counterTableRows[i].id;
            let count = data.counts[areaId];

            // しきい値にエリアごとの値を渡す仕組みがほしい
            let congestion = getCongestionByPeopleNum(count, 5, 10);

            if(counterTableRows[i].getElementsByTagName("td")[1]) {
                let congestionCell = counterTableRows[i].getElementsByTagName("td")[1];
                congestionCell.classList.remove("table-success", "table-warning", "table-danger");
                congestionCell.classList.add(congestion.style);
                congestionCell.innerText = congestion.description;
            }
        }
    } else if(populationList == 'week') {
        for (let i = 0; i < counterTableRows.length; i++) {
            // let areaId = counterTableRows[i].id;
            // let count = data.counts[areaId];

            if(counterTableRows[i].getElementsByTagName("td")[1]) {
                let congestionCell = counterTableRows[i].getElementsByTagName("td")[1];
                congestionCell.classList.remove("table-success", "table-warning", "table-danger");
                congestionCell.classList.add('table-success'); // とりあえず
                congestionCell.innerHTML = '<img src="./img/pages/1F/graph1.png">'
            }
        }
    }


    // 座席の表
    let sheetTable = document.getElementById("sheet-table");
    let sheetTableRows = sheetTable.getElementsByTagName("tr");

    const thresholds = [
        [15, 30],
        [15, 30],
        [12, 24],
        [8, 15],
    ];

    if(populationList == 'real') {
        for (let i = 0; i < sheetTableRows.length; i++) {
            let areaId = sheetTableRows[i].id;
            let count = data.counts[areaId];

            // しきい値にエリアごとの値を渡す仕組みがほしい
            let congestion = getCongestionByPeopleNum(count, thresholds[i][0], thresholds[i][1]);

            let congestionCell = sheetTableRows[i].getElementsByTagName("td")[1];
            congestionCell.classList.remove("table-success", "table-warning", "table-danger");
            congestionCell.classList.add(congestion.style);
            congestionCell.innerText = congestion.description;
        }
    } else if(populationList == 'week') {
        for (let i = 0; i < sheetTableRows.length; i++) {
            // let areaId = sheetTableRows[i].id;
            // let count = data.counts[areaId];

            // // しきい値にエリアごとの値を渡す仕組みがほしい
            // let congestion = getCongestionByPeopleNum(count, thresholds[i][0], thresholds[i][1]);

            let congestionCell = sheetTableRows[i].getElementsByTagName("td")[1];
            congestionCell.classList.remove("table-success", "table-warning", "table-danger");
            congestionCell.classList.add("table-success"); // とりあえず
            congestionCell.innerHTML = '<img src ="./img/pages/1F/graph2.png">';
        }
    }


}

/*
 * 実際の人数としきい値から混雑度に対応したクラスと文字列を返す。
 * success,warning,dangerだと流石に訳が分からないので、本当はそれらのクラスと
 * 同等の役割を持ちつつ、意味のわかるクラスを作ったほうが良い。
 */
function getCongestionByPeopleNum(count, th1, th2) {
    const dict = {
        ja: {
            low: "空いてる",
            mid: "やや混んでる",
            high: "混んでる",
            unit: "人"
        },
        en: {
            low: "low",
            mid: "mid",
            high: "high",
            unit: ""
        },
    };

    let locale = getLocale();
    // ロケールが指定されていない時は日本語
    if (!locale) {
        locale = "ja";
    }

    // 想定していないロケールの時は日本語
    if (!dict[locale]) {
        locale = "ja";
    }
    
    let style = "";
    let description = "-";
    if (count < th1) {
        style = "table-success";
        description = dict[locale].low;
    } else if (count < th2) {
        style = "table-warning";
        description = dict[locale].mid;
    } else {
        style = "table-danger";
        description = dict[locale].high;
    }
    
    description += "　（" + count + dict[locale].unit + "）";
    
    let retVal = {
        style: style,
        description: description
    };
    
    return retVal;
}

