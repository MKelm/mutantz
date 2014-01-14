/*
 * This file is part of Mutantz.
 * Copyright 2014 by Martin Kelm - All rights reserved.
 * Project page @ https://github.com/mkelm/nuaox
 *
 * Mutantz is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * any later version.
 *
 * Mutantz is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Mutantz. If not, see <http://www.gnu.org/licenses/>.
 */

// global object initialization
var mz = mz || {};

$(document).ready(function() {
  global.setTimeout(function() {
    //try {
      mz.keys = {};

      mz.util = new MZ.Util();
      mz.storage = new MZ.Storage();

      mz.version = new MZ.Version();
      mz.version.updateHashesFile(); // for maintainer

      mz.userConfig = mz.util.loadJSON('./user/data/config.json');
      mz.intervals = {};
      mz.pixi = new MZ.Pixi();

      mz.game = new MZ.Game();

      // add/start the pixi renderer
      document.body.appendChild(mz.pixi.renderer.view);
      requestAnimFrame(mz.pixi.animate.curry(mz.pixi));

      mz.pixi.loadAssets(function() { mz.game.start(); });

    //} catch (err) {
      //console.log(err);
    //}
  }, 0.00000001); // use timeout to detect fullscreen size correctly
});
