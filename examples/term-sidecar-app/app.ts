/*-----------------------------------------------------------------------------
| Copyright (c) 2015, Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
module example {

import Bootstrapper = phosphor.shell.Bootstrapper;


/**
 * A term-sidecar application built entirely from plugins.
 */
export
class TermSidecarApplication extends Bootstrapper {
  /**
   * Configure the plugins for the application.
   */
  configurePlugins(): Promise<void> {
    return this.pluginList.add([
      termplugin,
      sidecarplugin,
    ]);
  }
}

} // module example
