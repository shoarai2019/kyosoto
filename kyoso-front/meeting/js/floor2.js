function editDisplayData(data) {
  // 更新時刻
  const dispTime = getUpdateDateTime();

  let updateTime = document.getElementById("update-time");
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
      document.getElementById(roomId + "-status").innerText =
        dict[locale].using +
        " (" +
        data[roomId].count +
        dict[locale].unit +
        ")";
      document.getElementById(roomId + "-time").innerText =
        dict[locale].start + " " + data[roomId].lastStart;
      document.getElementById(roomId + "-status").parentElement.className = "";
    } else {
      document.getElementById(roomId + "-status").innerText =
        dict[locale].vacant;
      document.getElementById(roomId + "-time").innerText =
        dict[locale].end + " " + data[roomId].lastEnd;
      document.getElementById(roomId + "-status").parentElement.className =
        "table-success";
    }
  });
}

function drawMap(data) {
  // canvas
  const canvas = document.getElementById("map-canvas");
  if (canvas !== null) {
    let context = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 400;

    // 外側の枠線
    context.strokeStyle = "rgb(100, 100, 100)";
    context.lineWidth = 4;
    context.strokeRect(0, 0, canvas.width, canvas.height);

    context.font = "bold 40px 'arial'";

    // K2A
    drawMtgBox(context, "K2A", [23, 20, 197, 180], [77, 125], data);

    // K2B
    drawMtgBox(context, "K2B", [23, 199, 197, 180], [77, 304], data);

    // K2C 上段の基準となるBox
    const k2cBox = [312, 61, 94, 160];
    const k2cText = [315, 154];
    drawMtgBox(context, "K2C", k2cBox, k2cText, data);

    // K2D
    const k2dBox = [k2cBox[0] + k2cBox[2], k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
    const k2dText = [k2cText[0] + k2cBox[2], k2cText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2D", k2dBox, k2dText, data);

    // K2E
    const k2eBox = [k2cBox[0] + k2cBox[2] * 2, k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
    const k2eText = [k2cText[0] + k2cBox[2] * 2, k2cText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2E", k2eBox, k2eText, data);

    // K2F
    const k2fBox = [k2cBox[0] + k2cBox[2] * 3, k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
    const k2fText = [k2cText[0] + k2cBox[2] * 3, k2cText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2F", k2fBox, k2fText, data);

    // K2G
    const k2gBox = [k2cBox[0] + k2cBox[2] * 4, k2cBox[1], k2cBox[2], k2cBox[3]]; // widthのぶんだけ右にずらす
    const k2gText = [k2cText[0] + k2cBox[2] * 4, k2cText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2G", k2gBox, k2gText, data);

    // K2H 下段の基準となるBox
    const k2hBox = [k2cBox[0], k2cBox[1] + k2cBox[3], k2cBox[2], k2cBox[3]]; // heightのぶんだけ下にずらす
    const k2hText = [k2cText[0], k2cText[1] + k2cBox[3]]; // heightのぶんだけ下にずらす
    drawMtgBox(context, "K2H", k2hBox, k2hText, data);

    // K2I
    const k2iBox = [k2hBox[0] + k2hBox[2], k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
    const k2iText = [k2hText[0] + k2hBox[2], k2hText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2I", k2iBox, k2iText, data);

    // K2J
    const k2jBox = [k2hBox[0] + k2hBox[2] * 2, k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
    const k2jText = [k2hText[0] + k2hBox[2] * 2, k2hText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2J", k2jBox, k2jText, data);

    // K2K
    const k2kBox = [k2hBox[0] + k2hBox[2] * 3, k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
    const k2kText = [k2hText[0] + k2hBox[2] * 3, k2hText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2K", k2kBox, k2kText, data);

    // K2L
    const k2lBox = [k2hBox[0] + k2hBox[2] * 4, k2hBox[1], k2hBox[2], k2hBox[3]]; // widthのぶんだけ右にずらす
    const k2lText = [k2hText[0] + k2hBox[2] * 4, k2hText[1]]; // widthのぶんだけ右にずらす
    drawMtgBox(context, "K2L", k2lBox, k2lText, data);
  }
}

function drawMtgBox(context, roomId, rect, textCoord, data) {
  // 外枠
  context.strokeStyle = "rgb(0, 0, 0)";
  context.lineWidth = 3;
  context.strokeRect(rect[0], rect[1], rect[2], rect[3]);

  if (data && data[roomId].count > 0) {
    // load image
    const img = new Image();
    img.src = "./img/pages/2F/people.png";

    img.onload = function() {
      // canvas.width = img.width;
      // canvas.height = img.height;
      context.drawImage(img, rect[0] + rect[2] / 2 - img.width / 2, textCoord[1]);
    }

    // 塗りつぶし
    context.fillStyle = "rgb(255, 235, 226)";
  } else {
    context.fillStyle = "rgb(255, 255, 255)";
  }

  context.lineWidth = 0;
  context.fillRect(rect[0] + 2, rect[1] + 2, rect[2] - 4, rect[3] - 4);

  context.fillStyle = "rgb(0, 0, 0)";
  context.fillText(roomId, textCoord[0], textCoord[1] - 30);
}

function displayGraph(data) {
  let countOfUsing = 0;
  Object.keys(data).forEach(function(k) {
    data[k].count > 0 ? countOfUsing ++ : ''
  })

  document.getElementById('count').innerText = countOfUsing;
  document.getElementById('use-rate').innerText = countOfUsing / 12 * 100 + '%';

  // チャート描画
  const img = new Image();
  img.src = "./img/pages/2F/people2.png";
  let drawImagePlugin = {
    afterDraw: function(c) {
      let context = document.getElementById('myChart').getContext('2d');
      let xPos = 138 - img.width;
      let yPos = 135 - img.height;
      context.drawImage(img, xPos, yPos, 65, 65);
    }
  }
  Chart.pluginService.register(drawImagePlugin);

  img.onload = function() {
    // canvas.width = img.width;
    // canvas.height = img.height;
    const ctx = document.getElementById('myChart');
    ctx.width = 180;
    ctx.height = 155;

    new Chart(ctx, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [{
          backgroundColor: [
            '#ffab85',
            '#e1ecef'
          ],
          data: [countOfUsing, 12 - countOfUsing],
          padding: 0
        }]
      },
      options: {}
    });
  }
}
