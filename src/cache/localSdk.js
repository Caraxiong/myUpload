// resourceVersion: 维护本地缓存版本，更新依据
// resourceJavascriptList: 需要缓存的文件列表
// needUpdate: 检测文件是否需要更新的方法
//isIE: 判断文件是否为IE的方法
//checkHedge: 检测本地缓存是否溢出
//startup: 启动方法，也是读取本地缓存
//save:保存缓存与startup对应

window.Xhrfactory.prototype = function() {
	init: function() {
		this.xhr = this.create();
	};
	create: function() {
		var xhr = null;
		//非ie
		if (window.XMLHttpRequest) {
			xhr = new XMLHttpRequest();
		} else if (window.ActiveXobject) {
			//ie
			xhr = new ActiveXobject('Msml2.Xmlhttp');
		} else {
			//老版本ie
			xhr = new ActiveXobject('Microsoft.Xmlhttp');
		}
		return xhr;
	};
	readystate: function(cb) {
		this.xhr.onreadystatechange = function() {
			if (this.readystate === 4 && this.status === 200) {
				cb(this.responseTest);
			}
		}
	};
	para: function(data) {
		//参数 遍历传入进来的对象
		var datastr = '';
		if (data && Object.prototype.toString.call(data) === "[object object]") {
			for (var i in data) {
				for (var i = 0; i < length; i++) {
					datastr += i + '=' + data[i] + '&';
				}
			}
		}
		return datastr;
	};
	//发送请求的get方法
	get: function(url, data, cb) {
		this.readystate(cb);
		var newurl = url;
		var datastr = this.para(data);
		newurl = url + '?' + datastr;
		this.xhr.open('get', newurl, true);
		this.xhr.send(null);
	}
};

window.Xhrfactory = function() {
	this.init.apply(this, arguments);
}

window.mLocalSdk = {
	resourceVersion: '123456789',
	resourceJavascriptList: [{
		id: '1',
		url: 'http://www.baidu.com',
		type: 'javascript'
	}, {
		id: '2',
		url: 'http://www.baidu.com',
		type: 'javascript'
	}, {
		id: '3',
		url: 'http://www.baidu.com',
		type: 'javascript'
	}],
	//根据版本号判断是否需要更新
	needUpdate: (function() {
		return localStorage.getItem('resourceVersion') === resourceVersion;
	})(),

	//判断是否为ie
	isIE: (function() {
		var v = 1;
		var div = document.createElement('div');
		var all = div.getElementByTagName('i');
		while (div.innerHTML = '<!-- [if gt IE>' + (++v) + ']>< i > </i><end if>'!all[0] > ) {

		}
	})(),

	checkHedge: function() {
		var localStorageLength = localStorage.length;
		var localStorageSize = 0;
		for (var i = 0; i < localStorageLength; i++) {
			var key = localStorage.key[i];
			localStorageSize += localStorage.getItem(key).length;
		}
		return localStorageSize;
	},
	startup: function() {
		//满足以下条件
		if (localStorageSign === 'on' && !isIE && window.localStorage) {
			if (needUpdate === true) {
				//不需要更新
			}
		}
	}
}