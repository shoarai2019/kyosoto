// 接続先URI 1F食堂
const restUri = "ws://" + "10.232.188.186:1880" + "/ws_workers_cafeteria";

// 前回のip
// 10.232.233.121:1880

// 接続先URI 1Fカフェ
const cafeUri = "http://10.232.233.59/eki-shi/k125.jpg";


// 混雑度判定値
const congestionJuValue = {
    counterNoodleA : 9, // そば・うどん
    counterNoodleB : 9, // ラーメン
    counterCurry : 9, // カレー
    counterSpecial : 9, // スペシャル
    counterSetMeal : 9 // 定食
}

// 接続先URI 2F
const meetingUri = "ws://" + "10.232.188.186:1880" + "/ws_workers_meetingroom"; // ← [output] websocket の path に合わせる

const projectUri = "http://tof-people-sensing.crl.hitachi.co.jp:8001/sampledata/";
//const projectUri = "http://10.232.89.206:1880";
// const projectUri = "http://tof-people-sensing.crl.hitachi.co.jp:8001/visualizor/";

// 10-19
const camera3f = {
    1: "http://10.232.88.10/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    2: "http://10.232.88.11/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    3: "http://10.232.88.12/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    4: "http://10.232.88.13/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    5: "http://10.232.88.14/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
}

// 40-58
const camera4f = {
    1: "http://10.232.88.40/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    2: "http://10.232.88.41/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    3: "http://10.232.88.42/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    4: "http://10.232.88.43/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
    5: "http://10.232.88.44/cgi-bin/viewer/video.jpg?streamid=2&auality=5",
}
