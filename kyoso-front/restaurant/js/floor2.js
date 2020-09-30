

// ws接続
function wsopen() {
    if (webSocket === null) {
        // 初期化
        webSocket = new WebSocket(uri);
        // イベントハンドラ
        webSocket.onopen = function(ev) {
            //console.log("Connect..");
        };

        webSocket.onmessage = function(ev) {
            if (ev && ev.data) {
                data = JSON.parse(ev.data);
                
                editDisplayData(data);
                drawMap(data);
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

function editDisplayData(data) {
    // 更新時刻
    const dispTime = getUpdateDateTime();
                       
    let updateTime = document.getElementById('update-time');
    updateTime.innerText = dispTime;
    
    // 一覧テーブルの編集
    const dict = {
        ja: {
            using: "使用中",
            vacant: "空室",
            start: "使用開始",
            end: "前回終了",
            unit: "人"
        },
        en: {
            using: "Using",
            vacant: "Vacant",
            start: "Start at",
            end: "End at",
            unit: ""
        }
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
    
    roomIds = Object.keys(data);
    roomIds.forEach(function(roomId) {
        if (data[roomId].count > 0) {
            document.getElementById(roomId + '-status').innerText = dict[locale].using + ' (' + data[roomId].count + dict[locale].unit + ')';
            document.getElementById(roomId + '-time').innerText = dict[locale].start + ' ' + data[roomId].lastStart;
            document.getElementById(roomId + '-status').parentElement.className = '';
        } else {
            document.getElementById(roomId + '-status').innerText = dict[locale].vacant;
            document.getElementById(roomId + '-time').innerText = dict[locale].end + ' ' + data[roomId].lastEnd;
            document.getElementById(roomId + '-status').parentElement.className = 'table-success';
        }
    });
}

function drawMap(data) {
    // canvas
    var canvas = document.getElementById('map-canvas');
    if (canvas !== null) {
        var context = canvas.getContext('2d');
        
        canvas.width = 800;
        canvas.height = 400;
        
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