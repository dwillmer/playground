/*-----------------------------------------------------------------------------
| Copyright (c) 2015, Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

import IContainer = phosphor.di.IContainer;

import IShellView = phosphor.shell.IShellView;

import * as playground from "../../../lib/index";


/**
 * Initialize the sidecar plugin.
 */
export
function initialize(container: IContainer): void {
  var shell = container.resolve(IShellView);
  var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
  var ws_url = protocol + "://" + window.location.host + "/swebsocket";
  shell.addWidget('bottom', new playground.SidecarWidget(ws_url));
  console.log('sidecar initialized');
}
