
var EVENT_TARGET = "mpsev";
var MAKE_FRAME_TARGET = "mkimg_withpose";
var SEARCH_TARGET = "sxframe";

var PARAM_CAMERA = "camid";
var DEFAULT_WIDTH = 320;
var DEFAULT_HEIGHT = 240;

var DEFAULT_NORMAL_FONT_SIZE = 15;
var DEFAULT_SMALL_FONT_SIZE = 10;

var show_face = false;
var show_head = false;
var show_track_id = false;

MPSEventViewer = function(_element, _cameraID, _keyword_info, _interval, _ratio) {
    
    var _this = this;
    
    this.element = _element;
    this.cameraID = _cameraID;
    this.interval = _interval;
    if (_ratio) {
        this.ratio = _ratio;
    }
    
    this.normal_font_size = parseInt(DEFAULT_NORMAL_FONT_SIZE * this.ratio,10);
    this.small_font_size = parseInt(DEFAULT_SMALL_FONT_SIZE * this.ratio,10);
    
    this.run = false;
    
    // canvas
    this.canvas_element = $('<canvas>');
    this.canvas_element[0].width = DEFAULT_WIDTH;
    this.canvas_element[0].height = DEFAULT_HEIGHT;
    
    // スペース
    var space_element = $('<span>&nbsp;</span>');
        
    // ボタン
    this.play_button_element = $('<button class="ui-corner-all" style="width: 50px"></button>');
    this.button_value_element = $('<span style="display: inline-block" class="ui-icon ui-icon-play">');
    this.play_button_element.append(this.button_value_element)
        
    this.play_button_element.click(function() {
        if (_this.run == false) {
            _this.run = true;
            _this.button_value_element.removeClass('ui-icon-play');
            _this.button_value_element.addClass('ui-icon-pause');
                        
            _this.eventListener(0);
            
        } else {
            _this.run = false;
            _this.button_value_element.addClass('ui-icon-play');
            _this.button_value_element.removeClass('ui-icon-pause');
        }
    });
    
    // セレクタ
    this.select_element = $('<select>');
    for (var i = 0; i < _keyword_info.EnraFDBKeywords.length; i++) {
    	var cam = _keyword_info.EnraFDBKeywords[i];
    	var s = ''
    	if (cam.id == _cameraID) {
    		s = 'selected';
    	}
    	var opt = '<option value="' + cam.id + '" ' + s + '>' + cam.id + ' : ' + cam.word + '</option>';
    	this.select_element.append(opt);
    	
    }
    this.select_element.change(function() {
    	_this.setCameraID(_this.select_element.val());
	});
    
    // メッセージ
    this.message_element = $('<div>');
    this.message_element.addClass('error');
    
    var ctl_element = $('<div>');
    ctl_element.append(this.select_element);
    ctl_element.append($('<br>'));
    ctl_element.append(this.play_button_element);
    ctl_element.append(this.message_element);
    
    this.element.addClass('parent');
    this.element.append(this.canvas_element);
    this.element.append(ctl_element);
       
    this.counter_object_element = $('<div>');
    this.counter_object_element.addClass('counter counter_object');
    this.element.append(this.counter_object_element);
    this.counter_head_element = $('<div>');
    this.counter_head_element.addClass('counter counter_head');
    this.element.append(this.counter_head_element);
    this.counter_face_element = $('<div>');
    this.counter_face_element.addClass('counter counter_face');
    this.element.append(this.counter_face_element);
    
    var cond = "`IntEq(camera_id,Int(" + _this.cameraID + "))";
    var params = {"c": cond, "rt": "application/json", "op": "1", "ps": "1"};
    //var data = this.searchFrame(params);
    data = getEnraResponse(SEARCH_TARGET, params)
    if (data) {
        
        if ((data.EnraFDBSamples.length > 0) && (data.EnraFDBSamples[0].id)) {
            var mpsEvent = {};
            mpsEvent.frameId = data.EnraFDBSamples[0].id;
            mpsEvent.objectList = [];
            mpsEvent.time = new Date();
            this.makeImage(mpsEvent);
        }
    }
};

MPSEventViewer.prototype.setCameraID = function(camera_id) {
	this.cameraID = camera_id;
};

MPSEventViewer.prototype.makeImage = function(mpsEvent) {
    
    var _this = this;
    var image = new Image();
    
    image.onload = function() {
        var w = image.width;
        var h = image.height;
        //var ratio = (w >= h) ? w : h;
        var canvaswidth = w;
        var canvasheight = h;
        var canvas = _this.canvas_element[0];
        canvaswidth = canvaswidth * _this.ratio;
        canvasheight = canvasheight * _this.ratio;
        canvas.width = canvaswidth;
        canvas.height = canvasheight;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, canvaswidth, canvasheight);
        ctx.fillStyle = 'white';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 2;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        
        // カメラID描画
        ctx.font = "bold " + _this.normal_font_size + "pt 'ＭＳ ゴシック'";
        var str_width = _this.normal_font_size * ('' + _this.cameraID).length;
        ctx.fillText(_this.cameraID, (canvaswidth - str_width - 10), 10);
        
        // 時間描画
        ctx.font = "bold " + _this.small_font_size + "pt 'ＭＳ ゴシック'";
        var date = new Date(mpsEvent.time);
        var df = new DateFormat('YYYY/MM/DD hh:mm:ss.SSS');
        ctx.fillText(df.format(date),10,10);
        
        _this.clearRectangle();
        _this.writeRectangleData(mpsEvent);
        _this.eventListener((parseInt(mpsEvent.time, 10) + 1));
    }
    image.src = MAKE_FRAME_TARGET + "?" + "id=" + mpsEvent.frameId + "&rnd=" +  new Date().getTime();
}

/**
 * @param rect : [[left, top, width, height],[left, top, width, height],.....]
 */
MPSEventViewer.prototype.writeRectangleData = function(mpsEvent) {
    
    var _this = this;
    
    if (mpsEvent.objectList) {
        var objectList = mpsEvent.objectList;
        
        for (var i = 0; i < objectList.length; i++) {
            var x = parseInt(objectList[i].rect[0],10) * this.ratio;
            var y = parseInt(objectList[i].rect[1],10) * this.ratio;
            var w = (parseInt(objectList[i].rect[2], 10) - parseInt(objectList[i].rect[0], 10)) * this.ratio;
            var h = (parseInt(objectList[i].rect[3], 10) - parseInt(objectList[i].rect[1], 10)) * this.ratio;
            
            var rect_element = $('<div>');
            var n = objectList[i].track_id % 10;
            var rect_color = 'rect_object_' + n;
            rect_element.addClass('rect rect_object');
            rect_element.addClass(rect_color);
            rect_element.css({left: x, top: y});
            rect_element.width(w);
            rect_element.height(h);
            if (show_track_id) {
            	rect_element.html(objectList[i].track_id);
            }
            /*rect_element.click(function() {
                //_this.message_element.text('[INFO] ' + this.offsetLeft + ',' + this.offsetTop + "," + this.clientWidth + "," + this.clientHeight);
                var ctx = _this.canvas_element[0].getContext('2d');
                var img = ctx.getImageData(this.offsetLeft, this.offsetTop, this.clientWidth, this.clientHeight);
                $('#obj')[0].width = img.width;
                $('#obj')[0].height = img.height;
                var ctx2 = $('#obj')[0].getContext('2d');
                ctx2.putImageData(img,0,0);
            });*/
            this.element.append(rect_element);
            
            if (show_head) {
	            if (objectList[i].head) {
	                var rect = objectList[i].head.rect;
	                this.writeRect(rect, 'rect rect_head');
	            }
            }
            if (show_face) {
	            if (objectList[i].face) {
	                var rect = objectList[i].face.rect;
	                this.writeRect(rect, 'rect rect_face');
	            }
            }
        }
    }
    
    if (mpsEvent.anomalyRectList) {
        for (var j = 0; j < mpsEvent.anomalyRectList.length; j++) {
            var rect = mpsEvent.anomalyRectList[j].rect;
            this.writeRect(rect, 'rect rect_anomaly');
        }
    }
};

MPSEventViewer.prototype.writeRect = function(rect, label) {
    x = parseInt(rect[0],10) * this.ratio;
    y = parseInt(rect[1],10) * this.ratio;
    w = (parseInt(rect[2], 10) - parseInt(rect[0], 10)) * this.ratio;
    h = (parseInt(rect[3], 10) - parseInt(rect[1], 10)) * this.ratio;
    var rect_element = $('<div>');
    rect_element.addClass(label);
    rect_element.css({left: x, top: y});
    rect_element.width(w);
    rect_element.height(h);
    this.element.append(rect_element);
}

MPSEventViewer.prototype.clearRectangle = function() {
    this.element.find('.rect_object').remove();
    this.element.find('.rect_face').remove();
    this.element.find('.rect_head').remove();
    this.element.find('.rect_anomaly').remove();
};

MPSEventViewer.prototype.eventListener = function(lastTime) {
    
    if (!this.run)
        return;
    
    var _this = this;
    $.ajax({
        type: "post",
        url: EVENT_TARGET + "?cam=" + _this.cameraID + "&lt=" + lastTime,
        dataType: "json",
        async: true,
        timeout: 10000,
        error: function (xhr, status, e) {
            //console.error(xhr.responseText);
            //_this.clearRectangle();
            if (status != 'timeout') {
                //_this.message_element.text('[ERROR] ' + status);
                _this.eventListener(lastTime);
            } else {
                window.setTimeout(_this.eventListener(lastTime), _this.interval);
            }
        },
        success: function (data, status, xhr) {
            //console.log(xhr.responseText);
            //console.log(data.enraAttributes.mpsEvent.time);
            if (data.status == "FAILED") {
                //_this.message_element.text('[ERROR] ' + data.enraHeader.acceptTime + ' : ' + data.enraHeader.message);
                //_this.eventListener(lastTime);
                window.setTimeout(_this.eventListener(lastTime), _this.interval);
            } else {
                if (data.mpsEvent.time == -1) {
                	window.setTimeout(_this.eventListener(lastTime), _this.interval);
                	//_this.eventListener(lastTime);
                } else {
                    _this.makeImage(data.mpsEvent);
                    
                    _this.recordCounter('sxobject');
                    if (show_head) {
                    	_this.recordCounter('sxhead');
                    }
                    if (show_face) {
                    	_this.recordCounter('sxface');
                    }
                }
            }
        }
    });
};

MPSEventViewer.prototype.recordCounter = function(label) {
    
    var _this = this;
    
    $.ajax({
        type: "post",
        url: label + "?pcond=`IntEq(camera_id,Int(" + _this.cameraID + "))&op=1",
        dataType: "json",
        async: true,
        timeout: 5000,
        error: function (xhr, status, e) {
            if (status != 'timeout') {
                //_this.message_element.text('[ERROR] ' + status);
            }
        },
        success: function (data, status, xhr) {
            //console.log(xhr.responseText);
            //console.log(data.enraAttributes.mpsEvent.time);
            if (data.status == "FAILED") {
                //_this.message_element.text('[ERROR] ' + data.accept + ' : ' + data.message);
            } else {
                var h = _this.canvas_element[0].height;
                var row = 24;
                var cnt = 1;
                if (show_head && show_face) { 
                	cnt = 3;
                } else {
                	if (show_head || show_face) {
                		cnt = 2;
                	}
                }
                if (label == 'sxobject') {
                    _this.counter_object_element.css({left: 10, top: (h - (row * cnt * _this.ratio))});
                    _this.counter_object_element.css("fontSize",_this.small_font_size + 'pt');
                    _this.counter_object_element.text('[OBJECT] ' + data.EnraFDBSSInfo.sample_size);
                }
                if (show_head && show_face) { 
                	cnt = 2;
                } else {
                	if (show_head) {
                		cnt = 1;
                	}
                }
                if (label == 'sxhead') {
                    _this.counter_head_element.css({left: 10, top: (h - (row * cnt * _this.ratio))});
                    _this.counter_head_element.css("fontSize",_this.small_font_size + 'pt');
                    _this.counter_head_element.text('[ HEAD ] ' + data.EnraFDBSSInfo.sample_size);
                }
                if (show_face) { 
                	cnt = 1;
                }
                if (label == 'sxface') {
                    _this.counter_face_element.css({left: 10, top: (h - (row * cnt * _this.ratio))});
                    _this.counter_face_element.css("fontSize",_this.small_font_size + 'pt');
                    _this.counter_face_element.text('[ FACE ] ' + data.EnraFDBSSInfo.sample_size);
                }
            }
        }
    });
};

/*MPSEventViewer.prototype.searchFrame = function(params) {
    
    var _this = this;
    var ret;
    $.ajax({
        type: "post",
        url: SEARCH_TARGET,
        data: params,
        dataType: "json",
        async: false,
        timeout: 1000,
        error: function (xhr, status, e) {
            if (status != 'timeout') {
                //_this.message_element.text('[ERROR] ' + status);
            }
        },
        success: function (data, status, xhr) {
            if (data.status == "FAILED") {
                //_this.message_element.text('[ERROR] ' + data.accept + ' : ' + data.message);
            } else {
                ret = data;
            }
        }
    });
    return ret;    
};*/


