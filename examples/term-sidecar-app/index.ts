/*-----------------------------------------------------------------------------
| Copyright (c) 2015 
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
module example {
    

/**
 * Create and start the chat application.
 */
function main(): void {
    var app = new TermSidecarApplication();
  app.run();
}


window.onload = main;

} // module example
