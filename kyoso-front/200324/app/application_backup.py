import json
from flask import Flask, render_template, request
import gevent
from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler
import configparser
import cv2
import base64
import numpy as np
import multiprocessing
# librarys for analyzing
from lib.tracking import Tracking
from lib.transformer import Yolov3Transformer
from lib.yolov3_detector import Yolov3Detector
# import for debug
import datetime

# instantiate self as name of 'app'
app = Flask(__name__)

# read config
config_path = 'config.ini'
config = configparser.ConfigParser()
config.read(config_path)

# instantiate analysis module
#tracking = Tracking(config) # if using websocket
yolov3 = Yolov3Detector(config)
yolov3_transformer = Yolov3Transformer(
    config.getint('yolov3', 'input_size'), config.getint('yolov3', 'input_size')
)

# multi processing
pool = multiprocessing.Pool(config.getint('tracking', 'n_processes'))

# switch
person_detect_is_active = False

# routing
@app.route('/')
def index():
    title = 'How to Use'

    return render_template('index.html', title=title)

@app.route('/person_detect', methods=["GET", "POST"])
def person_detect():
    # if using websocket
    '''if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']

        # send config
        camera_urls = config.get('camera', 'urls').split(',')
        ws.send(json.dumps({'cameraUrls': camera_urls}))

        while True:
            #if person_detect_is_active:
            tracking_results, silhouette_frames = tracking.update()

            results = [result.tolist() for result in tracking_results]
            frames = [base64.b64encode(cv2.imencode('.png', frame)[1]).decode('utf-8') for frame in silhouette_frames]
            
            ret_val = {'results': results, 'frames': frames}
            ws.send(json.dumps(ret_val))

            # wait if needed
            gevent.sleep(1)'''
    
    #elif request.method == 'POST':
    result_object = {}
    if request.method == 'POST':
        if len(request.files) > 0:
            frames = [cv2.imdecode(np.fromstring(request.files[filename].read(), np.uint8), cv2.IMREAD_UNCHANGED)
                        for filename in request.files]

            results = pool.map_async(yolov3_transformer, frames)
            transformed_frames = results.get()
            transformed_frames = np.concatenate(transformed_frames, axis=0)
            
            confidences, labels, boxes = yolov3(transformed_frames)

            for frame, frame_boxes in zip(frames, boxes):
                height, width = frame.shape[:2]
                frame_boxes[:, ::2] *= width
                frame_boxes[:, 1::2] *= height

            result_list = [{'probs': frame_confidences.tolist(), 'boxes': frame_boxes.tolist()}
                            for frame_confidences, frame_boxes in zip(confidences, boxes)]

            for cam_id, result in zip(request.files, result_list):
                result_object[cam_id] = result

    return json.dumps(result_object)

@app.route('/person_detect_switch')
def person_detect_switch():
    if request.environ.get('wsgi.websocket'):
        ws = request.environ['wsgi.websocket']

        while True:
            src = ws.receive()
            if src is not None:
                global person_detect_is_active
                person_detect_is_active = not person_detect_is_active

if __name__ == '__main__':
    app.debug = True
    server = pywsgi.WSGIServer(
        ("0.0.0.0", 5000), # host, port
        app,
        handler_class=WebSocketHandler)
    server.serve_forever()

    #app.run(host='0.0.0.0')