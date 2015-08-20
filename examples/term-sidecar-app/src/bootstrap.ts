/*-----------------------------------------------------------------------------
| Copyright (c) 2015, Phosphor Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/

import Bootstrapper = phosphor.shell.Bootstrapper;

import * as termplugin from "./termplugin";

import * as sidecarplugin from "./sidecarplugin";

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
