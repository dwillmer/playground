import webbrowser
import tornado.web


class SidecarPageHandler(tornado.web.RequestHandler):

    def get(self):
        return self.render("index.html", static=self.static_url,
                           ws_url_path="/sidecar-ws")


def main(argv):

    handlers = [
        #(r"/websocket", TermSocket,
        # {'term_manager': term_manager}),
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
