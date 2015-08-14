/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
var dive = require('dive');
require('shelljs/global');

mkdir('-p', 'examples/codemirror/build');
mkdir('-p', 'examples/sidecar/build');
mkdir('-p', 'examples/term-sidecar/build');
mkdir('-p', 'examples/term-sidecar-app/build');

dive(
  process.cwd()+'/examples',
  {directories: true, recursive: false, files: false},
  function(err, dir) {
    exec("stylus " +dir+ "/index.styl -o " +dir+ "/build")
  }
);
