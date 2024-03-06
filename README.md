# xss-url-detector
Google Chrome extension to detect and prevent Reflected XSS via special crafted URLs
## Section in English
### The idea
The main idea of the extension is that attackers often use links that contain code in some way to carry out XSS attacks, and this code can be encoded to avoid detection by the user. To counteract such attacks, I have put together a full-fledged browser extension, which, although based on signature analysis, takes into account many coding techniques.
### Cookie-stealer
A script is also attached to this code for informational purposes, which can be used to receive a user Cookie to the attacker's server, it should be used to debug this program.
### Elements to consider
1. Script, frame, meta tags;
2. The presence of events in any tags (events are taken from the documentation);
3. The presence of attributes that accept addresses, specific sources;
4. Using the javascript schema:;
5. Calling unsafe browser storage functions (session, local storage), Cookies;
6. Eval functions;
8. Calling the Image, Audio, and Option constructors.
### Considered coding techniques
1. URL encoding, including multiple;
2. Base64URL encoding;
3. Base64, including substring analysis of the corresponding syntax;
4. Escape sequences of Unicode, CSS, JavaScript;
5. String from charCode, CodePoint functions;
6. HTML coding.
### How to use
1. Download the file from the Release section;
2. Unzip the archive;
3. In Google Chrome, enable Developer mode in the extensions menu;
4. After switching to the selection menu, specify the directory;
5. If you need to debug on any payloads, use the test(filename) function.

## Секция на русском
### Идея 
Основная идея расширения в том, что злоумышленники часто для проведения XSS-атак используют ссылки, в которых каким-либо образом содержится код, причем данный код может быть закодирован, чтобы избежать обнаружения его пользователем. Чтобы противодействовать таким атакам я собрал полноценное браузерное расширение, которое хоть и базируется на сигнатурном анализе, но при этом учитывает множество техник кодирования. 
### Cookie-stealer
К данному коду также в ознакомительных целях прикладывается скрипт, который может использоваться для получения Cookie пользователя на сервер злоумышленника, он должен использоваться для отладки данной программы.
### Учитываемые элемены
1. Теги script, frame, meta;
2. Наличие событий в любых тегах (события взяты из документации);
3. Наличие атрибутов, принимающих адреса, специфические источники;
4. Использование схемы javascript:;
5. Вызов небезопасных функций работы с хранилищем браузера (сессия, локальное хранилище), Cookie;
6. Eval-функции;
8. Вызов конструкторов Image, Audio, Option.
### Учитываемые техники кодирования
1. URL-кодирование, в том числе многократное;
2. Base64URL-кодирование;
3. Base64, включая анализ подстрок соответствующего синтаксиса;
4. Escape-последовательности Unicode, CSS, JavaScript;
5. String from CharCode, CodePoint функции;
6. HTML-кодирование.
### Как пользоваться
1. Скачайте файл из секции Release;
2. Распакуйте архив;
3. В Google Chrome включите режим разработчика в меню расширений;
4. После перехода к меню выбора укажите директорию;
5. Если необходимо провести отладку на каких-либо полезных нагрузках используйте функцию test(filename).
   
### Screenshots/Скриншоты
![image](https://github.com/olegbrain-offsec/xss-url-detector/assets/160741328/121e9bac-0c89-48ce-9d57-966eb42b21e2)

![image](https://github.com/olegbrain-offsec/xss-url-detector/assets/160741328/423f636c-2a41-4093-bf80-1d1d5fdb4ea7)

![image](https://github.com/olegbrain-offsec/xss-url-detector/assets/160741328/2b5d05da-9670-48af-860b-0e538d9893e6)
