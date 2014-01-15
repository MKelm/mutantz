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
  } else if (e.which == 113 && mz.game.isEditor == true) { // F2 fields panel for editor
    if (mz.game.displayFieldsPanel.visible == false) {
      mz.game.hidePanels();
      mz.game.displayFieldsPanel.show();
    } else {
      mz.game.hidePanels();
    }
  } else if (e.which == 114 && mz.game.isEditor == true) { // F3 areas panel for editor
    if (mz.game.displayAreasPanel.visible == false) {
      mz.game.hidePanels();
      mz.game.displayAreasPanel.show();
    } else {
      mz.game.hidePanels();
    }
  } else if (e.which == 115 && mz.game.isEditor == true) { // F4 areas panel for editor
    if (mz.game.displayEnemiesPanel.visible == false) {
      mz.game.hidePanels();
      mz.game.displayEnemiesPanel.show();
    } else {
      mz.game.hidePanels();
    }
  } else if (e.which == 116 && mz.game.isEditor == true) { // F5 save level for editor
    mz.storage.saveLevel(mz.game.currentLevelId);
  } else if (e.which == 117 && mz.game.isEditor == true) { // F6 load previous level
    if (mz.game.currentLevelId > 0) mz.game.currentLevelId--;
    mz.game.loadLevel();
    mz.game.display.drawLevelStatus();
  } else if (e.which == 118 && mz.game.isEditor == true) { // F6 load next level
    mz.game.currentLevelId++;
    mz.game.loadLevel();
    mz.game.display.drawLevelStatus();
  }
});

// keys handler for more game key events
$("html").keydown(function(e) {
    mz.keys[e.which] = true;
});
$("html").keyup(function(e) {
    delete mz.keys[e.which];
});