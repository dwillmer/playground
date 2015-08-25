
import os
import os.path
try:
    from http.server import SimpleHTTPRequestHandler
    import http.server as BaseHTTPServer
except ImportError:
    from SimpleHTTPServer import SimpleHTTPRequestHandler
    import BaseHTTPServer


class CORSRequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.node_dir = os.sep+'node_modules'
        self.main_dir = os.sep.join(os.getcwd().split(os.sep)[:-2])
        SimpleHTTPRequestHandler.__init__(self, *args, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

    def translate_path(self, path):
        if path.startswith(self.node_dir):
            return self.main_dir+path
        else:
            return SimpleHTTPRequestHandler.translate_path(self, path)

if __name__ == '__main__':
    BaseHTTPServer.test(CORSRequestHandler, BaseHTTPServer.HTTPServer)
