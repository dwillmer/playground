
declare module 'jupyter-js-output-area' {

	export class OutputModel {
		constructor();
		consumeMessage( msg: any ): boolean;
	}

	export class OutputView {
		public el: any;

		constructor( model: OutputModel, document: any );

	}

}
