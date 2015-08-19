/*-----------------------------------------------------------------------------
| Copyright (c) 2015 Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

import IMessage = phosphor.core.IMessage;
import Widget = phosphor.widgets.Widget;
import Size = phosphor.utility.Size;


declare function marked(data: string): string;

declare module katex {
  function renderToString(data: string): string;
}


export
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

    // JavaScript is our most rich display type
    if ("application/javascript" in data) {
      eval(data["application/javascript"]);
      return;
    }

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

  sizeHint(): Size {
    return new Size(640, 480);
  }

  private _ws: WebSocket;
}

