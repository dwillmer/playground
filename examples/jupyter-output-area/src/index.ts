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


function main(): void {

	var panel = new BoxPanel();

	var model = new oa.OutputModel();
	var output_area = new OutputAreaWidget( model, document );
	panel.addWidget(output_area, 1);

	panel.attach(document.getElementById('main'));
	panel.fit();

	window.onresize = () => panel.fit(); 

}

window.onload = main;