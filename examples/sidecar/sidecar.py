"""
Copyright (c) 2015 Phosphor Contributors
Distributed under the terms of the BSD 3-Clause License.
The full license is in the file LICENSE, distributed with this software.
"""
from __future__ import absolute_import, print_function

import json
import logging
import webbrowser

import tornado.websocket
import tornado.web

try:
    from jupyter_client import find_connection_file
except ImportError:
    from IPython.kernel.connect import find_connection_file

import zmq
from zmq.eventloop import ioloop
from zmq.eventloop.zmqstream import ZMQStream
ioloop.install()


class KernelSocket(tornado.websocket.WebSocketHandler):

    """Handler for a kernel iopub websocket"""

    def initialize(self):
        self._log = logging.getLogger(__name__)
        #self._log.setLevel(logging.INFO)
        with open(find_connection_file()) as fid:
            self.info = json.load(fid)
        self._log.info(self.info)

    def open(self, url_component=None):
        """Websocket connection opened.

        Call our terminal manager to get a terminal, and connect to it as a
        client.
        """
        self._log.info("KernelSocket.open: %s", url_component)

        ctx = zmq.Context()
        self.sock = ctx.socket(zmq.SUB)
        self.sock.connect('tcp://%s:%s' % (self.info['ip'],
                                           self.info['iopub_port']))
        self.sock.setsockopt(zmq.SUBSCRIBE, b'')
        self.stream = ZMQStream(self.sock)
        self.stream.on_recv(self.on_recv)

        self._log.info("KernelSocket.open: Opened %s", self.info['ip'])

    def on_recv(self, data):
        for msg in data:
            try:
                msg = json.loads(msg.decode('utf-8'))
            except ValueError:
                continue
            if "data" in msg:
                self.write_message(msg['data'])


class SidecarPageHandler(tornado.web.RequestHandler):

    def get(self):
        return self.render("index.html", static=self.static_url,
                           ws_url_path="/websocket")


def main(argv):

    handlers = [
        (r"/websocket", KernelSocket),
        (r"/bower_components/(.*)", tornado.web.StaticFileHandler,
         {'path': '../../bower_components'}),
        (r"/dist/(.*)", tornado.web.StaticFileHandler,
         {'path': '../../dist'}),
        (r"/build/(.*)", tornado.web.StaticFileHandler,
         {'path': 'build'}),
        (r"/node_modules/(.*)", tornado.web.StaticFileHandler,
         {'path': '../../node_modules'}),
        (r"/", SidecarPageHandler),
    ]
    app = tornado.web.Application(handlers, static_path='build',
                                  template_path='.')

    app.listen(8765, 'localhost')
    url = "http://localhost:8765/"
    loop = tornado.ioloop.IOLoop.instance()
    loop.add_callback(webbrowser.open, url)
    try:
        loop.start()
    except KeyboardInterrupt:
        print(" Shutting down on SIGINT")
    finally:
        loop.close()

if __name__ == '__main__':
    import sys
    main(sys.argv)
