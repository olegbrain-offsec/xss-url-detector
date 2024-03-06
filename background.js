/* Глобальные переменные */
var regexTags = /<(script|iframe|meta).*>/i;
var regexEvents = /<.*(onafterprint|onafterscriptexecute|onanimationcancel|onanimationend|onanimationiteration|onanimationstart|onauxclick|onbeforecopy|onbeforecut|onbeforeinput|onbeforeprint|onbeforescriptexecute|onbeforeunload|onbegin|onblur|onbounce|oncanplay|oncanplaythrough|onchange|onclick|oncuechange|oncut|ondblclick|ondrag|ondragend|ondragenter|ondragleave|ondragover|ondragstart|ondrop|ondurationchange|onend|onended|onerror|oncopy|onclose|oncontextmenu|onfinish|onfocus|onfocusin|onfocusout|onfullscreenchange|onhashchange|oninput|oninvalid|onkeydown|onkeypress|onkeyup|onload|onloadeddata|onloadedmetadata|onloadend|onloadstart|onmessage|onmousedown|onmouseenter|onmouseleave|onmousemove|onmouseout|onmouseover|onmouseup|onmousewheel|onmozfullscreenchange|onpageshow|onpagehide|onpaste|onpause|onplay|onplaying|onpointerdown|onpointerenter|onpointerleave|onpointermove|onpointerout|onpointerover|onpointerrawupdate|onpointerup|onpopstate|onprogress|onratechange|onrepeat|onreset|onresize|onscroll|onsearch|onseeked|onseeking|onselect|onselectionchange|onselectstart|onshow|onsubmit|onstart|ontimeupdate|ontoggle|ontouchend|ontouchmove|ontouchstart|ontransitioncancel|ontransitionend|ontransitionrun|ontransitionstart|onunhandledrejection|onunload|onvolumechange|onwebkitanimationend|onwebkitanimationiteration|onwebkitanimationstart|onwebkittransitionend|onwheel)(|\s)*=/i;
var regexSrcHrefUrl = /<.*(href|src|url\(|import|codebase|cite|usemap|profile|classid|longdesc|data|content|value|action|formaction|poster|srcset|archive|background)/i;
var regexDOMGetCreate = /(((document|element)\.(body|createAttribute|createAttributeNS|createCDATASection|createDocumentFragment|createElement|createElementNS|createEvent|createExpression|createProcessingInstruction|createTextNode|createDocument|createDocumentType|createHTMLDocument|write|writeln|evalute|getElementById|getElementByClassName|getElementByName|getElementByTagName|getElementByTagNameNS|querySelector|querySelectorAll|getElementsByClassName|getElementsByTagName|getElementsByTagNameNS)))\(/;
var regexProto = /javascript:.{1,}/i;
var regexSources = /document\.cookie|window\.localStorage|sessionStorage\.setItem\(|sessionStorage\.getItem\(/;
var regexDialExec = /(alert|prompt|confirm|eval|setTimeout|setInterval|Function|execScript)\(/;
var regexCreateObj = /new(\s|\w)*(Image|Audio|Option)(\(.*\))/;

// Прототип строки с паддингом Base64
String.prototype.padRight = function(){
    var currentString = this;
	var padLength = currentString.length + (4 - currentString.length % 4) % 4;
    if(padLength > this.length){
        for(i = 0; i < (padLength - this.length); i++){
            currentString += '=';
		}
	}
    return currentString;
}

// Уведомление о блокировке ссылки.
function Notify(Time){
	chrome.notifications.create("",{
		type: "basic",
		iconUrl: "icon.png",
		title: "Обнаружена опасная ссылка ("+Time+")",
		message: "В URL найден опасный фрагмент, посмотрите подробности в меню расширения."
	},function(){});
}

// Очистка хранилища по достижении 10 записей и добавление новой
function loadClearAppend(domainTime,dangerData){
	var totalLines = 0;
	chrome.storage.local.get(null, function (items){
		for (var key in items){
			totalLines += 1;
		}
		if (totalLines >= 10){
			chrome.storage.local.clear();
			chrome.storage.sync.clear();
		}
		chrome.storage.local.set({[domainTime]:dangerData});
	});
}

// Декодирование Base64 и Base64 URL
function decodeBase(baseString){
	var inputToDecode = baseString.replace(/-/g, '+').replace(/_/g, '/');
	try {
		var decodeB64 = atob(inputToDecode.padRight());
		return decodeB64;
	} catch {
		return baseString;
	}
}

// Декодирование Percent Encoding
function decodeURL(urlString){
	urlString = urlString.replace(/%[0-9A-Fa-f]{2}/g, function(){
		try {return decodeURIComponent(arguments[0]);} 
		catch {return arguments[0];}
	});
	return urlString;
}

// Декодирование HTML-сущностей (hex,dec,named)
function decodeHTML(htmlString){
	var htmlString = htmlString.replace(/&#0;|&#x0;/g, '');
    var txt = document.createElement("textarea");
    txt.innerHTML = htmlString;
    return txt.value;
}

// Замена Escape-последовательностей и функций Char
function decodeEscapes(escapeString){
	// Замена String.fromCharCode
	escapeString = escapeString.replace(/(String\.fromCharCode\(((\d|,|'|"|\s)*)\));{0,}/g, function(){
		try {return eval(arguments[0]);} 
		catch {return arguments[1];}
	});
	// Замена String.fromCodePoint
	escapeString = escapeString.replace(/(String\.fromCodePoint\(([a-fA-F]|x|\d|,|'|"|\s)*\));{0,}/g, function(){
		try {return eval(arguments[0]);} 
		catch {return arguments[1];}
	});
	// Замена JS UTF-8-escape HEX
	escapeString = escapeString.replace(/\\x([0-9A-Fa-f]{2})/g, function(){
		try {return String.fromCharCode(parseInt(arguments[1], 16));} 
		catch {return arguments[1];}
	});
	// Замена CSS-escape
	escapeString = escapeString.replace(/\\([0-9A-Fa-f]{2,6} {0,1})/g, function(){
		try {return String.fromCharCode(parseInt(arguments[1], 16));} 
		catch {return arguments[1];}
	});
	// Удаление null-символов
	escapeString = escapeString.replace(/(\\0|\%00|\0)/g,'');
	// Замена Python UTF-8-escape 4-digit
	escapeString = escapeString.replace(/\\u([0-9A-Fa-f]{4})/g, function(){
		try {return String.fromCharCode(parseInt(arguments[1], 16));} 
		catch {return arguments[0].toString();}
	});
	// Замена JS UTF-8-escape 
	escapeString = escapeString.replace(/\\u{([0-9A-Fa-f]{1,})}/g, function(){
		try {return String.fromCharCode(parseInt(arguments[1], 16));} 
		catch {return arguments[0].toString();}
	});
	// Fullwidth к нормальному виду
	escapeString = escapeString.normalize('NFKC');
	return escapeString;
}

// Поиск XSS по регулярным выражениям
function catchXSSInjection(value, url, debug){
	if(regexEvents.test(value)||regexProto.test(value)||regexSrcHrefUrl.test(value)||regexTags.test(value)||
	   regexDOMGetCreate.test(value)||regexSources.test(value)||regexDialExec.test(value)||regexCreateObj.test(value)){
		if (debug==true){
			console.log("Обнаружен опасный фрагмент\t: " + value);
			return true
		}
		// Время обнаружения инъекции
		var time = new Date().toLocaleTimeString({hour12:false});
		// Домен URL
		var domain = (new URL(url)).hostname;
		// Обновление данных в хранилище
		loadClearAppend(domain+"\n("+time+")", value);
		// Уведомление пользователя
		Notify(time.slice(0,5));
		console.log("Обнаружен опасный фрагмент\t: " + value);
		// Обработка в соответствии с выбранным режимом
		if (localStorage.warnmode == 'active'){
			var stopVisit = confirm('ССЫЛКА СОДЕРЖИТ ОПАСНЫЙ ФРАГМЕНТ!\n' + url + 
									'\nЕСЛИ ВЫ ПОЛУЧИЛИ ЭТУ ССЫЛКУ ИЗ НЕДОСТОВЕРНОГО ИСТОЧНИКА, НЕ ПЕРЕХОДИТЕ ПО НЕЙ!\nОСТАНОВИТЬ ПЕРЕХОД? (ОК-ДА/ОТМЕНА-НЕТ)');
			if (stopVisit == true){return {cancel: true};}
			else {return {cancel: false};}
		} else {return {cancel: true};}
	} else {return null;}
}

// Деобфускация параметров
function checkForEncoding(value, url, debug=false){
	// Ссылка для декодирования
	var decodedURL = url;
	// Проверка параметров
	var toReplace = value;
	console.log("Исследуемый параметр\t\t: " + value);
	// Декодирование
	while ((value!=decodeURL(value))||(value!=decodeHTML(value))
			||(value!=decodeBase(value))||(value!=decodeEscapes(value))){
		value = decodeBase(value);
		value = decodeURL(value);
		value = decodeEscapes(value);
		value = decodeHTML(value);
	}
	console.log("Декодированный параметр\t\t: " + value);
	decodedURL = decodedURL.replace(toReplace, value);
	// Проверка параметра на соответсвие regex
	var response = catchXSSInjection(value, decodedURL, debug);
	if (response!=null){
		return response;
	}
	// Проверка подстрок на Base64 и Base64URL
	var substring = value.match(/[A-Za-z0-9+\/\-_]{10,}/gm);
	if (substring != null){
		for (var i=0; i<substring.length; i++){
			if (substring[i]!=value){
				var responseSubstring= checkForEncoding(substring[i], decodedURL, debug);
				if (responseSubstring!=null){
					return responseSubstring;
				}
			}
		}
	} 
}

// Запись локальной переменной и вывод инструкции при запуске расширения
chrome.runtime.onInstalled.addListener(function (){
    localStorage.warnmode = 'notactive';
	console.log("Чтобы запустить тестирование браузерного расширения, вызовите в консоли test('filename')" +
				", где filename - имя и расширение текстового файла с инъекциями.");
});

// Обработка всех GET-запросов с query
chrome.webRequest.onBeforeRequest.addListener(function (details, url){
	if(details.method == "GET"){
		if(("url" in details)&&((details.url).includes("?")&&(details.type == "main_frame"))){
			var url = details.url;
			var query = url.substring(url.indexOf('?')+1);
			console.log("Исходный URL\t\t\t\t: " + url);
			return checkForEncoding(query,url, debug=false);
		}
	}}, {urls: ["<all_urls>"]}, ["blocking","requestBody"]
);

// Тестер для инъекций из файла
function test(filename){
		const startTime = performance.now();
		var failTest = [];
		var injections = 0;
		var detectedInj = 0;
		const urlFile = chrome.runtime.getURL(filename);
		fetch(urlFile).then(async function(response){
			return response.text().then(function(text){
				text = text.split('\n');
				for (let i = 0; i < text.length; i++){
					injections++;
					response = checkForEncoding(text[i], ('http://test.test/query='+text[i]), debug=true);
					if (response == null){
						failTest.push(text[i]);
					} else {
						detectedInj += 1;
					}
				}
				console.log("-------------------- РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ --------------------");
				for (var k=0; k<failTest.length;k++)
				{
					console.log("НЕ ПРОШЕЛ ПРОВЕРКУ: " + failTest[k]);
				}
				console.log("РЕЗУЛЬТАТ ТЕСТИРОВАНИЯ ОБНАРУЖЕНО/ВСЕГО: " + detectedInj + '/' + injections);
				const endTime = performance.now();
				console.log('Обработано ' + injections + ' строк за '+ (endTime-startTime) + ' мс.');
			});
		});
}


