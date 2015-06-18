/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, S. Chris Colbert
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
module example {

 import Widget = phosphor.widgets.Widget;


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
             // Get display data if available
             if ("content" in msg && "data" in msg.content) {
                 this.rich_display(msg.content.data);
             }
         };
     }

     dispose(): void {
         this._ws = null;
         super.dispose();
     }

     rich_display(data: any) {
         var html: string = null;

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

    var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
    var ws_url = protocol + "://" + window.location.host + "/sidecar-ws";

    var sidecar = new SidecarWidget(ws_url);

    sidecar.attach(document.getElementById('main'));
    sidecar.fit();

    window.onresize = () => sidecar.fit();

}

window.onload = main;

} // module example
