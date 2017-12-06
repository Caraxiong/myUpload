// resourceVersion: 维护本地缓存版本，更新依据
// resourceJavascriptList: 需要缓存的文件列表
// noNeedUpdate: 检测文件是否需要更新的方法
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
	noNeedUpdate: (function() {
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
		//满足以下条件  开关是否打开，是否为ie， 判断是否支持localStorage
		if (localStorageSign === 'on' && !isIE && window.localStorage) {
			//不需要更新的
			if (noNeedUpdate === true) {
				//不需要更新
				return function() {
					for (var i = 0; i < resourceJavascriptList.length; i++) {
						//获取本地缓存列表 输入到html上
						var scriptId = resourceJavascriptList[i]['id'];
						//把我们的列表中的js文件 渲染到页面
						//去读取本地文件
						window.mDomUtils.addJavascriptByInLine(scriptId);
					}
				}
			} else {
				// 需要更新
				// save localStorage 保存我们请求到的js文件
				//把从网络获取到的JavaScript输出到html上
				return function() {
					saveSdk();
					for (var i = 0; i < resourceJavascriptList.length; i++) {
						//获取本地缓存列表 输入到html上
						var scriptId = resourceJavascriptList[i]['id'];
						//把我们的列表中的js文件 渲染到页面
						//去读取本地文件
						window.mDomUtils.addJavascriptByInLine(scriptId);
					}
				}
			}
		} else {
			//原始方法加载javascript
			//把从网络获取到的JavaScript输出到html上
			for (var i = 0; i < resourceJavascriptList.length; i++) {
				//获取本地缓存列表 输入到html上
				var scriptId = resourceJavascriptList[i]['id'];
				//把我们的列表中的js文件 渲染到页面
				//去读取网络上的资源
				window.mDomUtils.addJavascriptByLink(scriptId, resourceJavascriptList[i].url);
			}
		}
	},
	//写入本地localstorage
	saveSdk: function() {
		//防止写满,用try catch
		try {
			localStorage.setItem('resourceVersion', window.mLocalSdk.resourceVersion);
		} catch (oException) {
			if (oException.name === 'QuotaExceededError') {
				localStorage.clear();
				localStorage.setItem('resourceVersion', window.mLocalSdk.resourceVersion);
			}
		}

		//写入资源
		for (var i = 0; i < resourceJavascriptList.length; i++) {
			var scriptId = resourceJavascriptList[i]['id'];
			var xhr = new Xhrfactory();
			xhr.get(resourceJavascriptList[i].url, null, function() {
					try {
						localStorage.setItem(scriptId, data);
					} catch (oException) {
						if (oException.name === 'QuotaExceededError') {
							localStorage.clear();
							localStorage.setItem(scriptId, data);
						}
					}
				})
				//add to html 加载到页面
		}
	}
}

window.mDomUtils = {
	//内联方式添加javascript
	addJavascriptByInLine: function(scriptId) {
		//创建script标签
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.id = scriptId;
		var heads = document.getElementByTagName('head');
		if (heads.length) {
			// 如果head存在的话
			heads[0].appendChild(script);
		} else {
			document.documentElement.appendChild(script);
		}

		script.innerHTML = localStorage.getItem(scriptId);
	},

	//外联方式添加javascript
	addJavascriptByLink: function(scriptId, url) {
		//创建script标签
		var script = document.createElement('script');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', url);
		script.id = scriptId;
		var heads = document.getElementByTagName('head');
		if (heads.length) {
			// 如果head存在的话
			heads[0].appendChild(script);
		} else {
			document.documentElement.appendChild(script);
		}
	},

	//内联方式添加css
	addCssByInLine: function(cssString) {
		//创建link标签
		var link = document.createElement('link');
		link.setAttribute('type', 'text/css');
		link.setAttribute('rel', 'stylesheet ');

		if (link.stylesheet) {
			//IE支持
			link.stylesheet.cssText = cssString;
		} else {
			//w3c
			var cssText = doc.createTextNode(cssString);
			link.appendChild(cssText);
		}

		var heads = document.getElementByTagName('head');
		if (heads.length) {
			// 如果head存在的话
			heads[0].appendChild(link);
		} else {
			document.documentElement.appendChild(link);
		}
	},

	//外联方式添加css
	addCssByLink: function(url) {
		//创建link标签
		var link = document.createElement('link');
		link.setAttribute('type', 'text/css');
		link.setAttribute('rel', 'stylesheet ');
		link.setAttribute('href', url);

		var heads = document.getElementByTagName('head');
		if (heads.length) {
			// 如果head存在的话
			heads[0].appendChild(link);
		} else {
			document.documentElement.appendChild(link);
		}
	}
}