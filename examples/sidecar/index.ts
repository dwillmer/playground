/*-----------------------------------------------------------------------------
| Copyright (c) 2015 Phosphor Contributors
| Copyright (c) 2015 Kyle Kelley
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

// import playground = require('phosphor-playground');
import {SidecarWidget, Terminal} from 'phosphor-playground';


module example {
	// import playground = require('../../dist/phosphor-playground');
    // import SidecarWidget as Sidecar = require('phosphor-playground').default;
    // import Sidecar = sidecar.SidecarWidget;
    // import {SidecarWidget as Sidecar} from 'phosphor-playground';
    // import playground = require('phosphor-playground');

function main(): void {

    var protocol = (window.location.protocol.indexOf("https") === 0) ? "wss" : "ws";
    var ws_url = protocol + "://" + window.location.host + "/websocket";

    var sidecar = new SidecarWidget(ws_url);

    sidecar.attach(document.getElementById('main'));
    sidecar.fit();

    window.onresize = () => sidecar.fit();

}

window.onload = main;

} // module example
