/**
 * enra-commons.js
 * Enra共通ライブラリ
 * 
 * @version	3.0
 * @author	uda
 * @see		jquery.js
 * @see 	BooleanQuery.js
 */

//prototype==================================================================//
/**
 * Date.lastDayOfMonth()
 * その月の最終日を表示する。
 * @return その月の最終日
 */
Date.prototype.lastDayOfMonth = function() {
	var d = new Date (this.getYear(), this.getMonth() + 1, 1);
	d.setTime(d.getTime() - 1);
	return d.getDate();
}

/**
 * Array.contains(value)
 * valueが配列に含まれているか判定する。
 * @param value
 * @return true(含まれている)／false(含まれていない)
 */
/*Array.prototype.contains = function(value){
    for(var i in this){
        if( this.hasOwnProperty(i) && this[i].toString() === value.toString()){
        	return true;
        }
    }
    return false;
}*/

/**
 * String.trim()
 * 文字列から空白を除去する。
 * @return 空白を除去した文字列
 */
String.prototype.trim = function() {
	return this.replace(/^\s+|\s+$/g, "");
}

/**
 * String.encodeHTML()
 * 文字列内のhtml特殊文字を置換する。
 * @return html特殊文字で置換した文字列
 */
String.prototype.encodeHTML = function() {
	return this.replace(/&/ig, "&amp;")
				.replace(/</ig, "&lt;")
				.replace(/>/ig, "&gt;")
				.replace(/"/ig, "&quot;")
				.replace(/ /ig, "&nbsp;");
}

/**
 * String.replaceAll()
 * 文字列中の検索文字列をすべて置換する。
 * @param substr : 検索文字列
 * @param newstr : 置換文字列
 * @return 文字列中の検索文字列を全置換した文字列
 */
String.prototype.replaceAll = function (substr, newstr) {  
	return this.split(substr).join(newstr); 
}



/**
 * Element(Select).setOptions(start, end)
 * Selectエレメントにstart〜endまでのOptionエレメントを追加する。
 * @param start : 初期値
 * @param end : 終値
 */
/*Element.prototype.setOptions = function(start, end) {
	if (this.type.match(/^select/i)) {
		if (isNumeric(start) && isNumeric(end)) {
			for (var i = start, j = 1; i <= end; i++, j++) {
				this.options[j] = new Option(i, i); 
			}
		}
	}
}*/



//class==================================================================//
/**
 * URLクラス
 * インスタンス生成時に渡された文字列からURLの情報を取得する。
 * @param url : URL文字列
 */
var URL = function(url){
	this.qsParm = {};
	this.query = url;
	var parms = this.query.split('&');
	for (var i = 0; i < parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0) {
			var key = parms[i].substring(0,pos);
			var val = parms[i].substring(pos+1);
			this.qsParm[key] = val;
		}
	}
	this.protocol = "";
	this.uri = "";
	var tmp = "";
	if (this.query.split('://').length > 1) {
		this.protocol = this.query.split('://')[0];
		tmp = this.query.split('://')[1];
	}
	if (tmp.split('/',2) > 1) {
		uri = tmp.split('/',2)[1].split('?')[0];
	}
	tmp = tmp.split('/',2)[0];
	
	this.servername = "";
	this.port = 80;
	if (tmp.split(':',2).length > 1) {
		this.servername = tmp.split(':',2)[0];
		if (isNumeric(tmp.split(':',2)[1])) {
			this.port = parseInt(tmp.split(':',2)[1]);
		}
	}
};
URL.prototype = 
{
	getParameter : function(key) {
		return this.qsParm[key];
	},
	getParameterMap : function() {
		return this.qsParm;
	},
	getProtocol : function() {
		return this.protocol;
	},
	getServerName : function() {
		return this.servername;
	},
	getServerPort : function() {
		return this.port;
	},
	getRequestURI : function() {
		return this.uri;
	},
	getRequestURL : function() {
		return this.getProtocol() + "//" + this.getServerName() + ":" + this.getServerPort() + this.getRequestURI();
	},
	getQueryString : function() {
		return this.query;
	}	
};

/**
 * HttpRequestクラス
 * window.locationから各種情報を取得する。
 */
var HttpRequest = function(){
	this.qsParm = {};
	this.query = window.location.search.substring(1);
	var parms = this.query.split('&');
	for (var i = 0; i < parms.length; i++) {
		var pos = parms[i].indexOf('=');
		if (pos > 0) {
			var key = parms[i].substring(0,pos);
			var val = parms[i].substring(pos+1);
			this.qsParm[key] = val;
		}
	}
};
HttpRequest.prototype = {
	getParameter: function(key) {
		return this.qsParm[key];
	},
	getParameterMap: function() {
		return this.qsParm;
	},
	getProtocol: function() {
		return window.location.protocol;
	},
	getServerName: function() {
		return window.location.hostname;
	},
	getServerPort: function() {
		return window.location.port;
	},
	getRequestURI: function() {
		return window.location.pathname;
	},
	getRequestURL: function() {
		return this.getProtocol() + "//" + this.getServerName() + ":" + this.getServerPort() + this.getRequestURI();
	},
	getQueryString: function() {
		return this.query;
	}
};
var request = new HttpRequest();

var DateFormat = function(pattern) {
	if (pattern) {
		this.pattern = pattern;
	} else {
		this.pattern = 'YYYY/MM/DD hh:mm:ss.SSS';
	}
};
DateFormat.prototype.format = function(date) {
	var _pattern = this.pattern;
	_pattern = _pattern.replace(/YYYY/g, date.getFullYear());
	_pattern = _pattern.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
	_pattern = _pattern.replace(/DD/g, ('0' + date.getDate()).slice(-2));
	_pattern = _pattern.replace(/hh/g, ('0' + date.getHours()).slice(-2));
	_pattern = _pattern.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
	_pattern = _pattern.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
	if (_pattern.match(/S/g)) {
	    var milliSeconds = ('00' + date.getMilliseconds()).slice(-3);
	    var length = _pattern.match(/S/g).length;
	    for (var i = 0; i < length; i++) { 
	    	_pattern = _pattern.replace(/S/, milliSeconds.substring(i, i + 1));
	    }
	}
	return _pattern;
};


//function==================================================================//
/**
 * （※）JQuery.isNumericに移行したい。。。
 * 
 * isNumeric(value)
 * 数字かどうか判断する。
 * @return true(数字)/false(数字ではない)
 */
function isNumeric(value) {
    var str = value.toString();
    var regex = /^-?\d+\.?\d*$/;
    //var regex = /[^0-9]/;  
    if (str.match(regex))
    	return true;
    return false;
} 

/**
 * （※）JQuery('.hogehoge')に移行したい。。。
 * 
 * getElementsByClassName(strClass, tag, elm)
 * 指定されたクラス名のエレメントを取得する。
 * @param strClass : 取得するクラス名
 * @param tag : 取得するタグ名（オプション）
 * @param elm : 親エレメント（オプション）
 * @returns エレメントの配列
 */
function getElementsByClassName(strClass, tag, elm) {
	tag = tag || "*";
	elm = elm || document;
	var objColl = elm.getElementsByTagName(tag);
	if (!objColl.length &&  tag == "*" &&  elm.all) objColl = elm.all;
	var arr = new Array();
	var delim = strClass.indexOf('|') != -1  ? '|' : ' ';
	var arrClass = strClass.split(delim);
	for (var i = 0, j = objColl.length; i < j; i++) {
		var arrObjClass = objColl[i].className.split(' ');
		if (delim == ' ' && arrClass.length > arrObjClass.length) continue;
		var c = 0;
		comparisonLoop:
		for (var k = 0, l = arrObjClass.length; k < l; k++) {
			for (var m = 0, n = arrClass.length; m < n; m++) {
				if (arrClass[m] == arrObjClass[k]) c++;
    			if (( delim == '|' && c == 1) || (delim == ' ' && c == arrClass.length)) {
					arr.push(objColl[i]);
					break comparisonLoop;
				}
			}
		}
	}
	return arr;
}

/**
 * sortHash(hash, sort)
 * Hashをキー順にソートする。
 * @param hash : 対象のHash
 * @param sort : "sort（省略した場合はこっち）" / "reverse" 
 * @return ソートされたHash
 */
function sortHash(hash, sort) {
	var sortFunc = sort || "sort";
	var keys = [];
	var newHash = {};
	for (var k in hash) keys.push(k);
	keys[sortFunc]();
	var length = keys.length;
	for(var i = 0; i < length; i++){
		newHash[keys[i]] = hash[keys[i]];
	}
	return newHash;	
}

/**
 * setOptions(element, start, end)
 * Selectエレメントにstart〜endまでのOptionエレメントを追加する。
 * (※)IE用に仕方なく実装。。。あとで何とかする！
 * @param element : Selectエレメント
 * @param start : 初期値
 * @param end : 終値
 */
function setOptions(element, start, end) {
	if (element.type.match(/^select/i)) {
		if (isNumeric(start) && isNumeric(end)) {
			for (var i = start, j = 1; i <= end; i++, j++) {
				element.options[j] = new Option(i, i); 
			}
		}
	}
}

/**
 * getEnraResponse(target, params)
 * Enra WEBAPI を叩いてEnraResponseを取得する
 * @param target : ターゲットサーブレット
 * @param params : リクエストパラメータのHash 
 * @return EnraResponseのJSONオブジェクト
 */
function getEnraResponse(target, params) {
	
	var ex = {};
	params["rt"] = "application/json";
	
	// protogype.js
	/*var ajax_response = new Ajax.Request(target, {
		method: 'post',
		parameters: params,
		asynchronous: false,	// 同期
		onCreate: function(transport){
		},
		onFailure: function(transport) {
			ex.message = "javascript failure : " +  + transport.status + "\t" + transport.statusText.encodeHTML(); 
		},
		onException: function(transport, e) {
			ex = e;
			ex.message = "javascript exception : " + ex.message;
		},
		onComplete: function(transport) {
		}
	});*/
	
	// jquery.js
    var enra_response = $.ajax({
        url: target,
        type: 'post',
        data: params,
        dataType: "json",
        async: false,    // 同期
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            ex.message = "javascript error : " +  + XMLHttpRequest + "\t" + textStatus.encodeHTML()+ "\t" + errorThrown.message; 
        }
    }).responseJSON;
	
	// XMLレスポンスのパージング（戻り値(enra_response)はJSONオブジェクト）
	/*try {
		//var enra_response = new EnraResponse().parse(ajax_response.transport.responseXML);
		var enra_response = new EnraResponse().parse(ajax_response);
	} catch (e) {
		throw ex;
	}*/
	
	// レスポンスがエラーだったらthrow e
	if (enra_response.status == "FAILED") {
		ex.message =  "enra error : " + enra_response.message.encodeHTML();
		throw ex;
	}
	return enra_response;
}

//Date (Long)
function get_date_cond(target) {
	var query = new BooleanQuery();
	var condarr = new Array(2);
	if ($(target + '_year_begin').value != "") {
		var year = parseInt($(target + '_year_begin').value);
		var month = 0;
		if ($(target + '_month_begin').value != "") {
			month = parseInt($(target + '_month_begin').value);
			month--;
		}
		var day = 1;
		if ($(target + '_day_begin').value != "") {
			day = parseInt($(target + '_day_begin').value);
		}
		var date = new Date(year, month, day);
		condarr[0] = query.GtL(target, date.valueOf());
	}

	if ($(target + '_year_end').value != "") {
		var year = parseInt($(target + '_year_end').value);
		var month = 11;
		if ($(target + '_month_end').value != "") {
			month = parseInt($(target + '_month_end').value);
			month--;
		}
		var day = (new Date(year, month, 1)).lastDayOfMonth();
		if ($(target + '_day_end').value != "") {
			day = parseInt($(target + '_day_end').value);
		}
		var date = new Date(year, month, day);
		condarr[1] = query.LtL(target, date.valueOf());
	}
	condarr = condarr.compact();
	if (condarr.length == 0) return null;
	var result = query.getAndQueryFeatureX(condarr)
	return result; 
}

// IntVectorString
function get_text_cond(target) {
	var query = new BooleanQuery();
	if ($(target).value == "") return null; 
	
	var keywords = $(target).value.split(/[ 　]+/);

	var result;
	var condstr = new Array(keywords.length); 
	for (var i = 0; i < keywords.length; ++i) {
		condstr[i] = query.getStringMatchUTF16Feature(target, keywords[i], false, 0);
	}
	if ($(target+'_mode') && $(target+'_mode').value=='or') {
		result = query.getOrQueryFeatureX(condstr);
	} else {
		result = query.getAndQueryFeatureX(condstr);
	}
	return result; 
} 

// String 
function get_string_cond(target) {
	var query = new BooleanQuery();
	if ($(target).value == "") return null; 
	
	var keywords = $(target).value.split(/[ 　]+/);

	var result;
	var condstr = new Array(keywords.length); 
	for (var i = 0; i < keywords.length; ++i) {
		condstr[i] = query.getStringMatchFeature(target, keywords[i], false, 0);
	}
	if ($(target+'_mode') && $(target+'_mode').value=='or') {
		result = query.getOrQueryFeatureX(condstr);
	} else {
		result = query.getAndQueryFeatureX(condstr);
	}
	return result; 
} 

