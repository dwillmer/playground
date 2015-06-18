/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, S. Chris Colbert
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
module example {

 import BoxPanel = phosphor.widgets.BoxPanel;
 import Widget = phosphor.widgets.Widget;
 import TermWidget = phosphor.terminal.TermWidget;

 declare function marked(data: string): string;

 declare module katex {
     function renderToString(data: string): string;
 }


 class SidecarWidget extends Widget {

     constructor(ws_url: string) {
         super();
         this.addClass('SidecarWidget');
         this._ws = new WebSocket(ws_url);

         this._ws.onmessage = (event: MessageEvent) => {
             var msg = JSON.parse(event.data);
             this.rich_display(msg);
         };
     }

     dispose(): void {
         this._ws = null;
         super.dispose();
     }

     rich_display(data: any): void {
         var html: string = null;
         console.log(data);

         if ("text/html" in data) {
             html = data["text/html"];
         } else if ("text/markdown" in data) {
             html = marked(data['text/markdown']);
         } else if ("text/latex" in data) {
             html = katex.renderToString(data["text/latex"]);
         } else if ("image/svg+xml" in data) {
             html = "<img src='data:image/svg+xml;base64," + data["image/svg+xml"] + "'/>";
         } else if ("image/png" in data) {
             html = "<img src='data:image/png;base64," + data["image/png"] + "'/>";
         } else if ("image/jpeg" in data) {
             html = "<img src='data:image/jpeg;base64," + data["image/jpeg"] + "'/>";
         } else if ("application/json" in data) {
             html = "<pre>" + JSON.stringify(data["application/json"]) + "</pre>";
         } else if ("text/plain" in data) {
             html = data["text/plain"];
         } else {
             console.log(data);
         }

         this.node.innerHTML = html;
     }

     private _ws: WebSocket;
 }


function main(): void {
    var panel = new BoxPanel();

    var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
    var sc_ws_url = protocol + "://" + window.location.host + "/swebsocket";
    var t_ws_url = protocol + "://" + window.location.host + "/twebsocket";

    var sidecar = new SidecarWidget(sc_ws_url);
    var term = new TermWidget(t_ws_url);

    panel.addWidget(term, 1);
    panel.addWidget(sidecar, 2);

    panel.attach(document.getElementById('main'));
    panel.fit();

    window.onresize = () => panel.fit();

}

window.onload = main;

} // module example
