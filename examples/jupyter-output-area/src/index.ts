/*-----------------------------------------------------------------------------
| Copyright (c) 2015 Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';
import oa = require('jupyter-js-output-area');
import Widget = phosphor.widgets.Widget;
import BoxPanel = phosphor.widgets.BoxPanel;


class OutputAreaWidget extends Widget {
	private _output_view: oa.OutputView;

	constructor( model: oa.OutputModel, document: any ) {
		super();

		this._output_view = new oa.OutputView(model, document);
		document.querySelector('body').appendChild(this._output_view.el);
	}

} // class OutputAreaWidget

function fetchJSONFile(path: string) {
  return new Promise(function(resolve, reject) {
		var httpRequest = new XMLHttpRequest();
		httpRequest.onreadystatechange = function() {
			if (httpRequest.readyState === 4) {
				if (httpRequest.status === 200) {
					resolve(JSON.parse(httpRequest.responseText));
				} else {
					reject(Error('httpRequest.status === ' + httpRequest.status));
				}
			}
		};
		httpRequest.open('GET', path, true);
		httpRequest.send();
  });
}


function main(): void {

	var panel = new BoxPanel();

	var model = new oa.OutputModel();
	var output_area = new OutputAreaWidget( model, document );

	fetchJSONFile('http://localhost:8000/data.json').then(function(messages: any[]) {
		for (var i = 0; i < messages.length; i++) {
			model.consumeMessage(<JSON>(messages[i]));
		}
	}).catch(function(err) {
		console.error('Could not load sample data: ', err);
	});

	panel.addWidget(output_area, 1);

	panel.attach(document.getElementById('main'));
	panel.fit();

	window.onresize = () => panel.fit(); 

}

window.onload = main;