import cv2
import requests
import time
import base64
import numpy as np
import json

vs = []
for i in range(10, 20):
    vs.append(cv2.VideoCapture('rtsp://10.232.88.{}/stream3'.format(i)))

while True:
    files = {}
    for i in range(10, 20):
        g, f = vs[i-10].read()

        cv2.imwrite('10.232.88.{}_ori.jpg'.format(i), f)

        _, f = cv2.imencode('.jpg', f)
        f = f.tostring()

        files['10.232.88.{}'.format(i)] = f

    print('Start requests')
    results = requests.post('http://10.232.188.186:5000/person_detect_img'
                , json=files)

    json_results = results.json()
    for ip in json_results:
        results = json_results[ip]
        count = results['count']
        img = results['img']
        img = base64.b64decode(img)
        img = np.fromstring(img, 'uint8')
        img = cv2.imdecode(img, cv2.IMREAD_UNCHANGED)
        print(ip, count)

        cv2.imwrite('{}_sil.jpg'.format(ip), img)

    time.sleep(1)
