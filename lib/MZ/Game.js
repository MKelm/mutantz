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

MZ.Game = function() {
  // use pixi event target to handle display object interaction events
  // see -> https://github.com/MKelm/pixi.js/blob/dev/src/pixi/utils/EventTarget.js
  PIXI.EventTarget.call(this);
  this.fps = -1;
  this.money = 0;

  this.run = false;
  this.lastUpdateTime = null;

  this.display = new MZ.Display(this);

  this.map = new MZ.Map();

  this.welcomeWindow = null, this.gameOverWindow = null;

  // register interaction event listeners
  this.addEventListener('window-close-click', mz.util.getEventListener(this, "handleEvent"));
  this.addEventListener('display-update-map', mz.util.getEventListener(this, "handleEvent"));
  this.addEventListener('display-map-mousedown', mz.util.getEventListener(this, "handleEvent"));
  this.addEventListener('display-map-mouseup', mz.util.getEventListener(this, "handleEvent"));
}

MZ.Game.prototype.constructor = MZ.Game;

MZ.Game.prototype.start = function() {
  this.display.initialize();
  this.display.activateMapZoom();
  this.map.load();
  this.showWelcomeWindow();
}

MZ.Game.prototype.showWelcomeWindow = function() {
  this.welcomeWindow = new MZ.DisplayWindow(this, 550, 200)
  this.welcomeWindow.handle = "welcome";
  this.welcomeWindow.show();
  this.welcomeWindow.drawCloseButton();
  this.welcomeWindow.drawContentText(
    "Welcome to Mutantz, you have to manage your mutant space factory and do some " +
    "research to get better equipement ...",
    500,
    40
  );
}

MZ.Game.prototype.showGameOverWindow = function(ranglist) {
  this.gameOverWindow = new MZ.DisplayWindow(this, 400, 290)
  this.gameOverWindow.handle = "gameover";
  this.gameOverWindow.title = "Game Over";
  this.gameOverWindow.show();
  this.gameOverWindow.drawTitle();
  this.gameOverWindow.drawContentText("Highscores:", false, 60);
  this.gameOverWindow.drawRanglist(ranglist, 105);
}

MZ.Game.prototype.update = function(scope) {
  var timeDiff = mz.util.time() - scope.lastUpdateTime;
  scope.fps = 1000 / timeDiff;
  // update game elements

  scope.lastUpdateTime = mz.util.time();
}


MZ.Game.prototype.handleEvent = function(scope, event) {
  switch (event.type) {
    case "window-close-click":
      if (event.content.window == "welcome") {
        scope.welcomeWindow.hide();
        // start game process
        scope.lastUpdateTime = mz.util.time();
        scope.run = true;
      }
      break;
    case "display-update-map":
      scope.display.updateMap();
      break;
    case "display-map-mousedown":
      // field selection
      scope.display.mapFieldSelection(scope.map.fieldPositionByMouse(event.content.mouse), true);
      break;
    case "display-map-mouseup":
      // field deselection
      scope.display.mapFieldSelection(scope.map.fieldPositionByMouse(event.content.mouse), false);
      break;
  }
}