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

// some hotkey functions

$("html").keyup(function(e){
  if (e.which == 27) { // ESC
    mz.util.quit();
  } else if (e.which == 112) { // F1
    mz.pixi.setFpsCounter(true, mz.pixi);

  } else if (e.which == 113) { // F2
    if (mz.game.displayFieldsPanel.visible == false) {
      mz.game.displayRoomsPanel.hide();
      mz.game.displayFieldsPanel.show();
    } else {
      mz.game.displayFieldsPanel.hide();
    }
  } else if (e.which == 114) { // F3
    if (mz.game.displayRoomsPanel.visible == false) {
      mz.game.displayFieldsPanel.hide();
      mz.game.displayRoomsPanel.show();
    } else {
      mz.game.displayRoomsPanel.hide();
    }
  }
});

// keys handler for more game key events
$("html").keydown(function(e) {
    mz.keys[e.which] = true;
});
$("html").keyup(function(e) {
    delete mz.keys[e.which];
});